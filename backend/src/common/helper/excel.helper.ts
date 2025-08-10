import * as ExcelJS from 'exceljs';
import { Response } from 'express';

export class ExcelHelper {
  static async exportToExcel<T>(
    data: T[],
    columns: Partial<ExcelJS.Column>[],
    fileName: string,
    res: Response,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.columns = columns;
    worksheet.addRows(data);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    await workbook.xlsx.write(res);
    res.end();
  }
}
