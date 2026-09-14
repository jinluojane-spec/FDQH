// 2026年8月质量指标覆盖数据
// 来源: raw/质量指标202608.xlsx

var MONTH = '8月';

var complaintSummary = {
  total: 613,
  period: '2026年1-8月',
  sourceFile: '质量管理保龄球图-202608(1).xlsx',
  detailTotal: 590,
  detailReagent: 120,
  detailInstrument: 470,
  missingDetail: 23,
  augustSummary: 48,
  augustDetail: 25,
  byMonth: { '1月': 126, '2月': 66, '3月': 66, '4月': 66, '5月': 70, '6月': 65, '7月': 106, '8月': 48 },
  byLine: { '仪器': 493, '微生物': 40, '发光': 42, '生化': 22, '荧光PCR': 12, 'POCT': 4 },
  augustByLine: { '试剂': 10, '仪器': 38 }
};

var kpis = {
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
  complaintCountYTD: 613,
  complaintsByLine: { '仪器': 493, '微生物': 40, '发光': 42, '生化': 22, '荧光PCR': 12, 'POCT': 4 }
};

var capaSummary = {
  total: 45,
  closed: 45,
  processing: 0,
  overdue: 0,
  onTimeRate: 100
};

var overviewStrategic = {
  '8': {
    plan: 8,
    actual: 0,
    ytd: 8.1,
    trend: 'down',
    drilldown: [
      { value: 0, ytd: 8.5, status: 'fail' },
      { value: 0, ytd: 8.5, status: 'fail' }
    ]
  },
  '9': {
    plan: 8,
    actual: 9.2,
    ytd: 8.3,
    trend: 'up',
    drilldown: [
      { value: 8.5, ytd: 8.0, status: 'warning' },
      { value: 10.1, ytd: 8.0, status: 'warning' }
    ]
  },
  '10': {
    plan: 2.5,
    actual: 3.4,
    ytd: 2.4,
    trend: 'up',
    drilldown: [
      { value: 3.4, ytd: 4.9, status: 'fail', alert: true },
      { value: 1.3, ytd: 1.0, status: 'fail', alert: true },
      { value: 20.0, ytd: 6.3, status: 'fail', alert: true },
      { value: null, ytd: null, status: 'na' },
      { value: null, ytd: 0, status: 'pass' }
    ]
  }
};

var overviewDaily = {
  D1: { target: 98.8, ytd: 99.3, value: 98, status: 'warning' },
  D2: { target: 99.3, ytd: 99.5, value: 100, status: 'pass' },
  D3: { ytd: 96.8, value: 97, status: 'warning' },
  D4: { ytd: 98.8, value: 97, status: 'warning' },
  D5: { ytd: 96.7, value: 99, status: 'pass' }
};

