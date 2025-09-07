/**
 * 用户表单 Schema 配置
 *
 * 使用 Formily Schema 语法定义表单结构、验证规则和组件属性
 * 遵循声明式配置理念，便于维护和复用
 */

import type { ISchema } from '@formily/react';

/**
 * 用户表单数据接口
 */
export interface UserFormData {
  name: string;
  email: string;
  age: number;
  phone: string;
  gender: 'male' | 'female';
  address: string;
  interests?: string[];
  description?: string;
}

/**
 * 用户表单 Schema 配置
 *
 * 📋 表单字段说明：
 * - name: 姓名（必填）
 * - email: 邮箱（必填，邮箱格式验证）
 * - age: 年龄（必填，数字范围 1-120）
 * - phone: 手机号（必填，中国手机号格式验证）
 * - gender: 性别（必填，单选）
 * - address: 地址（必填，文本域）
 * - interests: 兴趣爱好（可选，多选）
 * - description: 个人描述（可选，文本域）
 */
export const userFormSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '姓名',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入姓名',
        maxLength: 50,
      },
      'x-validator': [
        {
          required: true,
          message: '请输入姓名',
        },
        {
          min: 2,
          max: 50,
          message: '姓名长度应在 2-50 个字符之间',
        },
      ],
    },
    email: {
      type: 'string',
      title: '邮箱',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入邮箱',
        type: 'email',
      },
      'x-validator': [
        {
          required: true,
          message: '请输入邮箱',
        },
        {
          format: 'email',
          message: '请输入正确的邮箱格式',
        },
      ],
    },
    age: {
      type: 'number',
      title: '年龄',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        placeholder: '请输入年龄',
        min: 1,
        max: 120,
        precision: 0, // 只允许整数
        style: { width: '100%' },
      },
      'x-validator': [
        {
          required: true,
          message: '请输入年龄',
        },
        {
          minimum: 1,
          maximum: 120,
          message: '年龄应在 1-120 岁之间',
        },
      ],
    },
    phone: {
      type: 'string',
      title: '手机号',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入手机号',
        maxLength: 11,
      },
      'x-validator': [
        {
          required: true,
          message: '请输入手机号',
        },
        {
          pattern: /^1[3-9]\d{9}$/,
          message: '请输入正确的手机号格式',
        },
      ],
    },
    gender: {
      type: 'string',
      title: '性别',
      required: true,
      enum: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-validator': [
        {
          required: true,
          message: '请选择性别',
        },
      ],
    },
    address: {
      type: 'string',
      title: '地址',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        placeholder: '请输入详细地址',
        rows: 3,
        maxLength: 200,
        showCount: true,
      },
      'x-validator': [
        {
          required: true,
          message: '请输入地址',
        },
        {
          min: 5,
          max: 200,
          message: '地址长度应在 5-200 个字符之间',
        },
      ],
    },
    interests: {
      type: 'array',
      title: '兴趣爱好',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox.Group',
      enum: [
        { label: '读书', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '旅行', value: 'travel' },
        { label: '摄影', value: 'photography' },
        { label: '编程', value: 'programming' },
        { label: '绘画', value: 'painting' },
        { label: '游戏', value: 'gaming' },
      ],
      'x-component-props': {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '8px',
        },
      },
    },
    description: {
      type: 'string',
      title: '个人描述',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        placeholder: '请简单描述一下自己...',
        rows: 4,
        maxLength: 500,
        showCount: true,
      },
      'x-validator': [
        {
          max: 500,
          message: '个人描述不能超过 500 个字符',
        },
      ],
    },
  },
};

/**
 * 表单默认值
 */
export const userFormInitialValues: Partial<UserFormData> = {
  interests: [],
};

/**
 * 表单提交响应接口
 */
export interface UserFormSubmitResponse {
  success: boolean;
  message: string;
  data?: UserFormData;
}
