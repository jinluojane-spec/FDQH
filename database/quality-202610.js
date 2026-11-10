// 2026年10月质量指标增量覆盖层
// 来源: FDQH_quality_indicators_2026-11-06.xlsx
// 设计原则: 在9月覆盖层基础上追加10月数据，不修改既有8-9月月度值

var base = require('./quality-202609');

var MONTHS = ['8月', '9月', '10月'];
var MONTH_HEADERS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'];

var complaintSummary = Object.assign({}, base.complaintSummary, {
  total: 839,
  period: '2026年1-10月',
  sourceFile: 'FDQH_quality_indicators_2026-11-06.xlsx',
  missingDetail: 249,
  octoberSummary: 91,
  octoberDetail: 0,
  byMonth: Object.assign({}, base.complaintSummary.byMonth, { '10月': 91 }),
  sourceByMonth: {
    '1月': 125,
    '2月': 67,
    '3月': 67,
    '4月': 69,
    '5月': 74,
    '6月': 65,
    '7月': 106,
    '8月': 87,
    '9月': 88,
    '10月': 91
  },
  byLine: { '仪器': 672, '微生物': 52, '发光': 59, '生化': 33, '荧光PCR': 19, 'POCT': 4 },
  octoberByLine: { '试剂': 13, '仪器': 78 }
});

var kpis = Object.assign({}, base.kpis, {
  doaOverallYTD: 8.1,
  doaNewYTD: 7.4,
  doaMassYTD: 10.7,
  ffrOverallYTD: 8.3,
  ffrNewYTD: 8.2,
  ffrMassYTD: 8.4,
  reagentDefectOverallYTD: 4.7,
  reagentDefectCLIA: 9.0,
  reagentDefectBio: 2.5,
  reagentDefectMol: 10.5,
  pkgPassRate: 99.6,
  rawReagentPassRate: 99.6,
  rawInstrumentPassRate: 99.2,
  semiReagentPassRate: 97.0,
  finalReagentPassRate: 98.3,
  finalInstrumentPassRate: 100,
  batchRecordPassRate: 95.9,
  stabilityCompleteRate: 83.9,
  supplierCapaOnTime: 100,
  trainingCoverage: 100,
  complaintCountYTD: complaintSummary.total,
  complaintsByLine: complaintSummary.byLine
});

var dataIssues = [
  '10月附件将客诉累计更新为839件；按“不覆盖历史”要求，平台保留8月48件、9月58件既有月度值，仅追加10月91件。源表修订后的8月87件、9月88件未覆盖原历史。',
  '10月EQA记录为0/0，无有效参评项目；平台保留YTD 96.8%，10月月度值留空。',
  '附件“指标总览（YTD)”仍有多处7月说明和旧值，平台按各模块10月列及YTD列更新。',
  'CAPA YTD为65条、已关闭51条、处理中14条；10月新增9条、关闭1条。',
  '客诉汇总总数839件，其中仪器672件、试剂167件；试剂分线合计167件，与明细口径需继续核对。'
];

function lowIsGood(actual, target) {
  if (actual === null || actual === undefined || actual === '') return 'na';
  return Number(actual) <= Number(target) ? 'pass' : 'fail';
}

function setMonthObject(list, month, patch) {
  var index = list.findIndex(function(item) { return item && item.month === month; });
  var value = Object.assign({ month: month }, patch);
  if (index >= 0) list[index] = Object.assign({}, list[index], value);
  else list.push(value);
}

function setMonthValue(list, month, value) {
  var monthNumber = parseInt(month, 10);
  var index = list.findIndex(function(item) { return item && item.month === month; });
  if (index >= 0) {
    list[index] = Object.assign({}, list[index], { month: month, value: value });
    return;
  }
  while (list.length < monthNumber) list.push(null);
  list[monthNumber - 1] = value;
}

function setRowMonth(row, month, value) {
  row.months = row.months || {};
  row.months[month] = value;
}

function normalizeMonthHeaders(section) {
  if (!section || section.type !== 'table' || !section.rows) return;
  var usesMonths = section.rows.some(function(row) {
    return row.months && Object.keys(row.months).some(function(key) { return /^\d+月$/.test(key); });
  });
  if (usesMonths) section.headers = ['指标', '目标'].concat(MONTH_HEADERS, ['YTD']);
}

