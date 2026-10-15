// 2026年1-9月退换货整合清单看板数据
// 来源: 退换货申请、审批、登记单-20260805132504-台账及分析更新2026.1-9.xlsx

module.exports = {
  updated: '2026-10-15',
  sourceFile: '退换货申请、审批、登记单-20260805132504-台账及分析更新2026.1-9.xlsx',
  periodLabel: '2026年1-9月整合清单',
  actualPeriod: '2026-01-04 至 2026-09-29',
  summary: {
    total: 606,
    quality: 102,
    nonQuality: 504,
    qualityRate: 16.83,
    nonQualityRate: 83.17,
    orders: 154,
    qualityOrders: 69,
    nonQualityOrders: 68,
    augustTotal: 42,
    augustQuality: 28,
    augustNonQuality: 14,
    augustQualityRate: 66.67,
    septemberTotal: 49,
    septemberQuality: 10,
    septemberNonQuality: 39,
    septemberQualityRate: 20.41
  },
  months: [
    { month: '1月', quality: 14, nonQuality: 184, total: 198, qualityRate: 7.07 },
    { month: '2月', quality: 6, nonQuality: 67, total: 73, qualityRate: 8.22 },
    { month: '3月', quality: 4, nonQuality: 29, total: 33, qualityRate: 12.12 },
    { month: '4月', quality: 10, nonQuality: 57, total: 67, qualityRate: 14.93 },
    { month: '5月', quality: 8, nonQuality: 32, total: 40, qualityRate: 20.00 },
    { month: '6月', quality: 11, nonQuality: 5, total: 16, qualityRate: 68.75 },
    { month: '7月', quality: 11, nonQuality: 77, total: 88, qualityRate: 12.50 },
    { month: '8月', quality: 28, nonQuality: 14, total: 42, qualityRate: 66.67 },
    { month: '9月', quality: 10, nonQuality: 39, total: 49, qualityRate: 20.41 }
  ],
  qualityReasons: [
    { name: '质量问题（性能）', count: 54, qualityRate: 52.94, totalRate: 8.91 },
    { name: '外包装破损', count: 31, qualityRate: 30.39, totalRate: 5.12 },
    { name: '漏液', count: 12, qualityRate: 11.76, totalRate: 1.98 },
    { name: '组分完整性（缺组分、标签错误）', count: 4, qualityRate: 3.92, totalRate: 0.66 },
    { name: '污染', count: 1, qualityRate: 0.98, totalRate: 0.17 }
  ],
  nonQualityReasons: [
    { name: '业务', count: 198, nonQualityRate: 39.29, totalRate: 32.67 },
    { name: '客户调剂或改发票', count: 139, nonQualityRate: 27.58, totalRate: 22.94 },
    { name: '返厂售后（三包）', count: 113, nonQualityRate: 22.42, totalRate: 18.65 },
    { name: '订错货', count: 33, nonQualityRate: 6.55, totalRate: 5.45 },
    { name: '发错货', count: 11, nonQualityRate: 2.18, totalRate: 1.82 },
    { name: '物流问题', count: 10, nonQualityRate: 1.98, totalRate: 1.65 }
  ],
  productTypes: [
    { name: '生化', quality: 58, nonQuality: 172, total: 230, qualityRate: 25.22 },
    { name: 'POCT（长沙）', quality: 0, nonQuality: 113, total: 113, qualityRate: 0 },
    { name: '新冠抗原', quality: 0, nonQuality: 105, total: 105, qualityRate: 0 },
    { name: '化学发光', quality: 11, nonQuality: 67, total: 78, qualityRate: 14.10 },
    { name: '分子', quality: 17, nonQuality: 13, total: 30, qualityRate: 56.67 },
    { name: '微生物', quality: 13, nonQuality: 14, total: 27, qualityRate: 48.15 },
    { name: '经营类', quality: 0, nonQuality: 18, total: 18, qualityRate: 0 },
    { name: 'I-SPOT', quality: 3, nonQuality: 2, total: 5, qualityRate: 60.00 }
  ],
  septemberQualityAnalysis: {
    total: 10,
    topProduct: {
      name: '类风湿因子测定试剂盒（免疫比浊法）',
      count: 2,
      reason: '外包装破损',
      detail: '两个订单均因试剂盒外包装破损或客户拒收发生退换货。'
    },
    reasons: [
      {
        name: '外包装破损',
        count: 5,
        products: [
          { name: '类风湿因子测定试剂盒（免疫比浊法）', category: '生化', count: 2, detail: '试剂盒破损，客户不接受；另一单外包装破损后客户拒收。' },
          { name: '低密度脂蛋白胆固醇测定试剂盒（清除法）', category: '生化', count: 1, detail: '冷链送达后外盒挤压变形，无法出货。' },
          { name: 'W2酸性清洗液', category: '生化', count: 1, detail: '外包装破损，客户拒收。' },
          { name: '尿酸测定试剂盒（尿酸酶法）', category: '生化', count: 1, detail: '外包装破损，西门子无法销售并拒收。' }
        ]
      },
      {
        name: '质量问题（性能）',
        count: 4,
        products: [
          { name: '糖化白蛋白测定试剂盒（酶法）', category: '生化', count: 1, detail: '在医院930仪器上无法使用。' },
          { name: '肌酐测定试剂盒（肌氨酸氧化酶法）', category: '生化', count: 1, detail: '新试剂开封后发现R1只有半瓶，试剂量严重不足。' },
          { name: '胃泌素17检测试剂盒（磁微粒化学发光法）', category: '化学发光', count: 1, detail: '终端反馈产品漏液。' },
          { name: '新型冠状病毒、甲型流感病毒、乙型流感病毒抗原检测试剂盒（胶体金法）', category: '化学发光', count: 1, detail: '多次检测无质控线，或质控线颜色很浅。' }
        ]
      },
      {
        name: '质量问题（污染）',
        count: 1,
        products: [
          { name: '同型半胱氨酸测定试剂盒（酶循环法）', category: '生化', count: 1, detail: '试剂打开后发现异物。' }
        ]
      }
    ],
    previousMonthTop3: [
      {
        name: '质量问题（性能）',
        august: 22,
        september: 4,
        change: -18,
        assessment: '改善',
        situation: '8月主要由新冠甲乙流抗原、真菌药敏和一次性采样拭子集中退货带动；9月降至4条，且分散在4个产品。'
      },
      {
        name: '漏液',
        august: 3,
        september: 0,
        change: -3,
        assessment: '改善',
        situation: '8月为真菌药敏试剂盒2条、碱性磷酸酶试剂1条；9月未发生同类漏液质量问题。'
      },
      {
        name: '外包装破损',
        august: 2,
        september: 5,
        change: 3,
        assessment: '恶化',
        situation: '9月升至首位，主要由类风湿因子试剂2条及其余3个产品各1条构成，需重点检查冷链运输和成品包装防护。'
      }
    ]
  },
  insights: [
    '1-9月整合清单共606条，其中质量问题102条、非质量问题504条。',
    '9月退换货49条，其中质量问题10条、非质量问题39条，质量问题占比20.41%。',
    '本次来源同步修订8月口径：质量问题28条、非质量问题14条，质量问题占比66.67%。',
    '9月质量问题以外包装破损5条和性能问题4条为主，另有污染1条。',
    '9月非质量问题以客户调剂或改发票15条、订错货12条和业务原因7条为主。',
    '1-9月质量问题主要集中在性能问题54条、外包装破损31条和漏液12条。',
    '统计覆盖154个唯一订单号；其中质量问题涉及69个订单，非质量问题涉及68个订单。',
    '流程状态包含归档426条、未归档171条、未填写9条，看板按全部台账记录统计。',
    '9月Top3质量原因为外包装破损5条、性能问题4条、污染1条；最高单品为类风湿因子试剂2条。',
    '8月Top3质量问题在9月的变化为：性能问题22条降至4条，漏液3条降至0条，外包装破损2条升至5条。'
  ]
};
