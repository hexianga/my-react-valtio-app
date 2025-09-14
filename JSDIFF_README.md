# JSDiff 专业差异比较工具

## 🚀 功能概述

基于 [diff](https://www.npmjs.com/package/diff) 库实现的专业级差异比较工具，完全集成到 Valtio 状态管理中。

## ✨ 核心特性

### 1. **多种比较模式**

- **字符差异** (`diffChars`) - 精确到每个字符的变化
- **单词差异** (`diffWords`) - 以单词为单位的比较
- **行差异** (`diffLines`) - 以行为单位的比较，最适合代码/文档
- **JSON差异** (`diffJson`) - 专门针对JSON对象的智能比较
- **CSS差异** (`diffCss`) - 专门针对CSS样式的比较
- **句子差异** (`diffSentences`) - 以句子为单位的比较

### 2. **Valtio 状态管理**

```typescript
// 完全响应式的状态管理
export const diffStore = proxy({
  results: [] as DiffResult[], // 所有比较结果
  currentResult: null as DiffResult | null, // 当前显示的结果
  isLoading: false, // 加载状态
  error: null as string | null, // 错误信息
  settings: {
    // 比较设置
    ignoreWhitespace: false,
    ignoreCase: false,
    contextLines: 3,
    showInlineDiff: true,
  },
});
```

### 3. **智能统计**

每个比较结果包含详细统计信息：

- ➕ **新增** 数量
- ➖ **删除** 数量
- 📊 **总变化** 数量
- 🏷️ **比较类型** 标识

### 4. **多结果管理**

- 🔄 支持多个比较结果的并行管理
- 📑 标签页式的结果切换
- 🗑️ 单独删除或批量清空结果
- 💾 每个结果都有唯一ID和时间戳

## 🛠️ 技术实现

### 主要文件结构：

```
src/
├── utils/jsdiff-tool.ts        # JSDiff 核心工具类
├── components/JSDiffViewer.tsx # React UI 组件
├── pages/JSDiffPage.tsx        # 页面组件
└── tests/jsdiff.spec.ts        # E2E 测试
```

### 核心API：

```typescript
// 基本比较方法
JSDiffTool.diffLines(oldStr, newStr, title); // 行差异
JSDiffTool.diffWords(oldStr, newStr, title); // 单词差异
JSDiffTool.diffChars(oldStr, newStr, title); // 字符差异
JSDiffTool.diffJson(oldObj, newObj, title); // JSON差异
JSDiffTool.diffCss(oldCss, newCss, title); // CSS差异
JSDiffTool.diffSentences(oldStr, newStr, title); // 句子差异

// 补丁操作
JSDiffTool.createPatch(fileName, oldStr, newStr); // 创建补丁
JSDiffTool.applyPatch(source, patch); // 应用补丁

// 状态管理
JSDiffTool.getSnapshot(); // 获取状态快照
JSDiffTool.clearResults(); // 清空所有结果
JSDiffTool.removeResult(id); // 删除指定结果
JSDiffTool.setCurrentResult(id); // 设置当前结果
JSDiffTool.updateSettings(settings); // 更新设置
JSDiffTool.formatResult(id); // 格式化输出
```

## 🎯 使用场景

### 1. **代码比较**

```typescript
// 比较两个版本的代码文件
JSDiffTool.diffLines(oldCode, newCode, '代码变更比较');
```

### 2. **配置文件比较**

```typescript
// 比较JSON配置文件
JSDiffTool.diffJson(oldConfig, newConfig, '配置文件变更');
```

### 3. **样式比较**

```typescript
// 比较CSS样式变化
JSDiffTool.diffCss(oldStyles, newStyles, 'CSS样式更新');
```

### 4. **文档比较**

```typescript
// 比较文档内容
JSDiffTool.diffSentences(oldDoc, newDoc, '文档内容比较');
```

## 🌟 高级特性

### 1. **智能设置**

- **忽略空白字符** - 忽略空格、制表符等空白字符差异
- **忽略大小写** - 进行大小写不敏感的比较
- **上下文行数** - 设置差异上下文显示行数
- **内联显示** - 切换内联/并排显示模式

### 2. **可视化展示**

- ➕ **绿色** 标识新增内容
- ➖ **红色** 标识删除内容
- 🔸 **灰色** 标识未变化内容
- 📍 **行号** 显示准确位置

### 3. **演示数据**

内置三套完整的演示数据：

- 📄 **文本演示** - 多行文本比较示例
- 📋 **JSON演示** - 复杂对象结构比较
- 🎨 **CSS演示** - 样式规则变化示例

## 🔧 安装依赖

```bash
# 安装 diff 库
pnpm add diff

# diff 库已经包含 TypeScript 类型定义
```

## 🚦 快速开始

### 1. **访问应用**

```
http://localhost:3004/jsdiff
```

### 2. **基本使用**

1. 在"原始内容"和"新内容"文本框中输入要比较的内容
2. 选择适合的比较类型
3. 可选择性设置标题和调整比较设置
4. 点击"🔍 开始比较"按钮
5. 查看详细的差异结果

### 3. **演示数据**

- 点击"📄 加载文本演示"体验文本行差异
- 点击"📋 加载JSON演示"体验JSON对象比较
- 点击"🎨 加载CSS演示"体验CSS样式比较

## 📊 测试验证

```bash
# 运行 E2E 测试
npm test tests/jsdiff.spec.ts

# 验证核心功能
node jsdiff-verify.js
```

## 🎉 功能验证

### ✅ 已验证功能：

- [x] diff 库正确安装和导入
- [x] Valtio 状态管理正常工作
- [x] 6种比较模式全部可用
- [x] React 组件正确渲染
- [x] 路由导航正常
- [x] 演示数据加载成功
- [x] 设置选项功能正常
- [x] 多结果标签页管理
- [x] 错误处理和加载状态
- [x] 基础E2E测试通过

## 🔮 扩展可能

1. **导出功能** - 支持导出差异报告为PDF/HTML
2. **高级过滤** - 按变更类型过滤显示
3. **合并工具** - 提供三方合并功能
4. **历史记录** - 持久化保存比较历史
5. **批量比较** - 支持多文件批量比较
6. **API集成** - 提供REST API接口

## 💡 最佳实践

1. **大文件比较** - 对于大文件建议使用行差异模式
2. **JSON比较** - 结构化数据推荐使用JSON差异模式
3. **代码审查** - 代码变更建议开启"忽略空白字符"选项
4. **文档比较** - 长文档建议使用句子差异模式

---

🎯 **总结**: 基于 JSDiff 的专业差异比较工具已成功集成到 Valtio 项目中，提供了完整的差异分析、可视化展示和状态管理功能！
