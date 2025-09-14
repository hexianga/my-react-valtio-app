# 🚀 JSDiff 统一视图优化

## ✨ 优化概述

基于你的反馈，我将 JSDiff 工具的显示方式从"单独显示差异片段"优化为"Git 风格的统一视图"，实现了完整文件内容的对比展示。

## 🎯 关键改进

### 1. **统一视图模式** (像 git diff)

- ✅ **完整内容展示**: 显示整个文件的内容，而不是只显示变化的片段
- ✅ **行号对齐**: 左右两列显示原始和新版本的行号
- ✅ **变化标识**: 使用 `+`、`-`、` ` 标识新增、删除、未变化的行
- ✅ **上下文保留**: 保持文件的完整结构和上下文

### 2. **新增数据结构**

```typescript
export interface UnifiedDiffLine {
  lineNumber: {
    old: number | null; // 原始文件行号
    new: number | null; // 新文件行号
  };
  type: 'added' | 'removed' | 'unchanged' | 'context';
  content: string; // 行内容
  changeType?: 'word' | 'char'; // 内部变化类型
  innerChanges?: Array<{
    // 单词/字符级别的内联变化
    type: 'added' | 'removed' | 'unchanged';
    content: string;
  }>;
}
```

### 3. **视觉优化**

```
原始 | 新版 | 内容
-----|------|---------------------------
  1  |   1  |   function hello() {
  2  |   -  | -     console.log("Hello World");
  -  |   2  | +     console.log("Hello Universe");
  -  |   3  | +     console.log("Extra line");
  3  |   4  |       return true;
  4  |   5  |   }
```

## 🔧 技术实现

### 1. **核心方法: generateUnifiedView**

```typescript
private static generateUnifiedView(
  oldContent: string,
  newContent: string,
  changes: DiffChange[],
  diffType: string
): UnifiedDiffLine[]
```

### 2. **行模式处理**

- 对于 `lines` 类型：按行处理，保持文件结构
- 准确跟踪原始文件和新文件的行号
- 正确处理新增、删除、修改的行

### 3. **非行模式处理**

- 对于 `words`、`chars` 等类型：提供内联变化展示
- 在同一行内高亮显示具体的变化部分
- 支持嵌套的变化标识

## 🎨 UI 优化

### 1. **表格式布局**

```tsx
<div className="border border-gray-200 rounded-lg overflow-hidden">
  {/* 表头 */}
  <div className="bg-gray-100 px-4 py-2 border-b">
    <div className="flex items-center gap-3">
      <span className="w-4"></span> {/* 变化标识 */}
      <div className="flex gap-2 w-20">
        <span className="w-8">原始</span> {/* 原始行号 */}
        <span className="w-8">新版</span> {/* 新版行号 */}
      </div>
      <span className="flex-1">内容</span> {/* 文件内容 */}
    </div>
  </div>

  {/* 差异内容 */}
  <div className="max-h-96 overflow-y-auto">
    {unifiedView.map(line => renderUnifiedDiffLine(line))}
  </div>
</div>
```

### 2. **颜色标识**

- 🟢 **绿色背景**: 新增的行 (`bg-green-50 border-l-4 border-green-500`)
- 🔴 **红色背景**: 删除的行 (`bg-red-50 border-l-4 border-red-500`)
- ⚪ **白色背景**: 未变化的行 (`bg-white`)
- 🔵 **灰色背景**: 上下文行 (`bg-gray-50`)

### 3. **内联变化高亮**

```tsx
{
  line.innerChanges?.map((change, index) => (
    <span
      key={index}
      className={
        change.type === 'added'
          ? 'bg-green-200 text-green-800'
          : change.type === 'removed'
            ? 'bg-red-200 text-red-800'
            : ''
      }
    >
      {change.content}
    </span>
  ));
}
```

## 📊 使用效果

### 1. **原来的片段式显示**

```
➕ 新增: Hello Universe
➖ 删除: Hello World
➕ 新增: Extra line
```

### 2. **现在的统一视图显示**

```
1 | 1 |   function hello() {
2 | - | -     console.log("Hello World");
- | 2 | +     console.log("Hello Universe");
- | 3 | +     console.log("Extra line");
3 | 4 |       return true;
4 | 5 |   }
```

## 🚀 实际效果演示

### 1. **行差异模式** - 最像 git diff

- 完整显示文件结构
- 精确的行号对应
- 清晰的增删标识

### 2. **单词/字符模式** - 内联高亮

- 在同一行内显示具体变化
- 高亮标识变化的部分
- 保持内容的连续性

### 3. **JSON/CSS模式** - 结构化展示

- 保持原有的格式化显示
- 结构化的差异对比
- 便于理解配置变化

## 🎯 优势对比

| 特性         | 原来（片段式）    | 现在（统一视图）    |
| ------------ | ----------------- | ------------------- |
| **完整性**   | ❌ 只看到变化片段 | ✅ 看到完整文件结构 |
| **上下文**   | ❌ 缺少周围上下文 | ✅ 保留完整上下文   |
| **行号**     | ❌ 行号不连续     | ✅ 准确的行号对应   |
| **git 兼容** | ❌ 不像 git diff  | ✅ 完全像 git diff  |
| **可读性**   | ❌ 跳跃式阅读     | ✅ 线性连续阅读     |

## 📱 界面改进

### 1. **主要显示区域**

- 采用统一视图作为主要展示方式
- 添加滚动条支持大文件查看
- 优化表格式布局和对齐

### 2. **辅助信息**

- 将原来的变化列表移到可折叠的详情区域
- 保留统计信息的醒目显示
- 添加表头说明行号含义

### 3. **交互体验**

- 悬停高亮整行
- 清晰的视觉分组
- 合理的颜色对比度

## ✅ 验证结果

```bash
$ node test-unified-view.js
🚀 测试 Git 风格的统一视图功能...

=== Git 风格统一视图 ===
  1 |   function hello() {
  2 | -     console.log("Hello World");
  2 | +     console.log("Hello Universe");
  3 | +     console.log("Extra line");
  3 |       return true;
  4 |   }

✅ 统一视图功能测试完成！
```

## 🎉 总结

现在的 JSDiff 工具提供了真正的 **Git 风格统一视图**：

1. **📋 完整展示**: 显示整个文件内容，而不是只显示差异片段
2. **🔢 行号对齐**: 精确的原始和新版本行号对应关系
3. **🎨 直观标识**: 清晰的 `+`、`-`、` ` 标识不同类型的变化
4. **📖 上下文保留**: 保持完整的文件结构和上下文信息
5. **⚡ 响应式**: 基于 Valtio 的响应式状态管理

这种实现方式更符合开发者的使用习惯，提供了与 `git diff` 相似的查看体验！🚀
