// 2026年8-9月质量指标覆盖数据
// 来源: FDQH_quality_indicators_2026-10-15-少800P数据.xlsx

var base = require('./quality-202608');

var MONTHS = ['8月', '9月'];

var complaintSummary = {
  total: 671,
  period: '2026年1-9月',
  sourceFile: 'FDQH_quality_indicators_2026-10-15-少800P数据.xlsx',
  detailTotal: 590,
  detailReagent: 120,
  detailInstrument: 470,
  missingDetail: 81,
  augustSummary: 48,
  augustDetail: 25,
  septemberSummary: 58,
  septemberDetail: 0,
  byMonth: { '1月': 126, '2月': 66, '3月': 66, '4月': 66, '5月': 70, '6月': 65, '7月': 106, '8月': 48, '9月': 58 },
  byLine: { '仪器': 527, '微生物': 48, '发光': 47, '生化': 27, '荧光PCR': 18, 'POCT': 4 },
  augustByLine: { '试剂': 10, '仪器': 38 },
  septemberByLine: { '试剂': 24, '仪器': 34 }
};

var kpis = Object.assign({}, base.kpis, {
  doaOverallYTD: 8.1,
  doaNewYTD: 8.5,
  doaMassYTD: 8.5,
  ffrOverallYTD: 8.3,
  ffrNewYTD: 8.0,
  ffrMassYTD: 8.0,
  reagentDefectOverallYTD: 2.4,
  reagentDefectCLIA: 4.9,
  reagentDefectBio: 1.0,
  reagentDefectMol: 6.3,
  pkgPassRate: 99.3,
  rawReagentPassRate: 99.5,
  rawInstrumentPassRate: 99.4,
  semiReagentPassRate: 96.8,
  finalReagentPassRate: 98.8,
  finalInstrumentPassRate: 100,
  batchRecordPassRate: 96.7,
  stabilityCompleteRate: 83.9,
  supplierCapaOnTime: 75,
  trainingCoverage: 100,
  complaintCountYTD: complaintSummary.total,
  complaintsByLine: complaintSummary.byLine
});

var dataIssues = [
  '附件名称为“少800P数据”，9月仪器总FFR及新品FFR（800P、药敏仪）缺少完整结果，相关指标暂不能判定为完整月报。',
  '9月EQA单元格同时写有“18/18”和“90”，如18项全部合格，正确值应为100%，需确认源表笔误。',
  '客诉汇总总数按671件、仪器527件统计，但非仪器条线合计144件，与“客诉总数（试剂）120件”不一致。',
  'CAPA YTD写为总数45、已关闭45、处理中0，但9月又写总数11、已关闭5、处理中6，汇总与月度明细无法直接勾稽。',
  '“指标总览（YTD)”仍多处引用7月说明和旧值，不能作为9月汇总口径，应以各模块9月列及客诉汇总表为准。',
  '8月原料检验合格率（仪器）已按明细修正为99%；此前部分页面显示100%属于口径错误。'
];

