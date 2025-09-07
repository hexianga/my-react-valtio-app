import React from 'react';
import { createForm } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';
import {
  FormItem,
  Input,
  NumberPicker,
  Checkbox,
  Radio,
  FormLayout,
  Submit,
  Reset,
  FormButtonGroup,
} from '@formily/antd-v5';
import { Card, message } from 'antd';
import { useSnapshot } from 'valtio';
import { appState } from '../store';
import {
  userFormSchema,
  userFormInitialValues,
  type UserFormData,
} from '../schemas/userFormSchema';

// 创建表单实例
const form = createForm({
  //   validateFirst: true,
  initialValues: userFormInitialValues,
});

// 创建 Schema Field 组件
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    NumberPicker,
    Checkbox,
    Radio,
    FormLayout,
    Submit,
    Reset,
  },
});

// 用户表单组件
export const UserForm: React.FC = () => {
  const snapshot = useSnapshot(appState);

  // 主要的表单提交处理函数
  const handleSubmit = async (values: UserFormData) => {
    try {
      console.log('开始提交表单，数据:', values);
    } catch (error) {
      console.error('表单提交过程中出错:', error);
      message.error('提交失败，请重试');
    }
  };

  // 表单提交成功处理
  const handleSubmitSuccess = async (values: UserFormData) => {
    try {
      console.log('表单提交成功，数据:', values);

      // 这里可以调用 API 提交数据
      // await submitUserForm(values);

      // 模拟提交
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 更新应用状态（如果需要）
      // actions.setUser(values);

      message.success('表单提交成功！');

      // 重置表单
      form.reset();
    } catch (error) {
      console.error('API 调用失败:', error);
      message.error('服务器错误，请稍后重试');
    }
  };

  // 表单提交失败处理（验证失败）
  const handleSubmitFailed = (errors: any) => {
    console.error('表单验证失败:', errors);

    // 这里可以进行失败后的操作
    // 例如：显示错误统计信息
    const errorCount = Object.keys(errors).length;
    if (errorCount > 0) {
      message.warning(`发现 ${errorCount} 个字段验证错误，请修正后重试`);
    }
  };

  // 表单重置处理
  const handleReset = () => {
    form.reset();
    message.info('表单已重置');
  };

  return (
    <Card
      title="用户信息表单"
      style={{ maxWidth: 800, margin: '0 auto' }}
      extra={
        <span style={{ fontSize: '14px', color: '#666' }}>
          当前主题: {snapshot.theme}
        </span>
      }
    >
      <FormProvider form={form}>
        <FormLayout
          layout="vertical"
          size="large"
          colon={false}
          feedbackLayout="terse"
        >
          <SchemaField schema={userFormSchema} />

          <FormButtonGroup align="center">
            <Submit
              onSubmit={handleSubmit}
              onSubmitSuccess={handleSubmitSuccess}
              onSubmitFailed={handleSubmitFailed}
            >
              提交
            </Submit>
            <Reset onClick={handleReset}>重置</Reset>
          </FormButtonGroup>
        </FormLayout>
      </FormProvider>
    </Card>
  );
};

export default UserForm;