function findModule(data, id) {
  return (data.modules || []).find(function(item) { return item.id === id; });
}

function findSection(module, title) {
  return module && (module.sections || []).find(function(item) { return item.title === title; });
}

function findRow(module, sectionTitle, rowName) {
  var section = findSection(module, sectionTitle);
  return section && (section.rows || []).find(function(item) { return item.name === rowName || item.label === rowName; });
}

function updateSummary(module, label, patch) {
  var item = module && (module.summary || []).find(function(row) {
    return row.label === label || (row.label && row.label.indexOf(label) === 0);
  });
  if (item) Object.assign(item, patch);
}

function updateSummaryItem(module, title, label, patch) {
  var section = findSection(module, title);
  var item = section && (section.items || []).find(function(row) { return row.label === label; });
  if (item) Object.assign(item, patch);
}

function updateCard(module, label, note) {
  var section = findSection(module, '观察指标 (Monitoring) — 客服/可靠性');
  var item = section && (section.items || []).find(function(row) { return row.name === label; });
  if (item) item.note = note;
}

function updateTableRow(module, sectionTitle, rowName, october, ytd, status, desc) {
  var row = findRow(module, sectionTitle, rowName);
  if (!row) return;
  setRowMonth(row, '10月', october);
  if (ytd !== undefined) row.ytd = ytd;
  if (status !== undefined) row.status = status;
  if (desc !== undefined) row.desc = desc;
}

function applyToBowling(input) {
  var data = base.applyToBowling(input);
  data.updated = '2026-10';
  data.complaintStats = Object.assign({}, complaintSummary);
  var strategic = data.strategic || [];

  var doa = strategic.find(function(row) { return row.id === '8'; });
  if (doa) {
    doa.ytd = 8.1;
    setMonthObject(doa.months, '10月', { plan: 8, actual: 5.3, status: lowIsGood(5.3, 8) });
    if (doa.drilldown && doa.drilldown[0]) {
      doa.drilldown[0].ytd = 7.4;
      setMonthValue(doa.drilldown[0].months, '10月', 0);
    }
    if (doa.drilldown && doa.drilldown[1]) {
      doa.drilldown[1].ytd = 10.7;
      setMonthValue(doa.drilldown[1].months, '10月', 16.7);
    }
  }

  var ffr = strategic.find(function(row) { return row.id === '9'; });
  if (ffr) {
    ffr.ytd = 8.3;
    setMonthObject(ffr.months, '10月', { plan: 8, actual: 8.4, status: lowIsGood(8.4, 8) });
    if (ffr.drilldown && ffr.drilldown[0]) {
      ffr.drilldown[0].ytd = 8.2;
      setMonthValue(ffr.drilldown[0].months, '10月', 8.5);
    }
    if (ffr.drilldown && ffr.drilldown[1]) {
      ffr.drilldown[1].ytd = 8.4;
      setMonthValue(ffr.drilldown[1].months, '10月', 8.2);
    }
  }

  var defect = strategic.find(function(row) { return row.id === '10'; });
  if (defect) {
    defect.ytd = 4.7;
    setMonthObject(defect.months, '10月', { plan: 2.5, actual: 4.4, status: lowIsGood(4.4, 2.5) });
    var defectValues = [4.4, 11.8, 2.1, 0, null];
    (defect.drilldown || []).forEach(function(row, index) {
      if (row.ytd !== null && row.ytd !== undefined) row.ytd = [4.7, 9.0, 2.5, 10.5, null][index];
      setMonthValue(row.months, '10月', defectValues[index]);
    });
  }

  var dailyValues = {
    D1: 99.0,
    D2: 100,
    D3: 98,
    D4: 99,
    D5: 100,
    D6: 100,
    D7: null,
    D8: null
  };
  (data.daily || []).forEach(function(row) {
    if (Object.prototype.hasOwnProperty.call(dailyValues, row.id)) {
      setMonthValue(row.months, '10月', dailyValues[row.id]);
    }
  });

  return data;
}

function updateProductionMetric(section, id, october, ytd, status) {
  var item = section && (section.metrics || []).find(function(row) { return row.id === id; });
  if (!item && section && section.metrics) {
    section.metrics.some(function(metric) {
      item = (metric.children || []).find(function(row) { return row.id === id; });
      return Boolean(item);
    });
  }
  if (!item) return;
  item.months = item.months || {};
  item.months['10月'] = october;
  if (ytd !== undefined) item.ytd = ytd;
  if (status !== undefined) item.status = status;
}

