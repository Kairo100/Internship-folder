const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Class = require('../models/Class');
// At the top of reportController.js
const { format: formatDate } = require('date-fns'); // Renamed format to formatDate // Still useful for consistent formatting if needed
const ExcelJS = require('exceljs'); // npm install exceljs
const PDFDocument = require('pdfkit'); // npm install pdfkit
const mongoose = require('mongoose'); // Needed for isValidObjectId
const PDFDocumentTable = require('pdfkit-table'); // <-- Add this import

exports.generateClassReport = async (req, res) => {
    try {
        const { classId } = req.params;
        const { month, year } = req.query;

        if (!classId) {
            return res.status(400).json({ message: 'Class ID is required.' });
        }
        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({ message: 'Invalid Class ID format.' });
        }

        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);

        if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12 || yearNum < 1900) {
            return res.status(400).json({ message: 'Valid month and year are required.' });
        }

        // --- CORRECTED: Use UTC dates for querying and 'date' field ---
        const startOfMonth = new Date(Date.UTC(yearNum, monthNum - 1, 1)); // Start of the month in UTC
        const endOfMonth = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999)); // End of the month in UTC

        const attendance = await Attendance.find({
            class: classId,
            date: { $gte: startOfMonth, $lte: endOfMonth } // Query against 'date' field
        })
        .populate({
            path: 'records.student', // Populate students within the records array
            select: 'name rollNumber'
        })
        .populate('class', 'name') // Populate class details for context if needed later
        .sort({ date: 1 }); // Sort by date ascending

        // Reformat data to be flat for easier consumption on frontend if needed
        const flatAttendanceData = [];
        attendance.forEach(entry => {
            entry.records.forEach(record => {
                flatAttendanceData.push({
                    attendanceDate: entry.date, // Use the date from the main attendance entry
                    class: entry.class,
                    student: record.student,
                    status: record.status
                });
            });
        });

        res.json(flatAttendanceData); // Send the flattened data
    } catch (err) {
        console.error("Error in generateClassReport:", err);
        res.status(500).json({ message: 'Server error generating class report', details: err.message });
    }
};

exports.generateStudentReport = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { month, year } = req.query; // Assuming this report also uses month/year

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid Student ID format.' });
        }

        let filter = { 'records.student': studentId }; // Query for student within records array

        if (month && year) {
            const monthNum = parseInt(month, 10);
            const yearNum = parseInt(year, 10);

            if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12 || yearNum < 1900) {
                return res.status(400).json({ message: 'Valid month and year are required.' });
            }
            // --- CORRECTED: Use UTC dates for querying and 'date' field ---
            const startOfMonth = new Date(Date.UTC(yearNum, monthNum - 1, 1)); // Start of the month in UTC
            const endOfMonth = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999)); // End of the month in UTC

            filter.date = { $gte: startOfMonth, $lte: endOfMonth }; // Query against 'date' field
        }

        const attendance = await Attendance.find(filter)
            .populate('class', 'name')
            .populate({
                path: 'records.student',
                match: { _id: studentId }, // Filter to populate only the specific student's record
                select: 'name rollNumber'
            })
            .sort({ date: 1 });

        // Filter and flatten the records to only show data for the requested student
        const studentAttendanceRecords = [];
        attendance.forEach(entry => {
            const studentRecord = entry.records.find(rec => rec.student && rec.student._id.toString() === studentId);
            if (studentRecord) {
                studentAttendanceRecords.push({
                    attendanceDate: entry.date,
                    class: entry.class,
                    student: studentRecord.student,
                    status: studentRecord.status
                });
            }
        });

        res.json(studentAttendanceRecords);
    } catch (err) {
        console.error("Error in generateStudentReport:", err);
        res.status(500).json({ message: 'Server error generating student report', details: err.message });
    }
};

