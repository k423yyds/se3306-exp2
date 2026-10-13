import { useState } from 'react';
import Header from './Header';
import PostForm from './PostForm';
import CategoryFilter from './CategoryFilter';
import PostList from './PostList';
import PostDetail from './PostDetail';
import useLocalStorage from './useLocalStorage';

const initialPosts = [
  { id: '1', title: '我的第一篇博客', category: '技术', summary: 'React 上手记录', content: '从 create-vite 到第一个组件，一步一步来。', publishedAt: '2026-09-01' },
  { id: '2', title: '为什么学前端框架', category: '随笔', summary: '框架的价值', content: '组件化让界面像积木一样拼装。', publishedAt: '2026-09-03' },
  { id: '3', title: '状态管理小抄', category: '技术', summary: 'useState 到 Zustand', content: '组件内 useState，跨组件状态提升，全局 Zustand。', publishedAt: '2026-09-05' },
  { id: '4', title: '部署上线记', category: '生活', summary: '静态托管 5 分钟上线', content: 'pnpm build 之后把 dist 拖上去。', publishedAt: '2026-09-07' },
];

function App() {
  const [posts, setPosts] = useLocalStorage('blog-posts', initialPosts);
  const [category, setCategory] = useState('全部');
  const [selectedId, setSelectedId] = useState(null);

  const categories = ['全部', ...new Set(posts.map((p) => p.category))];
  const visiblePosts =
    category === '全部' ? posts : posts.filter((p) => p.category === category);
  const selectedPost = posts.find((p) => p.id === selectedId) || null;

  function addPost(post) {
    const newPost = { ...post, id: String(Date.now()), publishedAt: new Date().toISOString().slice(0, 10) };
    setPosts([newPost, ...posts]);
  }

  function deletePost(id) {
    setPosts(posts.filter((p) => p.id !== id));
    setSelectedId(null);
  }

  return (
    <div>
      <Header />
      {selectedPost ? (
        <PostDetail post={selectedPost} onBack={() => setSelectedId(null)} />
      ) : (
        <>
          <PostForm onAdd={addPost} />
          <CategoryFilter categories={categories} active={category} onChange={setCategory} />
          <p className="stats">共 {posts.length} 篇 · 当前分类 {visiblePosts.length} 篇</p>
          <PostList posts={visiblePosts} onView={setSelectedId} onDelete={deletePost} />
        </>
      )}
    </div>
  );
}

export default App;
