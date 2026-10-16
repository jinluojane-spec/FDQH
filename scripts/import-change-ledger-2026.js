const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

function clean(value) {
  return value === undefined || value === null ? '' : String(value).replace(/\s+/g, ' ').trim();
}

function findWorkbook(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const found = findWorkbook(fullPath);
      if (found) return found;
    } else if (entry.name === '2026年变更（上海、长沙、泰州）.xlsx') {
      return fullPath;
    }
  }
  return null;
}

function normalizeDate(value) {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  const text = clean(value);
  let match = text.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/);
  if (match) {
    return `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`;
  }
  match = text.match(/^(\d{3})[./-](\d{1,2})[./-](\d{1,2})$/);
  if (match) {
    const year = match[1] === '206' ? 2026 : Number(match[1]);
    return `${year}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`;
  }
  match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (match) {
    const year = Number(match[3]) < 100 ? 2000 + Number(match[3]) : Number(match[3]);
    return `${year}-${String(match[1]).padStart(2, '0')}-${String(match[2]).padStart(2, '0')}`;
  }
  match = text.match(/^(\d{4})[./-](\d{1,2})$/);
  if (match) return `${match[1]}-${String(match[2]).padStart(2, '0')}-01`;
  return text;
}

function normalizeLevel(value) {
  const text = clean(value);
  if (/III|Ⅲ/.test(text)) return 'III';
  if (/II|Ⅱ/.test(text)) return 'II';
  if (/I|Ⅰ/i.test(text)) return 'I';
  return 'I';
}

function normalizeStatus(value) {
  const text = clean(value);
  if (/取消/.test(text)) return '未完成';
  if (/是|已完成|完成/.test(text)) return '完成';
  return '未完成';
}

function normalizeTrack(objectValue, description) {
  const text = [objectValue, description].join(' ');
  if (/设计|配方|性能|算法|软件|技术要求|注册证/.test(text)) return '设计变更';
  return '工程变更';
}

function normalizeChangeType(objectValue) {
  const value = clean(objectValue);
  if (/供应商|原料|物料|包材/.test(value)) return '物料/供应商变更';
  if (/工艺|方法/.test(value)) return '工艺/方法变更';
  if (/软件|程序/.test(value)) return '软件变更';
  if (/说明书|文件|图纸|标签/.test(value)) return '文件/标签变更';
  if (/厂房|设施|设备/.test(value)) return '设备/设施变更';
  if (/注册证|技术要求/.test(value)) return '注册/技术要求变更';
  return value ? `${value}变更` : '其他变更';
}

function riskFromLevel(level) {
  if (level === 'III') return 'High';
  if (level === 'II') return 'Medium';
  return 'Low';
}

function truthyFlag(value) {
  return /是|已完成|涉及/.test(clean(value));
}

function splitRegistrar(value) {
  const text = clean(value);
  const match = text.match(/^(.*?)[/／]\s*(\d.*)$/);
  if (!match) return { person: text, date: '' };
  return { person: clean(match[1]), date: normalizeDate(match[2]) };
}

function stableId(prefix, index) {
  return `${prefix}-${String(index + 1).padStart(4, '0')}`;
}

function normalizeBase(value, sheetName) {
  const source = clean(value) || sheetName.split('-')[0];
  if (/三基地|所有基地/.test(source)) return '三基地';
  const parts = source.split(/[、,/／]+/).map(clean).filter(Boolean);
  const unique = Array.from(new Set(parts));
  const order = ['上海', '长沙', '泰州'];
  unique.sort(function(a, b) {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.localeCompare(b);
  });
  return unique.join('、') || source;
}

function mergeRecords(existing, incoming) {
  const merged = Object.assign({}, existing);
  Object.keys(incoming).forEach(function(key) {
    if (key === 'source_row') return;
    if (!merged[key] || String(incoming[key]).length > String(merged[key]).length) {
      merged[key] = incoming[key];
    }
  });
  merged.source_rows = Array.from(new Set((existing.source_rows || [existing.source_row]).concat(incoming.source_row)));
  merged.source_row = incoming.source_row;
  return merged;
}

