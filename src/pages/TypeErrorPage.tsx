import React, { useState } from 'react';

interface ErrorLog {
  id: string;
  title: string;
  description: string;
  code: string;
  error: string | null;
  status: 'idle' | 'error' | 'success';
}

/**
 * TypeError 演示页面
 * 展示各种常见的 TypeError 错误类型
 */
const TypeErrorPage: React.FC = () => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const addLog = (log: Omit<ErrorLog, 'id'>) => {
    const id = Date.now().toString();
    setLogs(prev => [{ ...log, id }, ...prev]);
    // 新增的日志默认展开
    setExpandedIds(prev => new Set([...prev, id]));
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const clearLogs = () => {
    setLogs([]);
    setExpandedIds(new Set());
  };

  // 1. 访问不存在的属性
  const testAccessUndefinedProperty = () => {
    try {
      const obj: any = { name: 'John' };
      const _age = obj.age; // 不会报错，返回 undefined
      const _result = obj.age.toString(); // 这会报错
      addLog({
        title: '访问不存在的属性',
        description: '尝试访问对象上不存在的属性，然后调用其方法',
        code: `const obj = { name: 'John' };
const result = obj.age.toString(); // TypeError`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: '访问不存在的属性',
        description: '尝试访问对象上不存在的属性，然后调用其方法',
        code: `const obj = { name: 'John' };
const result = obj.age.toString(); // TypeError`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  // 2. 调用不存在的方法
  const testCallUndefinedMethod = () => {
    try {
      const obj: any = { name: 'John' };
      obj.greet(); // 这会报错
      addLog({
        title: '调用不存在的方法',
        description: '尝试调用对象上不存在的方法',
        code: `const obj = { name: 'John' };
obj.greet(); // TypeError: obj.greet is not a function`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: '调用不存在的方法',
        description: '尝试调用对象上不存在的方法',
        code: `const obj = { name: 'John' };
obj.greet(); // TypeError: obj.greet is not a function`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  // 3. 对 null 访问属性
  const testAccessPropertyOnNull = () => {
    try {
      const obj: any = null;
      const _result = obj.name; // 这会报错
      addLog({
        title: '对 null 访问属性',
        description: '尝试对 null 值访问属性',
        code: `const obj = null;
const result = obj.name; // TypeError: Cannot read property 'name' of null`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: '对 null 访问属性',
        description: '尝试对 null 值访问属性',
        code: `const obj = null;
const result = obj.name; // TypeError: Cannot read property 'name' of null`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  // 4. 对 undefined 访问属性
  const testAccessPropertyOnUndefined = () => {
    try {
      let obj: any;
      const _result = obj.name; // 这会报错
      addLog({
        title: '对 undefined 访问属性',
        description: '尝试对 undefined 值访问属性',
        code: `let obj;
const result = obj.name; // TypeError: Cannot read property 'name' of undefined`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: '对 undefined 访问属性',
        description: '尝试对 undefined 值访问属性',
        code: `let obj;
const result = obj.name; // TypeError: Cannot read property 'name' of undefined`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  // 5. 访问数组元素的属性
  const testAccessArrayElementProperty = () => {
    try {
      const arr: any = [1, 2, 3];
      const _result = arr[10].toString(); // 这会报错
      addLog({
        title: '访问数组越界元素的属性',
        description: '尝试访问数组越界元素的属性',
        code: `const arr = [1, 2, 3];
const result = arr[10].toString(); // TypeError: Cannot read property 'toString' of undefined`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: '访问数组越界元素的属性',
        description: '尝试访问数组越界元素的属性',
        code: `const arr = [1, 2, 3];
const result = arr[10].toString(); // TypeError: Cannot read property 'toString' of undefined`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  // 6. 设置非对象的属性
  const testSetPropertyOnPrimitive = () => {
    try {
      const num: any = 42;
      num.value = 100; // 在严格模式下会报错，非严格模式下会被忽略
      addLog({
        title: '设置原始类型的属性',
        description: '尝试在原始类型（数字）上设置属性',
        code: `const num = 42;
num.value = 100; // 在严格模式下会报错`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: '设置原始类型的属性',
        description: '尝试在原始类型（数字）上设置属性',
        code: `const num = 42;
num.value = 100; // 在严格模式下会报错`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  // 7. 调用非函数值
  const testCallNonFunction = () => {
    try {
      const obj: any = { value: 42 };
      obj.value(); // 这会报错
      addLog({
        title: '调用非函数值',
        description: '尝试调用一个不是函数的值',
        code: `const obj = { value: 42 };
obj.value(); // TypeError: obj.value is not a function`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: '调用非函数值',
        description: '尝试调用一个不是函数的值',
        code: `const obj = { value: 42 };
obj.value(); // TypeError: obj.value is not a function`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  // 8. 对字符串调用数组方法
  const testCallArrayMethodOnString = () => {
    try {
      const str: any = 'hello';
      str.push('world'); // 这会报错
      addLog({
        title: '对字符串调用数组方法',
        description: '尝试对字符串调用数组特有的方法',
        code: `const str = 'hello';
str.push('world'); // TypeError: str.push is not a function`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: '对字符串调用数组方法',
        description: '尝试对字符串调用数组特有的方法',
        code: `const str = 'hello';
str.push('world'); // TypeError: str.push is not a function`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  // 9. 链式调用中的错误
  const testChainCallError = () => {
    try {
      const obj: any = { user: null };
      const _result = obj.user.name.toUpperCase(); // 这会报错
      addLog({
        title: '链式调用中的错误',
        description: '在链式调用中访问 null 的属性',
        code: `const obj = { user: null };
const result = obj.user.name.toUpperCase(); // TypeError: Cannot read property 'name' of null`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: '链式调用中的错误',
        description: '在链式调用中访问 null 的属性',
        code: `const obj = { user: null };
const result = obj.user.name.toUpperCase(); // TypeError: Cannot read property 'name' of null`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  // 10. 对非对象使用 new 操作符
  const testNewOnNonConstructor = () => {
    try {
      const notAConstructor: any = 'hello';
      new notAConstructor(); // 这会报错
      addLog({
        title: '对非构造函数使用 new',
        description: '尝试对非构造函数使用 new 操作符',
        code: `const notAConstructor = 'hello';
new notAConstructor(); // TypeError: notAConstructor is not a constructor`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: '对非构造函数使用 new',
        description: '尝试对非构造函数使用 new 操作符',
        code: `const notAConstructor = 'hello';
new notAConstructor(); // TypeError: notAConstructor is not a constructor`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  // 11. 对非对象使用 in 操作符
  const testInOperatorOnNonObject = () => {
    try {
      const _result = 'name' in (42 as any); // 这会报错
      addLog({
        title: '对非对象使用 in 操作符',
        description: '尝试对原始类型使用 in 操作符',
        code: `const result = 'name' in 42; // TypeError: Cannot use 'in' operator to search for 'name' in 42`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: '对非对象使用 in 操作符',
        description: '尝试对原始类型使用 in 操作符',
        code: `const result = 'name' in 42; // TypeError: Cannot use 'in' operator to search for 'name' in 42`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  // 12. 对非对象使用 delete 操作符
  const testDeleteOnNonObject = () => {
    try {
      const num: any = 42;
      delete num.value; // 在严格模式下会报错
      addLog({
        title: '对原始类型使用 delete',
        description: '尝试对原始类型使用 delete 操作符',
        code: `const num = 42;
delete num.value; // 在严格模式下会报错`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: '对原始类型使用 delete',
        description: '尝试对原始类型使用 delete 操作符',
        code: `const num = 42;
delete num.value; // 在严格模式下会报错`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  // 13. 访问 null 的 length 属性
  const testAccessLengthOnNull = () => {
    try {
      const value: any = null;
      const _result = value.length; // 这会报错
      addLog({
        title: '访问 null 的 length 属性',
        description: '尝试访问 null 的 length 属性',
        code: `const value = null;
const result = value.length; // TypeError: null is not an object`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: '访问 null 的 length 属性',
        description: '尝试访问 null 的 length 属性',
        code: `const value = null;
const result = value.length; // TypeError: null is not an object`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  // 14. 对 null 调用方法
  const testCallMethodOnNull = () => {
    try {
      const func: any = null;
      func(); // 这会报错
      addLog({
        title: '对 null 调用方法',
        description: '尝试对 null 值调用方法',
        code: `const func = null;
func(); // TypeError: null is not an object (evaluating 'func')`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: '对 null 调用方法',
        description: '尝试对 null 值调用方法',
        code: `const func = null;
func(); // TypeError: null is not an object (evaluating 'func')`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  // 15. Clipboard 读取权限异常
  const testClipboardReadPermissionDenied = () => {
    // 模拟 Clipboard API 不可用的情况
    // 这会导致 TypeError: Cannot read properties of undefined (reading 'readText')
    try {
      const _result = navigator.clipboard.readText(); // 这会报错
      addLog({
        title: 'Clipboard 读取权限异常',
        description:
          '尝试访问 navigator.clipboard.readText，但 clipboard 不可用',
        code: `navigator.clipboard.readText();
// TypeError: Cannot read properties of undefined (reading 'readText')`,
        error: null,
        status: 'success',
      });
    } catch (error) {
      addLog({
        title: 'Clipboard 读取权限异常',
        description:
          '尝试访问 navigator.clipboard.readText，但 clipboard 不可用',
        code: `navigator.clipboard.readText();
// TypeError: Cannot read properties of undefined (reading 'readText')`,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TypeError 演示
          </h1>
          <p className="text-lg text-gray-600">
            点击下方按钮触发各种常见的 TypeError 错误
          </p>
        </div>

        {/* 测试按钮区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button
            onClick={testAccessUndefinedProperty}
            className="btn btn-primary"
          >
            访问不存在的属性
          </button>
          <button onClick={testCallUndefinedMethod} className="btn btn-primary">
            调用不存在的方法
          </button>
          <button
            onClick={testAccessPropertyOnNull}
            className="btn btn-primary"
          >
            对 null 访问属性
          </button>
          <button
            onClick={testAccessPropertyOnUndefined}
            className="btn btn-primary"
          >
            对 undefined 访问属性
          </button>
          <button
            onClick={testAccessArrayElementProperty}
            className="btn btn-primary"
          >
            访问数组越界元素属性
          </button>
          <button
            onClick={testSetPropertyOnPrimitive}
            className="btn btn-primary"
          >
            设置原始类型属性
          </button>
          <button onClick={testCallNonFunction} className="btn btn-primary">
            调用非函数值
          </button>
          <button
            onClick={testCallArrayMethodOnString}
            className="btn btn-primary"
          >
            对字符串调用数组方法
          </button>
          <button onClick={testChainCallError} className="btn btn-primary">
            链式调用中的错误
          </button>
          <button onClick={testNewOnNonConstructor} className="btn btn-primary">
            对非构造函数使用 new
          </button>
          <button
            onClick={testInOperatorOnNonObject}
            className="btn btn-primary"
          >
            对非对象使用 in 操作符
          </button>
          <button onClick={testDeleteOnNonObject} className="btn btn-primary">
            对原始类型使用 delete
          </button>
          <button onClick={testAccessLengthOnNull} className="btn btn-primary">
            访问 null 的 length 属性
          </button>
          <button onClick={testCallMethodOnNull} className="btn btn-primary">
            对 null 调用方法
          </button>
          <button
            onClick={testClipboardReadPermissionDenied}
            className="btn btn-primary"
          >
            Clipboard 读取权限异常
          </button>
        </div>

        {/* 清空日志按钮 */}
        {logs.length > 0 && (
          <div className="mb-8 text-center">
            <button onClick={clearLogs} className="btn btn-secondary">
              清空所有日志
            </button>
          </div>
        )}

        {/* 错误日志区域 */}
        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 text-lg">
                点击上方按钮触发错误，错误日志将显示在这里
              </p>
            </div>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                className={`card cursor-pointer transition-all ${
                  log.status === 'error'
                    ? 'border-l-4 border-red-500'
                    : 'border-l-4 border-green-500'
                }`}
                onClick={() => toggleExpanded(log.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          log.status === 'error' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                      ></span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {log.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {log.description}
                    </p>
                  </div>
                  <span className="text-gray-400 ml-4">
                    {expandedIds.has(log.id) ? '▼' : '▶'}
                  </span>
                </div>

                {/* 展开的详细信息 */}
                {expandedIds.has(log.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        代码:
                      </p>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-auto">
                        {log.code}
                      </pre>
                    </div>
                    {log.error && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          错误信息:
                        </p>
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                          <p className="text-red-700 text-sm font-mono">
                            {log.error}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 说明文档 */}
        <div className="mt-12 card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            TypeError 类型说明
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong>TypeError</strong>是 JavaScript
              中最常见的错误类型之一，当一个值不是预期的类型时就会抛出。
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>访问不存在的属性:</strong>
                当访问对象上不存在的属性时，会返回
                undefined，但如果继续对其进行操作就会报错
              </li>
              <li>
                <strong>调用不存在的方法:</strong>
                尝试调用对象上不存在的方法会导致 TypeError
              </li>
              <li>
                <strong>对 null/undefined 操作:</strong>
                这是最常见的 TypeError，无法对 null 或 undefined
                进行任何属性访问或方法调用
              </li>
              <li>
                <strong>类型不匹配:</strong>
                尝试对错误的类型调用方法，如对字符串调用数组方法
              </li>
              <li>
                <strong>非函数调用:</strong>
                尝试调用一个不是函数的值
              </li>
              <li>
                <strong>链式调用错误:</strong>
                在链式调用中，如果中间某个值为 null 或
                undefined，后续操作都会失败
              </li>
              <li>
                <strong>Clipboard 权限异常:</strong>
                当尝试读取剪贴板内容但权限被拒绝时，会产生 UnhandledRejection
                错误。这通常发生在用户未授予权限或浏览器安全策略限制的情况下
              </li>
            </ul>
          </div>
        </div>

        {/* Clipboard 权限异常说明 */}
        <div className="mt-8 card bg-blue-50 border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-blue-900 mb-3">
            📋 Clipboard API 不可用异常详解
          </h3>
          <div className="space-y-3 text-blue-800 text-sm">
            <p>
              <strong>错误信息:</strong> Cannot read properties of undefined
              (reading 'readText')
            </p>
            <p>
              <strong>错误类型:</strong> TypeError
            </p>
            <p>
              <strong>发生场景:</strong>
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>navigator.clipboard 为 undefined（API 不可用）</li>
              <li>浏览器不支持 Clipboard API</li>
              <li>在非安全上下文中访问（非 HTTPS）</li>
              <li>在某些特殊环境中（如某些移动浏览器）</li>
              <li>在 iframe 中且未设置正确的权限</li>
            </ul>
            <p>
              <strong>解决方案:</strong>
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>检查 navigator.clipboard 是否存在</li>
              <li>使用 try-catch 处理可能的错误</li>
              <li>提供降级方案（如传统的 document.execCommand）</li>
              <li>在 HTTPS 环境下运行应用</li>
              <li>提供用户友好的错误提示</li>
            </ul>
            <div className="bg-white p-2 rounded mt-2 font-mono text-xs">
              <p className="text-gray-700">
                // 正确的处理方式
                <br />
                if (navigator.clipboard) {'{'}
                <br />
                &nbsp;&nbsp;navigator.clipboard.readText()
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;.then(text =&gt; console.log(text))
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;.catch(err =&gt; console.error(err));
                <br />
                {'}'} else {'{'}
                <br />
                &nbsp;&nbsp;console.warn('Clipboard API 不可用');
                <br />
                {'}'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeErrorPage;
