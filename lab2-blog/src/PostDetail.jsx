function PostDetail({ post, onBack }) {
  if (!post) return null;
  return (
    <div className="detail-card">
      <h2>{post.title}</h2>
      <div style={{ marginTop: 8 }}>
        <span className="badge">{post.category}</span>
        <span className="post-date" style={{ marginLeft: 8 }}>{post.publishedAt}</span>
      </div>
      <p className="detail-content">{post.content}</p>
      <button className="btn btn-ghost" onClick={onBack}>返回列表</button>
    </div>
  );
}

export default PostDetail;
