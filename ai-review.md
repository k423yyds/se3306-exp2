# AI 代码审查报告（ai-review.md）

> 审查对象：让 AI 自由生成的一版博客组件代码（未加任何约束提示词）
> 审查依据：React 官方文档 [Rules of Hooks](https://zh-hans.react.dev/reference/rules/rules-of-hooks)
> 审查人：k423yyds

---

## 检查点 1：组件职责——是否超 200 行、多职责？

### AI 代码原文（问题片段）

AI 生成的 `App.jsx` 把数据获取、表单、列表、详情、删除确认全写在一个组件里：

```jsx
// AI 生成的 App.jsx（节选，实际约 280 行）
function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('全部');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [detailId, setDetailId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(e => { setError(e); setLoading(false); });
  }, []);

  // ... 表单提交、删除确认、详情渲染全在这一个函数里
  return ( ... );
}
```

**违反规则**：违反 React 官方文档"组件应该只做一件事"的最佳实践。单组件 280 行，同时承担了数据获取、表单管理、列表渲染、详情展示、删除确认 5 个职责。

### 修改前后对比

修改后拆分为：
- `PostForm.jsx`：只负责发表表单
- `PostList.jsx`：只负责列表渲染
- `PostDetail.jsx`：只负责详情页
- `App.jsx`：只做组合和路由切换（约 30 行）

### 修改后运行时行为变化

拆组件后，修改表单样式不再影响列表逻辑，各组件独立维护。HMR 热更新速度从全组件重渲染变为局部更新。

---

## 检查点 2：Hook 调用顺序——是否在 if / for / 嵌套函数里调 Hook？

### AI 代码原文（问题片段）

AI 生成的代码把 `useEffect` 放在条件判断里：

```jsx
// AI 生成的 PostList.jsx
function PostList({ posts, showDetail }) {
  const [activeId, setActiveId] = useState(null);

  if (showDetail) {
    useEffect(() => {
      console.log('详情模式', activeId);
    }, [activeId]);  // ❌ Hook 在 if 里
  }

  return ( ... );
}
```

**违反规则**：违反 Rules of Hooks 第一条——"不要在循环、条件或嵌套函数中调用 Hook"。React 靠 Hook 调用顺序来跟踪每个 Hook 对应哪个 state，if 里的 Hook 在 `showDetail` 为 false 时不执行，下次渲染顺序就变了，导致 state 错位。

### 修改前后对比

```jsx
// 修改后：Hook 放在顶层，条件判断放在 Hook 内部
function PostList({ posts, showDetail }) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!showDetail) return;  // ✅ 条件在 Hook 内部
    console.log('详情模式', activeId);
  }, [activeId, showDetail]);

  return ( ... );
}
```

### 修改后运行时行为变化

修改前：`showDetail` 在 true/false 之间切换时，React 报 "Rendered fewer hooks than expected" 错误，页面白屏。
修改后：无论 `showDetail` 值如何，Hook 调用顺序始终一致，不再报错。

---

## 检查点 3：依赖数组——useEffect 依赖写全没？有没有闭包旧值？

### AI 代码原文（问题片段）

```jsx
// AI 生成的 PostDetail.jsx
function PostDetail({ post, onDelete }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1);  // ❌ count 是闭包捕获的旧值
    }, 1000);
    return () => clearInterval(timer);
  }, []);  // ❌ 依赖数组为空，但用了 count

  return <div>{count}</div>;
}
```

**违反规则**：违反 exhaustive-deps 规则。useEffect 里引用了 `count` 但依赖数组为空，导致闭包永远捕获第一次渲染时的 `count=0`，页面永远显示 1，不会递增。

### 修改前后对比

```jsx
// 修改后：用函数式更新，不需要依赖 count
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1);  // ✅ 用回调形式，不依赖外部 count
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

### 修改后运行时行为变化

修改前：计数器永远停在 1，每秒不变化。
修改后：计数器每秒正确递增 1。

---

## 检查点 4：状态最小化——有没有冗余 state？

### AI 代码原文（问题片段）

```jsx
// AI 生成的 CategoryFilter.jsx
function CategoryFilter({ posts }) {
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState('全部');

  useEffect(() => {
    const cats = ['全部', ...new Set(posts.map(p => p.category))];
    setCategories(cats);  // ❌ categories 完全可以从 posts 算出来
  }, [posts]);

  return ( ... );
}
```

**违反规则**：`categories` 是从 `posts` 派生的数据，不需要单独存 state。派生态应该用计算值，而不是用 useEffect + useState 同步。

### 修改前后对比

```jsx
// 修改后：直接计算，不用 state
function CategoryFilter({ posts, active, onChange }) {
  const categories = ['全部', ...new Set(posts.map(p => p.category))];  // ✅ 直接算

  return ( ... );
}
```

### 修改后运行时行为变化

修改前：posts 更新后需要等一次 useEffect 才更新分类按钮，有一帧延迟。
修改后：posts 更新时分类按钮同步更新，无延迟。

---

## 检查点 5：AI 代码是否附 AI 使用声明、审查留痕？

### 审查说明

- AI 生成代码时未加任何约束提示词，让其自由发挥
- 以上 5 个检查点均由人工对照 React 官方文档逐条审查
- 每个问题都记录了 AI 原文、违反规则、修改后代码和运行时行为对比
- 审查留痕即本文档 `ai-review.md`，已提交到仓库根目录

---

## 总结

AI 自由生成的代码常见问题：
1. 单组件过大，职责不拆分
2. Hook 放在条件语句里（违反 Rules of Hooks）
3. useEffect 依赖数组不全，导致闭包旧值
4. 派生态冗余存储（该用计算值的用了 state）
5. 缺少错误处理和加载态

这些问题中，第 2 条（Hook 在条件里）是必然出错而非偶尔出错，因为 React 靠 Hook 调用顺序跟踪状态，条件分支会打乱顺序。