var moduleSummary = {
  qms: {
    '出货产品合格率': { label: '成品合格率(试剂)', value: '98.8%', target: '≥99%', status: 'warning', desc: '8月97%' },
    'CAPA按期关闭率': { value: '100%', target: '≥95%', status: 'pass', desc: '8月按期完成率100%' },
    '客诉闭环率': { value: '--', target: '≥95%', status: 'na', desc: '半年度指标，8月无闭环明细' },
    '不良事件数': { value: '1', target: '0', status: 'fail', desc: 'PA方法学差异，建议研发改进' },
    '市场投诉': { value: '2件', target: '0件', status: 'fail', desc: '8月市场投诉指标' }
  },
  rd: {
    '项目质量达成率': { value: '92%', target: '≥90%', status: 'pass', desc: 'YTD 92%' },
    '新品DOA': { value: '8.5%', target: '≤8%', status: 'fail', desc: '新品DOA YTD' },
    '新品FFR': { value: '8.0%', target: '≤8%', status: 'warning', desc: '新品FFR YTD' }
  },
  supply: {
    '原料合格率(试剂)': { value: '99.5%', target: '≥99.3%', status: 'pass', desc: 'YTD，8月100%' },
    '原料合格率(仪器)': { value: '99.4%', target: '≥98.5%', status: 'pass', desc: 'YTD，8月99%' },
    '包材合格率': { value: '99.3%', target: '≥98.8%', status: 'warning', desc: 'YTD，8月98%' },
    '入库及时率': { value: '100%', target: '≥99.5%', status: 'pass', desc: '8月100%' }
  },
  mfg: {
    '半成品合格率': { value: '96.8%', target: '≥98%', status: 'warning', desc: 'YTD，8月97%' },
    '成品合格率(试剂)': { value: '98.8%', target: '≥99%', status: 'warning', desc: 'YTD，8月97%' },
    '批记录合格率': { value: '96.7%', target: '≥95%', status: 'pass', desc: 'YTD，8月99%' },
    'DOA Overall': { value: '8.1%', target: '≤8%', status: 'warning', desc: '整体到货缺陷率 YTD' }
  },
  pms: {
    '客诉总数': { label: '客诉总数(1-8月)', value: '613件', target: '≤50件/半年', status: 'warning', desc: '8月48件，试剂10 / 仪器38' },
    '试剂市场缺陷率': { value: '3.4%', target: '≤2.5%', status: 'fail', desc: '8月3.4%，YTD 2.4%' },
    'EQA合格率': { value: '100%', target: '100%', status: 'pass', desc: '8月90%（10/11）' },
    '到货缺陷率DOA': { value: '8.1%', target: '≤5%(新标)', status: 'fail', desc: '8月0%，YTD 8.1%' }
  }
};

