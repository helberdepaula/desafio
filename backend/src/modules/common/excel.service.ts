// excel.service.ts
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService {
  async generateReport(
    name: string,
    columns: Array<Partial<ExcelJS.Column>>,
    data: any[],
    path: string,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(name);

    // Add headers
    worksheet.columns = columns;

    // Add data rows
    data.forEach((row) => {
      worksheet.addRow(row);
    });

    return await workbook.xlsx.writeFile(path);
  }
}