function applyToProduction(input) {
  var data = base.applyToProduction(input);
  data.updated = '2026-10';
  data.dataSource = 'FDQH_quality_indicators_2026-11-06.xlsx';
  var sections = data.sections || [];

  var strategic = sections.find(function(section) { return section.title && section.title.indexOf('战略解码') === 0; });
  updateProductionMetric(strategic, 'DOA', 5.3, '8.1%', 'fail');
  updateProductionMetric(strategic, 'DOA-N', 0, '7.4%', 'pass');
  updateProductionMetric(strategic, 'DOA-M', 16.7, '10.7%', 'fail');
  updateProductionMetric(strategic, 'FFR', 8.4, '8.3%', 'fail');
  updateProductionMetric(strategic, 'FFR-N', 8.5, '8.2%', 'fail');
  updateProductionMetric(strategic, 'FFR-M', 8.2, '8.4%', 'warning');
  updateProductionMetric(strategic, 'DEFECT', 4.4, '4.7%', 'fail');
  updateProductionMetric(strategic, 'DEF-CLIA', 11.8, '9.0%', 'fail');
  updateProductionMetric(strategic, 'DEF-BIO', 2.1, '2.5%', 'fail');
  updateProductionMetric(strategic, 'DEF-MOL', 0, '10.5%', 'fail');

  var daily = sections.find(function(section) { return section.title && section.title.indexOf('日常检验') === 0; });
  [
    ['D1', 99.0, '99.6%', 'pass'],
    ['D2', 100, '99.6%', 'pass'],
    ['D3', 98, '99.2%', 'warning'],
    ['D4', 99, '97.0%', 'warning'],
    ['D5', 100, '98.3%', 'warning'],
    ['D6', 100, '100%', 'pass'],
    ['D7', null, '95.9%', 'pass'],
    ['D8', null, '83.9%', 'fail']
  ].forEach(function(values) {
    updateProductionMetric(daily, values[0], values[1], values[2], values[3]);
  });

  var complaint = sections.find(function(section) { return section.title && section.title.indexOf('客诉分析') === 0; });
  if (complaint) {
    complaint.title = '客诉分析 · 2026年1-10月 (共839件)';
    complaint.byMonth = complaintSummary.byMonth;
    complaint.byLine = [
      { name: '仪器', count: 672, color: '#0EA5E9', risk: '10月78件' },
      { name: '发光', count: 59, color: '#3B82F6', risk: '10月4件' },
      { name: '微生物', count: 52, color: '#10B981', risk: '10月5件' },
      { name: '生化', count: 33, color: '#F59E0B', risk: '10月2件' },
      { name: '荧光PCR', count: 19, color: '#8B5CF6', risk: '10月1件' },
      { name: 'POCT', count: 4, color: '#EC4899', risk: '10月0件' }
    ];
  }

  return data;
}

function addOctoberFaultSection(pms) {
  if (!pms || pms.sections.some(function(section) { return section.title === '仪器故障率（10月）'; })) return;
  var section = {
    title: '仪器故障率（10月）',
    type: 'table',
    months: ['10月'],
    headers: ['指标', '目标', '10月', 'YTD', '说明'],
    rows: [
      { name: '故障率(仪器) 1000', target: '参照历史水平', months: { '10月': 7.32 }, ytd: '7.32%', status: 'warning', desc: '10月6/82' },
      { name: '故障率(仪器) 3000', target: '参照历史水平', months: { '10月': 20.85 }, ytd: '20.85%', status: 'fail', desc: '10月59/283' },
      { name: '故障率(仪器) 800P', target: '参照历史水平', months: { '10月': 27.30 }, ytd: '27.30%', status: 'fail', desc: '10月80/293' },
      { name: '故障率(仪器) 药敏', target: '参照历史水平', months: { '10月': 3.47 }, ytd: '3.47%', status: 'warning', desc: '10月7/202' }
    ]
  };
  var insertAt = pms.sections.findIndex(function(item) { return item.title === '客诉 Top 问题'; });
  if (insertAt < 0) pms.sections.push(section);
  else pms.sections.splice(insertAt, 0, section);
}

