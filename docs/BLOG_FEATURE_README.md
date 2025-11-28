# 📚 技术博客功能说明

## 功能概述

技术博客功能允许你在应用中浏览和阅读 `docs` 目录下的所有 Markdown 文档。这是一个完整的文档阅读系统，包含：

- 📋 **文章列表页面** - 展示所有文档，支持搜索和分类筛选
- 📖 **文章详情页面** - 渲染 Markdown 内容，支持代码高亮和 GitHub 风格
- 🎨 **美观的 UI** - 现代化的设计，响应式布局
- 🔍 **搜索功能** - 快速查找文章
- 🏷️ **分类系统** - 自动根据文件名分类

## 文件结构

```
my-react-valtio-app/
├── docs/                                    # Markdown 文档目录
│   ├── API_REFACTORING_ANALYSIS.md
│   ├── AXIOS_OPTIMIZATION_GUIDE.md
│   ├── BRANCH_PROTECTION.md
│   └── ...
├── src/
│   ├── pages/
│   │   ├── BlogListPage.tsx                # 博客列表页面
│   │   └── BlogDetailPage.tsx              # 博客详情页面
│   ├── types/
│   │   └── markdown.d.ts                   # Markdown 类型声明
│   └── App.tsx                             # 路由配置
└── config/
    └── webpack.common.js                   # Webpack 配置（Markdown loader）
```

## 依赖库

```json
{
  "react-markdown": "^9.0.0",      // Markdown 渲染
  "remark-gfm": "^4.0.0",          // GitHub 风格 Markdown
  "rehype-highlight": "^7.0.0",    // 代码语法高亮
  "rehype-raw": "^7.0.0"           // 支持 HTML 标签
}
```

## 安装依赖

```bash
npm install react-markdown remark-gfm rehype-highlight rehype-raw --save
```

## 使用方法

### 1. 访问博客列表

在浏览器中访问：`http://localhost:3000/blog`

或点击侧边栏的 "📚 技术博客" 菜单项。

### 2. 浏览文章

- **搜索**: 在搜索框中输入关键词，实时过滤文章
- **分类筛选**: 使用下拉菜单选择特定分类
- **点击卡片**: 点击任意文章卡片进入详情页

### 3. 阅读文章

- 文章以 Markdown 格式渲染
- 代码块自动高亮
- 支持表格、列表、引用等 GitHub 风格语法
- 外部链接自动在新标签页打开

## 添加新文档

### 步骤 1: 创建 Markdown 文件

在 `docs` 目录下创建新的 `.md` 文件：

```bash
touch docs/MY_NEW_DOCUMENT.md
```

### 步骤 2: 编写内容

```markdown
# 我的新文档

这是文档内容...

## 代码示例

\`\`\`javascript
console.log('Hello World');
\`\`\`
```

### 步骤 3: 更新文件列表

编辑 `src/pages/BlogListPage.tsx`，在 `markdownFiles` 数组中添加新文件：

```typescript
const markdownFiles = [
  'API_REFACTORING_ANALYSIS.md',
  'AXIOS_OPTIMIZATION_GUIDE.md',
  // ... 其他文件
  'MY_NEW_DOCUMENT.md',  // 添加这一行
];
```

### 步骤 4: 刷新页面

重新加载应用，新文档会自动出现在列表中。

## 自定义分类

文章分类基于文件名自动判断。编辑 `BlogListPage.tsx` 中的 `parseFilename` 函数来自定义分类规则：

```typescript
const parseFilename = (filename: string): { title: string; category: string } => {
  const nameWithoutExt = filename.replace('.md', '');

  // 自定义分类规则
  let category = '其他';
  if (nameWithoutExt.includes('API')) {
    category = 'API 开发';
  } else if (nameWithoutExt.includes('GIT')) {
    category = 'Git 工具';
  }
  // 添加更多规则...

  return { title, category };
};
```

## 样式自定义

### Markdown 样式

编辑 `BlogDetailPage.tsx` 中的 `prose` 类名来自定义样式：

```tsx
<article className="prose prose-lg max-w-none
  prose-headings:font-bold
  prose-h1:text-3xl
  prose-code:text-pink-600
  // 添加更多样式...
">
```

### 代码高亮主题

更改 `BlogDetailPage.tsx` 中的导入：

```typescript
// 可选主题：
import 'highlight.js/styles/github-dark.css';     // GitHub 暗色
import 'highlight.js/styles/github.css';          // GitHub 亮色
import 'highlight.js/styles/monokai.css';         // Monokai
import 'highlight.js/styles/atom-one-dark.css';   // Atom One Dark
```

## 功能特性

### ✅ 已实现

