const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/import-audit-findings.js <workbook.xlsx>');
  process.exit(1);
}

const workbook = XLSX.readFile(inputPath, { cellDates: true });
const sheetName = workbook.SheetNames[0];
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
  header: 1,
  raw: false,
  defval: ''
});

function text(value) {
  return value === undefined || value === null ? '' : String(value).replace(/\s+/g, ' ').trim();
}

function inferGroup(description) {
  if (description.includes('西门子现场审核')) return { source: '供应商审核', date: '2026-01-09' };
  if (description.includes('CA50首次注册')) return { source: '注册体考', date: '2026-01-14' };
  if (description.includes('泰州基地') && description.includes('日常监督检查')) return { source: '日常监督检查', date: '2026-04-13' };
  if (description.includes('日常监督检查表')) return { source: '日常监督检查', date: '2026-05-12' };
  if (description.includes('LP(a)首次注册') && description.includes('研发')) return { source: '注册体考', date: '2026-06-02' };
  if (description.includes('CA50迭代') && description.includes('整改复核')) return { source: '整改复核', date: '2026-06-23' };
  if (description.includes('LPa泰州受托生产')) return { source: '受托生产核查', date: '2026-08-01' };
  if (description.includes('上海基地内审')) return { source: '内部审核', date: '2025-12-16' };
  return null;
}

function inferProduct(description) {
  if (description.includes('CA50')) return { product_name: 'CA50', product_line: '化学发光' };
  if (description.includes('Lp(a)') || description.includes('LP(a)') || description.includes('脂蛋白（a）')) return { product_name: 'Lp(a)', product_line: '生化' };
  if (description.includes('胱抑素C')) return { product_name: '胱抑素C', product_line: '生化' };
  if (description.includes('清洗液')) return { product_name: '清洗液', product_line: '试剂通用' };
  if (description.includes('新型冠状病毒') || description.includes('流感病毒')) return { product_name: '新冠及甲乙流核酸检测试剂', product_line: '分子' };
  return { product_name: '上海基地质量体系', product_line: '体系' };
}

function cleanDescription(value) {
  return text(value).replace(/^[（(]\d+[）)]\s*/, '');
}

function parseClosedAt(value) {
  const m = text(value).match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (!m) return '';
  return `${m[1]}-${String(m[2]).padStart(2, '0')}-${String(m[3]).padStart(2, '0')}`;
}

let group = { source: '质量审核', date: '2026-01-01' };
const events = [];

rows.slice(1).forEach(function(row, index) {
  const description = text(row[1]);
  const capaNo = text(row[4]);
  const clause = text(row[5]);
  const rectification = text(row[6]);
  const head = inferGroup(description);

  if (head && !capaNo) {
    group = head;
    return;
  }
  if (!capaNo || !description) return;

  const inferred = inferProduct(description);
  const highRisk = clause.includes('*');
  const closedAt = parseClosedAt(rectification);
  const status = rectification.includes('已完成') ? 'Closed' : 'Open';
  const recordNo = text(row[8]) || String(index + 2);

  events.push({
    id: capaNo,
    event_code: capaNo,
    event_type: 'Audit-Finding',
    event_subtype: group.source,
    audit_source: group.source,
    audit_scope: group.source,
    product_id: '',
    product_name: inferred.product_name,
    product_line: inferred.product_line,
    batch_no: '',
    risk_level: highRisk ? 'High' : 'Medium',
    severity: highRisk ? '高' : '中等',
    occurrence: '未知',
    detectability: '未知',
    rpn_score: 0,
    status: status,
    description: cleanDescription(description),
    root_cause_category: '',
    clause_ref: clause,
    responsible_dept: text(row[2]),
    reported_by: 'audit-import',
    occurred_at: group.date + 'T00:00:00Z',
    closed_at: closedAt,
    created_at: group.date + 'T00:00:00Z',
    updated_at: new Date().toISOString(),
    source_record_no: recordNo
  });
});

const outputPath = path.join(__dirname, '..', 'data', 'quality_events.json');
fs.writeFileSync(outputPath, JSON.stringify(events, null, 2), 'utf8');

console.log(JSON.stringify({
  sheet: sheetName,
  events: events.length,
  closed: events.filter(function(event) { return event.status === 'Closed'; }).length,
  open: events.filter(function(event) { return event.status === 'Open'; }).length,
  output: outputPath
}, null, 2));
