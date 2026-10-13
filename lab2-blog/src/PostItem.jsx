function PostItem({ post, onView, onDelete }) {
  return (
    <div className="post-card" onClick={() => onView(post.id)}>
      <h3>{post.title}</h3>
      <div style={{ marginTop: 8 }}>
        <span className="badge">{post.category}</span>
      </div>
      <p className="post-date">{post.publishedAt}</p>
      <p className="post-summary">{post.summary || post.content.slice(0, 60)}</p>
      <button
        className="delete-btn"
        onClick={(e) => { e.stopPropagation(); onDelete(post.id); }}
      >
        删除
      </button>
    </div>
  );
}

export default PostItem;
