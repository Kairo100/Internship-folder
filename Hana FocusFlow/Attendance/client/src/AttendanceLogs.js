import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/attendance/logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data.data || []);
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <h2>My Attendance Logs</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            {new Date(log.date).toLocaleDateString()}: {log.present ? "✅ Present" : "❌ Absent"} – {log.note}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceLogs;
