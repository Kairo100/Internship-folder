import React, { useState, useEffect } from 'react';

// Tailwind CSS is assumed to be available in the environment.
// No explicit import for Tailwind CSS is needed here.

// IMPORTANT: Replace this with the Web app URL you copied from Google Apps Script deployment.
// This URL will look something like: https://script.google.com/macros/s/AKfycb.../exec
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqBsa0BWlijABQycjqYKOHy-_TIuXNQA4O15AzE3J3sDI4ounUsIPfuDVYhxyOkVM-pg/exec';

// Utility function to make API calls to Google Apps Script
async function callAppsScript(action, params = {}) {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...params }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling Apps Script:', error);
    return { success: false, message: `API call failed: ${error.message}` };
  }
}

// Main App Component
function App() {
  const [user, setUser] = useState(null); // { username, role, className }
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'teachers', 'students', 'attendanceReports', 'takeAttendance', 'notifications'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // --- Login Component ---
  const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState(''); // Local message for login page

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      setLoginMessage(''); // Clear previous login message
      const result = await callAppsScript('login', { username, password });
      if (result.success) {
        setUser({ username: result.username, role: result.role, className: result.className });
        setLoginMessage(result.message);
      } else {
        setLoginMessage(result.message);
      }
      setLoading(false);
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-green-500">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Attendance System Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out w-full"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            {loginMessage && ( // Use loginMessage here
              <p className={`text-center mt-4 ${loginMessage.includes('successful') ? 'text-green-600' : 'text-red-500'}`}>
                {loginMessage}
              </p>
            )}
          </form>
          <p className="text-center text-gray-500 text-xs mt-6">
            Admin: admin1 / password123 | Teacher A: teacherA / passA | Teacher B: teacherB / passB
          </p>
        </div>
      </div>
    );
  };

  // --- Common Dashboard Layout ---
  const DashboardLayout = ({ children }) => (
    <div className="min-h-screen flex flex-col bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg">Welcome, {user?.username} ({user?.role})</span>
          <button
            onClick={() => setUser(null)}
            className="bg-green-600 hover:bg-green-800 text-white py-1 px-3 rounded-lg transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-lg p-4 border-r border-gray-200">
          <ul className="space-y-2">
            {user?.role === 'admin' && (
              <>
                <li>
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${currentPage === 'dashboard' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Dashboard Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('teachers')}
                    className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${currentPage === 'teachers' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Manage Teachers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('students')}
                    className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${currentPage === 'students' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Manage Students
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('attendanceReports')}
                    className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${currentPage === 'attendanceReports' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Attendance Reports
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('notifications')}
                    className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${currentPage === 'notifications' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Notifications
                  </button>
                </li>
              </>
            )}
            {user?.role === 'teacher' && (
              <li>
                <button
                  onClick={() => setCurrentPage('takeAttendance')}
                  className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${currentPage === 'takeAttendance' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Take Attendance ({user.className})
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {message && (
            <div className={`p-3 mb-4 rounded-lg text-center ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );

  // --- Admin Dashboard Overview ---
  const AdminDashboardOverview = () => {
    const [totalStudents, setTotalStudents] = useState(0);
    const [attendanceSummary, setAttendanceSummary] = useState({});

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        const studentsResult = await callAppsScript('getTotalStudents');
        if (studentsResult.success) {
          setTotalStudents(studentsResult.totalStudents);
        } else {
          setMessage(studentsResult.message);
        }

        const summaryResult = await callAppsScript('getAttendanceSummary');
        if (summaryResult.success) {
          setAttendanceSummary(summaryResult.data);
        } else {
          setMessage(summaryResult.message);
        }
        setLoading(false);
      };
      fetchData();
    }, []);

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        {loading ? (
          <p className="text-gray-600">Loading data...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
              <p className="text-4xl font-bold text-green-600">{totalStudents}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Present Records</h3>
              <p className="text-4xl font-bold text-blue-600">{attendanceSummary.totalPresent || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Absent Records</h3>
              <p className="text-4xl font-bold text-red-600">{attendanceSummary.totalAbsent || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Leave Records</h3>
              <p className="text-4xl font-bold text-yellow-600">{attendanceSummary.totalLeave || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Dropout Records</h3>
              <p className="text-4xl font-bold text-purple-600">{attendanceSummary.totalDropout || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-500">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Attendance Records</h3>
              <p className="text-4xl font-bold text-gray-600">{attendanceSummary.totalRecords || 0}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Teachers List Component ---
  const TeachersList = () => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
      const fetchTeachers = async () => {
        setLoading(true);
        const result = await callAppsScript('getTeachers');
        if (result.success) {
          setTeachers(result.data);
        } else {
          setMessage(result.message);
        }
        setLoading(false);
      };
      fetchTeachers();
    }, []);

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Teachers</h2>
        {loading ? (
          <p className="text-gray-600">Loading teachers...</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Assigned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Password (for demo)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teachers.map((teacher, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.Username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.Class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.Password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // --- Students List Component ---
  const StudentsList = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');

    useEffect(() => {
      const fetchInitialData = async () => {
        setLoading(true);
        const classesResult = await callAppsScript('getClasses');
        if (classesResult.success) {
          setClasses(classesResult.data);
        } else {
          setMessage(classesResult.message);
        }
        setLoading(false);
      };
      fetchInitialData();
    }, []);

    useEffect(() => {
      const fetchStudents = async () => {
        setLoading(true);
        const result = await callAppsScript('getStudents', { classFilter: selectedClass });
        if (result.success) {
          setStudents(result.data);
        } else {
          setMessage(result.message);
        }
        setLoading(false);
      };
      fetchStudents();
    }, [selectedClass]);

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Students</h2>
        <div className="flex items-center space-x-4">
          <label htmlFor="classFilter" className="font-medium text-gray-700">Filter by Class:</label>
          <select
            id="classFilter"
            className="mt-1 block w-48 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map((cls, index) => (
              <option key={index} value={cls.ClassName}>{cls.ClassName}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <p className="text-gray-600">Loading students...</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Class</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.StudentID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.Name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.Phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.Address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.Class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // --- Attendance Reports Component ---
  const AttendanceReports = () => {
    const [reportType, setReportType] = useState('monthly'); // 'monthly', 'student', 'class'
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [reportData, setReportData] = useState([]);
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
      const fetchDropdownData = async () => {
        const studentsResult = await callAppsScript('getStudents');
        if (studentsResult.success) {
          setStudents(studentsResult.data);
        }
        const classesResult = await callAppsScript('getClasses');
        if (classesResult.success) {
          setClasses(classesResult.data);
        }
      };
      fetchDropdownData();
    }, []);

    const generateReport = async () => {
      setLoading(true);
      setReportData([]);
      let result;
      switch (reportType) {
        case 'monthly':
          const [year, month] = selectedMonth.split('-').map(Number);
          result = await callAppsScript('getMonthlyAttendanceReport', { year, month });
          break;
        case 'student':
          result = await callAppsScript('getStudentAttendanceReport', { studentId: selectedStudentId });
          break;
        case 'class':
          result = await callAppsScript('getClassAttendanceReport', { className: selectedClass });
          break;
        default:
          setMessage('Please select a report type.');
          setLoading(false);
          return;
      }

      if (result.success) {
        setReportData(result.data);
        setMessage('Report generated successfully.');
      } else {
        setMessage(result.message);
      }
      setLoading(false);
    };

    const exportToCSV = (data, filename) => {
      if (!data || data.length === 0) {
        setMessage('No data to export.');
        return;
      }
      const headers = Object.keys(data[0]);
      const csv = [
        headers.join(','),
        ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setMessage('Report exported to CSV.');
    };

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Attendance Reports</h2>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center space-x-4">
            <label className="font-medium text-gray-700">Report Type:</label>
            <select
              className="mt-1 block w-48 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="monthly">Monthly Report</option>
              <option value="student">Per Student Report</option>
              <option value="class">Per Class Report</option>
            </select>
          </div>

          {reportType === 'monthly' && (
            <div className="flex items-center space-x-4">
              <label htmlFor="month" className="font-medium text-gray-700">Select Month:</label>
              <input
                type="month"
                id="month"
                className="mt-1 block w-48 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
          )}

          {reportType === 'student' && (
            <div className="flex items-center space-x-4">
              <label htmlFor="studentId" className="font-medium text-gray-700">Select Student:</label>
              <select
                id="studentId"
                className="mt-1 block w-64 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                <option value="">-- Select Student --</option>
                {students.map((student, index) => (
                  <option key={index} value={student.StudentID}>{student.Name} ({student.StudentID})</option>
                ))}
              </select>
            </div>
          )}

          {reportType === 'class' && (
            <div className="flex items-center space-x-4">
              <label htmlFor="class" className="font-medium text-gray-700">Select Class:</label>
              <select
                id="class"
                className="mt-1 block w-48 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls, index) => (
                  <option key={index} value={cls.ClassName}>{cls.ClassName}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={generateReport}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        {reportData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Report Results</h3>
            <button
              onClick={() => exportToCSV(reportData, `${reportType}_report`)}
              className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            >
              Export to CSV
            </button>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(reportData[0]).map((key, index) => (
                      <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((value, colIndex) => (
                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Take Attendance Component (Teacher Role) ---
  const TakeAttendance = () => {
    const [studentsInClass, setStudentsInClass] = useState([]);
    const [attendanceStatus, setAttendanceStatus] = useState({}); // { studentId: status }
    const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    useEffect(() => {
      const fetchStudentsForClass = async () => {
        setLoading(true);
        const result = await callAppsScript('getStudents', { classFilter: user.className });
        if (result.success) {
          setStudentsInClass(result.data);
          // Initialize attendance status for all students to 'Present'
          const initialStatus = {};
          result.data.forEach(student => {
            initialStatus[student.StudentID] = 'Present';
          });
          setAttendanceStatus(initialStatus);
        } else {
          setMessage(result.message);
        }
        setLoading(false);
      };
      if (user?.className) {
        fetchStudentsForClass();
      }
    }, [user?.className]);

    const handleStatusChange = (studentId, status) => {
      setAttendanceStatus(prevStatus => ({
        ...prevStatus,
        [studentId]: status,
      }));
    };

    const handleSubmitAttendance = async () => {
      setLoading(true);
      setMessage('');
      let allSuccess = true;
      for (const student of studentsInClass) {
        const status = attendanceStatus[student.StudentID];
        if (!status) {
          setMessage(`Please select a status for student ${student.Name}`);
          allSuccess = false;
          break;
        }
        const result = await callAppsScript('recordAttendance', {
          date: currentDate,
          studentId: student.StudentID,
          status: status,
          className: user.className,
          teacherUsername: user.username,
        });
        if (!result.success) {
          setMessage(`Failed to record attendance for ${student.Name}: ${result.message}`);
          allSuccess = false;
          break;
        }
      }

      if (allSuccess) {
        setMessage('Attendance recorded successfully for all students!');
      }
      setLoading(false);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Take Attendance for {user?.className}</h2>
        <p className="text-gray-600">Date: {currentDate}</p>

        {loading ? (
          <p className="text-gray-600">Loading students for attendance...</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentsInClass.map((student) => (
                  <tr key={student.StudentID}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.StudentID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.Name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={attendanceStatus[student.StudentID] || 'Present'}
                        onChange={(e) => handleStatusChange(student.StudentID, e.target.value)}
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Leave">Leave</option>
                        <option value="Dropout">Dropout</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleSubmitAttendance}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </div>
        )}
      </div>
    );
  };

  // --- Notifications Component (Admin Role) ---
  const NotificationSettings = () => {
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const handleSendEmail = async () => {
      setLoading(true);
      setMessage('');
      const result = await callAppsScript('sendNotificationEmail', { recipient, subject, body });
      if (result.success) {
        setMessage(result.message);
        setRecipient('');
        setSubject('');
        setBody('');
      } else {
        setMessage(result.message);
      }
      setLoading(false);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Notifications (Email)</h2>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <p className="text-gray-600">
            Send email notifications. Note: This requires proper configuration and permissions in your Google Apps Script.
          </p>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipient">
              Recipient Email
            </label>
            <input
              type="email"
              id="recipient"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g., student@example.com, teacher@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">
              Body
            </label>
            <textarea
              id="body"
              rows="5"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            onClick={handleSendEmail}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    );
  };

  // --- Main Render Logic ---
  if (!user) {
    return <LoginPage />;
  }

  return (
    <DashboardLayout>
      {(() => {
        switch (currentPage) {
          case 'dashboard':
            return user.role === 'admin' ? <AdminDashboardOverview /> : <TakeAttendance />;
          case 'teachers':
            return user.role === 'admin' ? <TeachersList /> : null;
          case 'students':
            return user.role === 'admin' ? <StudentsList /> : null;
          case 'attendanceReports':
            return user.role === 'admin' ? <AttendanceReports /> : null;
          case 'takeAttendance':
            return user.role === 'teacher' ? <TakeAttendance /> : null;
          case 'notifications':
            return user.role === 'admin' ? <NotificationSettings /> : null;
          default:
            return <AdminDashboardOverview />; // Default for admin
        }
      })()}
    </DashboardLayout>
  );
}

export default App;
