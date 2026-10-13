import { useState } from 'react';
import Header from './Header';
import PostForm from './PostForm';
import CategoryFilter from './CategoryFilter';
import PostList from './PostList';
import PostDetail from './PostDetail';
import usePostStore from './store/usePostStore';

function App() {
  const posts = usePostStore((s) => s.posts);
  const publish = usePostStore((s) => s.publish);
  const remove = usePostStore((s) => s.remove);

  const [category, setCategory] = useState('全部');
  const [selectedId, setSelectedId] = useState(null);

  const categories = ['全部', ...new Set(posts.map((p) => p.category))];
  const visiblePosts =
    category === '全部' ? posts : posts.filter((p) => p.category === category);
  const selectedPost = posts.find((p) => p.id === selectedId) || null;

  return (
    <div>
      <Header />
      {selectedPost ? (
        <PostDetail post={selectedPost} onBack={() => setSelectedId(null)} />
      ) : (
        <>
          <PostForm onAdd={publish} />
          <CategoryFilter categories={categories} active={category} onChange={setCategory} />
          <p className="stats">共 {posts.length} 篇 · 当前分类 {visiblePosts.length} 篇</p>
          <PostList posts={visiblePosts} onView={setSelectedId} onDelete={remove} />
        </>
      )}
    </div>
  );
}

export default App;
