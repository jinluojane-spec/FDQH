// 2026年1-8月退换货整合清单看板数据
// 来源: 1-8月退换货整合清单.xlsx

module.exports = {
  updated: '2026-09-14',
  sourceFile: '1-8月退换货整合清单.xlsx',
  periodLabel: '2026年1-8月整合清单',
  actualPeriod: '2026-01-04 至 2026-09-07',
  summary: {
    total: 562,
    quality: 91,
    nonQuality: 471,
    qualityRate: 16.19,
    nonQualityRate: 83.81,
    orders: 138,
    qualityOrders: 62,
    nonQualityOrders: 78,
    augustTotal: 42,
    augustQuality: 24,
    augustNonQuality: 18,
    augustQualityRate: 57.14
  },
  months: [
    { month: '1月', quality: 14, nonQuality: 184, total: 198, qualityRate: 7.07 },
    { month: '2月', quality: 6, nonQuality: 67, total: 73, qualityRate: 8.22 },
    { month: '3月', quality: 4, nonQuality: 29, total: 33, qualityRate: 12.12 },
    { month: '4月', quality: 10, nonQuality: 57, total: 67, qualityRate: 14.93 },
    { month: '5月', quality: 8, nonQuality: 32, total: 40, qualityRate: 20.00 },
    { month: '6月', quality: 11, nonQuality: 5, total: 16, qualityRate: 68.75 },
    { month: '7月', quality: 11, nonQuality: 77, total: 88, qualityRate: 12.50 },
    { month: '8月', quality: 24, nonQuality: 18, total: 42, qualityRate: 57.14 },
    { month: '9月', quality: 3, nonQuality: 2, total: 5, qualityRate: 60.00 }
  ],
  qualityReasons: [
    { name: '质量问题（性能）', count: 45, qualityRate: 49.45, totalRate: 8.01 },
    { name: '外包装破损', count: 28, qualityRate: 30.77, totalRate: 4.98 },
    { name: '漏液', count: 14, qualityRate: 15.38, totalRate: 2.49 },
    { name: '组分完整性', count: 4, qualityRate: 4.40, totalRate: 0.71 }
  ],
  nonQualityReasons: [
    { name: '非质量问题（业务）', count: 193, nonQualityRate: 40.98, totalRate: 34.34 },
    { name: '客户调剂或改发票', count: 124, nonQualityRate: 26.33, totalRate: 22.06 },
    { name: '返厂售后', count: 113, nonQualityRate: 23.99, totalRate: 20.11 },
    { name: '订错货', count: 21, nonQualityRate: 4.46, totalRate: 3.74 },
    { name: '发错货', count: 9, nonQualityRate: 1.91, totalRate: 1.60 },
    { name: '物流问题', count: 7, nonQualityRate: 1.49, totalRate: 1.25 },
    { name: '经营类', count: 4, nonQualityRate: 0.85, totalRate: 0.71 }
  ],
  productTypes: [
    { name: '生化', quality: 51, nonQuality: 147, total: 198, qualityRate: 25.76 },
    { name: 'POCT', quality: 0, nonQuality: 113, total: 113, qualityRate: 0 },
    { name: '新冠抗原', quality: 0, nonQuality: 105, total: 105, qualityRate: 0 },
    { name: '化学发光', quality: 10, nonQuality: 63, total: 73, qualityRate: 13.70 },
    { name: '分子诊断', quality: 14, nonQuality: 17, total: 31, qualityRate: 45.16 },
    { name: '微生物', quality: 13, nonQuality: 11, total: 24, qualityRate: 54.17 },
    { name: '生化（非自产经营类）', quality: 0, nonQuality: 6, total: 6, qualityRate: 0 },
    { name: 'I-SPOT', quality: 3, nonQuality: 2, total: 5, qualityRate: 60.00 },
    { name: 'I-SPOT（非自产经营类）', quality: 0, nonQuality: 4, total: 4, qualityRate: 0 },
    { name: '其他（非自产经营类）', quality: 0, nonQuality: 2, total: 2, qualityRate: 0 },
    { name: '分子诊断（非自产经营类）', quality: 0, nonQuality: 1, total: 1, qualityRate: 0 }
  ],
  insights: [
    '整合清单共562条，其中质量问题91条、非质量问题471条。',
    '8月质量问题24条、非质量问题18条，质量问题占比57.14%。',
    '质量问题主要集中在性能问题45条、外包装破损28条和漏液14条。',
    '非质量问题主要集中在业务原因193条、客户调剂或改发票124条和返厂售后113条。',
    '台账实际包含9月初5条记录，严格1-8月口径为557条；当前看板保留源汇总的562条口径。',
    '数量列单位不统一，金额列存在订单级重复录入，不能直接用于质量/非质量金额比较。'
  ]
};
