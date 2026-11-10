// 2026年1-10月退换货整合清单看板数据
// 来源: 退换货申请、审批、登记单-20260805132504-台账及分析更新2026.1-10.xlsx

var data = JSON.parse(JSON.stringify(require('./returns-202609')));

data.updated = '2026-11-10';
data.sourceFile = '退换货申请、审批、登记单-20260805132504-台账及分析更新2026.1-10.xlsx';
data.periodLabel = '2026年1-10月整合清单';
data.actualPeriod = '2026-01-04 至 2026-10-28';

data.summary = {
  total: 642,
  quality: 115,
  nonQuality: 527,
  qualityRate: 17.91,
  nonQualityRate: 82.09,
  orders: 166,
  qualityOrders: 74,
  nonQualityOrders: 93,
  augustTotal: 42,
  augustQuality: 28,
  augustNonQuality: 14,
  augustQualityRate: 66.67,
  septemberTotal: 49,
  septemberQuality: 10,
  septemberNonQuality: 39,
  septemberQualityRate: 20.41,
  latestMonthLabel: '10月',
  latestMonthTotal: 36,
  latestMonthQuality: 13,
  latestMonthNonQuality: 23,
  latestMonthQualityRate: 36.11
};

data.months = data.months.concat([
  { month: '10月', quality: 13, nonQuality: 23, total: 36, qualityRate: 36.11 }
]);

data.qualityReasons = [
  { name: '质量问题（性能）', count: 55, qualityRate: 47.83, totalRate: 8.57 },
  { name: '外包装破损', count: 43, qualityRate: 37.39, totalRate: 6.70 },
  { name: '漏液', count: 12, qualityRate: 10.43, totalRate: 1.87 },
  { name: '组分完整性（缺组分、标签错误）', count: 4, qualityRate: 3.48, totalRate: 0.62 },
  { name: '污染', count: 1, qualityRate: 0.87, totalRate: 0.16 }
];

data.nonQualityReasons = [
  { name: '业务', count: 206, nonQualityRate: 39.09, totalRate: 32.09 },
  { name: '客户调剂或改发票', count: 151, nonQualityRate: 28.65, totalRate: 23.52 },
  { name: '返厂售后（三包）', count: 113, nonQualityRate: 21.44, totalRate: 17.60 },
  { name: '订错货', count: 34, nonQualityRate: 6.45, totalRate: 5.30 },
  { name: '发错货', count: 13, nonQualityRate: 2.47, totalRate: 2.02 },
  { name: '物流问题', count: 10, nonQualityRate: 1.90, totalRate: 1.56 }
];

data.productTypes = [
  { name: '生化', quality: 70, nonQuality: 179, total: 249, qualityRate: 28.11 },
  { name: 'POCT（长沙）', quality: 0, nonQuality: 113, total: 113, qualityRate: 0 },
  { name: '新冠抗原', quality: 0, nonQuality: 105, total: 105, qualityRate: 0 },
  { name: '化学发光', quality: 11, nonQuality: 70, total: 81, qualityRate: 13.58 },
  { name: '分子', quality: 17, nonQuality: 13, total: 30, qualityRate: 56.67 },
  { name: '微生物', quality: 13, nonQuality: 14, total: 27, qualityRate: 48.15 },
  { name: 'I-SPOT', quality: 4, nonQuality: 15, total: 19, qualityRate: 21.05 },
  { name: '经营类', quality: 0, nonQuality: 18, total: 18, qualityRate: 0 }
];

data.qualityAnalysis = {
  monthLabel: '10月',
  previousMonthLabel: '9月',
  total: 13,
  topProduct: {
    name: '胱抑素C测定试剂盒（胶乳免疫比浊法）',
    count: 3,
    reason: '外包装破损',
    detail: '同一订单中试剂、校准品和质控品共3条记录受外包装破损影响。'
  },
  reasons: [
    {
      name: '外包装破损',
      count: 12,
      products: [
        { name: '胱抑素C测定试剂盒（胶乳免疫比浊法）', category: '生化', count: 3, detail: '同一订单中试剂、校准品和质控品均受外包装破损影响。' },
        { name: '总胆汁酸测定试剂盒（酶循环法）', category: '生化', count: 2, detail: '两个订单分别反馈外盒破损或到货拆箱后外包装破损。' },
        { name: '高密度脂蛋白胆固醇测定试剂盒（直接法-抗体分离法）', category: '生化', count: 1, detail: '外包装破损，客户不接受。' },
        { name: '载脂蛋白A-1测定试剂盒（免疫比浊法）', category: '生化', count: 1, detail: '外包装破损，客户不接受。' },
        { name: '直接胆红素测定试剂盒（钒酸盐氧化法）', category: '生化', count: 1, detail: '外盒破损，客户不接受。' },
        { name: 'α-羟丁酸脱氢酶测定试剂盒（α-酮丁酸底物法）', category: '生化', count: 1, detail: '外盒破损，客户不接受。' },
        { name: '未填写产品名称（质控品）', category: '生化', count: 2, detail: '台账未填写产品名称，需补充主数据。' },
        { name: '未填写产品名称（校准品）', category: '生化', count: 1, detail: '台账未填写产品名称，需补充主数据。' }
      ]
    },
    {
      name: '质量问题（性能）',
      count: 1,
      products: [
        { name: '结核分枝杆菌特异性细胞免疫反应检测试剂盒（酶联免疫斑点法）', category: 'I-SPOT', count: 1, detail: '开盒发现96孔板包装破损，导致密封失效。' }
      ]
    }
  ],
  previousMonthTop3: [
    {
      name: '外包装破损',
      previousCount: 5,
      currentCount: 12,
      change: 7,
      assessment: '恶化',
      situation: '10月升至12条，集中在生化产品，涉及同一订单多产品、校准品及质控品，需重点检查冷链运输和成品外包装防护。'
    },
    {
      name: '质量问题（性能）',
      previousCount: 4,
      currentCount: 1,
      change: -3,
      assessment: '改善',
      situation: '10月降至1条，为I-SPOT产品96孔板包装破损导致密封失效。'
    },
    {
      name: '污染',
      previousCount: 1,
      currentCount: 0,
      change: -1,
      assessment: '改善',
      situation: '10月未发生污染类质量退换货。'
    }
  ]
};

data.insights = [
  '1-10月整合清单共642条，其中质量问题115条、非质量问题527条。',
  '10月退换货36条，其中质量问题13条、非质量问题23条，质量问题占比36.11%。',
  '10月质量问题全部集中在外包装破损12条和性能问题1条，外包装破损较9月增加7条。',
  '10月非质量问题以客户调剂或改发票12条、业务原因8条、发错货2条和订错货1条为主。',
  '1-10月质量问题主要集中在性能问题55条、外包装破损43条和漏液12条。',
  '统计覆盖166个唯一订单号；其中质量问题涉及74个订单，非质量问题涉及93个订单。',
  '流程状态包含归档470条、未归档172条，10月新增36条均已归档。',
  '10月质量原因最高单品为胱抑素C测定试剂盒，共3条，均为外包装破损。',
  '10月3条质量记录未填写产品名称，涉及质控品和校准品，建议补齐产品主数据。',
  '9月Top3质量问题在10月的变化为：外包装破损5条升至12条，性能问题4条降至1条，污染1条降至0条。'
];

module.exports = data;