function main() {
  const inputPath = process.argv[2] || findWorkbook('C:/Users/13611/Desktop');
  if (!inputPath) throw new Error('Change worksheet not found');

  const workbook = XLSX.readFile(inputPath, { cellDates: true });
  const records = [];

  workbook.SheetNames.forEach((sheetName) => {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1,
      raw: false,
      defval: '',
      blankrows: false,
    });
    const headerIndex = rows.findIndex((row) => row.some((cell) => clean(cell) === '变更编号'));
    if (headerIndex < 0) return;
    const header = rows[headerIndex].map(clean);
    const index = {};
    header.forEach((name, column) => {
      if (name) index[name] = column;
    });

    rows.slice(headerIndex + 1).forEach((row, rowOffset) => {
      if (!row.some((cell) => clean(cell))) return;
      const value = (name) => {
        const text = clean(row[index[name]]);
        return text === '/' || text === '／' ? '' : text;
      };
      const description = value('变更描述');
      const productName = value('涉及产品（简称）');
      const changeNo = value('变更编号');
      if (!description && !productName && !changeNo) return;

      const sourceRow = headerIndex + rowOffset + 2;
      const level = normalizeLevel(value('变更类型'));
      const status = normalizeStatus(value('是否完成变更'));
      const registrar = splitRegistrar(value('登记人/日期'));
      const registeredBy = value('登记人') || registrar.person;
      const registeredDate = normalizeDate(value('登记日期') || registrar.date);
      const executionDate = normalizeDate(value('变更执行日期'));
      const archiveDate = normalizeDate(value('记录归档日期'));
      const expectedDate = normalizeDate(value('预计完成日期'));
      const base = normalizeBase(value('涉及基地'), sheetName);
      const productLine = value('产品线');
      const changeObject = value('变更对象');
      const id = changeNo || stableId(`EXTRA-${sheetName}`, rowOffset);

      records.push({
        id,
        change_no: changeNo || `待补编号-${String(records.length + 1).padStart(4, '0')}`,
        change_type: normalizeChangeType(changeObject),
        product_id: productName,
        product_type_desc: [productLine, productName].filter(Boolean).join(' / '),
        product_line: productLine,
        product_name: productName,
        base,
        change_level: level,
        risk: riskFromLevel(level),
        change_track: normalizeTrack(changeObject, description),
        change_object: changeObject,
        impact: description,
        change_stage: value('变更所处阶段'),
        validation_status: value('变更所处阶段'),
        status,
        source_status: value('是否完成变更'),
        initiator: value('申请人'),
        applicant: value('申请人'),
        registered_by: registeredBy,
        registered_date: registeredDate,
        execution_date: executionDate,
        archive_date: archiveDate,
        follow_up: value('待跟进事项'),
        expected_date: expectedDate,
        responsible: value('责任人'),
        follower: value('跟进人'),
        is_public: truthyFlag(value('是否公开')),
        involves_raw_material: truthyFlag(value('是否涉及原料变更')),
        involves_registration: truthyFlag(value('是否涉及注册/备案')),
        involves_license: truthyFlag(value('是否涉及生产许可')),
        source_sheet: sheetName,
        source_row: sourceRow,
        created_at: registeredDate || executionDate || archiveDate || expectedDate || '2026-01-01',
        updated_at: new Date().toISOString(),
      });
    });
  });

  const uniqueRecords = new Map();
  const duplicateCounts = {};
  records.forEach(function(record) {
    const key = record.change_no;
    if (!uniqueRecords.has(key)) {
      uniqueRecords.set(key, record);
      duplicateCounts[key] = 1;
    } else {
      uniqueRecords.set(key, mergeRecords(uniqueRecords.get(key), record));
      duplicateCounts[key] += 1;
    }
  });

  const finalRecords = Array.from(uniqueRecords.values());
  finalRecords.sort(function(a, b) {
    return String(a.created_at).localeCompare(String(b.created_at)) || String(a.change_no).localeCompare(String(b.change_no));
  });

  const outputPath = path.join(__dirname, '..', 'data', 'change_records.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalRecords, null, 2), 'utf8');

  const summary = finalRecords.reduce(function(result, record) {
    result.total += 1;
    result.byLevel[record.change_level] = (result.byLevel[record.change_level] || 0) + 1;
    result.byBase[record.base] = (result.byBase[record.base] || 0) + 1;
    result.byStatus[record.status] = (result.byStatus[record.status] || 0) + 1;
    return result;
  }, { total: 0, byLevel: {}, byBase: {}, byStatus: {} });

  const duplicateChangeNos = Object.keys(duplicateCounts)
    .filter(function(key) { return duplicateCounts[key] > 1; })
    .map(function(key) { return { change_no: key, rows: duplicateCounts[key] }; });

  console.log(JSON.stringify({ sourceFile: inputPath, output: outputPath, rawRecords: records.length, uniqueRecords: finalRecords.length, duplicateChangeNos, summary }, null, 2));
}

main();
