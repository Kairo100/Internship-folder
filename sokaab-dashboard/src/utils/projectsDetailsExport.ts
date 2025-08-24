// import * as XLSX from 'xlsx';

// /**
//  * Exports an array of objects to an Excel file (.xlsx).
//  * @param data The array of data to be exported. Each object in the array represents a row.
//  * @param filename The name of the file to be downloaded (e.g., 'projects.xlsx').
//  */
// export const projectsDetailsExport = (data: any[], filename: string) => {
//   // Create a new workbook
//   const workbook = XLSX.utils.book_new();

//   // Convert the array of objects to a worksheet
//   const worksheet = XLSX.utils.json_to_sheet(data);

//   // Add the worksheet to the workbook
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

//   // Write the workbook and trigger the download
//   XLSX.writeFile(workbook, filename);
// };




//to support multible sheets
import * as XLSX from 'xlsx';

/**
 * Exports data to an Excel file (.xlsx), supporting multiple sheets.
 * @param sheets An array of objects, where each object has 'sheetName' (string) and 'data' (array of objects).
 * @param filename The name of the file to be downloaded (e.g., 'Project_Details.xlsx').
 */
export const projectsDetailsExport = (sheets: { sheetName: string; data: any[] }[], filename: string) => {
  const workbook = XLSX.utils.book_new();

  sheets.forEach(sheetInfo => {
    // Convert the array of objects to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(sheetInfo.data);

    // Add the worksheet to the workbook with the specified sheet name
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetInfo.sheetName);
  });

  XLSX.writeFile(workbook, filename);
};
