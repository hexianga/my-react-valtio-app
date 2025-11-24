/**
 * JSON 解析工具函数
 * 用于解析和格式化 JSON 数据，支持递归解析嵌套的 JSON 字符串
 */

export interface ParsedData {
  duration?: number;
  url?: string;
  status?: number;
  pageUrl?: string;
  platform?: string;
  [key: string]: any;
}

export interface ParseResult {
  success: boolean;
  data?: ParsedData;
  error?: string;
  rawJson?: string;
  formattedJson?: string;
  nestedData?: Record<string, any>;
}

/**
 * 递归解析 JSON 字符串中的嵌套 JSON 字段
 * @param obj - 要处理的对象
 * @returns 处理后的对象，其中字符串类型的 JSON 被解析为对象
 */
function recursiveParseJSON(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    // 尝试解析字符串为 JSON
    try {
      const trimmed = obj.trim();
      if (
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))
      ) {
        const parsed = JSON.parse(trimmed);
        // 递归处理解析后的对象
        return recursiveParseJSON(parsed);
      }
    } catch {
      // 如果解析失败，返回原字符串
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => recursiveParseJSON(item));
  }

  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = recursiveParseJSON(value);
    }
    return result;
  }

  return obj;
}

/**
 * 解析 JSON 字符串
 * @param jsonString - JSON 字符串
 * @returns 解析结果
 */
export function parseJSON(jsonString: string): ParseResult {
  try {
    const trimmed = jsonString.trim();

    // 检查是否为空
    if (!trimmed) {
      return {
        success: false,
        error: 'JSON 字符串为空',
      };
    }

    // 尝试解析 JSON
    const data = JSON.parse(trimmed);

    // 递归解析嵌套的 JSON 字符串
    const nestedData = recursiveParseJSON(data);

    // 格式化 JSON
    const formattedJson = JSON.stringify(nestedData, null, 2);

    return {
      success: true,
      data: nestedData,
      rawJson: trimmed,
      formattedJson,
      nestedData,
    };
  } catch (error) {
    return {
      success: false,
      error: `JSON 解析失败: ${error instanceof Error ? error.message : '未知错误'}`,
      rawJson: jsonString,
    };
  }
}

/**
 * 提取 JSON 中的特定字段
 * @param data - 解析后的数据
 * @param fields - 要提取的字段名数组
 * @returns 提取的字段对象
 */
export function extractFields(
  data: ParsedData,
  fields: string[]
): Record<string, any> {
  const result: Record<string, any> = {};
  fields.forEach(field => {
    if (field in data) {
      result[field] = data[field];
    }
  });
  return result;
}

/**
 * 格式化 API 请求数据
 * @param data - 解析后的数据
 * @returns 格式化后的数据
 */
export function formatAPIData(data: ParsedData): Record<string, string> {
  return {
    请求耗时: data.duration ? `${data.duration}ms` : 'N/A',
    'API 地址': data.url || 'N/A',
    响应状态: data.status ? `${data.status}` : 'N/A',
    '页面 URL': data.pageUrl || 'N/A',
    平台: data.platform || 'N/A',
  };
}

/**
 * 验证 API 数据的有效性
 * @param data - 解析后的数据
 * @returns 验证结果
 */
export function validateAPIData(data: ParsedData): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (data.duration === undefined) {
    issues.push('缺少 duration 字段');
  } else if (typeof data.duration !== 'number' || data.duration < 0) {
    issues.push('duration 必须是非负数字');
  }

  if (!data.url) {
    issues.push('缺少 url 字段');
  } else if (typeof data.url !== 'string') {
    issues.push('url 必须是字符串');
  }

  if (data.status === undefined) {
    issues.push('缺少 status 字段');
  } else if (
    typeof data.status !== 'number' ||
    data.status < 100 ||
    data.status > 599
  ) {
    issues.push('status 必须是有效的 HTTP 状态码 (100-599)');
  }

  if (!data.pageUrl) {
    issues.push('缺少 pageUrl 字段');
  } else if (typeof data.pageUrl !== 'string') {
    issues.push('pageUrl 必须是字符串');
  }

  if (!data.platform) {
    issues.push('缺少 platform 字段');
  } else if (typeof data.platform !== 'string') {
    issues.push('platform 必须是字符串');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * 生成 API 数据的摘要
 * @param data - 解析后的数据
 * @returns 摘要字符串
 */
export function generateSummary(data: ParsedData): string {
  const formatted = formatAPIData(data);
  return Object.entries(formatted)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}
