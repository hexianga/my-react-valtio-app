const fs = require('fs');
const path = require('path');
const { JSDiffTool } = require('./src/utils/jsdiff-tool');

const LatestVersion = {
  template_config: {
    title: 'template-seagullweb-v5',
    linkType: 'VERSION',
    version: '0.0.31',
    config: {
      link: {
        'com.sankuai.sjst.erp.www_756b3150233fc2655fd6fe01e9e8cc00': 'history',
        'com.sankuai.sjst.erp.www_2a340540b3849b989593d1f0566e198a': 'history',
        'com.sankuai.sjst.erp.www_201f3d3fc2f1cbb1f1f4e2d0aa81c4ad': 'history',
        'com.sankuai.sjst.erp.www_4a52d8dab8cf936a7741035e99b9b261': 'history',
        'com.sankuai.sjst.erp.www_254902054b2bfdddc85f23b7d0f2b540': 'history',
        'com.sankuai.sjst.erp.www_08c98cf119b9f12920d507ab964a84a3': 'history',
        'com.sankuai.sjst.erp.www_4c677ac1789e663301676103484980a3': 'history',
        'com.sankuai.sjst.erp.www_821813a1d86bcfb6385eaa7649a55f2c': 'history',
        'com.sankuai.sjst.erp.www_f57ffae6b33a47209e77590307aa1ac3': 'history',
        'com.sankuai.sjst.erp.www_a038e2d034d21eaca3afd4990dfc7efc': 'history',
        'com.sankuai.sjst.erp.www_2aafc468631acc3fe1e25bf78ae3c6a4': 'history',
        'com.sankuai.sjst.erp.www_f2b3ba72a18a7f50922017885c102c9d': 'history',
        'com.sankuai.sjst.erp.www_6889ab823c658ca52ea4009247e9b2b5': 'history',
        'com.sankuai.sjst.erp.www_c8dc4b14adf1b686c0369075543be520': 'history',
        'com.sankuai.sjst.erp.www_b62fb44cec2e6e0b58a7fe006c463ae7': 'history',
        'com.sankuai.sjst.erp.www_a408901b7d65c6f036c77ec09ea47d6d': 'history',
        'com.sankuai.sjst.erp.www_76ac7e59bf2e1df947a8a4a5d5c3c4f4': 'history',
        'com.sankuai.sjst.erp.www_770bd9c1c8660a1ae9247e8130f48c13': 'history',
        'com.sankuai.sjst.erp.www_d05eef1dcea4e6d7d2365e6def237f62': 'history',
        'com.sankuai.sjst.erp.www_34894fbd38b006eb37a8753012447763': 'history',
        'com.sankuai.sjst.erp.www_5e5779c01c0991c76cfe15b571fc468a': 'history',
        'com.sankuai.sjst.erp.www_fbe70933e76bc23aec265caba95a5f21': 'history',
        'com.sankuai.sjst.erp.www_b6173cde5487cfff0bbaf65812788a4a': 'history',
        'com.sankuai.sjst.erp.www_35b8f8b70293496234fa9e8ef2c56f64': 'history',
        region_management_1705042509000: 'history',
        Agent_Account_Approve_Menu: 'history',
        'com.sankuai.sjst.erp.www_portrait_rule_1704789130': 'history',
        'com.sankuai.sjst.erp.www_5338c73a7d479ffe0a43309358ae4728': 'history',
        'com.sankuai.sjst.erp.www_435de3999d4ecf5822104a9f43a6100b': 'history',
        'com.sankuai.sjst.erp.www_c0c04de5a20a280e03bdfe13da7e9232': 'history',
        'com.sankuai.sjst.erp.www_0a4cf5538f8cfea1c00cf9754442d48c': 'history',
        'com.sankuai.sjst.erp.www_cacc359d213d5654a2a9aea27bc7dce6': 'history',
        'com.sankuai.sjst.erp.www_3e4cf034f7e4ee9e1b10bfdc0c66b09a': 'history',
        ACTIVIATION_CODE: 'history',
        'com.sankuai.sjst.erp.www_a0900210e825aa8c091f26195e0a81b8': 'history',
        'com.sankuai.sjst.erp.www_bcbaa0617436ae6bd519e2a8b7b3786d': 'history',
        AGENT_PURCHASE_LIST_INTELLIGENT: 'history',
        'com.sankuai.sjst.erp.www_5713d31fb4e1b024c382e1593ce4a7b4': 'history',
        'com.sankuai.sjst.erp.www_16d71bd63af468aa89004bcd81848b31': 'history',
        'com.sankuai.sjst.erp.www_e9ef2b4216bf3bdca3ff73522908c0d6': 'history',
        'com.sankuai.sjst.erp.www_6b5fbabc95245c1b531c7724ea49a8ae': 'history',
        'com.sankuai.sjst.erp.www_f08eae5b17ce7769b0bde385e61284d2': 'history',
        'com.sankuai.sjst.erp.www_93e1dc15a6d5b32cf3bbc8865e5daa79': 'history',
        'com.sankuai.sjst.erp.www_92a3f51b8834abfe4d5b8349bdcaa307': 'history',
        'com.sankuai.sjst.erp.www_2853550ba7c5c99a19e882339a2d6fca': 'history',
        Brandpool_Manager: 'history',
        SEAGULLWEB_BRANDAPPLY_MENU: 'history',
        'com.sankuai.sjst.erp.www_d3dc71ff3b44099fa55cbde080dae5a0': 'history',
        'com.sankuai.sjst.erp.www_59a8dfc26dc8a10f544e6829b8374ba1': 'history',
        'com.sankuai.sjst.erp.www_84b25d37f38965a6d713432a6732010b': 'history',
        'com.sankuai.sjst.erp.www_de95601337dbfe4c79b7dc0e4208658d': 'history',
        'Poi-PrivatSea': 'history',
        'com.sankuai.sjst.erp.www_78b06b19d4132f0ec6fccb4d19d3de46': 'history',
        'com.sankuai.sjst.erp.www_e966aff7c5fa58572e7abf32b0831159': 'history',
        'com.sankuai.sjst.erp.www_7d7e5b1c2dec207d41d182cfb0f36d83': 'history',
        'com.sankuai.sjst.erp.www_eada3705957625e370dbedc97235a8f6': 'history',
        IMPLEMENTATION_CELLULAR_MENU: 'history',
        PPVVC_LIST: 'history',
        'com.sankuai.sjst.erp.www_9a49cee83abfc131c3df6eb07350e8f3': 'history',
        'com.sankuai.sjst.erp.www_b906c4cff3dd96f4553e090257152ece': 'history',
        CLIENTSOURCE_PROJECTAPPLY_MENU: 'history',
        IMPLEMENTATION_PROJECT_MENU: 'history',
        CUSTOMER_TICKET_TASK_LIST: 'history',
        AGENT_BUSINESS_APPROVE: 'history',
        CUSTOMER_MANAGER_UNIT_MANAGE: 'history',
        CUSTOMER_MANAGER_POILIST: 'history',
        CUSTOMER_MANAGE_BRAND_LIST: 'history',
        CUSTOMER_MANAGER_HQ_LISTPAGE: 'history',
        POI_LIST: 'history',
        WORKORDER_TIME_QUERYLIST: 'history',
        WORKORDER_AFTERSALE_TICKET_MENU: 'history',
        GOODS_CENTER: 'history',
        STRARTEGY_CENTER: 'history',
        GOODS_CENTER_FRONTCATEGORY: 'history',
        GOODS_CENTER_BACKCATEGORY: 'history',
        GOODS_CENTER_INCIDENCE_RELATION: 'history',
        GOODS_CENTER_FATTRIBUTE: 'history',
        GOODS_CENTER_BACK_CATEGORY_ATTRIBUTE: 'history',
        GOODS_CENTER_ATTRIBUTE_TEMPLATES: 'history',
        GOODS_CENTER_TEMPLATE_CATEGORY: 'history',
        GOODS_CENTER_SAASGOODS: 'history',
        GOODS_CENTER_SALEGOODS: 'history',
        GOODS_CENTER_MATERIEL_LIST: 'history',
        APPROVAL_LIST: 'history',
        SEAGULL_ORDER: 'history',
        CODE_COMMON: 'history',
        CODE_ACTIVE_APPLY: 'history',
        CODE_ACTIVE_APPROVE: 'history',
        CODE_ACTIVE_QUERYALL_ENTRY: 'history',
        CODE_ACTIVE_DELETE: 'history',
        CUSTOMER_TICKET_TASK_MENU: 'history',
        AGENT_TRANSFER_RECORDS: 'history',
        AGENT_TRADE_DETAIL_NEW: 'history',
        GOODS_PURCHASE_NOTE_NEW: 'history',
        AGENT_PURCHASE_LIST_PROFESSION_NEW: 'history',
        PRICE_STRATEGY: 'history',
        PRICE_APPROVAL: 'history',
        SPACE_AUTH_MANAGER_MENU: 'history',
        SEAGULL_IMPLEMENT: 'history',
        XUFEI_UPGRADE: 'history',
        SEAGULL_TASK_WXAUTHTOOL: 'history',
        AGENT_IMPORT_RESULT_STEAMER: 'history',
        AGENT_MANAGE_EMPLOYEE_MENU_STEAMER: 'history',
        SEAGULL_TRANSFER_LIST: 'history',
        DATA_AUTH_MANAGER_MENU: 'history',
        WORKORDER_NEWPOI_INSTALLTICKET_MENU: 'history',
        BASIC_MANAGE_AFTERSALE_QUESTION: 'history',
        CRM_RESOURCE_ROTATION_LIST: 'history',
        CRM_SALES_CHAIN_HQACCOUNT_LIST: 'history',
        GOODS_CENTER_SALEGOODS_INTELLIGENT: 'history',
        GOODS_CENTER_SAASGOODS_INTELLIGENT: 'history',
        GOODS_CENTER_PRODUCT: 'history',
        STRATEGY_CENTER_SERVICE_RULE: 'history',
        STRATEGY_CENTER_GOODS_RULE: 'history',
        CUSTOMER_RISK_MANAGEMENT: 'history',
        'com.sankuai.sjst.erp.www_edcac7b9bf0efa07780be4fb79b179a1': 'history',
        CUSTOMER_ASSET_MANAGEMENT: 'history',
        AGENT_BILL_LIST: 'history',
        AGENT_CHANNEL_LIST: 'history',
        CRM_DASHBOARD_CONFIG_PAGE: 'history',
        SEAGULL_WAREHOUSE_MAINTENANCE: 'history',
        AGENT_EXECUTION_SETTLEMENT_QUERY_BILL: 'history',
        AGENT_EXECUTION_PAYMENT_QUERY_BILL: 'history',
        AGENT_EXECUTION_SETTLEMENT_QUERY_DEATILLIST: 'history',
        MESSAGE_CENTER_PUBLISH: 'history',
        MESSAGE_CENTER: 'history',
        MSGTYPE_USERGROUP: 'history',
        SEAGULL_OPPORTUNITY: 'history',
        SCM_CSPU_GOODS_MANAGER: 'history',
        SCM_HARDWARE_LIST: 'history',
        AGENT_ADMIN: 'history',
        MARKET_ORDER: 'history',
        CRM_ALL_POI: 'history',
        CRM_PRIVATE_POI: 'history',
        CRM_POI_VISIT: 'history',
        CALL_INVITATION: 'history',
        AGENT_AGENTZF: 'history',
        'com.sankuai.sjst.erp.www_cd141d8c90bbaf2e882835c53569cd98': 'history',
        AGENT_SELL_ORGMANAGE: 'history',
        AGENT_EXECUTION_PAGELIST: 'history',
        SEAGULL_BATCHOPERATION: 'history',
        'com.sankuai.sjst.erp.www_b9a9aab4b44f618345255656e6d4c69b': 'history',
        'com.sankuai.sjst.erp.www_c4d6e355f80b308ba033fe51ddfb41d4': 'history',
        'com.sankuai.sjst.erp.www_260f796b6b6c06f988d31f320f4aec88': 'history',
        'com.sankuai.sjst.erp.www_898430efc84c8b44e6a09ef505b14c75': 'history',
        RENEWAL_UPGRADE_TIME_STRATEGY: 'history',
        'com.sankuai.sjst.erp.www_a426ae930c344bd1b3435d9eabfdb60e': 'history',
        'com.sankuai.sjst.erp.www_36fd0e947dac185a98906ffdc271fd8d': 'history',
        Automatic_Renewal_Price_Strategy: 'history',
        Operations_Workbench: 'history',
        'com.sankuai.sjst.erp.www_bd3f63d244dd761676396e302fa5f351': 'history',
        'com.sankuai.sjst.erp.www_ba7918fd183c54ee4d0bbb708e7c9550': 'history',
        'com.sankuai.sjst.erp.www_5f8e5e066a3c2d3a728741132a4de03f': 'history',
        'com.sankuai.sjst.erp.www_980a89c2ae8df4d9c5dd1b33cd0b5d06': 'history',
        'com.sankuai.sjst.erp.www_b11da820ba814ceebb51099792f03aba': 'history',
        'com.sankuai.sjst.erp.www_9ca471813af00751a3c548cce5252611': 'history',
        'com.sankuai.sjst.erp.www_cc3cd488f6c5915b3efb3bf1734e14ea': 'history',
        'com.sankuai.sjst.erp.www_aac55c7f477d1aa17f8d85a46b10f974': 'history',
        'com.sankuai.sjst.erp.www_45747f0bf1b88d58318b2f278b0848d3': 'history',
        'com.sankuai.sjst.erp.www_75053f3dcc40290a3324df0bbd9f16e0': 'history',
        'com.sankuai.sjst.erp.www_3984e65e72e42af4f9207dedd1f4f4c2': 'history',
        'com.sankuai.sjst.erp.www_e9202977edaff792cf9a52cbb2987978': 'history',
        'com.sankuai.sjst.erp.www_4ebd76c858b1b819426e2d05ce1624f4': 'history',
        'com.sankuai.sjst.erp.www_0414d7efa6418699839f7f00f1e8c6c1': 'history',
        'com.sankuai.sjst.erp.www_90d425face480b6fb5cf07b99e470cdc': 'history',
        'com.sankuai.sjst.erp.www_6c95389aba568741bb8bee2adf193f19': 'history',
        'com.sankuai.sjst.erp.www_1ffd44c37f07e5d3d66356e3faf3b4d2': 'history',
        'com.sankuai.sjst.erp.www_ba63e5a0879fe459305d9a2188ffc189': 'history',
        'com.sankuai.sjst.erp.www_65e344e49749fdf4b82b7fe68a999c84': 'history',
        'com.sankuai.sjst.erp.www_1ebe7505cd4c3785093caba8508383aa': 'history',
        'com.sankuai.sjst.erp.www_cae04f81bea651cf09da51dba8c5cb07': 'history',
        'com.sankuai.sjst.erp.www_d5b5706c164747a6e278b317f2778099': 'history',
        'com.sankuai.sjst.erp.www_488025cf801c8eb7a438efd206472396': 'history',
        'com.sankuai.sjst.erp.www_4a4f68cbb31cc365f7d341e3b4694035': 'history',
        'com.sankuai.sjst.erp.www_db24cd30cef55b748c1c0cd6234eebc2': 'history',
        'com.sankuai.sjst.erp.www_3a112ee9dba5f92fb88e9c36ab7e2f87': 'history',
        'com.sankuai.sjst.erp.www_0d1f32f687b3da12fa59e3f5a8982cf5': 'history',
        'com.sankuai.sjst.erp.www_7141a323f8df13aa28cbd562eec1e2e1': 'history',
        'com.sankuai.sjst.erp.www_4a35dd29293855394e3c706ec9524408': 'history',
        'com.sankuai.sjst.erp.www_53c84195539130e6ed2cabcce31d0604': 'history',
        'com.sankuai.sjst.erp.www_8fd5bb6b09c621d9773d0a771ce13d8b': 'history',
        'com.sankuai.sjst.erp.www_338608eef242606112eccc76c2072a7e': 'history',
        'com.sankuai.sjst.erp.www_4b876dfe490c8ce67ebfb3bdcf38407c': 'history',
        'com.sankuai.sjst.erp.www_b3c33b429e62b30c60b03237b35fde4f': 'history',
        'com.sankuai.sjst.erp.www_c61e837756e0218560d08b0acc91d1b9': 'history',
        'com.sankuai.sjst.erp.www_224f97acbf5357fd34c841354327402d': 'history',
        'com.sankuai.sjst.erp.www_71776c0bf9f2c000113fef03148d5926': 'history',
        'com.sankuai.sjst.erp.www_e4583dd270f0244c2b47d0d24d699f8d': 'history',
      },
      menu: {
        'com.sankuai.sjst.erp.www_eada3705957625e370dbedc97235a8f6': {
          badge: [
            {
              url: '/apiwg/bdopappthriftservice/getcontactpositions',
              callBack: '(res) => {return res.contactPositionTOs[0].code}',
            },
          ],
        },
      },
    },
    templateId: 27,
    id: 27,
    confirmed: true,
    screenshots: [],
    maintainers: [
      'gongyanyu',
      'zhangchao26',
      'yuchangshuang',
      'wb_yangkaiming',
      'wb_guominqi',
      'pengtinghui',
      'hexiang09',
      'zhouyiheng02',
    ],
    meta: {},
    name: 'template-seagullweb-v5',
    type: '',
    framework: 'React',
    description: '海鸥运营后台',
    git: 'ssh://git@git.sankuai.com/sjst/fe.steamer.template.git',
    prefix: 'packages/template-seagullweb',
    current_file_key: '',
    current_version: '',
    document: '',
    created_at: '2021-09-01T05:56:39.000Z',
    updated_at: '2025-03-17T06:49:26.000Z',
    deleted_at: null,
  },
  middlewares: [
    {
      type: 'SSO',
      params: {
        clientId: 'fe.bdop',
        secret: '678ce49cab89d989f7f68b4bf2c25824',
      },
      confirmed: true,
      middlewareId: 'SSO',
    },
    {
      type: 'MOCK_SSO_USER',
      params: {
        enableExternalMock: true,
        externalConfig: {
          appkey: 'com.sankuai.zc.fe.scmadmin',
          userName: 'scm_admin',
          password: 'O3Q0927SL3',
          key: 'mockUserList',
        },
      },
      confirmed: true,
      middlewareId: 'MOCK_SSO_USER',
    },
    {
      type: 'UPM',
      params: {
        appkey: 'com.sankuai.sjst.erp.www',
        secret: '99569548342abf96768003634f08d027',
        upmHost: 'http://api.upm-in.sankuai.com',
        steamerConfig: {
          manageUrlList: ['/steamer(.*)', '/ticketv2(.*)'],
          preFetchPermUrl: true,
          preFetchPermInfo: true,
          preFetchRoleInfo: true,
        },
      },
      confirmed: true,
      middlewareId: 'UPM',
    },
    {
      type: 'LX',
      params: {
        category: 'eco',
        appnm: 'feseagullweb',
      },
      confirmed: true,
      middlewareId: 'LX',
    },
    {
      type: 'OWL',
      params: {
        project: 'com.sankuai.sjst.m.feseagullweb',
        autoCatch: {},
        resource: {
          sampleApi: 1,
        },
        error: {
          sample: 1,
          formatUnhandledRejection: true,
        },
        page: {
          sample: 1,
        },
        owlDimensionList: [
          {
            key: 'unionId',
            getter: 'userInfo.login',
          },
        ],
      },
      confirmed: true,
      middlewareId: 'OWL',
      id: 'OWL',
    },
    {
      type: 'UAC',
      params: {
        appkey: 'a940f1be3e',
        secret: '8829ad484d2748cc86abf3d0fc75e32f',
        steamerConfig: {
          needMenus: false,
          manageUrlList: ['/steamer/agent-order-manager/(.*)'],
          needAuthUrl: true,
          preFetchPermUrl: true,
          preFetchPermInfo: true,
          preFetchRoleInfo: true,
        },
      },
      confirmed: true,
      middlewareId: 'UAC',
    },
    {
      type: 'PHOENIX',
      params: {},
      middlewareId: 'PHOENIX',
      id: 'PHOENIX',
      confirmed: true,
    },
  ],
  services: [
    {
      id: 307,
      version: '0.0.14',
      name: 'service-request-global',
      inline: false,
      confirmed: true,
      serviceId: 307,
      linkType: 'VERSION',
    },
    {
      id: 623,
      version: '0.0.67',
      name: 'service-saas-ui-pc',
      inline: false,
      confirmed: true,
      serviceId: 623,
      linkType: 'VERSION',
    },
    {
      id: 548,
      version: '0.0.21',
      name: 'service-saasui-table-form',
      inline: false,
      confirmed: true,
      serviceId: 548,
      linkType: 'VERSION',
    },
    {
      name: 'service-common-utils',
      linkType: 'VERSION',
      version: '0.0.5',
      serviceId: 2904,
      id: 2904,
      confirmed: true,
    },
    {
      name: 'service-rule-configuration-new',
      linkType: 'VERSION',
      version: '0.0.1',
      serviceId: 3343,
      id: 3343,
      confirmed: true,
    },
    {
      name: 'service-config-runtime-web',
      linkType: 'VERSION',
      version: '0.0.6',
      serviceId: 3369,
      id: 3369,
      confirmed: true,
    },
    {
      name: 'service-sensitive-info',
      linkType: 'VERSION',
      version: '0.0.3',
      serviceId: 333,
      id: 333,
      confirmed: true,
    },
    {
      name: 'service-agent-profit-management',
      linkType: 'VERSION',
      version: '0.0.11',
      serviceId: 3345,
      id: 3345,
      confirmed: true,
    },
  ],
};

