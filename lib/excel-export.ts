// excel-export.ts
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface ExportData {
  Number: string;
  Amount: number;
}

export async function exportToExcel(
  data: ExportData[],
  filename: string,
  minNumber: number,
  maxNumber: number,
  numberLength: number
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Collection Data");

  const borderStyle: Partial<ExcelJS.Borders> = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  const redFont = { color: { argb: "FFFF0000" }, size: 18 };
  const blackFont = { color: { argb: "FF000000" }, size: 18 };

  // Summary Box (unchanged)
  const summaryStartCol = 22;
  const summary = [
    ["Collection Export Summary"],
    ["Export Date:", new Date().toLocaleDateString()],
    ["Export Time:", new Date().toLocaleTimeString()],
    ["Total Numbers:", data.length],
    ["Total Amount:", data.reduce((sum, item) => sum + item.Amount, 0)],
  ];

  summary.forEach((row, i) => {
    const rowRef = sheet.getRow(i + 1);
    rowRef.getCell(summaryStartCol).value = row[0];
    rowRef.getCell(summaryStartCol + 1).value = row[1];
    rowRef.getCell(summaryStartCol).font = { bold: true, size: 14 };
    rowRef.getCell(summaryStartCol + 1).font = { size: 14 };
  });

  // HEADER ROW
  const headerRow = sheet.getRow(7);
  // Assuming you want 10 columns of number + amount pairs (adjust if needed)
  const columnsCount = 10;
  for (let i = 0; i < columnsCount; i++) {
    headerRow.getCell(i * 2 + 1).value = i
      .toString()
      .padStart(numberLength, "0");
    headerRow.getCell(i * 2 + 2).value = "ST";
  }
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, size: 18 };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = borderStyle;
  });

  // Calculate total numbers
  const totalNumbers = maxNumber - minNumber + 1;
  const rowsCount = Math.ceil(totalNumbers / columnsCount);

  // DATA ROWS
  for (let rowOffset = 0; rowOffset < rowsCount; rowOffset++) {
    const row = sheet.getRow(8 + rowOffset);
    for (let colGroup = 0; colGroup < columnsCount; colGroup++) {
      const numberIndex = rowOffset + colGroup * rowsCount;
      const base = minNumber + numberIndex;
      if (base > maxNumber) continue;

      const formatted = base.toString().padStart(numberLength, "0");
      const amount = data.find((d) => d.Number === formatted)?.Amount ?? 0;

      const numCell = row.getCell(colGroup * 2 + 1);
      const amtCell = row.getCell(colGroup * 2 + 2);

      numCell.value = formatted;
      amtCell.value = amount;

      numCell.font = redFont;
      amtCell.font = blackFont;

      numCell.alignment = { horizontal: "center", vertical: "middle" };
      amtCell.alignment = { horizontal: "center", vertical: "middle" };

      numCell.border = borderStyle;
      amtCell.border = borderStyle;
    }
  }

  // Adjust column widths
  sheet.columns = new Array(columnsCount * 2)
    .fill(0)
    .map(() => ({ width: 10 }));

  // Export file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${filename}.xlsx`);
}
