import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePostStore = create(
  persist(
    (set) => ({
      posts: [
        { id: '1', title: '我的第一篇博客', category: '技术', summary: 'React 上手记录', content: '从 create-vite 到第一个组件，一步一步来。', publishedAt: '2026-09-01' },
        { id: '2', title: '为什么学前端框架', category: '随笔', summary: '框架的价值', content: '组件化让界面像积木一样拼装。', publishedAt: '2026-09-03' },
        { id: '3', title: '状态管理小抄', category: '技术', summary: 'useState 到 Zustand', content: '组件内 useState，跨组件状态提升，全局 Zustand。', publishedAt: '2026-09-05' },
        { id: '4', title: '部署上线记', category: '生活', summary: '静态托管 5 分钟上线', content: 'pnpm build 之后把 dist 拖上去。', publishedAt: '2026-09-07' },
      ],
      publish: (post) =>
        set((s) => ({
          posts: [{ ...post, id: String(Date.now()), publishedAt: new Date().toISOString().slice(0, 10) }, ...s.posts],
        })),
      update: (id, patch) =>
        set((s) => ({
          posts: s.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      remove: (id) =>
        set((s) => ({
          posts: s.posts.filter((p) => p.id !== id),
        })),
    }),
    { name: 'posts' }
  )
);

export default usePostStore;
