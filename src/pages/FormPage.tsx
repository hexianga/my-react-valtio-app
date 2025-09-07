import React from 'react';
import { Layout, Typography, Space, Button } from 'antd';
import { useSnapshot } from 'valtio';
import { appState, actions } from '../store';
import UserForm from '../components/UserForm';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export const FormPage: React.FC = () => {
  const { theme } = useSnapshot(appState);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 页面头部 */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Title level={1}>Formily + Valtio 表单示例</Title>
              <Paragraph type="secondary" style={{ fontSize: '16px' }}>
                这是一个集成了 Formily 表单管理和 Valtio 状态管理的示例页面
              </Paragraph>

              {/* 主题切换按钮 */}
              <Button
                onClick={() => actions.toggleTheme()}
                style={{ marginTop: '16px' }}
              >
                切换主题 (当前: {theme})
              </Button>
            </div>

            {/* 表单组件 */}
            <UserForm />
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default FormPage;
