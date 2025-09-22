/**
 * 测试环境配置
 */
export const TEST_CONFIG = {
  // 基础配置
  baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000',

  // 超时配置
  timeouts: {
    action: 10000,
    navigation: 30000,
    test: 60000,
  },

  // 重试配置
  retries: {
    local: 0,
    ci: 2,
  },

  // 浏览器配置
  browsers: {
    desktop: ['chromium', 'firefox', 'webkit'],
    mobile: ['Mobile Chrome', 'Mobile Safari'],
  },

  // 测试数据
  testData: {
    validUser: {
      name: '测试用户',
      email: 'test@example.com',
      phone: '13800138000',
    },
    invalidUser: {
      name: '',
      email: 'invalid-email',
      phone: '123',
    },
  },

  // API 端点
  apiEndpoints: {
    users: '/api/users',
    auth: '/api/auth',
    data: '/api/data',
  },

  // 选择器
  selectors: {
    navigation: {
      home: 'a[href="/"]',
      about: 'a[href="/about"]',
      form: 'a[href="/form"]',
    },
    form: {
      nameInput: 'input[name="name"]',
      emailInput: 'input[name="email"]',
      submitButton: 'button[type="submit"]',
      errorMessage: '.error, [role="alert"], .ant-form-item-explain-error',
    },
    common: {
      loading: '.loading, .spinner, .ant-spin',
      errorAlert: '.error, [role="alert"], .ant-notification',
      successMessage: '.success, .ant-message-success',
    },
  },

  // 性能阈值
  performance: {
    maxLoadTime: 5000, // 5秒
    maxResourceCount: 50,
    maxResponseTime: 2000, // 2秒
  },

  // 可访问性配置
  accessibility: {
    checkImages: true,
    checkLabels: true,
    checkContrast: false, // 需要额外插件
  },
};

/**
 * 环境特定配置
 */
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return {
        ...TEST_CONFIG,
        baseURL: process.env.PROD_URL || 'https://your-app.com',
        retries: 3,
        performance: {
          ...TEST_CONFIG.performance,
          maxLoadTime: 3000, // 生产环境要求更严格
        },
      };

    case 'staging':
      return {
        ...TEST_CONFIG,
        baseURL: process.env.STAGING_URL || 'https://staging-your-app.com',
        retries: 2,
      };

    default:
      return TEST_CONFIG;
  }
};
