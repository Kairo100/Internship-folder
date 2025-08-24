import React, { useEffect, useState } from "react";
import { auth } from "./firebase"; 

function AttendancePage() {
  const [user, setUser] = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function fetchAttendanceLogs() {
    if (!user) return;

    const token = await user.getIdToken();

    const res = await fetch("/api/attendance/logs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (data.success) {
      setAttendanceLogs(data.data);
    } else {
      alert("Failed to load attendance logs");
    }
  }

  useEffect(() => {
    if (user) {
      fetchAttendanceLogs();
    }
  }, [user]);

  async function markAttendance(present, note = "") {
    if (!user) return;

    const token = await user.getIdToken();

    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ present, note }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Attendance marked!");
      fetchAttendanceLogs();
    } else {
      alert("Failed to mark attendance");
    }
  }

  return (
    <div>
      <h1>Attendance Logs</h1>
      {!user && <p>Please log in to see your attendance.</p>}
      {user && (
        <>
          <button onClick={fetchAttendanceLogs}>Refresh Logs</button>
          <ul>
            {attendanceLogs.map((log) => (
              <li key={log._id}>
                Date: {new Date(log.date).toLocaleDateString()} - Present:{" "}
                {log.present ? "Yes" : "No"}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default AttendancePage;