var moduleRows = {
  'qms|考核指标 (KPI)|出货产品合格率': {
    name: '成品合格率(试剂)',
    target: '≥99%',
    month: 97,
    ytd: '98.8%',
    status: 'warning',
    desc: '8月97% 合格批次/总批次'
  },
  'qms|考核指标 (KPI)|不良事件按时报告率': {
    ytd: '100%',
    status: 'pass'
  },
  'qms|考核指标 (KPI)|无重大缺陷率(外部审计)': {
    month: 100,
    ytd: '100%',
    status: 'pass',
    desc: '外部审计重大缺陷数，8月100%'
  },
  'qms|观察指标 (Monitoring)|无重大缺陷率(外部审计)': {
    month: 100,
    ytd: '100%',
    status: 'pass',
    desc: '外部审计重大缺陷数，8月100%'
  },
  'qms|观察指标 (Monitoring)|体系培训完成课时': {
    target: '≥35h/人/年',
    months: { '3月': 4.5, '5月': 5.2, '6月': 8.6, '7月': 10.5, '8月': 14.1 },
    ytd: '14.1h/人/年',
    status: 'na',
    desc: '截至8月累计年人均质量培训课时'
  },
  'qms|观察指标 (Monitoring)|培训认证覆盖率': {
    target: '100%',
    month: 100,
    ytd: '100%',
    status: 'pass',
    desc: '上海、长沙、泰州培训计划执行'
  },

  'rd|新产品导入质量 (DOA/FFR)|DOA到货缺陷率': {
    month: 0,
    ytd: '8.5%',
    status: 'fail',
    direction: 'lt',
    desc: '8月0%，YTD 8.5%'
  },
  'rd|新产品导入质量 (DOA/FFR)|FFR月度维修率': {
    month: 8.5,
    ytd: '8.0%',
    status: 'warning',
    direction: 'lt',
    desc: '8月8.5%，YTD 8.0%'
  },

  'supply|考核指标 (KPI)|原料不合格率(试剂)': {
    month: 0,
    ytd: '0.5%',
    status: 'pass',
    desc: '8月合格率100%'
  },
  'supply|考核指标 (KPI)|仪器物料不良率(M4后)': {
    month: 1,
    ytd: '0.6%',
    status: 'pass',
    desc: '8月合格率99%'
  },
  'supply|考核指标 (KPI)|上线不良率(仪器)': {
    month: 90,
    ytd: '--',
    status: 'na',
    desc: '8月19/211311（90ppm）'
  },
  'supply|考核指标 (KPI)|供应商CAPA按时关闭率': {
    month: 76,
    ytd: '75%',
    status: 'warning',
    desc: '8月16/21（76%）'
  },
  'supply|观察指标 (Monitoring)|供应商年度审核完成率': {
    month: 57.14,
    ytd: '57.14%',
    status: 'warning',
    desc: '8月8/14'
  },
  'supply|观察指标 (Monitoring)|供应商优化率': {
    month: 16.5,
    ytd: '16.5%',
    status: 'pass',
    desc: '8月20/121'
  },

  'mfg|过程检验 & 成品 (月度)|半成品合格率(试剂)': {
    month: 97,
    ytd: '96.8%',
    status: 'warning',
    desc: '8月97%'
  },
  'mfg|过程检验 & 成品 (月度)|原料检验合格率(试剂)': {
    month: 100,
    ytd: '99.5%',
    status: 'pass',
    desc: '8月100%'
  },
  'mfg|过程检验 & 成品 (月度)|成品合格率(试剂)': {
    month: 97,
    ytd: '98.8%',
    status: 'warning',
    desc: '8月97%'
  },
  'mfg|过程检验 & 成品 (月度)|成品合格率(仪器)': {
    month: 100,
    ytd: '100%',
    status: 'pass'
  },
  'mfg|过程检验 & 成品 (月度)|批记录合格率': {
    month: 99,
    ytd: '96.7%',
    status: 'pass',
    desc: '8月99%'
  },
  'mfg|过程检验 & 成品 (月度)|稳定性检测完成率': {
    month: null,
    ytd: '83.9%',
    status: 'fail'
  },
  'mfg|试剂一次通过率 (周数据)|半成品-发光': { month: 100, ytd: '100%', status: 'pass' },
  'mfg|试剂一次通过率 (周数据)|半成品-微生物': { month: 84, ytd: '86%', status: 'warning' },
  'mfg|试剂一次通过率 (周数据)|半成品-分子': { month: 100, ytd: '100%', status: 'pass' },
  'mfg|试剂一次通过率 (周数据)|半成品-生化': { month: 98, ytd: '98%', status: 'pass' },
  'mfg|试剂一次通过率 (周数据)|成品-发光': { month: 97, ytd: '97.3%', status: 'pass' },
  'mfg|试剂一次通过率 (周数据)|成品-微生物': { month: 86, ytd: '94%', status: 'pass' },
  'mfg|试剂一次通过率 (周数据)|成品-分子': { month: 100, ytd: '98.7%', status: 'pass' },
  'mfg|试剂一次通过率 (周数据)|成品-生化': { month: 100, ytd: '99.9%', status: 'pass' },

  'pms|考核指标 (KPI)|室间质评EQA合格率': {
    month: 90,
    ytd: '100%',
    status: 'pass',
    desc: '8月10/11；8月EBV不合格'
  },
  'pms|考核指标 (KPI)|客诉例数(试剂)': {
    months: { '1月': 21, '2月': 8, '3月': 18, '4月': 13, '5月': 21, '6月': 9, '7月': 20, '8月': 10 },
    ytd: '120件',
    status: 'warning',
    desc: '1-8月试剂客诉累计'
  },
  'pms|试剂市场缺陷率 (月度)|Overall缺陷率': { month: 3.4, ytd: '2.4%', status: 'fail', direction: 'lt', desc: '8月3.4%' },
  'pms|试剂市场缺陷率 (月度)|发光条线': { month: 3.4, ytd: '4.9%', status: 'fail', direction: 'lt', desc: '8月3.4%' },
  'pms|试剂市场缺陷率 (月度)|生化条线': { month: 1.3, ytd: '1.0%', status: 'fail', direction: 'lt', desc: '8月1.3%' },
  'pms|试剂市场缺陷率 (月度)|分子条线': { month: 20, ytd: '6.3%', status: 'fail', direction: 'lt', desc: '8月20%' },
  'pms|仪器上市后质量 (月度)|仪器总FFR': { month: 9.2, ytd: '8.3%', status: 'fail', direction: 'lt', desc: '8月9.2%' },
  'pms|仪器上市后质量 (月度)|仪器到货缺陷率(DOA)': { month: 0, ytd: '8.1%', status: 'fail', direction: 'lt', desc: '8月0%' },
  'pms|客诉月度趋势|客诉总数': {
    months: { '1月': 126, '2月': 66, '3月': 66, '4月': 66, '5月': 70, '6月': 65, '7月': 106, '8月': 48 },
    ytd: '613件',
    status: 'warning',
    desc: '8月48件，试剂10 / 仪器38'
  },
  'pms|客诉月度趋势|发光': { months: { '8月': 2 }, ytd: '42件', status: 'fail' },
  'pms|客诉月度趋势|微生物': { months: { '8月': 2 }, ytd: '40件', status: 'warning' },
  'pms|客诉月度趋势|生化': { months: { '8月': 1 }, ytd: '22件', status: 'pass' },
  'pms|客诉月度趋势|荧光PCR': { months: { '8月': 2 }, ytd: '12件', status: 'pass' },
  'pms|客诉月度趋势|POCT': { months: { '8月': 1 }, ytd: '4件', status: 'pass' }
};

