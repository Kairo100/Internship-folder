"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import { toast, Toaster } from 'react-hot-toast';
import { FaFileDownload, FaChartBar, FaTable, FaSpinner } from 'react-icons/fa';
import { format } from "date-fns";

export default function AdminReportsPage() {
  const role = "admin";
  const [reportType, setReportType] = useState("attendance_by_class"); // Default report
  const [selectedClassId, setSelectedClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-01")); // Start of current month
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd")); // Today's date
  const [loading, setLoading] = useState(false); // For report generation
  const [reportData, setReportData] = useState(null); // To display generated report data

  // ADD THIS NEW STATE HERE
const [downloadFormat, setDownloadFormat] = useState('xlsx'); // Default to XLSX (Excel)

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await api.get("/admin/classes");
        setClasses(res.data);
        if (res.data.length > 0) {
          setSelectedClassId(res.data[0]._id); // Select first class by default
        }
      } catch (err) {
        console.error("Failed to fetch classes for reports:", err);
        toast.error("Failed to load classes for reports.");
      }
    }
    fetchClasses();
  }, []);

  const handleGenerateReport = async () => {
    setLoading(true);
    setReportData(null); // Clear previous report data

    try {
      if (typeof selectedClassId !== 'string' || !selectedClassId) {
        console.error("Invalid classId provided:", selectedClassId);
        toast.error("Please select a valid class.");
        setLoading(false);
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error("Invalid start or end date provided:", startDate, endDate);
        toast.error("Please select valid start and end dates.");
        setLoading(false);
        return;
      }

      const month = start.getMonth() + 1;
      const year = start.getFullYear();

      let res;

      switch (reportType) {
        case "attendance_by_class":
          res = await api.get(`/reports/class/${selectedClassId}?month=${month}&year=${year}`);
          setReportData({ type: reportType, data: res.data });
          break;
        case "student_attendance_summary":
          res = await api.get(`/reports/student-summary-by-class/${selectedClassId}?month=${month}&year=${year}`);
          setReportData({ type: reportType, data: res.data });
          break;
        case "absent_students_date_range":
          res = await api.get(`/reports/absent-students?startDate=${startDate}&endDate=${endDate}`);
          setReportData({ type: reportType, data: res.data });
          break;
        default:
          toast.error("Invalid report type selected.");
          setLoading(false);
          return;
      }
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Failed to generate report:", error);
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";
      toast.error("Failed to generate report: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

// ... (rest of your code)

// const downloadReport = async () => {
//   toast("Downloading report...");
//   try {
//     let params = {
//       startDate,
//       endDate,
//       format: downloadFormat, // Send the selected format to the backend
//     };

//     // Conditionally add classId ONLY for relevant report types
//     if (reportType === "attendance_by_class" || reportType === "student_attendance_summary") {
//       params.classId = selectedClassId;
//     }

//     const response = await api.get(`/reports/download/${reportType}`, {
//       params,
//       responseType: 'blob', // Important for file downloads
//     });

//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url;

//     let filename = `${reportType}_report_${format(new Date(), 'yyyyMMdd')}.${downloadFormat}`;
//     const contentDisposition = response.headers['content-disposition'];
//     if (contentDisposition) {
//       const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
//       if (filenameMatch && filenameMatch[1]) {
//         filename = filenameMatch[1];
//       }
//     }
//     link.setAttribute('download', filename);

//     document.body.appendChild(link);
//     link.click();

//     link.parentNode.removeChild(link);
//     window.URL.revokeObjectURL(url);

//     toast.success("Report downloaded successfully!");
//   } catch (err) {
//     console.error("Failed to download report:", err);
//     toast.error("Failed to download report. Please try again or contact support.");
//   }
// };
// ... (inside your AdminReportsPage component)

const downloadReport = async () => {
    toast("Downloading report..."); // This toast is good for showing initiation
    try {
        let params = {
            startDate,
            endDate,
            format: downloadFormat, // Send the selected format to the backend
        };

        // Conditionally add classId ONLY for relevant report types
        if (reportType === "attendance_by_class" || reportType === "student_attendance_summary") {
            params.classId = selectedClassId;
        }

        // For student_attendance_summary, also pass month and year
        if (reportType === "student_attendance_summary") {
            const start = new Date(startDate);
            params.month = start.getMonth() + 1;
            params.year = start.getFullYear();
        }

        const response = await api.get(`/reports/download/${reportType}`, {
            params,
            responseType: 'blob', // Crucial: Tells Axios to expect binary data
        });

        // 1. Get Filename from Content-Disposition header (server should send this)
        const contentDisposition = response.headers['content-disposition'];
        let filename = `${reportType}_report_${format(new Date(), 'yyyyMMdd')}.${downloadFormat}`; // Fallback filename

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename\*?=['"]?([^"']+)['"]?/i); // More robust regex
            if (filenameMatch && filenameMatch[1]) {
                try {
                    // Decode URI component to handle non-ASCII characters or spaces correctly
                    filename = decodeURIComponent(filenameMatch[1].replace(/^UTF-8''/, ''));
                } catch (e) {
                    console.warn("Failed to decode filename from Content-Disposition, using raw match or fallback.", filenameMatch[1]);
                    filename = filenameMatch[1];
                }
            }
        }

        // 2. Create a URL for the Blob
        const blob = new Blob([response.data], { type: response.headers['content-type'] }); // Use content-type from response
        const url = window.URL.createObjectURL(blob);

        // 3. Create a temporary link element and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename); // Set the download attribute with the filename
        link.style.display = 'none'; // Correctly hide the link element
        document.body.appendChild(link); // Append to the body
        link.click(); // Programmatically click the link

        // 4. Clean up: remove the link and revoke the blob URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Report downloaded successfully!");
    } catch (err) {
        console.error("Failed to download report:", err);
        // More specific error handling for Axios errors
        if (err.response) {
            // Server responded with a status other than 2xx
            // If the server sent a JSON error, try to parse it
            const errorBlob = new Blob([err.response.data], { type: 'application/json' });
            const reader = new FileReader();
            reader.onload = function() {
                try {
                    const errorJson = JSON.parse(reader.result);
                    toast.error(`Failed to download report: ${errorJson.message || 'Server error'}`);
                } catch (parseError) {
                    // Not a JSON error, maybe HTML or plain text
                    toast.error(`Failed to download report: ${err.response.statusText || 'Unexpected server response.'}`);
                }
            };
            reader.readAsText(errorBlob);
        } else if (err.request) {
            // Request was made but no response received (e.g., network error)
            toast.error("Failed to download report: Network error. Please check your connection.");
        } else {
            // Something else happened while setting up the request
            toast.error("Failed to download report: " + (err.message || "An unknown error occurred."));
        }
    }
};

// ... (rest of your component)
// ... (rest of your code)

  return (
    <>
      <div className="">
        <main className="flex-1 p-6 sm:p-8 bg-gray-100">
          <Toaster />
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4 border-b pb-4">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mb-6">
              Generate various attendance and student performance reports.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="reportType" className="block text-lg font-semibold text-gray-700 mb-2">
                  Select Report Type:
                </label>
                <select
                  id="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="block text-gray-700 appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                >
                  <option value="attendance_by_class" className="text-gray-700">Attendance by Class (Date Range)</option>
                  <option value="student_attendance_summary" className="text-gray-700">Student Attendance Summary (Class)</option>
                  <option value="absent_students_date_range" className="text-gray-700">Absent Students (Date Range)</option>
                  {/* Add more report options */}
                </select>
              </div>

              {/* DOWNLOAD FORMAT SELECT - PDF OPTION ADDED HERE */}
              <div>
                <label htmlFor="downloadFormat" className="block text-lg font-semibold text-gray-700 mb-2">
                  Download Format:
                </label>
                <select
                  id="downloadFormat"
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="block text-gray-700 appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                >
               
                  <option value="xlsx" className="text-gray-700">Excel (XLSX)</option>
                  <option value="pdf" className="text-gray-700">PDF</option> {/* THIS IS THE NEW LINE */}
                  {/* Add DOCX if you implement them on the backend */}
                </select>
              </div>

              {classes.length > 0 && (reportType === "attendance_by_class" || reportType === "student_attendance_summary") && (
                <div>
                  <label htmlFor="classSelect" className="block text-lg font-semibold text-gray-700 mb-2">
                    Select Class:
                  </label>
                  <select
                    id="classSelect"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="block text-gray-700 appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                  >
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id} className="text-gray-700">
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col">
                <label htmlFor="startDate" className="block text-lg font-semibold text-gray-700 mb-2">
                  Start Date:
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border text-gray-700 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="endDate" className="block text-lg font-semibold text-gray-700 mb-2">
                  End Date:
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border text-gray-700 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                />
              </div>
            </div>

           
<div className="flex flex-col sm:flex-row gap-4">
  <button
    onClick={handleGenerateReport}
    disabled={loading}
    className={`px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center transition duration-300 ease-in-out
          ${loading
            ? "bg-green-300 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 shadow-lg"
          }`}
  >
    {loading ? (
      <>
        <FaSpinner className="animate-spin mr-2" /> Generating...
      </>
    ) : (
      <>
        <FaChartBar className="mr-2" /> Generate Report
      </>
    )}
  </button>
  {reportData && (
    <button
      onClick={downloadReport}
      className="px-6 py-3 rounded-lg text-green-700 border border-green-600 font-semibold flex items-center justify-center transition duration-300 ease-in-out hover:bg-green-50"
    >
      <FaFileDownload className="mr-2" /> Download Report
    </button>
  )}
</div>
            {reportData && (
              <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Generated Report:</h2>
                {reportData.type === "attendance_by_class" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Attendance Details for {classes.find(c => c._id === selectedClassId)?.name}</h3>
                    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                      <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="py-2 px-3 text-left font-semibold text-gray-600 uppercase">Date</th>
                            <th className="py-2 px-3 text-left font-semibold text-gray-600 uppercase">Student</th>
                            <th className="py-2 px-3 text-center font-semibold text-gray-600 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.data.length > 0 ? (
                            reportData.data.map((record, index) => (
                              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-2 px-3">{format(new Date(record.attendanceDate), 'PPP')}</td>
                                <td className="py-2 px-3">{record.student?.name || 'N/A'}</td>
                                <td className={`py-2 px-3 text-center font-medium ${
                                  record.status === 'present' ? 'text-green-600' :
                                  record.status === 'absent' ? 'text-red-600' : 'text-yellow-600'
                                }`}>
                                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="py-4 text-center text-gray-500">No attendance records found for this period.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {reportData.type === "student_attendance_summary" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Student Attendance Summary for {classes.find(c => c._id === selectedClassId)?.name}</h3>
                    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                      <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="py-2 px-3 text-left font-semibold text-gray-600 uppercase">Student</th>
                            <th className="py-2 px-3 text-center font-semibold text-gray-600 uppercase">Total Present</th>
                            <th className="py-2 px-3 text-center font-semibold text-gray-600 uppercase">Total Absent</th>
                            <th className="py-2 px-3 text-center font-semibold text-gray-600 uppercase">Total Leave</th>
                            <th className="py-2 px-3 text-center font-semibold text-gray-600 uppercase">% Present</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.data.length > 0 ? (
                            reportData.data.map((summary, index) => (
                              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-2 px-3">{summary.student?.name || 'N/A'}</td>
                                <td className="py-2 px-3 text-center">{summary.present || 0}</td>
                                <td className="py-2 px-3 text-center">{summary.absent || 0}</td>
                                <td className="py-2 px-3 text-center">{summary.leave || 0}</td>
                                <td className="py-2 px-3 text-center font-medium">
                                  {summary.totalDays > 0 ? ((summary.present / summary.totalDays) * 100).toFixed(2) : 0}%
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="py-4 text-center text-gray-500">No summary data found for this class and period.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {reportData.type === "absent_students_date_range" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Absent Students from {format(new Date(startDate), 'PPP')} to {format(new Date(endDate), 'PPP')}</h3>
                    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                      <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="py-2 px-3 text-left font-semibold text-gray-600 uppercase">Student Name</th>
                            <th className="py-2 px-3 text-left font-semibold text-gray-600 uppercase">Class</th>
                            <th className="py-2 px-3 text-left font-semibold text-gray-600 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.data.length > 0 ? (
                            reportData.data.map((record, index) => (
                              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-2 px-3">{record.student?.name || 'N/A'}</td>
                                <td className="py-2 px-3">{record.class?.name || 'N/A'}</td>
                                <td className="py-2 px-3">{format(new Date(record.attendanceDate), 'PPP')}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="py-4 text-center text-gray-500">No absent students found for this period.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}