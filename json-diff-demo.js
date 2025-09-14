// 简单的 JSON Diff 演示 (JavaScript 版本)

// 模拟 valtio proxy 功能的简单实现
const createStore = initialState => {
  const listeners = [];
  let state = { ...initialState };

  return {
    get state() {
      return state;
    },
    set state(newState) {
      state = newState;
      listeners.forEach(listener => listener(state));
    },
    subscribe(listener) {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
      };
    },
  };
};

// 创建 diff store
const diffStore = createStore({
  results: [],
  beforeData: null,
  afterData: null,
});

// JSON Diff 工具类
class JsonDiffer {
  static createPath(path) {
    return path.length > 0 ? path.join('.') : 'root';
  }

  static findByName(arr, name) {
    const index = arr.findIndex(item => item.name === name);
    return index !== -1 ? { item: arr[index], index } : null;
  }

  static compareArrays(oldArr, newArr, path) {
    const results = [];
    const processed = new Set();

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

  static compareObjects(oldObj, newObj, path = []) {
    const results = [];

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

  static diff(before, after) {
    return this.compareObjects(before, after);
  }

  static updateStore(before, after) {
    const results = this.diff(before, after);
    diffStore.state = {
      beforeData: before,
      afterData: after,
      results,
    };
  }

  static getSnapshot() {
    return diffStore.state;
  }

  static formatResults() {
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

// 演示数据
const before = [
  {
    name: 'a',
    version: '1.0.0',
    children: [
      {
        name: 'b',
        version: '1.0.0',
        children: [
          {
            name: 'c',
            version: '1.0.0',
          },
        ],
      },
      {
        name: 'd',
        version: '1.0.0',
        children: [
          {
            name: 'e',
            version: '1.0.0',
          },
        ],
      },
    ],
  },
  {
    name: 'f',
    version: '1.0.0',
    children: [
      {
        name: 'g',
        version: '1.0.0',
        children: [
          {
            name: 'h',
            version: '1.0.0',
          },
        ],
      },
      {
        name: 'i',
        version: '1.0.0',
        children: [
          {
            name: 'j',
            version: '1.0.0',
          },
        ],
      },
    ],
  },
];

const after = [
  {
    name: 'f',
    version: '1.0.0',
    children: [
      {
        name: 'g',
        version: '1.0.0',
        children: [
          {
            name: 'h',
            version: '1.0.1',
          },
        ],
      },
    ],
  },
  {
    name: 'a',
    version: '1.0.0',
    children: [
      {
        name: 'b',
        version: '1.0.0',
        children: [
          {
            name: 'c',
            version: '1.0.0',
          },
        ],
      },
      {
        name: 'd',
        version: '1.0.2',
        children: [
          {
            name: 'e',
            version: '1.0.0',
          },
        ],
      },
    ],
  },
];

// 运行演示
function runDemo() {
  console.log('🚀 开始 JSON Diff 演示...\n');

  // 执行 diff 并更新 store
  JsonDiffer.updateStore(before, after);

  // 获取并显示结果
  const results = JsonDiffer.formatResults();
  console.log(results);

  // 显示 store 状态
  const snapshot = JsonDiffer.getSnapshot();
  console.log(`📊 Store 状态:`);
  console.log(`- 检测到 ${snapshot.results.length} 个变化`);
  console.log(`- Before 数据包含 ${snapshot.beforeData.length} 个顶级项目`);
  console.log(`- After 数据包含 ${snapshot.afterData.length} 个顶级项目`);

  return snapshot;
}

// 执行演示
runDemo();