var productionRows = {
  '战略解码 · 仪器试剂核心质量指标|DOA': { month: { plan: 8, actual: 0 }, ytd: '8.1%', status: 'fail' },
  '战略解码 · 仪器试剂核心质量指标|DOA-N': { month: 0, ytd: '8.5%', status: 'fail' },
  '战略解码 · 仪器试剂核心质量指标|DOA-M': { month: 0, ytd: '8.5%', status: 'fail' },
  '战略解码 · 仪器试剂核心质量指标|FFR': { month: { plan: 8, actual: 9.2 }, ytd: '8.3%', status: 'fail' },
  '战略解码 · 仪器试剂核心质量指标|FFR-N': { month: 8.5, ytd: '8.0%', status: 'warning' },
  '战略解码 · 仪器试剂核心质量指标|FFR-M': { month: 10.1, ytd: '8.0%', status: 'warning' },
  '战略解码 · 仪器试剂核心质量指标|DEFECT': { month: { plan: 2.5, actual: 3.4 }, ytd: '2.4%', status: 'fail' },
  '战略解码 · 仪器试剂核心质量指标|DEF-CLIA': { month: 3.4, ytd: '4.9%', status: 'fail' },
  '战略解码 · 仪器试剂核心质量指标|DEF-BIO': { month: 1.3, ytd: '1.0%', status: 'fail' },
  '战略解码 · 仪器试剂核心质量指标|DEF-MOL': { month: 20, ytd: '6.3%', status: 'fail' },
  '日常检验 · 全过程质量控制指标|D1': { month: 98, ytd: '99.3%', status: 'warning' },
  '日常检验 · 全过程质量控制指标|D2': { month: 100, ytd: '99.5%', status: 'pass' },
  '日常检验 · 全过程质量控制指标|D3': { month: 100, ytd: '99.4%', status: 'pass' },
  '日常检验 · 全过程质量控制指标|D4': { month: 97, ytd: '96.8%', status: 'warning' },
  '日常检验 · 全过程质量控制指标|D5': { month: 97, ytd: '98.8%', status: 'warning' },
  '日常检验 · 全过程质量控制指标|D6': { month: 100, ytd: '100%', status: 'pass' },
  '日常检验 · 全过程质量控制指标|D7': { month: 99, ytd: '96.7%', status: 'pass' },
  '日常检验 · 全过程质量控制指标|D8': { month: null, ytd: '83.9%', status: 'fail' }
};

function applyRow(row, override) {
  if (!row || !override) return;
  if (override.name !== undefined) row.name = override.name;
  if (override.label !== undefined) row.label = override.label;
  if (override.target !== undefined) row.target = override.target;
  if (override.ytd !== undefined) row.ytd = override.ytd;
  if (override.status !== undefined) row.status = override.status;
  if (override.desc !== undefined) row.desc = override.desc;
  if (override.note !== undefined) row.note = override.note;
  if (override.direction !== undefined) row.direction = override.direction;
  if (override.collapsed !== undefined) row.collapsed = override.collapsed;
  if (override.months !== undefined) row.months = Object.assign({}, row.months || {}, override.months);
  if (override.month !== undefined) row.months = Object.assign({}, row.months || {}, { '8月': override.month });
}