exports.generateStudentSummaryByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { month, year } = req.query;

        if (!classId || !month || !year) {
            return res.status(400).json({ message: 'Missing classId, month, or year' });
        }
        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({ message: 'Invalid Class ID format.' });
        }

        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);

        if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12 || yearNum < 1900) {
            return res.status(400).json({ message: 'Valid month and year are required.' });
        }

        // --- CORRECTED: Use UTC dates for querying and 'date' field ---
        const startOfMonth = new Date(Date.UTC(yearNum, monthNum - 1, 1)); // Start of the month in UTC
        const endOfMonth = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999)); // End of the month in UTC

        // Get all attendance entries for the class within the month
        const attendanceEntries = await Attendance.find({
            class: classId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        }).populate({
            path: 'records.student',
            select: 'name rollNumber'
        }).lean(); // Use .lean() for faster aggregation if you don't need Mongoose objects

        // Get all students belonging to the class for a comprehensive summary
        const allStudentsInClass = await Student.find({ class: classId }).select('name rollNumber').lean();

        // Aggregate attendance data for each student
        const studentSummary = {};

        // Initialize summary for all students in the class
        allStudentsInClass.forEach(student => {
            studentSummary[student._id.toString()] = {
                student: student,
                present: 0,
                absent: 0,
                leave: 0,
                totalDays: 0 // Total days attendance was marked in the month for this class
            };
        });

        // Process attendance entries
        attendanceEntries.forEach(entry => {
            entry.records.forEach(record => {
                const studentIdStr = record.student._id.toString();
                if (studentSummary[studentIdStr]) {
                    studentSummary[studentIdStr].totalDays++; // Increment total days for the student for this marked day
                    if (record.status === 'present') {
                        studentSummary[studentIdStr].present++;
                    } else if (record.status === 'absent') {
                        studentSummary[studentIdStr].absent++;
                    } else if (record.status === 'leave') {
                        studentSummary[studentIdStr].leave++;
                    }
                }
            });
        });

        const result = Object.values(studentSummary);
        res.json(result);
    } catch (err) {
        console.error('Error generating student summary by class:', err);
        res.status(500).json({ message: 'Server error generating report.', details: err.message });
    }
};

exports.generateAbsentStudentsReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required for absent students report.' });
        }

        // --- CORRECTED: Use UTC dates for querying and 'date' field ---
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0); // Start of the day in UTC

        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999); // End of the day in UTC

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: 'Invalid start or end date provided.' });
        }

        // Find attendance records for the given date range, then filter for 'absent' status within their records array
        const attendanceEntries = await Attendance.find({
            date: { $gte: start, $lte: end } // Query against the 'date' field
        })
        .populate('class', 'name')
        .populate({
            path: 'records.student',
            select: 'name rollNumber'
        })
        .sort({ date: 1 }); // Sort by date ascending

        // Flatten the data to list each absent student individually
        const absentStudents = [];
        attendanceEntries.forEach(entry => {
            entry.records.forEach(record => {
                if (record.status === 'absent') {
                    absentStudents.push({
                        attendanceDate: entry.date,
                        class: entry.class,
                        student: record.student,
                        status: record.status // Should always be 'absent' here
                    });
                }
            });
        });

        res.json(absentStudents);

    } catch (err) {
        console.error('Error generating absent students report:', err);
        res.status(500).json({ message: 'Server error generating absent students report.', details: err.message });
    }
};

// controllers/reportController.js

// ... (keep all your existing imports and other generate functions)

