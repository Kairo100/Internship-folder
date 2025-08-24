import React, { useState } from 'react';
import axios from 'axios';

const AdminReport = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [report, setReport] = useState([]);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/attendance/report/${year}/${month}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReport(res.data.data || []);
    } catch (err) {
      alert("Only admin can access this.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Admin Attendance Report</h2>
      <input type="number" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
      <input type="number" placeholder="Month (1-12)" value={month} onChange={e => setMonth(e.target.value)} />
      <button onClick={fetchReport}>Get Report</button>
      <ul>
        {report.map((r, index) => (
          <li key={index}>
            User ID: {r._id} | Present Days: {r.presentDays} / {r.totalDays}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReport;
