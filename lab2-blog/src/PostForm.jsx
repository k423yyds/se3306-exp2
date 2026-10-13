import { useState } from 'react';

function PostForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onAdd({ title, category, summary, content });
    setTitle(''); setCategory(''); setSummary(''); setContent('');
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="form-title">写文章</div>
      <input placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="分类（技术 / 随笔 / 生活）" value={category} onChange={(e) => setCategory(e.target.value)} />
      <input placeholder="摘要" value={summary} onChange={(e) => setSummary(e.target.value)} />
      <textarea placeholder="正文" value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit" className="btn btn-primary">发布</button>
    </form>
  );
}

export default PostForm;
