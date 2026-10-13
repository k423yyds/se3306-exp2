import { useState, useEffect } from 'react';

// 训练1 JSX
function TrainJSX() {
  const name = '我的博客';
  const posts = ['第一篇', '第二篇', '第三篇'];
  return (
    <div>
      <h1>欢迎来到{name}</h1>
      <ul>{posts.map((p, i) => <li key={i}>{p}</li>)}</ul>
    </div>
  );
}

// 训练3 useState 四连
function TrainUseState() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [on, setOn] = useState(false);
  const [list, setList] = useState(['写实验报告', '复习']);
  const [newItem, setNewItem] = useState('');
  return (
    <div>
      <p>{count} <button onClick={() => setCount(count + 1)}>+1</button></p>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>你输入了：{text}</p>
      <button onClick={() => setOn(!on)}>{on ? '开' : '关'}</button>
      <input value={newItem} onChange={(e) => setNewItem(e.target.value)} />
      <button onClick={() => { setList([...list, newItem]); setNewItem(''); }}>添加</button>
      <ul>{list.map((item, i) => <li key={i}>{item}<button onClick={() => setList(list.filter((_, idx) => idx !== i))}>删</button></li>)}</ul>
    </div>
  );
}

// 训练4 key
let nextId = 3;
function TrainKey() {
  const [list, setList] = useState([{ id: 1, name: '甲' }, { id: 2, name: '乙' }]);
  return (
    <div>
      <button onClick={() => setList([{ id: nextId++, name: '新' }, ...list])}>头部插入一个新人</button>
      <ul>{list.map((p, i) => <li key={i}>#{p.id} <input defaultValue={p.name} /></li>)}</ul>
      <p>在乙那行输入"测试"，再点头部插入，看"测试"跟到哪行（index 当 key 会串位）</p>
    </div>
  );
}

// 训练5 useEffect
function TrainEffect() {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);
  useEffect(() => { console.log('挂载了，只跑一次'); }, []);
  useEffect(() => { console.log('count=', count); }, [count]);
  useEffect(() => {
    const t = setInterval(() => setTime((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div>
      <p>{count} <button onClick={() => setCount(count + 1)}>+1</button></p>
      <p>{time} 秒</p>
      <p>F12 控制台看打印</p>
    </div>
  );
}

// 训练6 自定义Hook
function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const fn = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return size;
}
function TrainCustomHook() {
  const { w, h } = useWindowSize();
  return <p>窗口：{w} × {h}（拖动浏览器边缘看数字变化）</p>;
}

const TABS = [
  { id: 'jsx', label: '训练1 JSX', C: TrainJSX },
  { id: 'state', label: '训练3 useState', C: TrainUseState },
  { id: 'key', label: '训练4 key', C: TrainKey },
  { id: 'effect', label: '训练5 useEffect', C: TrainEffect },
  { id: 'hook', label: '训练6 自定义Hook', C: TrainCustomHook },
];

export default function App() {
  const [tab, setTab] = useState('jsx');
  const Current = TABS.find((t) => t.id === tab).C;
  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ marginRight: 10, padding: '10px 20px', fontSize: 16 }}>

            {t.label}
          </button>
        ))}
      </div>
      <hr />
      <Current />
    </div>
  );
}
