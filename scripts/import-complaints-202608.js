const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/import-complaints-202608.js <workbook.xlsx>');
  process.exit(1);
}

const workbook = XLSX.readFile(inputPath, { cellDates: true });
const reagentRows = XLSX.utils.sheet_to_json(workbook.Sheets['试剂投诉汇总'], {
  header: 1,
  raw: false,
  defval: ''
});
const instrumentRows = XLSX.utils.sheet_to_json(workbook.Sheets['仪器投诉汇总'], {
  header: 1,
  raw: false,
  defval: ''
});

function text(value) {
  return value === undefined || value === null ? '' : String(value).replace(/\s+/g, ' ').trim();
}

function dateText(value) {
  const valueText = text(value);
  if (!valueText) return '';
  const match = valueText.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (!match) return valueText;
  return `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`;
}

function normalizeReagentCause(value) {
  const cause = text(value);
  if (cause.includes('设计')) return '设计问题';
  if (cause.includes('物料')) return '物料问题';
  if (cause.includes('工艺')) return '工艺问题';
  if (cause.includes('生产')) return '生产问题';
  if (cause.includes('非质量')) return '非质量问题';
  return cause || '其他问题';
}

function normalizeInstrumentCause(value) {
  const cause = text(value);
  if (cause.includes('设计')) return '设计问题';
  if (cause.includes('物料')) return '物料问题';
  if (cause.includes('程序') || cause.includes('软件')) return '软件问题';
  if (cause.includes('人员')) return '人员问题';
  return cause || '其他问题';
}

const details = [];

reagentRows.slice(1).forEach(function(row) {
  const month = text(row[1]);
  const date = dateText(row[2]);
  const processId = text(row[3]);
  const productLine = text(row[4]);
  const productName = text(row[6]);
  const batchNo = text(row[7]);
  const description = text(row[8]);
  const cause = normalizeReagentCause(row[9]);
  if (!month || !productName || !description) return;

  details.push({
    id: `CPT${String(details.length + 1).padStart(4, '0')}`,
    event_type: 'Complaint',
    risk_level: 'Medium',
    product_name: productName,
    batch_no: batchNo,
    description: `【${cause}】${description}`,
    complaint_source: `试剂投诉-${productLine || '未分类'}`,
    complaint_month: Number(month),
    complaint_cause: cause,
    complaint_date: date,
    complaint_process_id: processId,
    complaint_repeat: text(row[15]) === '是',
    status: 'Open',
    reported_by: 'complaints-202608-import',
    created_at: new Date().toISOString()
  });
});

const reagentDetailCount = details.length;

instrumentRows.slice(1).forEach(function(row) {
  const month = text(row[0]);
  const date = dateText(row[1]);
  const productName = text(row[2]);
  const serialNo = text(row[4]);
  const complaintType = text(row[7]);
  const issueClass = normalizeInstrumentCause(row[8]);
  const problemDescription = text(row[11]);
  const severity = text(row[16]);
  const statusText = text(row[22]);
  if (!month || !productName || !problemDescription) return;

  details.push({
    id: `CPI${String(details.length - reagentDetailCount + 1).padStart(4, '0')}`,
    event_type: 'Complaint',
    risk_level: /严重|高|致命/.test(severity) ? 'High' : 'Medium',
    product_name: productName,
    batch_no: serialNo,
    description: `【${issueClass}】${problemDescription}`,
    complaint_source: `仪器投诉-${complaintType || '未分类'}`,
    complaint_month: Number(month),
    complaint_cause: issueClass,
    complaint_date: date,
    complaint_process_id: `INST-${String(details.length - reagentDetailCount + 1).padStart(4, '0')}`,
    complaint_repeat: false,
    status: /关闭|完成/.test(statusText) ? 'Closed' : 'Open',
    reported_by: 'complaints-202608-import',
    created_at: new Date().toISOString()
  });
});

const instrumentDetailCount = details.length - reagentDetailCount;
const byMonth = {};
details.forEach(function(item) {
  byMonth[item.complaint_month] = (byMonth[item.complaint_month] || 0) + 1;
});

const outputPath = path.join(__dirname, '..', 'data', 'complaints_2026_import.json');
fs.writeFileSync(outputPath, JSON.stringify(details, null, 2), 'utf8');

console.log(JSON.stringify({
  source: path.basename(inputPath),
  detailTotal: details.length,
  reagentDetails: reagentDetailCount,
  instrumentDetails: instrumentDetailCount,
  byMonth: byMonth,
  missingDetailsAgainstSummary: 613 - details.length,
  output: outputPath
}, null, 2));