function applyRows(rows, overrides, prefix) {
  (rows || []).forEach(function(row) {
    var key = row.id || row.name || row.label;
    applyRow(row, overrides[prefix ? prefix + '|' + key : key]);
    if (row.children) applyRows(row.children, overrides, prefix);
  });
}

function ensureAugustHeader(section) {
  if (!section || !section.headers) return;
  var ytd = section.headers.indexOf('YTD');
  var total = section.headers.indexOf('合计');
  var insertAt = ytd >= 0 ? ytd : total;
  if (insertAt >= 0 && section.headers.indexOf(MONTH) < 0) section.headers.splice(insertAt, 0, MONTH);
}

function applyToBowling(data) {
  if (!data) return data;
  (data.strategic || []).forEach(function(row) {
    var o = overviewStrategic[row.id];
    if (!o) return;
    row.ytd = o.ytd;
    row.trend = o.trend;
    row.months.push({
      month: MONTH,
      plan: o.plan,
      actual: o.actual,
      status: o.actual <= o.plan ? 'pass' : 'fail'
    });
    (row.drilldown || []).forEach(function(child, index) {
      var c = o.drilldown[index];
      if (!c) return;
      child.months.push(c.value);
      child.ytd = c.ytd;
      child.status = c.status;
      if (c.alert !== undefined) child.alert = c.alert;
    });
  });
  (data.daily || []).forEach(function(row) {
    var o = overviewDaily[row.id];
    if (!o) return;
    if (o.target !== undefined) row.target = o.target;
    row.months.push(o.value);
    row.ytd = o.ytd;
    row.status = o.status;
  });
  data.complaintStats = Object.assign({}, data.complaintStats, complaintSummary);
  data.updated = '2026-08';
  data.dataSource = '质量指标202608.xlsx';
  return data;
}

function applyToProduction(data) {
  if (!data) return data;
  (data.sections || []).forEach(function(section) {
    ensureAugustHeader(section);
    applyRows(section.rows || section.metrics, productionRows, section.title);
  });
  var complaint = (data.sections || []).find(function(section) { return section.title && section.title.indexOf('客诉分析') === 0; });
  if (complaint) {
    complaint.title = '客诉分析 · 2026年1-8月 (共613件)';
    complaint.byMonth = complaintSummary.byMonth;
    complaint.byLine = [
      { name: '仪器', count: 493, color: '#0EA5E9', risk: '8月38件' },
      { name: '发光', count: 42, color: '#3B82F6', risk: '8月2件' },
      { name: '微生物', count: 40, color: '#10B981', risk: '8月2件' },
      { name: '生化', count: 22, color: '#F59E0B', risk: '8月1件' },
      { name: '荧光PCR', count: 12, color: '#8B5CF6', risk: '8月2件' },
      { name: 'POCT', count: 4, color: '#EC4899', risk: '8月1件' }
    ];
  }
  data.updated = '2026-08';
  data.dataSource = '质量指标202608.xlsx';
  return data;
}

