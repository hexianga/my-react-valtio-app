// seagullConfig.ts
// 美团海鸥系统配置数据

export const seagullConfig = {
  "businessModules": [
    {
      "name": "orderlist",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-orderlist",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.120",
      "config": {}
    },
    {
      "name": "bd-order-confirm",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-bd-order-confirm",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.115",
      "config": {}
    },
    {
      "name": "refund-approve",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-refund-approve",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.26",
      "config": {}
    },
    {
      "name": "inventory-after-check",
      "type": "Route",
      "sandbox": true,
      "routePath": "/scm-inventory-after-check",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.86",
      "config": {}
    },
    {
      "name": "refund-manage",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-refund-manage",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.147",
      "config": {}
    },
    {
      "name": "after-sales-detail",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-after-sales-detail",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.47",
      "config": {}
    },
    {
      "name": "inventory",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-inventory",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.309",
      "config": {}
    },
    {
      "name": "batch-del",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-batch-del",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.37",
      "config": {}
    },
    {
      "name": "purchase",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-purchase",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.355",
      "config": {}
    },
    {
      "name": "qualificationslist",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-qualificationslist",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.70",
      "config": {}
    },
    {
      "name": "new-purchase",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-new-purchase",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.149",
      "config": {}
    },
    {
      "name": "refund-transfer",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-refund-transfer",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.16",
      "config": {}
    },
    {
      "name": "additional-purchase",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer/re-select-store",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.136",
      "config": {}
    },
    {
      "name": "replace-stores",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-replace-stores",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.39-alpha.3",
      "config": {}
    },
    {
      "name": "orderdetails",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-orderdetails",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.262",
      "config": {}
    },
    {
      "name": "newsale-purchase",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-purchase/newsale",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.150",
      "config": {}
    },
    {
      "name": "add-purchase-goods",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer/add-purchase-goods",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.126",
      "config": {}
    },
    {
      "name": "agent-order-list",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-agent-order-list",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.71",
      "config": {}
    },
    {
      "name": "scm-poi-edit",
      "type": "Route",
      "sandbox": true,
      "routePath": "/scm-poi-edit",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.30",
      "config": {}
    },
    {
      "name": "scm-head-select",
      "type": "Route",
      "sandbox": true,
      "routePath": "/scm-head-select",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.42",
      "config": {}
    },
    {
      "name": "scm-goods-select-noshop",
      "type": "Route",
      "sandbox": true,
      "routePath": "/scm-goods-select-noshop",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.26",
      "config": {}
    },
    {
      "name": "renewal-upgrade",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer/renewal-upgrade",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.81",
      "config": {}
    },
    {
      "name": "order-contract",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer/contract",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.97",
      "config": {}
    },
    {
      "name": "service-list",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-service-list",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.60",
      "config": {}
    },
    {
      "name": "service-bind-detail",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer/serviceBind/detail",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.25",
      "config": {}
    },
    {
      "name": "quotation-approval",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-quotation-approval",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.35",
      "config": {}
    },
    {
      "name": "poi-replace",
      "type": "Route",
      "sandbox": true,
      "routePath": "/scm-poi-replace",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.32",
      "config": {}
    },
    {
      "name": "scm-mockuser",
      "type": "Route",
      "sandbox": true,
      "routePath": "/scm-mockuser",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.1",
      "config": {}
    },
    {
      "name": "bank-pay",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-bank-pay",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.113",
      "config": {}
    },
    {
      "name": "pay-info",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-pay-info",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.12",
      "config": {}
    },
    {
      "name": "brand-order",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-brand-order",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.10",
      "config": {}
    },
    {
      "name": "auto-renew",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-auto-renew",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.18",
      "config": {}
    },
    {
      "name": "price-apply",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-price-apply",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.52",
      "config": {}
    },
    {
      "name": "batch-import-pois",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-batch-import-pois",
      "parentRoutePath": "/",
      "exactMatch": true,
      "associationType": "VERSION",
      "associationVersion": "0.0.33",
      "config": {}
    },
    {
      "name": "change-hands",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-change-hands",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.20",
      "config": {}
    },
    {
      "name": "pay-result",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-pay-result",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.62",
      "config": {}
    },
    {
      "name": "wallet",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-wallet",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.16",
      "config": {}
    },
    {
      "name": "price-reject",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-price-reject",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.24",
      "config": {}
    },
    {
      "name": "collection-info",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-collection-info",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.21",
      "config": {}
    },
    {
      "name": "price-apply-detail",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-price-apply-detail",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.51",
      "config": {}
    },
    {
      "name": "service-bind",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-service-bind",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.46",
      "config": {}
    },
    {
      "name": "performance-additional-purchase",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer/performance/additional/purchase",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.44",
      "config": {}
    },
    {
      "name": "performance-select-goods",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer/performance-select-goods",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.178",
      "config": {}
    },
    {
      "name": "new-honour-abnormal",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-new-honour-abnormal",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.36",
      "config": {}
    },
    {
      "name": "performance-new-purchase",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer/performance/new/purchase",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.66",
      "config": {}
    },
    {
      "name": "performance-select-goods-other-order",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer/performance-select-goods-other-order",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.43",
      "config": {}
    },
    {
      "name": "cross-order-fulfillment",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-cross-order-fulfillment",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.19",
      "config": {}
    },
    {
      "name": "bulk-renewal",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-bulk-renewal",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.80",
      "config": {}
    },
    {
      "name": "batch-performance",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-batch-performance",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.63",
      "config": {}
    },
    {
      "name": "fulfillment-bulk-import",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-fulfillment-bulk-import",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.18",
      "config": {}
    },
    {
      "name": "bulk-import-results",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-bulk-import-results",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.14",
      "config": {}
    },
    {
      "name": "price-list",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-price-list",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.29",
      "config": {}
    },
    {
      "name": "sign-info",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-sign-info",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.11",
      "config": {}
    },
    {
      "name": "coop-sign",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-coop-sign",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.28",
      "config": {}
    },
    {
      "name": "other-version-attachment",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-attachment",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.9",
      "config": {}
    },
    {
      "name": "other-version-order-confirm",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-order-confirm",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.31",
      "config": {}
    },
    {
      "name": "other-version-order-detail",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-order-detail",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.54",
      "config": {}
    },
    {
      "name": "other-version-pay-result",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-pay-result",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.16",
      "config": {}
    },
    {
      "name": "other-version-collection-info",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-collection-info",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.12",
      "config": {}
    },
    {
      "name": "other-version-refund-list",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-refund-list",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.12",
      "config": {}
    },
    {
      "name": "other-version-contract",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-contract",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.43",
      "config": {}
    },
    {
      "name": "other-version-qualifications-list",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-other-version-qualifications-list",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.17",
      "config": {}
    },
    {
      "name": "other-version-refund-detail",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-refund-detail",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.12",
      "config": {}
    },
    {
      "name": "other-version-goods-add",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-goods-add",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.24",
      "config": {}
    },
    {
      "name": "other-version-select-shop",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-select-shop",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.18",
      "config": {}
    },
    {
      "name": "other-version-goods-info",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-goods-info",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.45",
      "config": {}
    },
    {
      "name": "other-version-refund-schedule",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-refund-schedule",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.11",
      "config": {}
    },
    {
      "name": "other-version-refund-goods",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-refund-goods",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.14",
      "config": {}
    },
    {
      "name": "other-version-refund-apply",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-refund-apply",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.24",
      "config": {}
    },
    {
      "name": "other-version-choose-goods",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-choose-goods",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.18",
      "config": {}
    },
    {
      "name": "other-version-change-payee",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-change-payee",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.12",
      "config": {}
    },
    {
      "name": "goods-price-detail",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-goods-price-detail",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.14",
      "config": {}
    },
    {
      "name": "other-version-replace-stores",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-replace-stores",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.20",
      "config": {}
    },
    {
      "name": "other-version-price-apply",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-price-apply",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.16",
      "config": {}
    },
    {
      "name": "other-version-price-apply-detail",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-price-apply-detail",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.6",
      "config": {}
    },
    {
      "name": "other-version-price-reject",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-other-version-price-reject",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.5",
      "config": {}
    },
    {
      "name": "select-refund-goods",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-select-refund-goods",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.40",
      "config": {}
    },
    {
      "name": "refund-goods-list",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-refund-goods-list",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.24",
      "config": {}
    },
    {
      "name": "async-task-list",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-async-task-list",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.8",
      "config": {}
    },
    {
      "name": "performance-goods-other-batch",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-performance-goods-other-batch",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.5",
      "config": {}
    },
    {
      "name": "performance-select-poi",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-performance-select-poi",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.9",
      "config": {}
    },
    {
      "name": "cross-order-fulfillment-batch",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-cross-order-fulfillment-batch",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.5",
      "config": {}
    },
    {
      "name": "performance-select-goods-batch",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-performance-select-goods-batch",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.12",
      "config": {}
    },
    {
      "name": "batch-fulfillment-bind-stores",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-batch-fulfillment-bind-stores",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.15",
      "config": {}
    },
    {
      "name": "bd-renewal-manage",
      "type": "Route",
      "sandbox": true,
      "routePath": "/bd-renewal-manage",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.7",
      "config": {}
    },
    {
      "name": "agent-deposit",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-agent-deposit",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.4",
      "config": {}
    },
    {
      "name": "brand-snapshot",
      "type": "Route",
      "sandbox": true,
      "routePath": "/steamer-brand-snapshot",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.1",
      "config": {}
    },
    {
      "name": "other-versions-poilist",
      "type": "Route",
      "sandbox": false,
      "routePath": "/steamer-other-versions-poilist",
      "parentRoutePath": "/",
      "exactMatch": false,
      "associationType": "VERSION",
      "associationVersion": "0.0.1",
      "config": {}
    }
  ],
  "middlewares": [
    {
      "name": "灵犀",
      "params": {
        "category": "eco",
        "appnm": "seagull"
      }
    },
    {
      "name": "Mock（SSO）",
      "params": {
        "enableExternalMock": true,
        "externalConfig": {
          "appkey": "com.sankuai.zc.fe.scmadmin",
          "userName": "scm_admin",
          "password": "O3Q0927SL3",
          "key": "mockUserList"
        }
      }
    },
    {
      "name": "OWL",
      "params": {
        "project": "com.sankuai.feseagull.syorder.app",
        "owlVersion": "1.10.2",
        "autoCatch": {
          "ajax": false,
          "console": true
        },
        "resource": {
          "sampleApi": 1
        },
        "disableCache": true,
        "ajax": {
          "flag": true,
          "duration": 3000
        },
        "error": {
          "sample": 1,
          "formatUnhandledRejection": true
        },
        "noScriptError": false,
        "page": {
          "sample": 1,
          "disableSensoryImageIndex": true,
          "interactToStopObserver": true,
          "logFirstScreen": true,
          "fstPerfAnalysis": true,
          "fstPerfSample": 1,
          "logSlowView": true
        },
        "owlDimensionList": [
          {
            "key": "unionId",
            "getter": "userInfo.login"
          }
        ],
        "SPA": {
          "autoPV": true,
          "getFST": true
        }
      }
    },
    {
      "name": "不死鸟",
      "params": {}
    },
    {
      "name": "SSO",
      "params": {
        "clientId": "sjst.fe.seagull",
        "secret": "c180240512560b0adbd38b528d0ed975",
        "steamerConfig": {
          "outRedirectUrl": "https://seagull.sankuai.com"
        },
        "excludedUriList": "/steamer/confirm"
      }
    },
    {
      "name": "UAC",
      "params": {
        "appkey": "a940f1be3e",
        "secret": "8829ad484d2748cc86abf3d0fc75e32f",
        "steamerConfig": {
          "needMenus": false,
          "manageUrlList": [
            "/steamer/sy(.*)"
          ],
          "preFetchRoleInfo": true
        }
      }
    },
    {
      "name": "UPM",
      "params": {
        "appkey": "fe.bdop",
        "secret": "678ce49cab89d989f7f68b4bf2c25824",
        "upmHost": "http://api.upm-in.sankuai.com",
        "steamerConfig": {
          "manageUrlList": [
            "/steamer/sy(.*)"
          ],
          "preFetchRoleInfo": true,
          "preFetchPermUrl": true
        }
      }
    }
  ],
  "hostTemplates": [
    {
      "id": "10",
      "associationType": "VERSION",
      "associationVersion": "1.0.5",
      "config": {}
    }
  ],
  "commonModules": [
    {
      "id": "445",
      "associationType": "VERSION",
      "name": "service-scm-request"
    },
    {
      "id": "450",
      "associationType": "VERSION",
      "name": "service-scm-config-request"
    },
    {
      "id": "454",
      "associationType": "VERSION",
      "name": "scm-saas-ui-mobile"
    },
    {
      "id": "453",
      "associationType": "VERSION",
      "name": "service-scm-accessinfo"
    },
    {
      "id": "473",
      "associationType": "VERSION",
      "name": "service-scm-flow"
    },
    {
      "id": "486",
      "associationType": "VERSION",
      "name": "seagull-img-upload"
    },
    {
      "id": "3259",
      "associationType": "VERSION",
      "name": "service-components-sy"
    }
  ]
};

export default seagullConfig;
