# 实验二 React 项目实战与 Zustand 状态管理

## 一、实验目的

通过从零搭建 React 项目，掌握组件拆分、状态管理、Props 数据流、Hook 规则，并将博客项目从 useState 迁移到 Zustand 全局状态管理，接入 TanStack Query 处理服务端状态。

## 二、环境与工具

- Node v22 + pnpm 12.4.2
- Vite 8 + React 19
- Zustand 5 + TanStack Query 5
- VS Code + Edge 浏览器
- GitHub Actions + GitHub Pages 部署

## 三、任务与自检（含截图）

### 任务一：井字棋（React 官方教程）

（1）页面出现 9 个 3×3 按钮格子，可轮流下 X/O；
（2）能判胜负，显示"胜者：X"或平局；
（3）右侧历史记录可时间旅行回退任意一步。

![任务一：井字棋游戏界面](screenshots/task1-tic-tac-toe.png)

自检：
- 拆了哪几个组件：Square（格子按钮）、Board（棋盘排列+判胜负）、Game（顶层状态+时间旅行）、calculateWinner（工具函数）。
- state 放在哪一层：history 和 currentMove 放在 Game 顶层，因为判胜负需要全部 9 格数据，时间旅行需要保留每步快照。
- 时间旅行靠什么：不可变快照（squares.slice()）+ currentMove 下标，点历史按钮切回 history[currentMove]。

### 任务二：React 基础训练营（6个练习）

训练1：JSX 花括号——变量和表达式写在 {} 里，map 渲染列表必须有 key。

![训练1：JSX花括号](screenshots/task2-train1.png)

训练2：ES6 语法——展开运算符（...）和 map 是博客开发最常用语法。

![训练2：ES6语法](screenshots/task2-train2.png)

训练3：useState——函数组件拥有记忆，改状态必须调 set 函数传新值。

![训练3：useState](screenshots/2.3.1.png)
![训练3：useState](screenshots/2.3.2.png)
![训练3：useState](screenshots/2.3.3.png)
![训练3：useState](screenshots/2.3.4.png)

训练4：key 必须用稳定 id——用 index 当 key 在头部插入/删除时会错配 DOM。

![训练4：key的重要性](screenshots/2.4.1.png)
![训练4：key的重要性](screenshots/2.4.2.png)

训练5：useEffect——依赖数组控制执行时机，空数组只跑一次，return 清理副作用。

![训练5：useEffect](screenshots/2.5.png)

训练6：自定义 Hook——把复用的 state+副作用抽成 use 开头的函数。

![训练6：自定义Hook](screenshots/2.6.1.png)
![训练6：自定义Hook](screenshots/2.6.2.png)

### 任务三：Thinking in React（四步法）

（1）拆组件：FilterableProductTable → SearchBar + ProductTable → ProductCategoryRow + ProductRow；
（2）静态版：硬编码数据先画出表格；
（3）state 最小表示：只有 filterText 和 inStockOnly 两个 state，放共同父组件；
（4）数据流：props 向下传，回调向上通知。

![任务三：产品表格搜索过滤](screenshots/3.1.png)
![任务三：产品表格搜索过滤](screenshots/3.2.png)
![任务三：产品表格搜索过滤](screenshots/3.3.png)

### 任务四：博客项目

（1）组件树：App → Header + PostForm + CategoryFilter + PostList(→PostItem) + PostDetail；
（2）JSX 验证：className 不是 class（class 是 JS 保留字）；{} 是插值；大写标签是组件、小写是 HTML 标签；
（3）key 用 post.id 不用 index；
（4）F5 刷新数据不丢（useLocalStorage）。

![任务4：博客主列表](screenshots/4.1.png)
![任务4：写文章表单](screenshots/4.2.png)
![任务4：分类过滤](screenshots/4.3.1.png)
![任务4：文章详情](screenshots/4.4.png)
![任务4：删除文章](screenshots/4.5.png)
![任务4：组件结构](screenshots/4.6.png)
![任务4：线上主列表](screenshots/4.7.png)
![任务4：线上技术分类过滤](screenshots/4.8.png)
![任务4：线上详情页](screenshots/4.9.png)
![任务4：F5持久化](screenshots/4.10.png)

### 任务五：Zustand 状态管理升级