function applyToModules(data) {
  if (!data || !data.modules) return data;
  data.modules.forEach(function(mod) {
    var summaries = moduleSummary[mod.id] || {};
    (mod.summary || []).forEach(function(item) {
      var o = summaries[item.label] || summaries[item.label.replace(/\(1-\d+月\)/, '')];
      if (o) Object.assign(item, o);
    });
    if (mod.id === 'qms' && !mod.summary.some(function(item) { return item.label === '市场投诉'; })) {
      mod.summary.push({ label: '市场投诉', value: '2件', target: '0件', status: 'fail', desc: '8月市场投诉指标' });
    }
    (mod.sections || []).forEach(function(section) {
      ensureAugustHeader(section);
      if (section.type === 'table') {
        applyRows(section.rows, moduleRows, mod.id + '|' + section.title);
        if (mod.id === 'qms' && section.title === '考核指标 (KPI)' && !section.rows.some(function(row) { return row.name === '抽检合格率'; })) {
          section.rows.unshift({
            name: '抽检合格率',
            target: '100%',
            months: { '7月': 100, '8月': 100 },
            ytd: '100%',
            status: 'warning',
            desc: '市场抽检、监督抽样检查和召回计算，8月100%'
          });
        }
        if (mod.id === 'qms' && section.title === '考核指标 (KPI)') {
          [
            { name: '不良事件数', target: '0件', months: { '8月': 1 }, ytd: '1件', status: 'fail', desc: 'PA方法学差异，建议研发改进' },
            { name: '市场投诉', target: '0件', months: { '8月': 2 }, ytd: '2件', status: 'fail', desc: '8月市场投诉指标' }
          ].forEach(function(row) {
            if (!section.rows.some(function(existing) { return existing.name === row.name; })) section.rows.push(row);
          });
        }
      } else if (section.type === 'cross' && mod.id === 'mfg' && section.title === '仪器质量 (分机型DOA/FFR)') {
        section.metrics.forEach(function(metric) {
          Object.keys(metric.data || {}).forEach(function(model) {
            metric.data[model].months = metric.data[model].months || {};
            if (metric.label.indexOf('DOA') === 0) metric.data[model].months[MONTH] = 0;
            if (metric.label.indexOf('FFR') === 0 && (model === 'F-i3000' || model === 'F-i1000')) metric.data[model].months[MONTH] = 10.1;
          });
        });
      }
      if (section.type === 'summary') {
        if (mod.id === 'qms' && section.title === 'CAPA 管理') {
          section.items = [
            { label: 'CAPA总数', value: capaSummary.total, color: '#3B82F6' },
            { label: '已关闭', value: capaSummary.closed, color: '#10B981' },
            { label: '处理中', value: capaSummary.processing, color: '#F59E0B' },
            { label: '逾期', value: capaSummary.overdue, color: '#EF4444' },
            { label: '按期关闭率', value: capaSummary.onTimeRate + '%', color: '#059669' }
          ];
        }
        if (mod.id === 'supply' && section.title === '仓储物流KPI (长沙工厂)') {
          section.items = [
            { label: '入库及时率', value: '100%', color: '#10B981' },
            { label: '出库及时率', value: '100%', color: '#10B981' },
            { label: '领料及时率', value: '98.64%', color: '#D97706' },
            { label: '48小时发货率', value: '99.55% (8月)', color: '#10B981' },
            { label: '发货准确性', value: '100% (8月)', color: '#10B981' }
          ];
        }
      }
    });
    if (mod.id === 'pms' && !mod.sections.some(function(section) { return section.title === '仪器故障率（8月）'; })) {
      mod.sections.splice(mod.sections.length - 1, 0, {
        title: '仪器故障率（8月）',
        type: 'table',
        months: [MONTH],
        headers: ['指标', '目标', MONTH, 'YTD', '说明'],
        rows: [
          { name: '故障率(仪器) 1000', target: '参照历史水平', months: { '8月': 6.2 }, ytd: '6.2%', status: 'fail', desc: '8月5/81' },
          { name: '故障率(仪器) 3000', target: '参照历史水平', months: { '8月': 24.2 }, ytd: '24.2%', status: 'fail', desc: '8月67/277' },
          { name: '故障率(仪器) 800P', target: '参照历史水平', months: { '8月': 28.4 }, ytd: '28.4%', status: 'fail', desc: '8月77/271' },
          { name: '故障率(仪器) 药敏', target: '参照历史水平', months: { '8月': 6.1 }, ytd: '6.1%', status: 'fail', desc: '8月12/198' }
        ]
      });
    }
  });
  data.updated = '2026-08';
  data.dataSource = '质量指标202608.xlsx';
  return data;
}

module.exports = {
  month: MONTH,
  sourceFile: '质量指标202608.xlsx',
  complaintSummary: complaintSummary,
  kpis: kpis,
  capaSummary: capaSummary,
  applyToBowling: applyToBowling,
  applyToProduction: applyToProduction,
  applyToModules: applyToModules
};