const LatestGrayVersion = {
  template_config: {
    title: 'template-seagullweb-v5',
    linkType: 'VERSION',
    version: '0.0.31',
    config: {
      link: {
        'com.sankuai.sjst.erp.www_756b3150233fc2655fd6fe01e9e8cc00': 'history',
        'com.sankuai.sjst.erp.www_2a340540b3849b989593d1f0566e198a': 'history',
        'com.sankuai.sjst.erp.www_201f3d3fc2f1cbb1f1f4e2d0aa81c4ad': 'history',
        'com.sankuai.sjst.erp.www_4a52d8dab8cf936a7741035e99b9b261': 'history',
        'com.sankuai.sjst.erp.www_254902054b2bfdddc85f23b7d0f2b540': 'history',
        'com.sankuai.sjst.erp.www_08c98cf119b9f12920d507ab964a84a3': 'history',
        'com.sankuai.sjst.erp.www_821813a1d86bcfb6385eaa7649a55f2c': 'history',
        'com.sankuai.sjst.erp.www_2aafc468631acc3fe1e25bf78ae3c6a4': 'history',
        'com.sankuai.sjst.erp.www_f2b3ba72a18a7f50922017885c102c9d': 'history',
        'com.sankuai.sjst.erp.www_4c677ac1789e663301676103484980a3': 'history',
        'com.sankuai.sjst.erp.www_f57ffae6b33a47209e77590307aa1ac3': 'history',
        'com.sankuai.sjst.erp.www_a038e2d034d21eaca3afd4990dfc7efc': 'history',
        'com.sankuai.sjst.erp.www_6889ab823c658ca52ea4009247e9b2b5': 'history',
        'com.sankuai.sjst.erp.www_c8dc4b14adf1b686c0369075543be520': 'history',
        'com.sankuai.sjst.erp.www_b62fb44cec2e6e0b58a7fe006c463ae7': 'history',
        'com.sankuai.sjst.erp.www_a408901b7d65c6f036c77ec09ea47d6d': 'history',
        'com.sankuai.sjst.erp.www_76ac7e59bf2e1df947a8a4a5d5c3c4f4': 'history',
        'com.sankuai.sjst.erp.www_770bd9c1c8660a1ae9247e8130f48c13': 'history',
        'com.sankuai.sjst.erp.www_d05eef1dcea4e6d7d2365e6def237f62': 'history',
        'com.sankuai.sjst.erp.www_34894fbd38b006eb37a8753012447763': 'history',
        'com.sankuai.sjst.erp.www_5e5779c01c0991c76cfe15b571fc468a': 'history',
        'com.sankuai.sjst.erp.www_fbe70933e76bc23aec265caba95a5f21': 'history',
        'com.sankuai.sjst.erp.www_b6173cde5487cfff0bbaf65812788a4a': 'history',
        'com.sankuai.sjst.erp.www_35b8f8b70293496234fa9e8ef2c56f64': 'history',
        region_management_1705042509000: 'history',
        Agent_Account_Approve_Menu: 'history',
        'com.sankuai.sjst.erp.www_portrait_rule_1704789130': 'history',
        'com.sankuai.sjst.erp.www_5338c73a7d479ffe0a43309358ae4728': 'history',
        'com.sankuai.sjst.erp.www_435de3999d4ecf5822104a9f43a6100b': 'history',
        'com.sankuai.sjst.erp.www_c0c04de5a20a280e03bdfe13da7e9232': 'history',
        'com.sankuai.sjst.erp.www_0a4cf5538f8cfea1c00cf9754442d48c': 'history',
        'com.sankuai.sjst.erp.www_cacc359d213d5654a2a9aea27bc7dce6': 'history',
        'com.sankuai.sjst.erp.www_3e4cf034f7e4ee9e1b10bfdc0c66b09a': 'history',
        ACTIVIATION_CODE: 'history',
        'com.sankuai.sjst.erp.www_a0900210e825aa8c091f26195e0a81b8': 'history',
        'com.sankuai.sjst.erp.www_bcbaa0617436ae6bd519e2a8b7b3786d': 'history',
        AGENT_PURCHASE_LIST_INTELLIGENT: 'history',
        'com.sankuai.sjst.erp.www_5713d31fb4e1b024c382e1593ce4a7b4': 'history',
        'com.sankuai.sjst.erp.www_16d71bd63af468aa89004bcd81848b31': 'history',
        'com.sankuai.sjst.erp.www_e9ef2b4216bf3bdca3ff73522908c0d6': 'history',
        'com.sankuai.sjst.erp.www_6b5fbabc95245c1b531c7724ea49a8ae': 'history',
        'com.sankuai.sjst.erp.www_f08eae5b17ce7769b0bde385e61284d2': 'history',
        'com.sankuai.sjst.erp.www_93e1dc15a6d5b32cf3bbc8865e5daa79': 'history',
        'com.sankuai.sjst.erp.www_92a3f51b8834abfe4d5b8349bdcaa307': 'history',
        'com.sankuai.sjst.erp.www_2853550ba7c5c99a19e882339a2d6fca': 'history',
        Brandpool_Manager: 'history',
        SEAGULLWEB_BRANDAPPLY_MENU: 'history',
        'com.sankuai.sjst.erp.www_d3dc71ff3b44099fa55cbde080dae5a0': 'history',
        'com.sankuai.sjst.erp.www_59a8dfc26dc8a10f544e6829b8374ba1': 'history',
        'com.sankuai.sjst.erp.www_84b25d37f38965a6d713432a6732010b': 'history',
        'com.sankuai.sjst.erp.www_de95601337dbfe4c79b7dc0e4208658d': 'history',
        'Poi-PrivatSea': 'history',
        'com.sankuai.sjst.erp.www_78b06b19d4132f0ec6fccb4d19d3de46': 'history',
        'com.sankuai.sjst.erp.www_e966aff7c5fa58572e7abf32b0831159': 'history',
        'com.sankuai.sjst.erp.www_7d7e5b1c2dec207d41d182cfb0f36d83': 'history',
        'com.sankuai.sjst.erp.www_eada3705957625e370dbedc97235a8f6': 'history',
        IMPLEMENTATION_CELLULAR_MENU: 'history',
        PPVVC_LIST: 'history',
        'com.sankuai.sjst.erp.www_9a49cee83abfc131c3df6eb07350e8f3': 'history',
        'com.sankuai.sjst.erp.www_b906c4cff3dd96f4553e090257152ece': 'history',
        CLIENTSOURCE_PROJECTAPPLY_MENU: 'history',
        IMPLEMENTATION_PROJECT_MENU: 'history',
        CUSTOMER_TICKET_TASK_LIST: 'history',
        AGENT_BUSINESS_APPROVE: 'history',
        CUSTOMER_MANAGER_UNIT_MANAGE: 'history',
        CUSTOMER_MANAGER_POILIST: 'history',
        CUSTOMER_MANAGE_BRAND_LIST: 'history',
        CUSTOMER_MANAGER_HQ_LISTPAGE: 'history',
        POI_LIST: 'history',
        WORKORDER_TIME_QUERYLIST: 'history',
        WORKORDER_AFTERSALE_TICKET_MENU: 'history',
        GOODS_CENTER: 'history',
        STRARTEGY_CENTER: 'history',
        GOODS_CENTER_FRONTCATEGORY: 'history',
        GOODS_CENTER_BACKCATEGORY: 'history',
        GOODS_CENTER_INCIDENCE_RELATION: 'history',
        GOODS_CENTER_FATTRIBUTE: 'history',
        GOODS_CENTER_BACK_CATEGORY_ATTRIBUTE: 'history',
        GOODS_CENTER_ATTRIBUTE_TEMPLATES: 'history',
        GOODS_CENTER_TEMPLATE_CATEGORY: 'history',
        GOODS_CENTER_SAASGOODS: 'history',
        GOODS_CENTER_SALEGOODS: 'history',
        GOODS_CENTER_MATERIEL_LIST: 'history',
        APPROVAL_LIST: 'history',
        SEAGULL_ORDER: 'history',
        CODE_COMMON: 'history',
        CODE_ACTIVE_APPLY: 'history',
        CODE_ACTIVE_APPROVE: 'history',
        CODE_ACTIVE_QUERYALL_ENTRY: 'history',
        CODE_ACTIVE_DELETE: 'history',
        CUSTOMER_TICKET_TASK_MENU: 'history',
        AGENT_TRANSFER_RECORDS: 'history',
        AGENT_TRADE_DETAIL_NEW: 'history',
        GOODS_PURCHASE_NOTE_NEW: 'history',
        AGENT_PURCHASE_LIST_PROFESSION_NEW: 'history',
        PRICE_STRATEGY: 'history',
        PRICE_APPROVAL: 'history',
        SPACE_AUTH_MANAGER_MENU: 'history',
        SEAGULL_IMPLEMENT: 'history',
        XUFEI_UPGRADE: 'history',
        SEAGULL_TASK_WXAUTHTOOL: 'history',
        AGENT_IMPORT_RESULT_STEAMER: 'history',
        AGENT_MANAGE_EMPLOYEE_MENU_STEAMER: 'history',
        SEAGULL_TRANSFER_LIST: 'history',
        DATA_AUTH_MANAGER_MENU: 'history',
        WORKORDER_NEWPOI_INSTALLTICKET_MENU: 'history',
        BASIC_MANAGE_AFTERSALE_QUESTION: 'history',
        CRM_RESOURCE_ROTATION_LIST: 'history',
        CRM_SALES_CHAIN_HQACCOUNT_LIST: 'history',
        GOODS_CENTER_SALEGOODS_INTELLIGENT: 'history',
        GOODS_CENTER_SAASGOODS_INTELLIGENT: 'history',
        GOODS_CENTER_PRODUCT: 'history',
        STRATEGY_CENTER_SERVICE_RULE: 'history',
        STRATEGY_CENTER_GOODS_RULE: 'history',
        CUSTOMER_RISK_MANAGEMENT: 'history',
        'com.sankuai.sjst.erp.www_edcac7b9bf0efa07780be4fb79b179a1': 'history',
        CUSTOMER_ASSET_MANAGEMENT: 'history',
        AGENT_BILL_LIST: 'history',
        AGENT_CHANNEL_LIST: 'history',
        CRM_DASHBOARD_CONFIG_PAGE: 'history',
        SEAGULL_WAREHOUSE_MAINTENANCE: 'history',
        AGENT_EXECUTION_SETTLEMENT_QUERY_BILL: 'history',
        AGENT_EXECUTION_PAYMENT_QUERY_BILL: 'history',
        AGENT_EXECUTION_SETTLEMENT_QUERY_DEATILLIST: 'history',
        MESSAGE_CENTER_PUBLISH: 'history',
        MESSAGE_CENTER: 'history',
        MSGTYPE_USERGROUP: 'history',
        SEAGULL_OPPORTUNITY: 'history',
        SCM_CSPU_GOODS_MANAGER: 'history',
        SCM_HARDWARE_LIST: 'history',
        AGENT_ADMIN: 'history',
        MARKET_ORDER: 'history',
        CRM_ALL_POI: 'history',
        CRM_PRIVATE_POI: 'history',
        CRM_POI_VISIT: 'history',
        CALL_INVITATION: 'history',
        AGENT_AGENTZF: 'history',
        'com.sankuai.sjst.erp.www_cd141d8c90bbaf2e882835c53569cd98': 'history',
        AGENT_SELL_ORGMANAGE: 'history',
        AGENT_EXECUTION_PAGELIST: 'history',
        SEAGULL_BATCHOPERATION: 'history',
        'com.sankuai.sjst.erp.www_b9a9aab4b44f618345255656e6d4c69b': 'history',
        'com.sankuai.sjst.erp.www_c4d6e355f80b308ba033fe51ddfb41d4': 'history',
        'com.sankuai.sjst.erp.www_260f796b6b6c06f988d31f320f4aec88': 'history',
        'com.sankuai.sjst.erp.www_898430efc84c8b44e6a09ef505b14c75': 'history',
        RENEWAL_UPGRADE_TIME_STRATEGY: 'history',
        'com.sankuai.sjst.erp.www_a426ae930c344bd1b3435d9eabfdb60e': 'history',
        'com.sankuai.sjst.erp.www_36fd0e947dac185a98906ffdc271fd8d': 'history',
        Automatic_Renewal_Price_Strategy: 'history',
        Operations_Workbench: 'history',
        'com.sankuai.sjst.erp.www_bd3f63d244dd761676396e302fa5f351': 'history',
        'com.sankuai.sjst.erp.www_ba7918fd183c54ee4d0bbb708e7c9550': 'history',
        'com.sankuai.sjst.erp.www_5f8e5e066a3c2d3a728741132a4de03f': 'history',
        'com.sankuai.sjst.erp.www_980a89c2ae8df4d9c5dd1b33cd0b5d06': 'history',
        'com.sankuai.sjst.erp.www_b11da820ba814ceebb51099792f03aba': 'history',
        'com.sankuai.sjst.erp.www_9ca471813af00751a3c548cce5252611': 'history',
        'com.sankuai.sjst.erp.www_cc3cd488f6c5915b3efb3bf1734e14ea': 'history',
        'com.sankuai.sjst.erp.www_aac55c7f477d1aa17f8d85a46b10f974': 'history',
        'com.sankuai.sjst.erp.www_45747f0bf1b88d58318b2f278b0848d3': 'history',
        'com.sankuai.sjst.erp.www_75053f3dcc40290a3324df0bbd9f16e0': 'history',
        'com.sankuai.sjst.erp.www_3984e65e72e42af4f9207dedd1f4f4c2': 'history',
        'com.sankuai.sjst.erp.www_e9202977edaff792cf9a52cbb2987978': 'history',
        'com.sankuai.sjst.erp.www_4ebd76c858b1b819426e2d05ce1624f4': 'history',
        'com.sankuai.sjst.erp.www_0414d7efa6418699839f7f00f1e8c6c1': 'history',
        'com.sankuai.sjst.erp.www_90d425face480b6fb5cf07b99e470cdc': 'history',
        'com.sankuai.sjst.erp.www_6c95389aba568741bb8bee2adf193f19': 'history',
        'com.sankuai.sjst.erp.www_1ffd44c37f07e5d3d66356e3faf3b4d2': 'history',
        'com.sankuai.sjst.erp.www_ba63e5a0879fe459305d9a2188ffc189': 'history',
        'com.sankuai.sjst.erp.www_65e344e49749fdf4b82b7fe68a999c84': 'history',
        'com.sankuai.sjst.erp.www_1ebe7505cd4c3785093caba8508383aa': 'history',
        'com.sankuai.sjst.erp.www_cae04f81bea651cf09da51dba8c5cb07': 'history',
        'com.sankuai.sjst.erp.www_d5b5706c164747a6e278b317f2778099': 'history',
        'com.sankuai.sjst.erp.www_488025cf801c8eb7a438efd206472396': 'history',
        'com.sankuai.sjst.erp.www_4a4f68cbb31cc365f7d341e3b4694035': 'history',
        'com.sankuai.sjst.erp.www_db24cd30cef55b748c1c0cd6234eebc2': 'history',
        'com.sankuai.sjst.erp.www_3a112ee9dba5f92fb88e9c36ab7e2f87': 'history',
        'com.sankuai.sjst.erp.www_0d1f32f687b3da12fa59e3f5a8982cf5': 'history',
        'com.sankuai.sjst.erp.www_7141a323f8df13aa28cbd562eec1e2e1': 'history',
        'com.sankuai.sjst.erp.www_4a35dd29293855394e3c706ec9524408': 'history',
        'com.sankuai.sjst.erp.www_53c84195539130e6ed2cabcce31d0604': 'history',
        'com.sankuai.sjst.erp.www_8fd5bb6b09c621d9773d0a771ce13d8b': 'history',
        'com.sankuai.sjst.erp.www_338608eef242606112eccc76c2072a7e': 'history',
        'com.sankuai.sjst.erp.www_4b876dfe490c8ce67ebfb3bdcf38407c': 'history',
        'com.sankuai.sjst.erp.www_b3c33b429e62b30c60b03237b35fde4f': 'history',
        'com.sankuai.sjst.erp.www_c61e837756e0218560d08b0acc91d1b9': 'history',
        'com.sankuai.sjst.erp.www_224f97acbf5357fd34c841354327402d': 'history',
        'com.sankuai.sjst.erp.www_71776c0bf9f2c000113fef03148d5926': 'history',
        'com.sankuai.sjst.erp.www_e4583dd270f0244c2b47d0d24d699f8d': 'history',
      },
      menu: {
        'com.sankuai.sjst.erp.www_eada3705957625e370dbedc97235a8f6': {
          badge: [
            {
              url: '/apiwg/bdopappthriftservice/getcontactpositions',
              callBack: '(res) => {return res.contactPositionTOs[0].code}',
            },
          ],
        },
      },
    },
    templateId: 27,
    id: 27,
    confirmed: true,
    screenshots: [],
    maintainers: [
      'gongyanyu',
      'zhangchao26',
      'yuchangshuang',
      'wb_yangkaiming',
      'wb_guominqi',
      'pengtinghui',
      'hexiang09',
      'zhouyiheng02',
    ],
    meta: {},
    name: 'template-seagullweb-v5',
    type: '',
    framework: 'React',
    description: '海鸥运营后台',
    git: 'ssh://git@git.sankuai.com/sjst/fe.steamer.template.git',
    prefix: 'packages/template-seagullweb',
    current_file_key: '',
    current_version: '',
    document: '',
    created_at: '2021-09-01T05:56:39.000Z',
    updated_at: '2025-03-17T06:49:26.000Z',
    deleted_at: null,
  },

  middlewares: [
    {
      type: 'SSO',
      params: {
        clientId: 'fe.bdop',
        secret: '678ce49cab89d989f7f68b4bf2c25824',
      },
      confirmed: true,
      middlewareId: 'SSO',
    },
    {
      type: 'MOCK_SSO_USER',
      params: {
        enableExternalMock: true,
        externalConfig: {
          appkey: 'com.sankuai.zc.fe.scmadmin',
          userName: 'scm_admin',
          password: 'O3Q0927SL3',
          key: 'mockUserList',
        },
      },
      confirmed: true,
      middlewareId: 'MOCK_SSO_USER',
    },
    {
      type: 'UPM',
      params: {
        appkey: 'com.sankuai.sjst.erp.www',
        secret: '99569548342abf96768003634f08d027',
        upmHost: 'http://api.upm-in.sankuai.com',
        steamerConfig: {
          manageUrlList: ['/steamer(.*)', '/ticketv2(.*)'],
          preFetchPermUrl: true,
          preFetchPermInfo: true,
          preFetchRoleInfo: true,
        },
      },
      confirmed: true,
      middlewareId: 'UPM',
    },
    {
      type: 'LX',
      params: {
        category: 'eco',
        appnm: 'feseagullweb',
      },
      confirmed: true,
      middlewareId: 'LX',
    },
    {
      type: 'OWL',
      params: {
        project: 'com.sankuai.sjst.m.feseagullweb',
        autoCatch: {
          pv: true,
        },
        resource: {
          sampleApi: 1,
        },
        error: {
          sample: 1,
          formatUnhandledRejection: true,
        },
        page: {
          sample: 1,
        },
        owlDimensionList: [
          {
            key: 'unionId',
            getter: 'userInfo.login',
          },
        ],
      },
      confirmed: true,
      middlewareId: 'OWL',
      id: 'OWL',
    },
    {
      type: 'UAC',
      params: {
        appkey: 'a940f1be3e',
        secret: '8829ad484d2748cc86abf3d0fc75e32f',
        steamerConfig: {
          needMenus: false,
          manageUrlList: ['/steamer/agent-order-manager/(.*)'],
          needAuthUrl: true,
          preFetchPermUrl: true,
          preFetchPermInfo: true,
          preFetchRoleInfo: true,
        },
      },
      confirmed: true,
      middlewareId: 'UAC',
    },
    {
      type: 'PHOENIX',
      params: {},
      middlewareId: 'PHOENIX',
      id: 'PHOENIX',
      confirmed: true,
    },
  ],
  services: [
    {
      id: 307,
      version: '0.0.14',
      name: 'service-request-global',
      inline: false,
      confirmed: true,
      serviceId: 307,
      linkType: 'VERSION',
    },
    {
      id: 623,
      version: '0.0.67',
      name: 'service-saas-ui-pc',
      inline: false,
      confirmed: true,
      serviceId: 623,
      linkType: 'VERSION',
    },
    {
      id: 548,
      version: '0.0.21',
      name: 'service-saasui-table-form',
      inline: false,
      confirmed: true,
      serviceId: 548,
      linkType: 'VERSION',
    },
    {
      name: 'service-common-utils',
      linkType: 'VERSION',
      version: '0.0.5',
      serviceId: 2904,
      id: 2904,
      confirmed: true,
    },
    {
      name: 'service-rule-configuration-new',
      linkType: 'VERSION',
      version: '0.0.1',
      serviceId: 3343,
      id: 3343,
      confirmed: true,
    },
    {
      name: 'service-config-runtime-web',
      linkType: 'VERSION',
      version: '0.0.6',
      serviceId: 3369,
      id: 3369,
      confirmed: true,
    },
    {
      name: 'service-sensitive-info',
      linkType: 'VERSION',
      version: '0.0.3',
      serviceId: 333,
      id: 333,
      confirmed: true,
    },
    {
      name: 'service-agent-profit-management',
      linkType: 'VERSION',
      version: '0.0.11',
      serviceId: 3345,
      id: 3345,
      confirmed: true,
    },
  ],
};
/**
 * JSON差异比较测试脚本
 * 比较两个API响应的JSON数据，并生成可视化HTML报告
 */
