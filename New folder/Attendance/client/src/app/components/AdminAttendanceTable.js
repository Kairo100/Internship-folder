"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import { format, parseISO, isToday, getDay } from "date-fns";
import { toast } from 'react-hot-toast';

const AdminAttendanceTable = ({ classId, classes }) => {
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({}); // Stores 'present', 'absent', or 'leave'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const [canTakeAttendance, setCanTakeAttendance] = useState(false);
    const [attendanceAlreadyTaken, setAttendanceAlreadyTaken] = useState(false);

    useEffect(() => {
        const selected = parseISO(selectedDate);
        const dayOfWeek = getDay(selected); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Determine if attendance can be taken for the selected date (Today, Sunday-Thursday)
        const isAttendanceDay = isToday(selected) && dayOfWeek >= 0 && dayOfWeek <= 4;
        setCanTakeAttendance(isAttendanceDay);
        console.log(`[AttendanceTable] Date: ${selectedDate}, Is Today: ${isToday(selected)}, Day of Week: ${dayOfWeek}, Can Take Attendance: ${isAttendanceDay}`);

        async function fetchData() {
            if (!classId) {
                setLoading(false);
                setStudents([]);
                setAttendanceData({});
                setAttendanceAlreadyTaken(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                console.log(`[AttendanceTable] Fetching students for classId: ${classId}`);
                const studentsRes = await api.get(`/admin/students?classId=${classId}`);
                setStudents(studentsRes.data);
                console.log("[AttendanceTable] Fetched students:", studentsRes.data);

                console.log(`[AttendanceTable] Fetching attendance for classId: ${classId}, date: ${selectedDate}`);
                const attendanceRes = await api.get(`/attendance/class/${classId}?date=${selectedDate}`);
                console.log("[AttendanceTable] Fetched raw attendance response:", attendanceRes.data);

                const dailyAttendanceRecord = attendanceRes.data.attendanceRecords.find(
                    record => format(parseISO(record.date), 'yyyy-MM-dd') === selectedDate
                );

                const initialAttendance = {};
                studentsRes.data.forEach(student => {
                    initialAttendance[student._id] = 'absent'; // Default all to 'absent'
                });

                if (dailyAttendanceRecord) {
                    dailyAttendanceRecord.records.forEach(record => {
                        if (initialAttendance.hasOwnProperty(record.student._id)) {
                             initialAttendance[record.student._id] = record.status;
                        }
                    });
                    setAttendanceAlreadyTaken(true); // Attendance found for this date
                    console.log("[AttendanceTable] Found daily record. Attendance already taken for this date.");
                } else {
                    setAttendanceAlreadyTaken(false); // No attendance found for this date
                    console.log("[AttendanceTable] No daily record found for this date. Initializing all to 'absent'.");
                }
                setAttendanceData(initialAttendance);
                console.log("[AttendanceTable] Initial attendanceData state after fetch:", initialAttendance);

            } catch (err) {
                console.error("Failed to fetch students or attendance:", err);
                setError("Failed to load attendance data. Please try again.");
                toast.error("Failed to load attendance.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [classId, selectedDate]);

    // Handle checkbox change for a specific status
    const handleStatusChange = (studentId, statusType) => {
        console.log(`[AttendanceTable] handleStatusChange called for studentId: ${studentId}, statusType: ${statusType}`);

        if (!canTakeAttendance) {
            toast.error("Attendance can only be marked for today, Sunday to Thursday.");
            console.log("[AttendanceTable] handleStatusChange blocked: canTakeAttendance is FALSE.");
            return;
        }
        if (attendanceAlreadyTaken) {
            toast.error("Attendance has already been taken for this date.");
            console.log("[AttendanceTable] handleStatusChange blocked: Attendance already taken.");
            return;
        }

        setAttendanceData(prev => {
            const currentStatus = prev[studentId];
            let newStatus;

            // If the clicked checkbox is already the current status, uncheck it (toggle off)
            if (currentStatus === statusType) {
                newStatus = 'absent'; // Revert to absent if toggling off their current status
            } else {
                newStatus = statusType; // Set the new status
            }

            const newState = {
                ...prev,
                [studentId]: newStatus,
            };
            console.log("[AttendanceTable] New attendanceData state (after change):", newState);
            return newState;
        });
    };

    const handleSubmitAttendance = async () => {
        console.log("[AttendanceTable] handleSubmitAttendance called.");
        if (!canTakeAttendance) {
            toast.error("Attendance can only be submitted for today, Sunday to Thursday.");
            console.log("[AttendanceTable] handleSubmitAttendance blocked: canTakeAttendance is FALSE.");
            return;
        }
        if (attendanceAlreadyTaken) {
            toast.error("Attendance has already been taken for this date. Cannot submit again.");
            console.log("[AttendanceTable] handleSubmitAttendance blocked: Attendance already taken.");
            return;
        }

        setLoading(true);
        try {
            const recordsToSend = students.map(student => ({
                student: student._id,
                status: attendanceData[student._id] || 'absent', // Default to 'absent' if nothing is selected
            }));
            console.log("[AttendanceTable] Submitting records:", recordsToSend);

            const payload = {
                classId: classId,
                date: selectedDate,
                records: recordsToSend,
            };

            await api.post("/attendance/mark/admin", payload);
            toast.success("Attendance marked successfully!");
            console.log("[AttendanceTable] Attendance submission successful.");
            setAttendanceAlreadyTaken(true); // Mark as taken after successful submission
        } catch (err) {
            console.error("Failed to submit attendance:", err);
            const errorMessage = err.response?.data?.message || "Failed to submit attendance.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Loading attendance...</div>;
    }

    if (error) {
        return <div className="text-red-600 text-center py-8">{error}</div>;
    }

    if (students.length === 0) {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
                <p className="font-bold">No students found!</p>
                <p>There are no students assigned to this class. Please assign students first.</p>
            </div>
        );
    }

    const currentClassName = classes?.find(cls => cls._id === classId)?.name || "Selected Class";

    // Determine if the form should be disabled for interaction
    const isFormDisabled = !canTakeAttendance || attendanceAlreadyTaken;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Attendance for {currentClassName}
            </h2>

            <div className="mb-6">
                <label htmlFor="attendanceDate" className="block text-lg font-semibold text-gray-700 mb-2">
                    Select Date:
                </label>
                <input
                    type="date"
                    id="attendanceDate"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-gray-700 border border-gray-300 rounded px-3 py-2 w-full max-w-xs focus:ring-green-500 focus:border-green-500"
                />
                {!canTakeAttendance && (
                    <p className="text-red-500 text-sm mt-2">
                        Attendance can only be taken for today, Sunday through Thursday.
                    </p>
                )}
                {canTakeAttendance && !attendanceAlreadyTaken && (
                    <p className="text-green-600 text-sm mt-2">
                        Attendance is enabled for marking. (Today is {format(parseISO(selectedDate), 'EEEE')})
                    </p>
                )}
                {attendanceAlreadyTaken && (
                    <p className="text-green-500 text-sm mt-2 font-semibold">
                        Attendance for {format(parseISO(selectedDate), 'PPPP')} has already been recorded.
                    </p>
                )}
            </div>

            {/* --- Student List for Small Screens (Card-like Layout) --- */}
            <div className="space-y-4 md:hidden">
                {students.map((student) => (
                    <div key={student._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="font-semibold text-lg text-gray-800 mb-2">
                            {student.name} ({student.rollNumber})
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <label className={`inline-flex items-center ${isFormDisabled ? 'text-gray-400' : 'text-green-600'}`}>
                                <input
                                    type="checkbox"
                                    className="text-gray-700 form-checkbox"
                                    checked={attendanceData[student._id] === 'present'}
                                    onChange={() => handleStatusChange(student._id, 'present')}
                                    disabled={isFormDisabled}
                                />
                                <span className="ml-2">Present</span>
                            </label>
                            <label className={`inline-flex items-center ${isFormDisabled ? 'text-gray-400' : 'text-red-600'}`}>
                                <input
                                    type="checkbox"
                                    className="text-gray-700 form-checkbox"
                                    checked={attendanceData[student._id] === 'absent'}
                                    onChange={() => handleStatusChange(student._id, 'absent')}
                                    disabled={isFormDisabled}
                                />
                                <span className="ml-2">Absent</span>
                            </label>
                            <label className={`inline-flex items-center ${isFormDisabled ? 'text-gray-400' : 'text-green-600'}`}>
                                <input
                                    type="checkbox"
                                    className="text-gray-700 form-checkbox"
                                    checked={attendanceData[student._id] === 'leave'}
                                    onChange={() => handleStatusChange(student._id, 'leave')}
                                    disabled={isFormDisabled}
                                />
                                <span className="ml-2">On Leave</span>
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Traditional Table for Larger Screens --- */}
            <div className="overflow-x-auto hidden md:block">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Roll No.</th>
                            <th className="py-3 px-6 text-left">Student Name</th>
                            <th className="py-3 px-6 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {students.map((student) => (
                            <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{student.rollNumber}</td>
                                <td className="py-3 px-6 text-left">{student.name}</td>
                                <td className="py-3 px-6 text-left">
                                    <div className="flex items-center space-x-4">
                                        <label className={`inline-flex items-center ${isFormDisabled ? 'text-gray-400' : 'text-green-600'}`}>
                                            <input
                                                type="checkbox"
                                                className="text-gray-700 form-checkbox text-green-600"
                                                checked={attendanceData[student._id] === 'present'}
                                                onChange={() => handleStatusChange(student._id, 'present')}
                                                disabled={isFormDisabled}
                                            />
                                            <span className="ml-2">Present</span>
                                        </label>
                                        <label className={`inline-flex items-center ${isFormDisabled ? 'text-gray-400' : 'text-red-600'}`}>
                                            <input
                                                type="checkbox"
                                                className="text-gray-700 form-checkbox text-red-600"
                                                checked={attendanceData[student._id] === 'absent'}
                                                onChange={() => handleStatusChange(student._id, 'absent')}
                                                disabled={isFormDisabled}
                                            />
                                            <span className="ml-2">Absent</span>
                                        </label>
                                        <label className={`inline-flex items-center ${isFormDisabled ? 'text-gray-400' : 'text-green-600'}`}>
                                            <input
                                                type="checkbox"
                                                className="text-gray-700 form-checkbox text-green-600"
                                                checked={attendanceData[student._id] === 'leave'}
                                                onChange={() => handleStatusChange(student._id, 'leave')}
                                                disabled={isFormDisabled}
                                            />
                                            <span className="ml-2">On Leave</span>
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                onClick={handleSubmitAttendance}
                disabled={loading || isFormDisabled}
                className="mt-6 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Submitting..." : "Submit Attendance"}
            </button>
        </div>
    );
};

export default AdminAttendanceTable;