- [x] Markdown 文件列表展示
- [x] Markdown 内容渲染
- [x] 代码语法高亮
- [x] 搜索功能
- [x] 分类筛选
- [x] 响应式设计
- [x] GitHub 风格 Markdown
- [x] 外部链接处理
- [x] 加载状态
- [x] 错误处理

### 🚀 可扩展功能

- [ ] 文章目录（TOC）
- [ ] 阅读进度条
- [ ] 文章评论
- [ ] 点赞/收藏
- [ ] 标签系统
- [ ] 全文搜索
- [ ] 文章推荐
- [ ] 打印/导出 PDF
- [ ] 暗黑模式
- [ ] 字体大小调节

## 技术实现

### Markdown 渲染流程

```
1. 用户访问 /blog/:filename
         ↓
2. 动态导入 Markdown 文件
   import(`../../docs/${filename}`)
         ↓
3. 获取文件 URL
   markdownModule.default
         ↓
4. Fetch 文件内容
   fetch(url).then(res => res.text())
         ↓
5. ReactMarkdown 渲染
   <ReactMarkdown>{content}</ReactMarkdown>
         ↓
6. 应用插件处理
   - remarkGfm: GitHub 风格
   - rehypeHighlight: 代码高亮
   - rehypeRaw: HTML 支持
         ↓
7. 显示渲染结果
```

### Webpack 配置

Markdown 文件作为资源处理：

```javascript
{
  test: /\.md$/,
  type: 'asset/resource',
  generator: {
    filename: 'docs/[name][ext]',
  },
}
```

## 常见问题

### Q1: 为什么需要手动列出文件？

**A**: Webpack 不支持动态 `require` 目录。需要在 `BlogListPage.tsx` 中手动维护文件列表。

**解决方案**: 可以编写脚本自动生成文件列表：

```javascript
// scripts/generate-blog-list.js
const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '../docs');
const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));

console.log('const markdownFiles = [');
files.forEach(f => console.log(`  '${f}',`));
console.log('];');
```

### Q2: 如何添加文章元数据？

**A**: 在 Markdown 文件开头添加 Front Matter：

```markdown
---
title: 我的文章标题
date: 2024-01-01
category: 技术
tags: [React, TypeScript]
---

# 文章内容...
```

然后使用 `gray-matter` 库解析：

```bash
npm install gray-matter
```

```typescript
import matter from 'gray-matter';

const { data, content } = matter(markdownText);
console.log(data.title); // 我的文章标题
```

### Q3: 如何优化加载性能？

**A**:

1. **代码分割**: 使用 React.lazy 懒加载页面
2. **缓存**: 使用 localStorage 缓存文章内容
3. **预加载**: 在列表页预加载热门文章
4. **CDN**: 将 Markdown 文件部署到 CDN

### Q4: 如何支持图片？

**A**:

1. 将图片放在 `public/images/` 目录
2. 在 Markdown 中使用相对路径：

```markdown
![图片描述](/images/my-image.png)
```

或使用绝对 URL：

```markdown
![图片描述](https://example.com/image.png)
```

## 最佳实践

### 1. 文件命名规范

```
✅ 好的命名:
- API_REFACTORING_ANALYSIS.md
- AXIOS_OPTIMIZATION_GUIDE.md
- REQUEST_ID_GUIDE.md

❌ 避免:
- doc1.md
- temp.md
- 未命名.md
```

### 2. Markdown 编写规范

```markdown
# 使用一级标题作为文章标题

## 使用二级标题作为章节

### 使用三级标题作为小节

- 使用列表组织内容
- 保持层级清晰

\`\`\`javascript
// 代码块指定语言以启用高亮
const example = 'code';
\`\`\`

> 使用引用突出重要信息

**加粗**重要内容，*斜体*强调
```

### 3. 性能优化

- 控制单个文档大小（建议 < 100KB）
- 大文档拆分为多个小文档
- 图片使用压缩和懒加载
- 使用 CDN 加速资源加载

## 相关资源

- [React Markdown 文档](https://github.com/remarkjs/react-markdown)
- [Remark GFM 文档](https://github.com/remarkjs/remark-gfm)
- [Rehype Highlight 文档](https://github.com/rehypejs/rehype-highlight)
- [Markdown 语法指南](https://www.markdownguide.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

## 总结

技术博客功能为你的应用提供了一个完整的文档阅读系统。通过简单的配置，你可以：

✅ 快速浏览所有技术文档
✅ 搜索和筛选感兴趣的内容
✅ 享受优雅的阅读体验
✅ 轻松添加和管理文档

开始使用吧！🚀

---

**维护者**: 项目团队
**最后更新**: 2024-11-28