async function testJsonDiff() {
  console.log('开始测试JSON差异比较功能...');

  // 模拟两个不同版本的API响应数据
  const oldApiResponse = LatestVersion;

  const newApiResponse = LatestGrayVersion;

  try {
    // 使用JSDiffTool比较两个JSON对象
    const diffResultId = JSDiffTool.diffJson(
      oldApiResponse,
      newApiResponse,
      '服务模块数据差异比较'
    );

    // 获取差异结果
    const diffResult = JSDiffTool.getResult(diffResultId);

    if (!diffResult) {
      console.error('获取差异比较结果失败');
      return;
    }

    console.log(
      `差异统计: 新增 +${diffResult.stats.additions}, 删除 -${diffResult.stats.deletions}, 总变更 ${diffResult.stats.total}`
    );

    // 生成HTML报告
    const htmlReport = generateHtmlReport(diffResult);

    // 保存HTML报告到文件
    const reportPath = path.join(
      __dirname,
      'test-results',
      'json-diff-report.html'
    );

    // 确保目录存在
    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(reportPath, htmlReport);

    console.log(`JSON差异比较报告已生成: ${reportPath}`);
  } catch (error) {
    console.error('执行JSON差异比较时出错:', error);
  }
}

/**
 * 生成包含内联CSS和JS的HTML报告
 * @param diffResult 差异比较结果
 * @returns HTML字符串
 */
