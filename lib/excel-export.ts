import * as XLSX from 'xlsx';

interface ExportData {
  Number: string;
  Amount: number;
}

export function exportToExcel(data: ExportData[], filename: string) {
  try {
    // Ensure we have data to export
    if (!data || data.length === 0) {
      throw new Error('No data available to export');
    }

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Add summary information
    const summaryData = [
      ['Collection Export Summary'],
      ['Export Date:', new Date().toLocaleDateString()],
      ['Export Time:', new Date().toLocaleTimeString()],
      ['Total Numbers:', data.length],
      ['Total Amount:', data.reduce((sum, item) => sum + item.Amount, 0)],
      [''], // Empty row for spacing
      ['Number', 'Amount'] // Headers for main data
    ];
    
    // Combine summary and main data
    const allData = [
      ...summaryData,
      ...data.map(item => [item.Number, item.Amount])
    ];
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    
    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Number/Label column
      { wch: 15 }, // Amount/Value column
    ];
    worksheet['!cols'] = columnWidths;
    
    // Style the header rows
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Collection Data');
    
    // Generate and download the file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Excel export error:', error);
    throw new Error('Failed to export Excel file. Please try again.');
  }
}