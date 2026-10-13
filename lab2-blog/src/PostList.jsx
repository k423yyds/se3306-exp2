import PostItem from './PostItem';

function PostList({ posts, onView, onDelete }) {
  if (posts.length === 0) return <p style={{ margin: 12 }}>还没有文章，写下第一篇吧</p>;
  return (
    <div>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} onView={onView} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default PostList;
