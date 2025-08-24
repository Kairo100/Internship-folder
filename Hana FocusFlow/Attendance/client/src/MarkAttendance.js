import React, { useState } from 'react';
import axios from 'axios';

const MarkAttendance = () => {
  const [present, setPresent] = useState(true);
  const [note, setNote] = useState('');
  const [response, setResponse] = useState(null);

  const markAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/attendance",
        { present, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Failed to mark attendance" });
    }
  };

  return (
    <div>
      <h2>Mark Attendance</h2>
      <label>
        <input type="checkbox" checked={present} onChange={() => setPresent(!present)} />
        Present
      </label>
      <br />
      <input type="text" placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} />
      <br />
      <button onClick={markAttendance}>Submit</button>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
};

export default MarkAttendance;