function generateHtmlReport(diffResult) {
  // 内联CSS样式
  const styles = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      margin-bottom: 30px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .stats {
      display: flex;
      gap: 20px;
      margin: 20px 0;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 5px;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
    }
    .stat-label {
      font-size: 14px;
      color: #666;
    }
    .additions { color: #28a745; }
    .deletions { color: #dc3545; }
    .total { color: #0366d6; }

    .tabs {
      display: flex;
      border-bottom: 1px solid #ddd;
      margin-bottom: 20px;
    }
    .tab {
      padding: 10px 20px;
      cursor: pointer;
      border: 1px solid transparent;
      border-bottom: none;
      margin-bottom: -1px;
    }
    .tab.active {
      border-color: #ddd;
      border-radius: 5px 5px 0 0;
      background-color: white;
      border-bottom: 1px solid white;
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }

    /* 分割视图样式 */
    .split-view {
      display: flex;
      border: 1px solid #ddd;
      border-radius: 5px;
      overflow: hidden;
    }
    .split-header {
      background-color: #f1f1f1;
      border-bottom: 1px solid #ddd;
    }
    .split-header-row {
      display: flex;
    }
    .split-header-cell {
      flex: 1;
      padding: 8px 15px;
      font-weight: 600;
      border-right: 1px solid #ddd;
    }
    .split-header-cell:last-child {
      border-right: none;
    }
    .split-content {
      max-height: 800px;
      overflow-y: auto;
    }
    .split-row {
      display: flex;
    }
    .split-cell {
      flex: 1;
      padding: 5px 15px;
      font-family: monospace;
      white-space: pre-wrap;
      border-right: 1px solid #ddd;
      position: relative;
    }
    .split-cell:last-child {
      border-right: none;
    }
    .line-number {
      color: #999;
      text-align: right;
      padding-right: 10px;
      user-select: none;
      border-right: 1px solid #ddd;
      margin-right: 10px;
      min-width: 40px;
      display: inline-block;
    }
    .removed { background-color: #ffeef0; }
    .removed .content { color: #b31d28; }
    .added { background-color: #e6ffed; }
    .added .content { color: #22863a; }
    .empty { background-color: #f6f8fa; }

    /* 统一视图样式 */
    .unified-view {
      border: 1px solid #ddd;
      border-radius: 5px;
      overflow: hidden;
      font-family: monospace;
    }
    .unified-line {
      padding: 2px 15px;
      white-space: pre-wrap;
      display: flex;
    }
    .unified-line.added { background-color: #e6ffed; }
    .unified-line.removed { background-color: #ffeef0; }
    .unified-line.context { background-color: #f6f8fa; }
    .line-numbers {
      color: #999;
      text-align: right;
      padding-right: 10px;
      user-select: none;
      border-right: 1px solid #ddd;
      margin-right: 10px;
      min-width: 80px;
      display: inline-block;
    }
    .line-content {
      flex: 1;
    }
    .line-content.added { color: #22863a; }
    .line-content.removed { color: #b31d28; }

    /* 高亮样式 */
    .highlight-added {
      background-color: #acf2bd;
      color: #1a7f37;
      font-weight: 500;
    }
    .highlight-removed {
      background-color: #ffd7d5;
      color: #cf222e;
      font-weight: 500;
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
      .split-view {
        flex-direction: column;
      }
      .split-header-row, .split-row {
        flex-direction: column;
      }
      .split-cell, .split-header-cell {
        border-right: none;
        border-bottom: 1px solid #ddd;
      }
      .split-cell:last-child, .split-header-cell:last-child {
        border-bottom: none;
      }
    }
  `;

  // 内联JavaScript
  const scripts = `
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

    // 初始化时显示分割视图
    document.addEventListener('DOMContentLoaded', function() {
      switchTab('split-view-tab');
    });
  `;

  // 生成分割视图HTML
  let splitViewHtml = '';
  if (diffResult.splitView) {
    splitViewHtml = `
      <div class="split-view">
        <div class="split-header">
          <div class="split-header-row">
            <div class="split-header-cell">
              <span style="color: #b31d28;">➖</span> 原始内容
            </div>
            <div class="split-header-cell">
              <span style="color: #22863a;">➕</span> 新内容
            </div>
          </div>
        </div>
        <div class="split-content">
    `;

    // 遍历行
    const leftLines = diffResult.splitView.leftLines;
    const rightLines = diffResult.splitView.rightLines;

    for (let i = 0; i < leftLines.length; i++) {
      const leftLine = leftLines[i];
      const rightLine = rightLines[i];

      splitViewHtml += `<div class="split-row">`;

      // 左侧单元格
      splitViewHtml += `<div class="split-cell ${leftLine.type}">`;
      if (leftLine.lineNumber) {
        splitViewHtml += `<span class="line-number">${leftLine.lineNumber}</span>`;
      } else {
        splitViewHtml += `<span class="line-number"></span>`;
      }

      // 处理高亮范围
      if (leftLine.highlightRanges && leftLine.highlightRanges.length > 0) {
        let content = leftLine.content;
        let result = '';
        let lastIndex = 0;

        leftLine.highlightRanges.forEach(range => {
          // 添加高亮前的普通文本
          if (lastIndex < range.start) {
            result += escapeHtml(content.substring(lastIndex, range.start));
          }

          // 添加高亮文本
          const highlightClass =
            leftLine.type === 'removed' ? 'highlight-removed' : '';
          result += `<span class="${highlightClass}">${escapeHtml(content.substring(range.start, range.end))}</span>`;

          lastIndex = range.end;
        });

        // 添加剩余的普通文本
        if (lastIndex < content.length) {
          result += escapeHtml(content.substring(lastIndex));
        }

        splitViewHtml += `<span class="content">${result}</span>`;
      } else {
        splitViewHtml += `<span class="content">${escapeHtml(leftLine.content)}</span>`;
      }

      splitViewHtml += `</div>`;

      // 右侧单元格
      splitViewHtml += `<div class="split-cell ${rightLine.type}">`;
      if (rightLine.lineNumber) {
        splitViewHtml += `<span class="line-number">${rightLine.lineNumber}</span>`;
      } else {
        splitViewHtml += `<span class="line-number"></span>`;
      }

      // 处理高亮范围
      if (rightLine.highlightRanges && rightLine.highlightRanges.length > 0) {
        let content = rightLine.content;
        let result = '';
        let lastIndex = 0;

        rightLine.highlightRanges.forEach(range => {
          // 添加高亮前的普通文本
          if (lastIndex < range.start) {
            result += escapeHtml(content.substring(lastIndex, range.start));
          }

          // 添加高亮文本
          const highlightClass =
            rightLine.type === 'added' ? 'highlight-added' : '';
          result += `<span class="${highlightClass}">${escapeHtml(content.substring(range.start, range.end))}</span>`;

          lastIndex = range.end;
        });

        // 添加剩余的普通文本
        if (lastIndex < content.length) {
          result += escapeHtml(content.substring(lastIndex));
        }

        splitViewHtml += `<span class="content">${result}</span>`;
      } else {
        splitViewHtml += `<span class="content">${escapeHtml(rightLine.content)}</span>`;
      }

      splitViewHtml += `</div>`;
      splitViewHtml += `</div>`;
    }

    splitViewHtml += `
        </div>
      </div>
    `;
  }

  // 生成统一视图HTML
  let unifiedViewHtml = '';
  if (diffResult.unifiedView) {
    unifiedViewHtml = `
      <div class="unified-view">
    `;

    diffResult.unifiedView.forEach(line => {
      unifiedViewHtml += `<div class="unified-line ${line.type}">`;

      // 行号
      unifiedViewHtml += `<span class="line-numbers">`;
      if (line.lineNumber.old !== null) {
        unifiedViewHtml += line.lineNumber.old;
      } else {
        unifiedViewHtml += ' ';
      }
      unifiedViewHtml += ' : ';
      if (line.lineNumber.new !== null) {
        unifiedViewHtml += line.lineNumber.new;
      } else {
        unifiedViewHtml += ' ';
      }
      unifiedViewHtml += `</span>`;

      // 内容
      unifiedViewHtml += `<span class="line-content ${line.type}">${escapeHtml(line.content)}</span>`;

      unifiedViewHtml += `</div>`;
    });

    unifiedViewHtml += `
      </div>
    `;
  }

  // 生成原始JSON和新JSON的格式化显示
  const oldJsonHtml = `<pre>${escapeHtml(JSON.stringify(JSON.parse(diffResult.oldContent), null, 2))}</pre>`;
  const newJsonHtml = `<pre>${escapeHtml(JSON.stringify(JSON.parse(diffResult.newContent), null, 2))}</pre>`;

  // 组装完整的HTML报告
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>JSON差异比较报告 - ${diffResult.title}</title>
      <style>${styles}</style>
    </head>
    <body>
      <header>
        <h1>${diffResult.title}</h1>
        <p>生成时间: ${new Date(diffResult.timestamp).toLocaleString()}</p>
      </header>

      <div class="stats">
        <div class="stat-item">
          <div class="stat-value additions">+${diffResult.stats.additions}</div>
          <div class="stat-label">新增</div>
        </div>
        <div class="stat-item">
          <div class="stat-value deletions">-${diffResult.stats.deletions}</div>
          <div class="stat-label">删除</div>
        </div>
        <div class="stat-item">
          <div class="stat-value total">${diffResult.stats.total}</div>
          <div class="stat-label">总变更</div>
        </div>
      </div>

      <div class="tabs">
        <div class="tab active" data-tab="split-view-tab" onclick="switchTab('split-view-tab')">双栏视图</div>
        <div class="tab" data-tab="unified-view-tab" onclick="switchTab('unified-view-tab')">统一视图</div>
        <div class="tab" data-tab="old-json-tab" onclick="switchTab('old-json-tab')">原始JSON</div>
        <div class="tab" data-tab="new-json-tab" onclick="switchTab('new-json-tab')">新JSON</div>
      </div>

      <div id="split-view-tab" class="tab-content active">
        ${splitViewHtml}
      </div>

      <div id="unified-view-tab" class="tab-content">
        ${unifiedViewHtml}
      </div>

      <div id="old-json-tab" class="tab-content">
        <h3>原始JSON</h3>
        ${oldJsonHtml}
      </div>

      <div id="new-json-tab" class="tab-content">
        <h3>新JSON</h3>
        ${newJsonHtml}
      </div>

      <script>${scripts}</script>
    </body>
    </html>
  `;
}

/**
 * 转义HTML特殊字符
 * @param text 需要转义的文本
 * @returns 转义后的文本
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 执行测试
testJsonDiff().catch(console.error);
