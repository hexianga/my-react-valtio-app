// 标签页切换功能
const tabSwitchingScript = `
  function switchTab(tabId) {
    // 隐藏所有标签内容
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
      content.classList.remove('active');
    });

    // 取消所有标签的活动状态
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.classList.remove('active');
    });

    // 显示选定的标签内容并激活标签
    document.getElementById(tabId).classList.add('active');
    document.querySelector(\`[data-tab="\${tabId}"]\`).classList.add('active');
  }
`;

// 模块切换功能
const moduleSwitchingScript = `
  function switchModule(moduleId) {
    // 隐藏所有模块内容
    const moduleContents = document.querySelectorAll('.module-content');
    moduleContents.forEach(content => {
      content.classList.remove('active');
    });

    // 取消所有模块标签的活动状态
    const moduleTabs = document.querySelectorAll('.module-tab');
    moduleTabs.forEach(tab => {
      tab.classList.remove('active');
    });

    // 显示选定的模块内容并激活模块标签
    const currentModuleContent = document.getElementById(moduleId + '-content');
    currentModuleContent.classList.add('active');
    document.querySelector(\`[data-module="\${moduleId}"]\`).classList.add('active');

    // 自动选中当前模块下的第一个标签页
    if (currentModuleContent) {
      // 找到当前模块下的所有标签页
      const tabs = currentModuleContent.querySelectorAll('.tab');
      const tabContents = currentModuleContent.querySelectorAll('.tab-content');

      // 取消所有标签的活动状态
      tabs.forEach(tab => {
        tab.classList.remove('active');
      });

      // 隐藏所有标签内容
      tabContents.forEach(content => {
        content.classList.remove('active');
      });

      // 激活第一个标签页
      const firstTab = tabs[0];
      if (firstTab) {
        firstTab.classList.add('active');
        const tabId = firstTab.getAttribute('data-tab');
        if (tabId) {
          const tabContent = document.getElementById(tabId);
          if (tabContent) {
            tabContent.classList.add('active');
          }
        }
      }
    }
  }
`;

// 初始化脚本
const initializationScript = `
  // 初始化时显示第一个模块和分割视图
  document.addEventListener('DOMContentLoaded', function() {
    // 激活第一个模块
    const firstModuleTab = document.querySelector('.module-tab');
    if (firstModuleTab) {
      const moduleId = firstModuleTab.getAttribute('data-module');
      if (moduleId) switchModule(moduleId);
    }
  });
`;

// 将所有脚本拼接在一起
export const scripts = `
  ${tabSwitchingScript}
  ${moduleSwitchingScript}
  ${initializationScript}
`;