const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/import-aftersales-focus.js <workbook.xlsx>');
  process.exit(1);
}

const workbook = XLSX.readFile(inputPath, { cellDates: true });
const productRows = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1'], {
  header: 1,
  raw: false,
  defval: ''
});
const instrumentRows = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet2'], {
  header: 1,
  raw: false,
  defval: ''
});

function text(value) {
  return value === undefined || value === null ? '' : String(value).replace(/\s+/g, ' ').trim();
}

function combine(values) {
  return values.map(text).filter(function(value) { return value && value !== '/'; }).join(' ');
}

function statusFrom(textValue) {
  if (/已关闭|无需措施|已完成|已导入/.test(textValue)) return 'Closed';
  return 'In Progress';
}

const records = [];

productRows.slice(2).forEach(function(row) {
  const serial = text(row[0]);
  const description = text(row[1]);
  const productName = text(row[2]);
  const productCategory = text(row[4]);
  if (!serial || !description || !productName) return;

  const rootCause = combine([row[6], row[9]]);
  const actionProgress = combine([row[7], row[10], row[12], row[14], row[16], row[18]]);
  records.push({
    id: `AS-${String(records.length + 1).padStart(4, '0')}`,
    source: '售后',
    record_type: '重点客诉分析',
    serial: serial,
    product_name: productName,
    product_category: productCategory || '未分类',
    description: description,
    root_cause: rootCause,
    action_progress: actionProgress,
    status: statusFrom(rootCause + ' ' + actionProgress),
    risk_level: /假阳|稳定性差|线性低|失控|故障|异常|风险/.test(description) ? 'High' : 'Medium'
  });
});

const instrumentStart = records.length;
instrumentRows.slice(1).forEach(function(row) {
  const model = text(row[0]);
  const description = text(row[1]);
  const rootCause = text(row[2]);
  const actionProgress = text(row[3]);
  if (!model || !description) return;

  records.push({
    id: `ASI-${String(records.length - instrumentStart + 1).padStart(4, '0')}`,
    source: '售后',
    record_type: '仪器专项分析',
    serial: '',
    product_name: model,
    product_category: '仪器专项',
    description: description,
    root_cause: rootCause,
    action_progress: actionProgress,
    status: statusFrom(rootCause + ' ' + actionProgress),
    risk_level: /故障|风险|异常|突入/.test(description + ' ' + actionProgress) ? 'High' : 'Medium'
  });
});

const byCategory = {};
const byStatus = {};
const byProduct = {};
records.forEach(function(record) {
  byCategory[record.product_category] = (byCategory[record.product_category] || 0) + 1;
  byStatus[record.status] = (byStatus[record.status] || 0) + 1;
  byProduct[record.product_name] = (byProduct[record.product_name] || 0) + 1;
});

const output = {
  updated: '2026-09-11',
  source: '售后',
  sourceFile: path.basename(inputPath),
  summary: {
    total: records.length,
    productAnalysis: productRows.slice(2).filter(function(row) {
      return text(row[1]) && text(row[2]) && text(row[3]);
    }).length,
    instrumentAnalysis: instrumentStart === records.length ? 0 : records.length - instrumentStart,
    inProgress: byStatus['In Progress'] || 0,
    closed: byStatus['Closed'] || 0
  },
  byCategory: byCategory,
  byStatus: byStatus,
  topProducts: Object.keys(byProduct).map(function(name) {
    return { name: name, count: byProduct[name] };
  }).sort(function(a, b) { return b.count - a.count; }).slice(0, 12),
  records: records
};

const outputPath = path.join(__dirname, '..', 'data', 'aftersales_focus_20260911.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

console.log(JSON.stringify({
  total: output.summary.total,
  productAnalysis: output.summary.productAnalysis,
  instrumentAnalysis: output.summary.instrumentAnalysis,
  inProgress: output.summary.inProgress,
  closed: output.summary.closed,
  categories: byCategory,
  output: outputPath
}, null, 2));