// controllers/reportController.js
exports.downloadReport = async (req, res) => {
    try {
        const { reportType } = req.params;
        const { format, startDate, endDate, classId, month, year } = req.query;

        let data = [];
        let filename = '';
        let workbook; // For ExcelJS
        let doc;      // For PDFKit
const PDFDocument = require('pdfkit');

// --- Helper function for drawing a table row ---
// This function needs access to 'doc' and the current 'y' position.
// It also needs the column definitions.
function drawTableRow(doc, y, rowData, columns, isHeader = false) {
    const startX = 50; // Starting X position for the table
    const rowHeight = 20; // Default row height
    const padding = 5; // Padding inside cells

    let currentX = startX;
    let maxTextHeight = rowHeight;

    // Determine the actual row height based on content
    columns.forEach(col => {
        let textContent = rowData[col.dataKey];
        if (isHeader) textContent = col.header;
        if (typeof textContent !== 'string') textContent = String(textContent); // Ensure text is a string

        const textWidth = col.width - (2 * padding);
        const calculatedTextHeight = doc.heightOfString(textContent, { width: textWidth, align: col.align });
        maxTextHeight = Math.max(maxTextHeight, calculatedTextHeight + (2 * padding));
    });

    // Draw row content and vertical lines
    columns.forEach(col => {
        const textWidth = col.width - (2 * padding);
        let textContent = rowData[col.dataKey];
        if (isHeader) {
            textContent = col.header;
            doc.font('Helvetica-Bold');
        } else {
            // Specific formatting for data
            if (col.dataKey === 'status') {
                textContent = textContent.charAt(0).toUpperCase() + textContent.slice(1);
            } else if (col.dataKey === 'percentagePresent') {
                textContent = textContent + '%';
            }
            doc.font('Helvetica');
        }

        if (typeof textContent !== 'string') textContent = String(textContent); // Ensure text is a string

        // Draw cell text
        doc.text(textContent, currentX + padding, y + padding, {
            width: textWidth,
            align: col.align,
            continued: false // Ensure text doesn't flow outside cell
        });

        // Draw right vertical line for the cell
        doc.moveTo(currentX + col.width, y)
           .lineTo(currentX + col.width, y + maxTextHeight)
           .stroke();

        currentX += col.width;
    });

    // Draw horizontal line at the bottom of the row
    doc.moveTo(startX, y + maxTextHeight)
       .lineTo(currentX, y + maxTextHeight)
       .stroke();

    return maxTextHeight; // Return the height of the drawn row
}

// Helper to check for new page and re-add headers
function checkAndAddPage(doc, currentY, headerColumns, reportType, queryStartDate, queryEndDate, filename) {
    if (currentY > 750) { // Standard page break threshold
        doc.addPage();
        doc.y = 50; // Reset Y position for new page
        doc.fontSize(12).text(`Report Type: ${reportType.replace(/_/g, ' ')} (continued)`, { align: 'left' }).moveDown(0.5);
        doc.text(`Date Range: ${formatDate(queryStartDate, 'PPP')} - ${formatDate(queryEndDate, 'PPP')}`).moveDown(1);
        
        // Draw headers on new page
        let headerRowHeight = drawTableRow(doc, doc.y, {}, headerColumns, true); // Pass empty object for data, true for isHeader
        doc.y += headerRowHeight;
        return doc.y;
    }
    return currentY;
}


        let queryStartDate, queryEndDate;

        if (!reportType || !format) {
            return res.status(400).json({ message: 'Missing reportType or format for download.' });
        }

        // --- Date Parsing Logic (Already good) ---
        if (reportType === 'attendance_by_class' || reportType === 'absent_students_date_range') {
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'Start date and end date are required for this report type.' });
            }
            queryStartDate = new Date(startDate);
            queryStartDate.setUTCHours(0, 0, 0, 0); // Start of the day in UTC

            queryEndDate = new Date(endDate);
            queryEndDate.setUTCHours(23, 59, 59, 999); // End of the day in UTC

            if (isNaN(queryStartDate.getTime()) || isNaN(queryEndDate.getTime())) {
                return res.status(400).json({ message: 'Invalid start or end date provided.' });
            }
        } else if (reportType === 'student_attendance_summary') {
            const monthNum = parseInt(month, 10);
            const yearNum = parseInt(year, 10);
            if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12 || yearNum < 1900) {
                return res.status(400).json({ message: 'Valid month and year are required for this report type.' });
            }
            queryStartDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
            queryEndDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999));
        } else {
            return res.status(400).json({ message: 'Invalid report type specified for download.' });
        }

        // --- Data Fetching and Preparation (Fill in other cases if not done) ---
        switch (reportType) {
            case 'attendance_by_class':
                if (!classId) return res.status(400).json({ message: 'Class ID is required for this report.' });
                if (!mongoose.Types.ObjectId.isValid(classId)) return res.status(400).json({ message: 'Invalid Class ID format.' });

                const classAttendances = await Attendance.find({
                    class: classId,
                    date: { $gte: queryStartDate, $lte: queryEndDate }
                })
                .populate({ path: 'records.student', select: 'name rollNumber' })
                .populate('class', 'name')
                .sort({ date: 1 });

                data = [];
                classAttendances.forEach(entry => {
                    entry.records.forEach(record => {
                        data.push({
                            date: formatDate(entry.date, 'yyyy-MM-dd'),
                            className: entry.class?.name || 'N/A',
                            studentName: record.student?.name || 'N/A',
                            studentRollNumber: record.student?.rollNumber || 'N/A',
                            status: record.status
                        });
                    });
                });
                filename = `attendance_by_class_${formatDate(new Date(), 'yyyyMMdd_HHmm')}.${format}`;
                break;

            case 'student_attendance_summary':
                if (!classId) return res.status(400).json({ message: 'Class ID is required for this report.' });
                if (!mongoose.Types.ObjectId.isValid(classId)) return res.status(400).json({ message: 'Invalid Class ID format.' });

                const studentsInClass = await Student.find({ class: classId }).select('name rollNumber').lean();
                const studentSummaryMap = {};
                studentsInClass.forEach(s => {
                    studentSummaryMap[s._id.toString()] = {
                        student: s,
                        present: 0, absent: 0, leave: 0, totalDays: 0
                    };
                });

                const summaryAttendanceEntries = await Attendance.find({
                    class: classId,
                    date: { $gte: queryStartDate, $lte: queryEndDate }
                }).populate({ path: 'records.student', select: 'name rollNumber' }).lean();

                summaryAttendanceEntries.forEach(entry => {
                    entry.records.forEach(record => {
                        const studentIdStr = record.student._id.toString();
                        if (studentSummaryMap[studentIdStr]) {
                            studentSummaryMap[studentIdStr].totalDays++;
                            if (record.status === 'present') studentSummaryMap[studentIdStr].present++;
                            else if (record.status === 'absent') studentSummaryMap[studentIdStr].absent++;
                            else if (record.status === 'leave') studentSummaryMap[studentIdStr].leave++;
                        }
                    });
                });
                data = Object.values(studentSummaryMap).map(summary => ({
                    studentName: summary.student?.name || 'N/A',
                    studentRollNumber: summary.student?.rollNumber || 'N/A',
                    present: summary.present,
                    absent: summary.absent,
                    leave: summary.leave,
                    totalDays: summary.totalDays,
                    percentagePresent: summary.totalDays > 0 ? ((summary.present / summary.totalDays) * 100).toFixed(2) : '0.00'
                }));
                filename = `student_attendance_summary_${formatDate(new Date(), 'yyyyMMdd_HHmm')}.${format}`;
                break;

            case 'absent_students_date_range':
                const absentAttendanceEntries = await Attendance.find({
                    date: { $gte: queryStartDate, $lte: queryEndDate }
                })
                .populate('class', 'name')
                .populate({ path: 'records.student', select: 'name rollNumber' })
                .sort({ date: 1 });

                data = [];
                absentAttendanceEntries.forEach(entry => {
                    entry.records.forEach(record => {
                        if (record.status === 'absent') {
                            data.push({
                                date: formatDate(entry.date, 'yyyy-MM-dd'),
                                className: entry.class?.name || 'N/A',
                                studentName: record.student?.name || 'N/A',
                                studentRollNumber: record.student?.rollNumber || 'N/A',
                                status: record.status // Should always be 'absent' here
                            });
                        }
                    });
                });
                filename = `absent_students_${formatDate(new Date(), 'yyyyMMdd_HHmm')}.${format}`;
                break;

            default:
                return res.status(400).json({ message: 'Unsupported report type for download.' });
        }

        // --- Check for no data before proceeding to file generation ---
        if (data.length === 0) {
            return res.status(404).json({ message: 'No data found for the selected report and criteria.' });
        }

        // --- File Generation and Response Headers ---
        switch (format) {
            case 'xlsx':
                workbook = new ExcelJS.Workbook();
                const excelSheet = workbook.addWorksheet('Report');

                // Define columns based on report type
                let excelColumns = [];
                if (reportType === 'attendance_by_class') {
                    excelColumns = [
                        { header: 'Date', key: 'date', width: 15 },
                        { header: 'Class Name', key: 'className', width: 25 },
                        { header: 'Student Name', key: 'studentName', width: 30 },
                        { header: 'Roll Number', key: 'studentRollNumber', width: 15 },
                        { header: 'Status', key: 'status', width: 10 }
                    ];
                } else if (reportType === 'student_attendance_summary') {
                    excelColumns = [
                        { header: 'Student Name', key: 'studentName', width: 30 },
                        { header: 'Roll Number', key: 'studentRollNumber', width: 15 },
                        { header: 'Total Present', key: 'present', width: 15 },
                        { header: 'Total Absent', key: 'absent', width: 15 },
                        { header: 'Total Leave', key: 'leave', width: 15 },
                        { header: '% Present', key: 'percentagePresent', width: 15 }
                    ];
                } else if (reportType === 'absent_students_date_range') {
                    excelColumns = [
                        { header: 'Date', key: 'date', width: 15 },
                        { header: 'Class Name', key: 'className', width: 25 },
                        { header: 'Student Name', key: 'studentName', width: 30 },
                        { header: 'Roll Number', key: 'studentRollNumber', width: 15 } // Add roll number for clarity
                    ];
                }
                excelSheet.columns = excelColumns;

                // Add rows
                data.forEach(row => {
                    excelSheet.addRow(row);
                });

                // Set headers for download
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

                // Write the workbook to the response stream
                await workbook.xlsx.write(res);
                res.end(); // Important to end the response
                break;

        
     case 'pdf':
    doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);

    doc.fontSize(20).text('Attendance Report', { align: 'center' }).moveDown();
    doc.fontSize(12).text(`Report Type: ${reportType.replace(/_/g, ' ')}`, { align: 'left' }).moveDown(0.5);
    doc.text(`Date Range: ${formatDate(queryStartDate, 'PPP')} - ${formatDate(queryEndDate, 'PPP')}`).moveDown(1);

    let currentY = doc.y; // Track current Y position

    let columns = [];
    if (reportType === 'attendance_by_class') {
        columns = [
            { header: 'Date', dataKey: 'date', width: 80, align: 'left' },
            { header: 'Class Name', dataKey: 'className', width: 120, align: 'left' },
            { header: 'Student Name', dataKey: 'studentName', width: 150, align: 'left' },
            { header: 'Roll No.', dataKey: 'studentRollNumber', width: 60, align: 'left' },
            { header: 'Status', dataKey: 'status', width: 80, align: 'left' },
        ];
    } else if (reportType === 'student_attendance_summary') {
        columns = [
            { header: 'Student Name', dataKey: 'studentName', width: 150, align: 'left' },
            { header: 'Roll No.', dataKey: 'studentRollNumber', width: 60, align: 'left' },
            { header: 'Present', dataKey: 'present', width: 60, align: 'center' },
            { header: 'Absent', dataKey: 'absent', width: 60, align: 'center' },
            { header: 'Leave', dataKey: 'leave', width: 60, align: 'center' },
            { header: '% Present', dataKey: 'percentagePresent', width: 80, align: 'center' },
        ];
    } else if (reportType === 'absent_students_date_range') {
        columns = [
            { header: 'Date', dataKey: 'date', width: 80, align: 'left' },
            { header: 'Class Name', dataKey: 'className', width: 120, align: 'left' },
            { header: 'Student Name', dataKey: 'studentName', width: 150, align: 'left' },
            { header: 'Roll No.', dataKey: 'studentRollNumber', width: 60, align: 'left' },
        ];
    }

    // Draw the initial table top border
    const tableStartX = 50;
    const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);
    doc.moveTo(tableStartX, currentY)
       .lineTo(tableStartX + tableWidth, currentY)
       .stroke();

    // Draw Table Headers
    const headerRowHeight = drawTableRow(doc, currentY, {}, columns, true);
    currentY += headerRowHeight;

    // Add table rows
    data.forEach(row => {
        currentY = checkAndAddPage(doc, currentY, columns, reportType, queryStartDate, queryEndDate, filename);

        const rowHeight = drawTableRow(doc, currentY, row, columns);
        currentY += rowHeight;
    });

    doc.end();
    break;
            default:
                return res.status(400).json({ message: 'Unsupported download format.' });
        }

    } catch (err) {
        console.error("Error in downloadReport (backend):", err);
        // Ensure that if an error occurs during file generation, it doesn't leave the client hanging
        if (!res.headersSent) { // Check if headers have already been sent
            res.status(500).json({ message: 'Server error generating download report.', details: err.message });
        } else {
            // If headers were sent (e.g., partial file streamed), just log
            console.error("Headers already sent, cannot send 500 status.");
        }
    }
};