function addOctoberDataIssues(pms) {
  if (!pms || pms.sections.some(function(section) { return section.title === '10月数据提示'; })) return;
  pms.sections.push({
    title: '10月数据提示',
    type: 'list',
    items: dataIssues.map(function(issue) {
      return { issue: issue, line: '数据质量', product: '', status: 'open' };
    })
  });
}

function applyToModules(input) {
  var data = base.applyToModules(input);
  data.updated = '2026-10';
  data.dataSource = 'FDQH_quality_indicators_2026-11-06.xlsx';
  data.dataQualityNotes = (base.dataIssues || []).concat(dataIssues);

  var qms = findModule(data, 'qms');
  var rd = findModule(data, 'rd');
  var supply = findModule(data, 'supply');
  var mfg = findModule(data, 'mfg');
  var pms = findModule(data, 'pms');

  [qms, rd, supply, mfg, pms].forEach(function(module) {
    (module && module.sections || []).forEach(normalizeMonthHeaders);
  });

  if (qms) {
    updateSummary(qms, '成品合格率(试剂)', { value: '100%', target: '100%', status: 'pass', desc: '10月抽检100%，YTD100%' });
    updateSummary(qms, 'CAPA按期关闭率', { value: '100%', target: '≥95%', status: 'pass', desc: '10月新增9条、关闭1条、处理中14条' });
    updateTableRow(qms, '考核指标 (KPI)', '抽检合格率', 100, '100%', 'pass', '10月100%');
    updateTableRow(qms, '考核指标 (KPI)', '成品合格率(试剂)', 100, '100%', 'pass', '10月抽检合格率100%');
    updateTableRow(qms, '观察指标 (Monitoring)', '无重大缺陷率(外部审计)', 100, '100%', 'pass', '10月100%');
    updateTableRow(qms, '观察指标 (Monitoring)', '体系培训完成课时', 18.3, '18.3h/人/年', 'warning', '截至10月累计18.3h');
    updateTableRow(qms, '观察指标 (Monitoring)', '培训认证覆盖率', 100, '100%', 'pass', '上海63、长沙29、泰州5');
    updateSummaryItem(qms, 'CAPA 管理', 'CAPA总数', { value: 65 });
    updateSummaryItem(qms, 'CAPA 管理', '已关闭', { value: 51 });
    updateSummaryItem(qms, 'CAPA 管理', '处理中', { value: 14 });
    updateSummaryItem(qms, 'CAPA 管理', '逾期', { value: 0 });
    updateSummaryItem(qms, 'CAPA 管理', '按期关闭率', { value: '100%' });
  }

  if (rd) {
    updateSummary(rd, '新品DOA', { value: '7.4%', target: '≤8%', status: 'pass', desc: 'YTD7.4%，10月0%' });
    updateSummary(rd, '新品FFR', { value: '8.2%', target: '≤8%', status: 'warning', desc: 'YTD8.2%，10月8.5%' });
    updateTableRow(rd, '新产品导入质量 (DOA/FFR)', 'DOA到货缺陷率', 0, '7.4%', 'pass', '10月0%');
    updateTableRow(rd, '新产品导入质量 (DOA/FFR)', 'FFR月度维修率', 8.5, '8.2%', 'warning', '10月8.5%');
  }

  if (supply) {
    updateSummary(supply, '原料合格率(试剂)', { value: '99.6%', target: '≥99.3%', status: 'pass', desc: 'YTD99.6%，10月100%' });
    updateSummary(supply, '原料合格率(仪器)', { value: '99.2%', target: '≥98.5%', status: 'pass', desc: 'YTD99.2%，10月98%' });
    updateSummary(supply, '包材合格率', { value: '99.6%', target: '≥98.8%', status: 'pass', desc: 'YTD99.6%，10月99%' });
    updateSummary(supply, '入库及时率', { value: '99.77%', target: '≥99.5%', status: 'pass', desc: '10月99.77%' });
    updateTableRow(supply, '考核指标 (KPI)', '上线不良率(仪器)', 100, '--', 'pass', '10月100ppm（12/119185）');
    updateTableRow(supply, '考核指标 (KPI)', '供应商CAPA按时关闭率', null, '100%', 'warning', '10月无当月关闭率；总数106、新增36，计划11月底关闭');
    updateTableRow(supply, 'IQC来料检验 (2026H1累计)', '仪器-原辅料', 98, '99.2%', 'warning', '10月98%');
    updateTableRow(supply, 'IQC来料检验 (2026H1累计)', '仪器-包材', 99, '99.6%', 'pass', '10月包材合格率99%');
    updateTableRow(supply, 'IQC来料检验 (2026H1累计)', '试剂-原辅料(长沙)', 100, '99.6%', 'pass', '10月100%');
    updateTableRow(supply, '观察指标 (Monitoring)', '供应商年度审核完成率', 85.7, '85.70%', 'warning', '10月12/14');
    updateSummaryItem(supply, '仓储物流KPI (长沙工厂)', '入库及时率', { value: '99.77%' });
    updateSummaryItem(supply, '仓储物流KPI (长沙工厂)', '出库及时率', { value: '100%' });
    updateSummaryItem(supply, '仓储物流KPI (长沙工厂)', '领料及时率', { value: '94.78%' });
    updateSummaryItem(supply, '仓储物流KPI (长沙工厂)', '48小时发货率', { value: '97.73%' });
    updateSummaryItem(supply, '仓储物流KPI (长沙工厂)', '发货准确性', { value: '100%' });
  }

  if (mfg) {
    updateSummary(mfg, '半成品合格率', { value: '97.0%', target: '≥98%', status: 'warning', desc: 'YTD97.0%，10月99%' });
    updateSummary(mfg, '成品合格率(试剂)', { value: '98.3%', target: '≥99%', status: 'warning', desc: 'YTD98.3%，10月100%' });
    updateSummary(mfg, '批记录合格率', { value: '95.9%', target: '≥95%', status: 'pass', desc: 'YTD95.9%，10月无有效数据' });
    updateSummary(mfg, 'DOA Overall', { value: '8.1%', target: '≤8%', status: 'warning', desc: 'YTD8.1%，10月5.3%' });
    updateTableRow(mfg, '过程检验 & 成品 (月度)', '半成品合格率(试剂)', 99, '97.0%', 'warning', '10月99%');
    updateTableRow(mfg, '过程检验 & 成品 (月度)', '成品合格率(试剂)', 100, '98.3%', 'warning', '10月100%');
    updateTableRow(mfg, '过程检验 & 成品 (月度)', '成品合格率(仪器)', 100, '100%', 'pass', '10月100%');
    updateTableRow(mfg, '过程检验 & 成品 (月度)', '批记录合格率', null, '95.9%', 'pass', '10月无法有效统计');
    updateTableRow(mfg, '过程检验 & 成品 (月度)', '稳定性检测完成率', null, '83.9%', 'fail', '10月无法有效统计');
    [
      ['半成品-发光', 100, '100%', 'pass'],
      ['半成品-微生物', 95, '86%', 'warning'],
      ['半成品-分子', 100, '100%', 'pass'],
      ['半成品-生化', 98.4, '98.1%', 'pass'],
      ['成品-发光', 100, '95.9%', 'pass'],
      ['成品-微生物', 100, '95%', 'pass'],
      ['成品-分子', 100, '98.9%', 'pass'],
      ['成品-生化', 100, '99.9%', 'pass']
    ].forEach(function(values) {
      updateTableRow(mfg, '试剂一次通过率 (周数据)', values[0], values[1], values[2], values[3], '10月' + values[1] + '%');
    });
    updateTableRow(mfg, '仪器一次通过率 (周数据)', '生化F-C800P', 100, '100%', 'pass', '10月10/10');
    updateTableRow(mfg, '仪器一次通过率 (周数据)', '发光F-i3000', null, '--', 'na', '10月0/0');
  }

  if (pms) {
    updateSummary(pms, '客诉总数', { label: '客诉总数(1-10月)', value: '839件', target: '≤50件/半年', status: 'warning', desc: 'YTD仪器672、试剂167；10月91件' });
    updateSummary(pms, '试剂市场缺陷率', { value: '4.7%', target: '≤2.5%', status: 'fail', desc: 'YTD4.7%，10月4.4%' });
    updateSummary(pms, 'EQA合格率', { value: '96.8%', target: '100%', status: 'warning', desc: 'YTD96.8%；10月0/0无有效参评' });
    updateSummary(pms, '到货缺陷率DOA', { value: '10.7%', target: '≤5%(新标)', status: 'fail', desc: 'YTD10.7%，10月5.3%' });
    updateTableRow(pms, '考核指标 (KPI)', '室间质评EQA合格率', null, '96.8%', 'warning', '10月0/0，无有效参评项目');
    updateTableRow(pms, '试剂市场缺陷率 (月度)', 'Overall缺陷率', 4.4, '4.7%', 'fail', '10月4.4%');
    updateTableRow(pms, '试剂市场缺陷率 (月度)', '发光条线', 11.8, '9.0%', 'fail', '10月11.8%');
    updateTableRow(pms, '试剂市场缺陷率 (月度)', '生化条线', 2.1, '2.5%', 'fail', '10月2.1%');
    updateTableRow(pms, '试剂市场缺陷率 (月度)', '分子条线', 0, '10.5%', 'fail', '10月0%');
    updateTableRow(pms, '仪器上市后质量 (月度)', '仪器总FFR', 8.4, '8.3%', 'fail', '10月8.4%');
    updateTableRow(pms, '仪器上市后质量 (月度)', '仪器到货缺陷率(DOA)', 5.3, '8.1%', 'fail', '10月5.3%');
    updateTableRow(pms, '客诉月度趋势', '客诉总数', 13, '167件', 'warning', '试剂YTD167，10月13');
    updateTableRow(pms, '客诉月度趋势', '发光', 4, '52', 'warning', '10月4件');
    updateTableRow(pms, '客诉月度趋势', '微生物', 5, '33', 'warning', '10月5件');
    updateTableRow(pms, '客诉月度趋势', '生化', 2, '27', 'pass', '10月2件');
    updateTableRow(pms, '客诉月度趋势', '荧光PCR', 1, '14', 'pass', '10月1件');
    updateTableRow(pms, '客诉月度趋势', 'POCT', 0, '3', 'pass', '10月0件');
    updateCard(pms, '零星客户投诉率', '10月14ppm；YTD62ppm。零星投诉/总投诉');
    updateCard(pms, '批量客户投诉占比', '10月4.7%；YTD3.20%。批量投诉/总投诉');
    addOctoberFaultSection(pms);
    addOctoberDataIssues(pms);

    var massDoa = findRow(pms, '仪器上市后质量 (月度)', 'DOA到货缺陷率（1000、3000）');
    var instrumentSection = findSection(pms, '仪器上市后质量 (月度)');
    if (!massDoa && instrumentSection) {
      massDoa = {
        name: 'DOA到货缺陷率（1000、3000）',
        target: '≤8%',
        months: { '10月': 16.7 },
        ytd: '10.7%',
        status: 'fail',
        direction: 'lt',
        desc: '10月16.7%'
      };
      instrumentSection.rows.push(massDoa);
    } else if (massDoa) {
      setRowMonth(massDoa, '10月', 16.7);
      massDoa.ytd = '10.7%';
      massDoa.status = 'fail';
      massDoa.desc = '10月16.7%';
    }
    var massFfr = findRow(pms, '仪器上市后质量 (月度)', 'FFR月度维修率（1000、3000）');
    if (!massFfr && instrumentSection) {
      massFfr = {
        name: 'FFR月度维修率（1000、3000）',
        target: '≤8%',
        months: { '10月': 8.2 },
        ytd: '8.4%',
        status: 'warning',
        direction: 'lt',
        desc: '10月8.2%'
      };
      instrumentSection.rows.push(massFfr);
    } else if (massFfr) {
      setRowMonth(massFfr, '10月', 8.2);
      massFfr.ytd = '8.4%';
      massFfr.status = 'warning';
      massFfr.desc = '10月8.2%';
    }
  }

  [qms, rd, supply, mfg, pms].forEach(function(module) {
    (module && module.sections || []).forEach(normalizeMonthHeaders);
  });

  return data;
}

function applyToKpis(data) {
  return Object.assign(data, kpis);
}

module.exports = {
  month: '10月',
  months: MONTHS,
  sourceFile: 'FDQH_quality_indicators_2026-11-06.xlsx',
  complaintSummary: complaintSummary,
  kpis: kpis,
  capaSummary: { total: 65, closed: 51, processing: 14, overdue: 0, onTimeRate: 100 },
  dataIssues: dataIssues,
  applyToBowling: applyToBowling,
  applyToProduction: applyToProduction,
  applyToModules: applyToModules,
  applyToKpis: applyToKpis
};
