// excel.service.ts
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExcelService {
  async generateReport(
    name: string,
    columns: Array<Partial<ExcelJS.Column>>,
    data: any[],
    filePath: string,
  ) {
    // Garantir que o diretório existe
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(name);

    // Add headers
    worksheet.columns = columns;

    // Add data rows
    data.forEach((row) => {
      worksheet.addRow(row);
    });

    // Salvar o arquivo
    await workbook.xlsx.writeFile(filePath);
    
    // Verificar se o arquivo foi criado corretamente
    if (!fs.existsSync(filePath)) {
      throw new Error(`Falha ao criar arquivo Excel: ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    console.log(`Arquivo Excel gerado com sucesso: ${filePath} (${stats.size} bytes)`);

    return filePath;
  }
}