（1）安装 zustand，创建 usePostStore（create + persist 中间件）；
（2）App.jsx 从 store 直接读 posts/publish/remove，不再用 useState + useLocalStorage；
（3）安装 @tanstack/react-query，main.jsx 包裹 QueryClientProvider。

验证：F5 刷新数据不丢（persist 生效）；组件不再层层传 props。

| 方案 | 适用场景 |
|---|---|
| useState | 组件内局部状态，不跨组件共享 |
| useLocalStorage | 需要持久化但数据量小、层级不深 |
| Zustand | 跨组件共享全局数据，避免 props drilling，自动持久化 |

### 任务六：AI 代码审查

ai-review.md 在仓库根目录，包含 5 个检查点（每个含 AI 原文 + 违反规则 + 修改前后 diff + 运行时变化）：
1. 组件职责：280 行巨型组件 → 拆分
2. Hook 调用顺序：useEffect 在 if 里 → 移到顶层
3. 依赖数组：闭包旧值 → 函数式更新
4. 状态最小化：冗余派生态 → 计算值
5. 审查留痕

## 四、指标对比

| 阶段 | 状态管理方式 | props 传递 | 持久化 |
|---|---|---|---|
| 任务4初始 | useState + useLocalStorage | App 层层透传 | 手写 localStorage |
| 任务5迁移后 | Zustand + persist | 组件自取，无 drilling | persist 自动 |

## 五、提交与部署

- GitHub 公开仓库：https://github.com/k423yyds/se3306-exp2
- 线上博客：https://k423yyds.github.io/se3306-exp2/

## 六、必答题

### （1）为什么把 Hook 写在 if 里是必然出错而不是偶尔出错？

React 内部为每个组件维护一个 Hook 数组，按调用顺序存储 state。每次渲染按 Hook 出现顺序"领号"：第一个 useState 是 0 号，第二个是 1 号。如果 Hook 在 if 里，条件 true 时它执行占号，条件 false 时不执行，后面所有 Hook 的号都往前挪一位。下次条件又变 true，React 去上次位置读 state 但那里是另一个 Hook 的数据——必然读错。只要条件分支切换过，顺序就必然错乱，不是概率问题。

### （2）useState / useLocalStorage / Zustand 的选择思路？

局部 UI 状态用 useState；需要持久化的小数据用 useLocalStorage；跨组件共享的全局数据用 Zustand。反例：博客文章列表如果硬用 useState 存在 App 里，通过 props 一层层传给 PostList→PostItem、PostForm、CategoryFilter、PostDetail，每加一个组件就多传一层 props（props drilling），应该用 Zustand。

## 七、选答题

### Zustand persist 为什么是异步恢复？对首屏渲染意味着什么？

Zustand persist 先以初始 state 渲染一次，再异步从 localStorage 读取数据触发 re-render。首屏可能短暂显示空数据然后填充，数据量大时会闪烁。本实验数据量小，肉眼不可见。

## 八、Debug FAQ（本次实验真实遇到的坑）

### 1. GitHub Actions pnpm ENOENT 失败

现象：部署 workflow 报 `ENOENT: no such file or directory, open '.../package.json'`。
原因：`pnpm/action-setup@v2` 在仓库根目录找 package.json，但项目在 lab2-blog 子目录。
解决：去掉 pnpm/action-setup，改用 `npm install -g pnpm` 安装。

### 2. CloudBase 突然收费，改用 GitHub Pages

现象：腾讯云 CloudBase 静态托管要求新建付费环境。
解决：改用 GitHub Actions + GitHub Pages 免费部署，workflow 自动 build + deploy。

### 3. GitHub Pages 部署后 404

现象：部署成功但访问 /se3306-exp2/lab2-blog/ 返回 404。
原因：dist 部署到 Pages 根目录，路径应为 /se3306-exp2/ 而不是 /se3306-exp2/lab2-blog/。

## 九、实验体会

通过从零写井字棋到完整博客项目，我理解了 React 的核心思想：组件化拆分、单向数据流、状态提升。从 useState 迁移到 Zustand 后，组件不再需要层层传 props，代码结构明显清晰。Hook 规则（不能在条件里调用）背后是 React 按顺序跟踪状态的机制，理解了 hookIndex"排队领号"后就知道这不是建议而是必然约束。同时学会了 GitHub Actions 自动部署前端项目。
