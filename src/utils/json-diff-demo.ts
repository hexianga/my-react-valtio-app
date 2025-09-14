import { proxy, snapshot } from 'valtio';

// JSON Diff 类型定义
interface DiffResult {
  path: string;
  type: 'added' | 'removed' | 'modified' | 'moved';
  oldValue?: any;
  newValue?: any;
  oldIndex?: number;
  newIndex?: number;
}

// 创建 valtio store 来存储 diff 结果
export const diffStore = proxy({
  results: [] as DiffResult[],
  beforeData: null as any,
  afterData: null as any,
});

// JSON Diff 工具类
export class JsonDiffer {
  private static createPath(path: string[]): string {
    return path.length > 0 ? path.join('.') : 'root';
  }

  private static findByName(
    arr: any[],
    name: string
  ): { item: any; index: number } | null {
    const index = arr.findIndex(item => item.name === name);
    return index !== -1 ? { item: arr[index], index } : null;
  }

  private static compareArrays(
    oldArr: any[],
    newArr: any[],
    path: string[]
  ): DiffResult[] {
    const results: DiffResult[] = [];
    const processed = new Set<string>();

    // 检查修改和移动
    for (let newIndex = 0; newIndex < newArr.length; newIndex++) {
      const newItem = newArr[newIndex];
      const oldResult = this.findByName(oldArr, newItem.name);

      if (oldResult) {
        const { item: oldItem, index: oldIndex } = oldResult;
        processed.add(newItem.name);

        // 检查位置变化
        if (oldIndex !== newIndex) {
          results.push({
            path: this.createPath([...path, newItem.name]),
            type: 'moved',
            oldIndex,
            newIndex,
            oldValue: oldItem,
            newValue: newItem,
          });
        }

        // 递归比较对象内容
        const itemDiffs = this.compareObjects(oldItem, newItem, [
          ...path,
          newItem.name,
        ]);
        results.push(...itemDiffs);
      } else {
        // 新增项
        results.push({
          path: this.createPath([...path, newItem.name]),
          type: 'added',
          newValue: newItem,
        });
      }
    }

    // 检查删除的项
    for (const oldItem of oldArr) {
      if (!processed.has(oldItem.name)) {
        results.push({
          path: this.createPath([...path, oldItem.name]),
          type: 'removed',
          oldValue: oldItem,
        });
      }
    }

    return results;
  }

  private static compareObjects(
    oldObj: any,
    newObj: any,
    path: string[] = []
  ): DiffResult[] {
    const results: DiffResult[] = [];

    if (oldObj === newObj) return results;

    if (typeof oldObj !== typeof newObj) {
      results.push({
        path: this.createPath(path),
        type: 'modified',
        oldValue: oldObj,
        newValue: newObj,
      });
      return results;
    }

    if (Array.isArray(oldObj) && Array.isArray(newObj)) {
      return this.compareArrays(oldObj, newObj, path);
    }

    if (typeof oldObj === 'object' && oldObj !== null && newObj !== null) {
      const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

      for (const key of allKeys) {
        const oldValue = oldObj[key];
        const newValue = newObj[key];
        const currentPath = [...path, key];

        if (!(key in oldObj)) {
          results.push({
            path: this.createPath(currentPath),
            type: 'added',
            newValue,
          });
        } else if (!(key in newObj)) {
          results.push({
            path: this.createPath(currentPath),
            type: 'removed',
            oldValue,
          });
        } else if (oldValue !== newValue) {
          if (typeof oldValue === 'object' && typeof newValue === 'object') {
            const nestedDiffs = this.compareObjects(
              oldValue,
              newValue,
              currentPath
            );
            results.push(...nestedDiffs);
          } else {
            results.push({
              path: this.createPath(currentPath),
              type: 'modified',
              oldValue,
              newValue,
            });
          }
        }
      }
    } else if (oldObj !== newObj) {
      results.push({
        path: this.createPath(path),
        type: 'modified',
        oldValue: oldObj,
        newValue: newObj,
      });
    }

    return results;
  }

  static diff(before: any, after: any): DiffResult[] {
    return this.compareObjects(before, after);
  }

  static updateStore(before: any, after: any): void {
    const results = this.diff(before, after);
    diffStore.beforeData = before;
    diffStore.afterData = after;
    diffStore.results = results;
  }

  static getSnapshot() {
    return snapshot(diffStore);
  }

  static formatResults(): string {
    const snap = this.getSnapshot();
    if (snap.results.length === 0) {
      return '没有发现差异';
    }

    let output = `发现 ${snap.results.length} 个差异:\n\n`;

    snap.results.forEach((diff, index) => {
      output += `${index + 1}. ${diff.path}:\n`;

      switch (diff.type) {
        case 'added':
          output += `   ➕ 新增: ${JSON.stringify(diff.newValue)}\n`;
          break;
        case 'removed':
          output += `   ❌ 删除: ${JSON.stringify(diff.oldValue)}\n`;
          break;
        case 'modified':
          output += `   🔄 修改: ${JSON.stringify(diff.oldValue)} → ${JSON.stringify(diff.newValue)}\n`;
          break;
        case 'moved':
          output += `   📦 移动: 从位置 ${diff.oldIndex} 到位置 ${diff.newIndex}\n`;
          break;
      }
      output += '\n';
    });

    return output;
  }
}
