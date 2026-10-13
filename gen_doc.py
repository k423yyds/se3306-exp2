from docx import Document

doc = Document()

doc.add_heading('任务5：Zustand 状态管理升级与 TanStack Query', level=1)

doc.add_heading('一、Zustand 全局状态迁移', level=2)

doc.add_heading('1. 自检：F5刷新数据不丢，persist生效', level=3)
doc.add_paragraph(
    '迁移后，posts 数据由 usePostStore（带 persist 中间件）管理。'
    'persist 配置 name 为 posts，自动把 store 状态写入 localStorage。'
    'F5 刷新后，Zustand 从 localStorage 恢复数据，4 篇示例文章仍然存在，验证 persist 生效。'
)

doc.add_heading('2. 自检：组件不再层层传 props', level=3)
doc.add_paragraph(
    '迁移前：App 通过 props 把 posts、onAdd、onDelete、category、selectedId 一层层传给 '
    'PostForm、CategoryFilter、PostList、PostItem、PostDetail。'
)
doc.add_paragraph(
    '迁移后：App 里直接 usePostStore((s) => s.posts) 和 usePostStore((s) => s.publish) 读取，'
    '组件内部需要数据时自己从 store 取，不再需要父组件透传。'
    'App 只保留 category 和 selectedId 这两个纯 UI 状态（用 useState），'
    '业务数据 posts 完全由全局 store 管理。'
)

doc.add_heading('3. useState vs useLocalStorage vs Zustand 适用场景', level=3)
table = doc.add_table(rows=4, cols=2)
table.style = 'Light Grid Accent 1'
table.cell(0, 0).text = '方案'
table.cell(0, 1).text = '适用场景'
table.cell(1, 0).text = 'useState（组件内状态）'
table.cell(1, 1).text = '只在单个组件或其子组件内使用的状态，比如表单输入、开关切换、当前选中项。不需要跨组件共享。'
table.cell(2, 0).text = 'useLocalStorage（自定义 Hook 持久化）'
table.cell(2, 1).text = '需要持久化但数据量小、组件层级不深的场景。它本质还是 useState，只是同步写入 localStorage。适合实验博客这种小项目。'
table.cell(3, 0).text = 'Zustand（全局 Store）'
table.cell(3, 1).text = '中大型项目，多个不相关组件需要共享同一份数据，避免 props drilling。带 persist 中间件自动持久化，适合跨页面、跨组件的全局状态（用户信息、购物车、文章列表）。'

doc.add_heading('4. 官方文档怎么描述 Zustand？迁移验证了什么？', level=3)
doc.add_paragraph(
    'Zustand 官方文档描述它是一个小型、快速、可扩展的状态管理库，'
    '基于简化的 Flux 概念，使用 Hook 来管理状态，零依赖、约 1KB。'
    '核心 API 是 create() 创建 store，组件通过 useStore() 选择器订阅需要的状态切片。'
    'persist 中间件自动把 store 持久化到 localStorage/sessionStorage。'
)
doc.add_paragraph('迁移过程验证了三点：')
doc.add_paragraph('（1）状态提升不是唯一方案——数据可以放到全局 store，组件按需订阅；', style='List Bullet')
doc.add_paragraph('（2）persist 中间件确实替代了手写的 useLocalStorage，F5 刷新数据不丢；', style='List Bullet')
doc.add_paragraph('（3）组件不再需要层层 props 传函数，App 组件代码量明显减少。', style='List Bullet')

doc.add_heading('二、TanStack Query 服务端状态', level=2)

doc.add_heading('1. 三态 status：pending / error / success', level=3)
doc.add_paragraph('TanStack Query 的 useQuery 返回一个 status 字段，有三种状态：')
doc.add_paragraph('pending：请求发出但还没返回，此时显示加载中（Loading）；', style='List Bullet')
doc.add_paragraph('error：请求失败，显示错误信息和重试按钮；', style='List Bullet')
doc.add_paragraph('success：请求成功，渲染数据列表。', style='List Bullet')

doc.add_heading('2. json-server 本地 Mock 后台', level=3)
doc.add_paragraph('json-server 是一个零依赖工具，一条命令把 db.json 变成完整的 REST API：')
doc.add_paragraph('npx json-server db.json --port 3000 --delay 500')
doc.add_paragraph(
    '--delay 500 模拟 500ms 网络延迟，让 pending 态肉眼可见。'
    'db.json 里的增删改会真实写回文件，相当于一个本地数据库。'
)

doc.add_heading('3. 客户端状态 vs 服务端状态的边界', level=3)
doc.add_paragraph(
    '客户端状态：只存在于浏览器内存里，比如弹窗开关、表单草稿——用 useState / Zustand。'
)
doc.add_paragraph(
    '服务端状态：数据来自远程服务器，有缓存、过期、重新获取的概念——用 TanStack Query。'
    'Query 自动处理缓存、后台刷新、错误重试，不需要手写 useEffect + fetch + loading 状态。'
)

doc.save(r'C:\Users\cyj\Desktop\任务5_自检答案.docx')
print('done')