function lowerIsBetterStatus(actual, target) {
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

function ensureMonthHeader(section, month) {
  if (!section || !section.headers || section.headers.indexOf(month) >= 0) return;
  var insertAt = section.headers.indexOf('YTD');
  if (insertAt < 0) insertAt = section.headers.indexOf('合计');
  if (insertAt < 0) insertAt = section.headers.length;
  section.headers.splice(insertAt, 0, month);
}

function findModule(data, id) {
  return (data.modules || []).find(function(item) { return item.id === id; });
}

function findSection(module, title) {
  return module && (module.sections || []).find(function(item) { return item.title === title; });
}

function findRow(section, name) {
  return section && (section.rows || []).find(function(item) { return item.name === name || item.label === name; });
}

function normalizeMonthTableHeaders(section) {
  if (!section || section.type !== 'table' || !section.rows) return;
  var usesMonths = section.rows.some(function(row) {
    return row.months && Object.keys(row.months).some(function(key) { return /^\d+月$/.test(key); });
  });
  if (!usesMonths) return;
  section.headers = ['指标', '目标'].concat(['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'], ['YTD']);
}

function updateSummary(module, label, patch) {
  var item = module && (module.summary || []).find(function(row) { return row.label === label; });
  if (item) Object.assign(item, patch);
}

function updateTableRow(module, sectionTitle, rowName, august, september, ytd, status, desc) {
  var section = findSection(module, sectionTitle);
  var row = findRow(section, rowName);
  if (!row) return;
  ensureMonthHeader(section, '9月');
  setRowMonth(row, '8月', august);
  setRowMonth(row, '9月', september);
  if (ytd !== undefined) row.ytd = ytd;
  if (status !== undefined) row.status = status;
  if (desc !== undefined) row.desc = desc;
}

function applyToBowling(input) {
  var data = base.applyToBowling(input);
  data.complaintStats = Object.assign({}, complaintSummary);
  data.updated = '2026-09';

  var strategic = data.strategic || [];
  var doa = strategic.find(function(row) { return row.id === '8'; });
  if (doa) {
    doa.ytd = 8.1;
    setMonthObject(doa.months, '8月', { plan: 8, actual: 0, status: 'pass' });
    setMonthObject(doa.months, '9月', { plan: 8, actual: 7.1, status: lowerIsBetterStatus(7.1, 8) });
    if (doa.drilldown && doa.drilldown[0]) {
      doa.drilldown[0].ytd = 8.5;
      setMonthValue(doa.drilldown[0].months, '8月', 0);
      setMonthValue(doa.drilldown[0].months, '9月', 0);
    }
    if (doa.drilldown && doa.drilldown[1]) {
      doa.drilldown[1].ytd = 8.5;
      setMonthValue(doa.drilldown[1].months, '8月', 0);
      setMonthValue(doa.drilldown[1].months, '9月', 0);
    }
  }

  var ffr = strategic.find(function(row) { return row.id === '9'; });
  if (ffr) {
    ffr.ytd = 8.3;
    setMonthObject(ffr.months, '8月', { plan: 8, actual: 9.2, status: lowerIsBetterStatus(9.2, 8) });
    setMonthObject(ffr.months, '9月', { plan: 8, actual: null, status: 'na' });
    if (ffr.drilldown && ffr.drilldown[0]) {
      ffr.drilldown[0].ytd = 8.0;
      setMonthValue(ffr.drilldown[0].months, '8月', 8.5);
      setMonthValue(ffr.drilldown[0].months, '9月', null);
    }
    if (ffr.drilldown && ffr.drilldown[1]) {
      ffr.drilldown[1].ytd = 8.0;
      setMonthValue(ffr.drilldown[1].months, '8月', 10.1);
      setMonthValue(ffr.drilldown[1].months, '9月', 7.0);
    }
  }

  var defect = strategic.find(function(row) { return row.id === '10'; });
  if (defect) {
    defect.ytd = 2.4;
    setMonthObject(defect.months, '8月', { plan: 2.5, actual: 3.4, status: lowerIsBetterStatus(3.4, 2.5) });
    setMonthObject(defect.months, '9月', { plan: 2.5, actual: 7.3, status: lowerIsBetterStatus(7.3, 2.5) });
    var defectValues = [
      { august: 3.4, september: 7.3 },
      { august: 1.3, september: 4.0 },
      { august: 20.0, september: 36.4 },
      { august: null, september: null },
      { august: null, september: null }
    ];
    (defect.drilldown || []).forEach(function(row, index) {
      setMonthValue(row.months, '8月', defectValues[index].august);
      setMonthValue(row.months, '9月', defectValues[index].september);
    });
  }

  var daily = data.daily || [];
  var dailyValues = {
    D1: [98, 96],
    D2: [100, 100],
    D3: [97, 99],
    D4: [97, 97],
    D5: [99, 97]
  };
  daily.forEach(function(row) {
    var values = dailyValues[row.id];
    if (!values) return;
    setMonthValue(row.months, '8月', values[0]);
    setMonthValue(row.months, '9月', values[1]);
  });

  return data;
}

function updateProductionMetric(section, id, august, september, ytd, status) {
  var item = section && (section.metrics || []).find(function(row) { return row.id === id; });
  if (!item) return;
  item.months = item.months || {};
  item.months['8月'] = august;
  item.months['9月'] = september;
  if (ytd !== undefined) item.ytd = ytd;
  if (status !== undefined) item.status = status;
}

function applyToProduction(input) {
  var data = base.applyToProduction(input);
  data.updated = '2026-09';
  data.dataSource = 'FDQH_quality_indicators_2026-10-15-少800P数据.xlsx';

  var sections = data.sections || [];
  sections.forEach(function(section) {
    if (section && section.headers) ensureMonthHeader(section, '9月');
  });

  var strategic = sections.find(function(section) { return section.title && section.title.indexOf('战略解码') === 0; });
  updateProductionMetric(strategic, 'DOA', 0, 7.1, '8.1%', 'fail');
  updateProductionMetric(strategic, 'DOA-N', 0, null, '8.5%', 'fail');
  updateProductionMetric(strategic, 'DOA-M', 0, 0, '8.5%', 'fail');
  updateProductionMetric(strategic, 'FFR', 9.2, null, '8.3%', 'fail');
  updateProductionMetric(strategic, 'FFR-N', 8.5, null, '8.0%', 'warning');
  updateProductionMetric(strategic, 'FFR-M', 10.1, 7.0, '8.0%', 'warning');
  updateProductionMetric(strategic, 'DEFECT', 3.4, 7.3, '2.4%', 'fail');
  updateProductionMetric(strategic, 'DEF-CLIA', 3.4, 7.3, '4.9%', 'fail');
  updateProductionMetric(strategic, 'DEF-BIO', 1.3, 4.0, '1.0%', 'fail');
  updateProductionMetric(strategic, 'DEF-MOL', 20.0, 36.4, '6.3%', 'fail');

  var daily = sections.find(function(section) { return section.title && section.title.indexOf('日常检验') === 0; });
  var dailyValues = [
    ['D1', 98, 96, '99.3%', 'warning'],
    ['D2', 100, 100, '99.5%', 'pass'],
    ['D3', 99, 98.8, '99.4%', 'warning'],
    ['D4', 97, 99, '96.8%', 'warning'],
    ['D5', 97, 97, '98.8%', 'warning'],
    ['D6', 100, 100, '100%', 'pass'],
    ['D7', 99, 97, '96.7%', 'pass'],
    ['D8', null, null, '83.9%', 'fail']
  ];
  dailyValues.forEach(function(values) {
    updateProductionMetric(daily, values[0], values[1], values[2], values[3], values[4]);
  });

  var complaint = sections.find(function(section) { return section.title && section.title.indexOf('客诉分析') === 0; });
  if (complaint) {
    complaint.title = '客诉分析 · 2026年1-9月 (共671件)';
    complaint.byMonth = complaintSummary.byMonth;
    complaint.byLine = [
      { name: '仪器', count: 527, color: '#0EA5E9', risk: '9月34件' },
      { name: '微生物', count: 48, color: '#10B981', risk: '9月7件' },
      { name: '发光', count: 47, color: '#3B82F6', risk: '9月3件' },
      { name: '生化', count: 27, color: '#F59E0B', risk: '9月4件' },
      { name: '荧光PCR', count: 18, color: '#8B5CF6', risk: '9月4件' },
      { name: 'POCT', count: 4, color: '#EC4899', risk: '9月0件' }
    ];
  }

  return data;
}

function updateInstrumentCrossSection(module) {
  var section = findSection(module, '仪器质量 (分机型DOA/FFR)');
  if (!section) return;
  (section.metrics || []).forEach(function(metric) {
    Object.keys(metric.data || {}).forEach(function(model) {
      var row = metric.data[model];
      row.months = row.months || {};
      if (metric.label.indexOf('DOA') === 0) {
        if (model === 'F-i3000' || model === 'F-i1000') row.months['9月'] = 0;
        if (model === 'F-C800P' || model === '药敏') row.months['9月'] = null;
      }
      if (metric.label.indexOf('FFR') === 0) {
        if (model === 'F-i3000' || model === 'F-i1000') row.months['9月'] = 7.0;
        if (model === 'F-C800P' || model === '药敏') row.months['9月'] = null;
      }
      row.months['8月'] = row.months['8月'] === undefined ? null : row.months['8月'];
    });
  });
}

function addSeptemberFaultSection(module) {
  if (!module || (module.sections || []).some(function(section) { return section.title === '仪器故障率（9月）'; })) return;
  var section = {
    title: '仪器故障率（9月）',
    type: 'table',
    months: ['9月'],
    headers: ['指标', '目标', '9月', 'YTD', '说明'],
    rows: [
      { name: '故障率(仪器) 1000', target: '参照历史水平', months: { '9月': 3.66 }, ytd: '3.66%', status: 'warning', desc: '9月3/82' },
      { name: '故障率(仪器) 3000', target: '参照历史水平', months: { '9月': 18.05 }, ytd: '18.05%', status: 'fail', desc: '9月50/277' },
      { name: '故障率(仪器) 800P', target: '参照历史水平', months: { '9月': 22.61 }, ytd: '22.61%', status: 'fail', desc: '9月64/283；附件标识缺少800P数据，需确认' },
      { name: '故障率(仪器) 药敏', target: '参照历史水平', months: { '9月': 5.53 }, ytd: '5.53%', status: 'warning', desc: '9月11/199' }
    ]
  };
  var pms = findModule({ modules: [module] }, 'pms');
  if (!pms) return;
  var insertAt = (module.sections || []).findIndex(function(item) { return item.title === '客诉分析'; });
  if (insertAt < 0) module.sections.push(section);
  else module.sections.splice(insertAt, 0, section);
}

function addDataIssueSection(module) {
  if (!module || (module.sections || []).some(function(section) { return section.title === '9月数据提示'; })) return;
  module.sections.push({
    title: '9月数据提示',
    type: 'list',
    items: dataIssues.map(function(issue) {
      return { issue: issue, line: '数据质量', product: '', status: 'open' };
    })
  });
}

function applyToModules(input) {
  var data = base.applyToModules(input);
  data.updated = '2026-09';
  data.dataSource = 'FDQH_quality_indicators_2026-10-15-少800P数据.xlsx';
  data.dataQualityNotes = dataIssues.slice();

  var qms = findModule(data, 'qms');
  var rd = findModule(data, 'rd');
  var supply = findModule(data, 'supply');
  var mfg = findModule(data, 'mfg');
  var pms = findModule(data, 'pms');

  [qms, rd, supply, mfg, pms].forEach(function(module) {
    if (!module) return;
    (module.sections || []).forEach(function(section) {
      normalizeMonthTableHeaders(section);
      if (section.type === 'table') ensureMonthHeader(section, '9月');
    });
  });

  if (qms) {
    updateSummary(qms, '出货产品合格率', { value: '100%', target: '100%', status: 'pass', desc: '9月100%，YTD100%' });
    updateSummary(qms, 'CAPA按期关闭率', { value: '100%', target: '≥95%', status: 'pass', desc: '9月新增11条，已关闭5条，处理中6条' });
    updateSummary(qms, '体系培训完成课时', { value: '16.8h', target: '≥35h/人/年', status: 'warning', desc: '截至9月累计年人均16.8h' });
    updateTableRow(qms, '考核指标 (KPI)', '抽检合格率', 100, 100, '100%', 'pass', '9月100%');
    updateTableRow(qms, '考核指标 (KPI)', '出货产品合格率', 100, 100, '100%', 'pass', '9月100%');
    updateTableRow(qms, 'CAPA 管理', 'CAPA总数', 6, 11, '45', '', '9月新增11条');
    updateTableRow(qms, 'CAPA 管理', '已关闭', 6, 5, '45', '', '9月关闭5条');
    updateTableRow(qms, 'CAPA 管理', '处理中', 0, 6, '0', '', '9月处理中6条');
    updateTableRow(qms, 'CAPA 管理', '逾期', 0, 0, '0', '', '无逾期');
    updateTableRow(qms, 'CAPA 管理', '按期关闭率', 100, 100, '100%', '', '9月100%');
    updateTableRow(qms, '观察指标 (Monitoring)', '体系培训完成课时', 14.1, 16.8, '16.8h/人/年', 'warning', '截至9月累计年人均16.8h');
    updateTableRow(qms, '观察指标 (Monitoring)', '培训认证覆盖率', 100, 100, '100%', 'pass', '上海57、长沙25、泰州14');
  }

  if (rd) {
    updateTableRow(rd, '新产品导入质量 (DOA/FFR)', 'DOA到货缺陷率', 0, 0, '8.5%', 'fail', '9月0%；800P数据仍需确认');
    updateTableRow(rd, '新产品导入质量 (DOA/FFR)', 'FFR月度维修率', 8.5, null, '8.0%', 'warning', '9月缺少800P/药敏仪完整FFR');
  }

  if (supply) {
    updateSummary(supply, '原料合格率(试剂)', { value: '99.5%', target: '≥99.3%', status: 'pass', desc: 'YTD，9月100%' });
    updateSummary(supply, '原料合格率(仪器)', { value: '99.4%', target: '≥98.5%', status: 'pass', desc: 'YTD，8月99%，9月98.8%' });
    updateSummary(supply, '包材合格率', { value: '99.3%', target: '≥98.8%', status: 'warning', desc: 'YTD，8月98%，9月96%' });
    updateSummary(supply, '入库及时率', { value: '99.82%', target: '≥99.5%', status: 'warning', desc: '9月99.82%' });
    updateTableRow(supply, '考核指标 (KPI)', '上线不良率(仪器)', 90, 151, '--', 'na', '9月151ppm（15/99112）');
    updateTableRow(supply, '考核指标 (KPI)', '供应商CAPA按时关闭率', 76, 70, '75%', 'warning', '9月70%（23/33）');
    updateTableRow(supply, 'IQC来料检验', '仪器-原辅料合格率', 99, 98.8, '99.4%', 'warning', '8月修正为99%，9月98.8%');
    updateTableRow(supply, 'IQC来料检验', '包材合格率', 98, 96, '99.3%', 'warning', '9月96%');
    updateTableRow(supply, 'IQC来料检验', '试剂-原辅料合格率', 100, 100, '99.5%', 'pass', '9月100%');
    updateTableRow(supply, '观察指标 (Monitoring)', '供应商年度审核完成率', 57.14, 57.14, '57.14%', 'warning', '9月8/14');
    updateTableRow(supply, '仓储物流KPI (长沙工厂)', '入库及时率', 100, 99.82, '99.82%', 'warning', '9月99.82%');
    updateTableRow(supply, '仓储物流KPI (长沙工厂)', '出库及时率', 100, 100, '100%', 'pass', '9月100%');
    updateTableRow(supply, '仓储物流KPI (长沙工厂)', '领料及时率', 98.60, 98.28, '98.28%', 'warning', '9月98.28%');
    updateTableRow(supply, '仓储物流KPI (长沙工厂)', '48小时发货率', 99.6, 99.41, '99.41%', 'pass', '9月99.41%');
    updateTableRow(supply, '仓储物流KPI (长沙工厂)', '发货准确性', 100, 100, '100%', 'pass', '9月100%');
  }

  if (mfg) {
    updateSummary(mfg, '半成品合格率', { value: '96.8%', target: '≥98%', status: 'warning', desc: 'YTD，8月97%，9月99%' });
    updateSummary(mfg, '成品合格率(试剂)', { value: '98.8%', target: '≥99%', status: 'warning', desc: 'YTD，8月97%，9月97%' });
    updateSummary(mfg, '批记录合格率', { value: '96.7%', target: '≥95%', status: 'pass', desc: 'YTD，8月99%，9月97%' });
    updateSummary(mfg, 'DOA Overall', { value: '8.1%', target: '≤8%', status: 'warning', desc: 'YTD，8月0%，9月7.1%' });
    updateTableRow(mfg, '过程检验 & 成品 (月度)', '半成品合格率(试剂)', 97, 99, '96.8%', 'warning', '9月99%');
    updateTableRow(mfg, '过程检验 & 成品 (月度)', '成品合格率(试剂)', 97, 97, '98.8%', 'warning', '9月97%');
    updateTableRow(mfg, '过程检验 & 成品 (月度)', '成品合格率(仪器)', 100, 100, '100%', 'pass', '9月100%');
    updateTableRow(mfg, '过程检验 & 成品 (月度)', '批记录合格率', 99, 97, '96.7%', 'warning', '9月97%');
    [
      ['半成品-发光', 100, 100, '100%', 'pass'],
      ['半成品-微生物', 84, 72, '86%', 'fail'],
      ['半成品-分子', 100, 100, '100%', 'pass'],
      ['半成品-生化', 98, 98, '98%', 'pass'],
      ['成品-发光', 97, 83, '97.3%', 'fail'],
      ['成品-微生物', 86, 100, '94%', 'pass'],
      ['成品-分子', 100, 100, '98.7%', 'pass'],
      ['成品-生化', 100, 100, '99.9%', 'pass']
    ].forEach(function(values) {
      updateTableRow(mfg, '试剂一次通过率 (周数据)', values[0], values[1], values[2], values[3], values[4], values[0] + '：8月 ' + values[1] + '%，9月 ' + values[2] + '%');
    });
    updateInstrumentCrossSection(mfg);
  }

  if (pms) {
    updateSummary(pms, '客诉总数', { value: complaintSummary.total + '件', target: '≤50件/半年', status: 'warning', desc: '9月58件，试剂24 / 仪器34' });
    updateSummary(pms, '试剂市场缺陷率', { value: '7.3%', target: '≤2.5%', status: 'fail', desc: '9月7.3%，YTD 2.4%' });
    updateSummary(pms, 'EQA合格率', { value: '100%', target: '100%', status: 'pass', desc: '9月18/18；源表数值90疑似错误' });
    updateSummary(pms, '到货缺陷率DOA', { value: '7.1%', target: '≤5%(新标)', status: 'fail', desc: '9月7.1%，YTD 8.1%' });
    updateTableRow(pms, '考核指标 (KPI)', '室间质评EQA合格率', '10/11 90', '18/18 100', '100%', 'pass', '9月18/18；源表数值栏写90');
    updateTableRow(pms, '试剂市场缺陷率 (月度)', 'Overall缺陷率', 3.4, 7.3, '2.4%', 'fail', '9月7.3%');
    updateTableRow(pms, '试剂市场缺陷率 (月度)', '发光条线', 3.4, 7.3, '4.9%', 'fail', '9月7.3%');
    updateTableRow(pms, '试剂市场缺陷率 (月度)', '生化条线', 1.3, 4.0, '1.0%', 'fail', '9月4.0%');
    updateTableRow(pms, '试剂市场缺陷率 (月度)', '分子条线', 20.0, 36.4, '6.3%', 'fail', '9月36.4%');
    updateTableRow(pms, '仪器上市后质量 (月度)', '仪器总FFR', 9.2, null, '8.3%', 'fail', '9月缺少800P完整数据');
    updateTableRow(pms, '仪器上市后质量 (月度)', '仪器到货缺陷率(DOA)', 0, 7.1, '8.1%', 'fail', '9月7.1%');
    updateTableRow(pms, '仪器上市后质量 (月度)', 'DOA到货缺陷率（1000、3000）', 0, 0, '8.5%', 'fail', '9月0%');
    updateTableRow(pms, '仪器上市后质量 (月度)', 'FFR月度维修率（1000、3000）', 10.1, 7.0, '8.0%', 'warning', '9月7.0%');
    updateTableRow(pms, '客诉月度趋势', '客诉总数（试剂）', 10, 24, '120件', 'warning', '9月24件；与条线合计存在差异');
    updateTableRow(pms, '客诉月度趋势', '发光', 2, 3, '29', 'fail', '9月3件');
    updateTableRow(pms, '客诉月度趋势', '微生物', 2, 7, '40', 'warning', '9月7件');
    updateTableRow(pms, '客诉月度趋势', '生化', 1, 4, '20', 'warning', '9月4件');
    updateTableRow(pms, '客诉月度趋势', '荧光PCR', 2, 4, '5', 'warning', '9月4件');
    updateTableRow(pms, '客诉月度趋势', 'POCT', 1, 0, '4', 'pass', '9月0件');
    updateTableRow(pms, '观察指标 (Monitoring) — 客服/可靠性', '零星客户投诉率PPM（试剂）', 68, 14, '', 'info', '9月14ppm');
    updateTableRow(pms, '观察指标 (Monitoring) — 客服/可靠性', '批量客户投诉占比', '1.6%', '5.9%', '', 'warning', '9月5.9%');
    addSeptemberFaultSection(pms);
    addDataIssueSection(pms);
  }

  [qms, rd, supply, mfg, pms].forEach(function(module) {
    if (!module) return;
    (module.sections || []).forEach(normalizeMonthTableHeaders);
  });

  return data;
}

function applyToKpis(data) {
  Object.assign(data, kpis);
  return data;
}

module.exports = {
  month: '9月',
  months: MONTHS,
  sourceFile: 'FDQH_quality_indicators_2026-10-15-少800P数据.xlsx',
  complaintSummary: complaintSummary,
  kpis: kpis,
  capaSummary: base.capaSummary,
  dataIssues: dataIssues,
  applyToBowling: applyToBowling,
  applyToProduction: applyToProduction,
  applyToModules: applyToModules,
  applyToKpis: applyToKpis
};
