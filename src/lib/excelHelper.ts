// src/lib/excelHelper.ts
import * as XLSX from 'xlsx';
export interface SheetData {
  name: string;
  data: Record<string, unknown>[];
}
export const excelHelper = {
  export(sheets: SheetData[], filename: string) {
    const wb = XLSX.utils.book_new();
    sheets.forEach((sheet) => {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheet.data), sheet.name);
    });
    XLSX.writeFile(wb, filename);
  },
  async read(file: File, sheetNames: string[]): Promise<Record<string, Record<string, unknown>[]>> {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' });
    const hasil: Record<string, Record<string, unknown>[]> = {};
    sheetNames.forEach((nama) => {
      hasil[nama] = wb.Sheets[nama] ? XLSX.utils.sheet_to_json(wb.Sheets[nama]) : [];
    });
    return hasil;
  },
};