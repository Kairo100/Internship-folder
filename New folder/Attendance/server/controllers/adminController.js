// controllers/adminController.js
const Class = require('../models/Class');
const bcrypt = require('bcryptjs')
const User = require('../models/User');
const Attendance = require('../models/Attendance'); 
const mongoose = require('mongoose');
const { isValidObjectId } = mongoose.Types; 
const Student = require('../models/Student');
const { sendEmailWithReport } = require('../utils/emailService');
const moment = require('moment');

exports.createClass = async (req, res) => {
  try {
    const { name, teacherId } = req.body; // Destructure teacherId here

    const existing = await Class.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Class already exists' });

    const newClass = new Class({
      name,
      teacher: teacherId || null // Set the teacher field. Use null if teacherId is not provided.
    });
    await newClass.save();

    // IMPORTANT: If a teacher was assigned, update that teacher's assignedClass field
    if (teacherId) {
      const teacher = await User.findById(teacherId);
      if (teacher) {
        // Optional: Check if the teacher is already assigned to another class
        // If your logic dictates a teacher can only teach one class, handle conflicts here.
        // For now, we'll just assign it.
        teacher.assignedClass = newClass._id;
        await teacher.save();
      } else {
        // Handle case where provided teacherId is invalid or teacher not found
        console.warn(`Attempted to assign non-existent teacher with ID: ${teacherId}`);
        // You might want to unset the teacher from the class or return an error here
        newClass.teacher = null; // Unset the teacher if ID is invalid
        await newClass.save();
      }
    }

    // Re-populate the teacher for the response to send back the name
    const createdClassWithTeacher = await Class.findById(newClass._id).populate('teacher', 'name');

    res.status(201).json(createdClassWithTeacher); // Send back the populated class
  } catch (err) {
    console.error("Error creating class:", err.message);
    res.status(500).json({ message: 'Server error during class creation', details: err.message });
  }
};


exports.getClassById = async (req, res) => {
  try {
    const classId = req.params.id;
    // Populate teacher to send teacher object, not just ID
    const cls = await Class.findById(classId).populate('teacher', 'name');
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(cls);
  } catch (err) {
    console.error('Error fetching class by ID:', err.message);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

// NEW FUNCTION: Update Class
exports.updateClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const { name, teacher } = req.body; // 'teacher' here will be the teacher's _id or null/empty string

    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Update class name
    cls.name = name || cls.name;

    // Handle teacher assignment/reassignment
    const oldTeacherId = cls.teacher ? cls.teacher.toString() : null;
    const newTeacherId = teacher || null; // Can be null if unassigned

    if (oldTeacherId !== newTeacherId) {
      // Remove assignment from old teacher (if any)
      if (oldTeacherId) {
        await mongoose.model('User').findByIdAndUpdate(oldTeacherId, { assignedClass: null });
      }

      // Assign to new teacher (if newTeacherId is not null)
      if (newTeacherId) {
        const newTeacher = await mongoose.model('User').findById(newTeacherId);
        if (!newTeacher || newTeacher.role !== 'teacher') {
          return res.status(400).json({ message: 'Invalid or non-teacher user selected as teacher.' });
        }
        // Optional: If you want a class to only have one teacher,
        // you might want to check if the newTeacher is already assigned to another class
        // and handle that conflict. For simplicity, we'll allow reassignment.
        await mongoose.model('User').findByIdAndUpdate(newTeacherId, { assignedClass: cls._id });
      }
      cls.teacher = newTeacherId;
    }

    await cls.save();

    // Re-populate teacher for the response to send back the name
    const updatedClass = await Class.findById(classId).populate('teacher', 'name');

    res.json({ message: 'Class updated successfully', class: updatedClass });
  } catch (err) {
    console.error('Error updating class:', err.message);
    res.status(500).json({ message: 'Server error during class update', details: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classId = req.params.id; // Get the class ID

    // Find the class to ensure it exists and to potentially get its associated teacher
    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // --- IMPORTANT: Unassign the teacher from the User model first ---
    // If a teacher is assigned to this class, set their 'assignedClass' to null
    if (cls.teacher) {
      await mongoose.model('User').findByIdAndUpdate(
        cls.teacher,
        { $unset: { assignedClass: "" } } // Unset the field
        // Alternatively: { assignedClass: null } // Set it to null
      );
    }

    // --- IMPORTANT: Unassign all students from this class ---
    // If students are assigned to this class, set their 'class' field to null
    await mongoose.model('Student').updateMany(
      { class: classId },
      { $unset: { class: "" } } // Unset the field
      // Alternatively: { class: null } // Set it to null
    );

    // Now, delete the class itself
    await Class.findByIdAndDelete(classId); // Use findByIdAndDelete

    res.json({ message: 'Class removed successfully' });
  } catch (err) {
    console.error("Error deleting class:", err.message); // Log the specific error
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

// controllers/adminController.js

// ... (existing imports)

exports.getAllClasses = async (req, res) => {
  try {
    const { search } = req.query; // Get the search term
    let query = {}; // Start with an empty query object

    if (search) {
      // If a search term is provided, add a regex condition for the class name
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
      query.name = { $regex: searchRegex }; // Search by class name
    }

    // Find classes matching the query, populate teacher name, and get student count
    const classes = await Class.find(query)
      .populate('teacher', 'name') // Populate the 'teacher' field and select only the 'name'
      .lean(); // Use .lean() for plain JavaScript objects, faster for reads

    // Manually add student count for each class, as populate('students') can be heavy
    const classesWithCounts = await Promise.all(classes.map(async (cls) => {
      const studentCount = await mongoose.model('Student').countDocuments({ class: cls._id });
      return { ...cls, studentCount };
    }));

    res.json(classesWithCounts);
  } catch (err) {
    console.error("Error fetching classes:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ... (rest of your controller functions)

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password, classId } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields: name, email, and password.' });
    }

    // 2. Check if email already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email already exists.' });
    }

    // 3. DO NOT HASH THE PASSWORD HERE.
    // The pre('save') hook in your User model will handle this automatically.
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the new teacher user - pass the PLAINTEXT password
    const newTeacher = new User({
      name,
      email,
      password: password, // Pass the plaintext password
      role: 'teacher',
      assignedClass: classId || null
    });

    await newTeacher.save(); // The pre('save') hook in User.js will hash the password here

    // ... (rest of your existing logic for class assignment and response)
    // If a classId was provided, update the Class model to reference this teacher if needed
    if (classId) {
      const cls = await Class.findById(classId);
      if (cls && !cls.teacher) {
        cls.teacher = newTeacher._id;
        await cls.save();
      } else if (cls && cls.teacher) {
        console.warn(`Class ${cls.name} already has a teacher assigned.`);
      }
    }

    res.status(201).json({
      message: 'Teacher created successfully',
      teacher: {
        _id: newTeacher._id,
        name: newTeacher.name,
        email: newTeacher.email,
        role: newTeacher.role,
        assignedClass: newTeacher.assignedClass
      }
    });

  } catch (err) {
    console.error("Error creating teacher:", err); // Log the full error
    if (err.code === 11000) { // Duplicate key error for unique fields
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }
    res.status(500).json({ message: 'Server error during teacher creation', details: err.message });
  }
};
exports.getTeachers = async (req, res) => {
  try {
    const { search } = req.query; // 1. Get the 'search' parameter from the query string
    let query = { role: 'teacher' }; // Base query to always filter by role

    if (search) {
      // 2. If a search term exists, add conditions to the query
      // This creates a case-insensitive regex for partial matching
      const searchRegex = new RegExp(search, 'i');
      query.$or = [ // Use $or to search across multiple fields (name OR email)
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } }
      ];
    }

    // 3. Apply the constructed query to your Mongoose find operation
    const teachers = await User.find(query).populate('assignedClass', 'name');
    res.json(teachers);
  } catch (err) {
    console.error("Error fetching teachers:", err); // Log the specific error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;

    // Option 1: Find and then delete (good for extra checks before deletion)
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (teacher.role !== 'teacher') {
      return res.status(400).json({ message: 'User is not a teacher' });
    }

    // New Mongoose method to delete the document
    await User.findByIdAndDelete(teacherId); // <-- CORRECT WAY TO DELETE

    
    await Class.findOneAndUpdate(
        { teacher: teacherId },
        { $unset: { teacher: "" } } // Remove the teacher field from any class they were assigned to
    );


    res.json({ message: 'Teacher removed successfully' }); // More specific success message

  } catch (err) {
    console.error("Error removing teacher:", err.message); // Log the specific error
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllStudents = async (req, res) => {
  try {
    const { search, classId } = req.query; // Destructure search and classId from query
    let query = {}; // Start with an empty query object

    // 1. Handle search term
    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive regex
      query.$or = [ // Search by name OR email
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } }
      ];
    }

    // 2. Handle class filter
    if (classId) {
      // Ensure classId is a valid ObjectId, if your IDs are Mongoose ObjectIds
      // if (!mongoose.Types.ObjectId.isValid(classId)) {
      //   return res.status(400).json({ message: 'Invalid Class ID' });
      // }
      query.class = classId; // Filter by the class ID
    }

    // Find students matching the constructed query
    // Populate the 'class' field to get the class name
    const students = await Student.find(query).populate('class', 'name');
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// NEW: Create Student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, class: classId, rollNumber, status, dropoutReason } = req.body; // Destructure all expected fields

    // Basic validation
    if (!name || !email || !classId || !rollNumber || !status) {
      return res.status(400).json({ message: 'Name, email, roll number, class, and status are required.' });
    }

    // Check if roll number already exists
    let existingRollNumberStudent = await Student.findOne({ rollNumber });
    if (existingRollNumberStudent) {
        return res.status(400).json({ message: 'A student with this Roll Number already exists.' });
    }

    // Check if user (student) with this email already exists
    // You might want to make email unique in your Student model too.
    let existingEmailStudent = await Student.findOne({ email });
    if (existingEmailStudent) {
      return res.status(400).json({ message: 'Student with this email already exists.' });
    }

    // Check if the class exists
    const assignedClass = await Class.findById(classId);
    if (!assignedClass) {
      return res.status(404).json({ message: 'Assigned class not found.' });
    }

    // Conditional validation for dropoutReason on backend
    if (status === 'dropout' && !dropoutReason) {
        return res.status(400).json({ message: 'Dropout reason is required if status is "dropout".' });
    }

    // Create new student
    const newStudent = new Student({
      name,
      rollNumber,
      email,
      class: classId,
      status,
      dropoutReason: status === 'dropout' ? dropoutReason : '', // Store reason only if dropout
    });

    await newStudent.save();

    // Update the Class model to include this student
    assignedClass.students.push(newStudent._id);
    await assignedClass.save();

    // NEW: Send dropout report email if status is 'dropout'
    if (status === 'dropout') {
        const adminEmail = process.env.ADMIN_REPORT_EMAIL || 'admin@example.com'; // Use an environment variable for admin email
        const subject = `Student Dropout Notification: ${newStudent.name} (${newStudent.rollNumber})`;
        const htmlContent = `
            <p>Dear Administrator,</p>
            <p>This is to inform you that student <strong>${newStudent.name}</strong> (Roll No: ${newStudent.name}) has been marked as 'Dropout'.</p>
            <p><strong>Reason for Dropout:</strong> ${newStudent.dropoutReason}</p>
            <p><strong>Email:</strong> ${newStudent.email || 'N/A'}</p>
            <p><strong>Class:</strong> ${assignedClass.name}</p>
            <p>Please review the student's record and take any necessary actions.</p>
            <p>Regards,<br/>Your School System</p>
        `;
        try {
            await sendEmailWithReport(adminEmail, subject, htmlContent);
            console.log(`Dropout email sent for ${newStudent.name} to ${adminEmail}`);
        } catch (emailErr) {
            console.error(`Failed to send dropout notification email for ${newStudent.name}:`, emailErr);
            // Optionally, you might still create the student but log the email failure
        }
    }

    res.status(201).json({ message: 'Student created successfully', student: newStudent });
  } catch (err) {
    console.error("Error creating student:", err);
    if (err.code === 11000) { // Duplicate key error for unique fields
      return res.status(400).json({ message: 'A student with this email or roll number already exists.' });
    }
    res.status(500).json({ message: 'Server error while creating student.', details: err.message });
  }
};





exports.sendReportEmail = async (req, res) => {
  try {
    const { toEmail, subject, htmlContent } = req.body;
    await sendEmailWithReport(toEmail, subject, htmlContent);
    res.json({ message: 'Report email sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send email' });
  }
};


// NEW FUNCTION: Get Teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).populate('assignedClass', 'name');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    if (teacher.role !== 'teacher') {
      return res.status(400).json({ message: 'User is not a teacher' });
    }
    res.json(teacher);
  } catch (err) {
    console.error('Error fetching teacher by ID:', err.message);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};


// NEW FUNCTION: Update Teacher
exports.updateTeacher = async (req, res) => {
  try {
    const { name, email, classId } = req.body; // Password not updated here

    const teacher = await User.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    if (teacher.role !== 'teacher') {
      return res.status(400).json({ message: 'User is not a teacher' });
    }

    // Check if email is being changed and if it already exists for another user
    if (email && email !== teacher.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== teacher._id.toString()) {
        return res.status(400).json({ message: 'Email already in use by another user.' });
      }
    }

    // Update teacher fields
    teacher.name = name || teacher.name;
    teacher.email = email || teacher.email;

    // Handle class assignment/reassignment
    // If the teacher was assigned to a class, remove them from that class first
    if (teacher.assignedClass && teacher.assignedClass.toString() !== classId) {
      const oldClass = await Class.findById(teacher.assignedClass);
      if (oldClass && oldClass.teacher && oldClass.teacher.toString() === teacher._id.toString()) {
        oldClass.teacher = null;
        await oldClass.save();
      }
    }

    // Assign to the new class if classId is provided
    if (classId) {
      const newClass = await Class.findById(classId);
      if (!newClass) {
        return res.status(404).json({ message: 'Assigned class not found.' });
      }
      // If the new class already has a teacher, handle this according to your business logic
      if (newClass.teacher && newClass.teacher.toString() !== teacher._id.toString()) {
          console.warn(`Class ${newClass.name} already has a different teacher assigned. This teacher will still be assigned.`);
          // You might choose to return an error here instead, or allow multiple teachers
      }
      newClass.teacher = teacher._id; // Set this teacher as the primary teacher for the class
      await newClass.save();
      teacher.assignedClass = classId; // Update the teacher's assignedClass field
    } else {
      teacher.assignedClass = null; // If classId is null/empty, unassign the teacher
    }

    await teacher.save();

    res.json({ message: 'Teacher updated successfully', teacher });

  } catch (err) {
    console.error('Error updating teacher:', err.message);
    res.status(500).json({ message: 'Server error during teacher update', details: err.message });
  }
};

exports.getStudentsByClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const students = await Student.find({ class: classId });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students by class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




exports.getStudentById = async (req, res) => {
    try {
        const studentId = req.params.id;
        // Access isValidObjectId directly from mongoose.Types here
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid student ID' });
        }
        const student = await Student.findById(studentId).populate('class', 'name');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        console.error("Error fetching student by ID:", err.message);
        res.status(500).json({ message: 'Server error', details: err.message });
    }
};

// ... (update students)
exports.updateStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        // Add dropoutReason to the destructuring
        const { name, rollNumber, email, class: classId, status, dropoutReason } = req.body;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid student ID' });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        // Validate rollNumber uniqueness if changed
        if (rollNumber && rollNumber !== student.rollNumber) {
            const existingStudent = await Student.findOne({ rollNumber });
            if (existingStudent && existingStudent._id.toString() !== studentId) {
                return res.status(400).json({ message: 'Another student with this Roll Number already exists.' });
            }
        }

        // Validate email uniqueness if changed
        if (email && email !== student.email) {
            const existingStudent = await Student.findOne({ email });
            if (existingStudent && existingStudent._id.toString() !== studentId) {
                return res.status(400).json({ message: 'Another student with this Email already exists.' });
            }
        }

        // Validate classId if provided
        if (classId && !mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({ message: 'Invalid Class ID' });
        }
        if (classId) {
            const targetClass = await Class.findById(classId);
            if (!targetClass) {
                return res.status(404).json({ message: 'Assigned class not found.' });
            }
        }

        // Update student fields
        student.name = name || student.name;
        student.rollNumber = rollNumber || student.rollNumber;
        student.email = email === '' ? undefined : email;
        student.class = classId || student.class;
        student.status = status || student.status; // Update status

        // --- NEW/MODIFIED LOGIC FOR dropoutReason ---
        if (student.status === 'dropout') {
            // If status is dropout, ensure dropoutReason is provided and save it
            if (!dropoutReason) {
                return res.status(400).json({ message: 'Dropout reason is required if status is "dropout".' });
            }
            student.dropoutReason = dropoutReason;

            // Optional: Send dropout email on update if status changes to dropout
            // You might want to add a check here if the status *changed* to dropout
            // to avoid sending multiple emails for the same dropout student.
            // For example: if (status === 'dropout' && student.isModified('status')) { ... send email ... }
            const adminEmail = process.env.ADMIN_REPORT_EMAIL ;
            const subject = `Student Dropout Notification: ${student.name} (${student.rollNumber})`;
            const htmlContent = `
                <p>Dear Administrator,</p>
                <p>This is to inform you that student <strong>${student.name}</strong> (Roll No: ${student.rollNumber}) has been updated to 'Dropout'.</p>
                <p><strong>Reason for Dropout:</strong> ${student.dropoutReason}</p>
                <p><strong>Email:</strong> ${student.email || 'N/A'}</p>
                <p><strong>Class:</strong> ${student.class ? (await Class.findById(student.class)).name : 'N/A'}</p>
                <p>Please review the student's record and take any necessary actions.</p>
                <p>Regards,<br/>Your School System</p>
            `;
            try {
                await sendEmailWithReport(adminEmail, subject, htmlContent);
                console.log(`Dropout email sent for ${student.name} to ${adminEmail} on update.`);
            } catch (emailErr) {
                console.error(`Failed to send dropout notification email for ${student.name} on update:`, emailErr);
            }
        } else {
            // If status is not dropout, clear the dropout reason
            student.dropoutReason = '';
        }
        // --- END NEW/MODIFIED LOGIC ---

        await student.save();

        const updatedStudent = await Student.findById(studentId).populate('class', 'name');
        res.json({ message: 'Student updated successfully', student: updatedStudent });

    } catch (err) {
        console.error("Error updating student:", err.message);
        res.status(500).json({ message: 'Server error during student update', details: err.message });
    }
};

// ... (the rest of your file, including deleteStudent if it uses isValidObjectId)

exports.deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        // Access isValidObjectId directly from mongoose.Types here
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid student ID' });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await Student.findByIdAndDelete(studentId);
        res.json({ message: 'Student removed successfully' });
    } catch (err) {
        console.error("Error deleting student:", err.message);
        res.status(500).json({ message: 'Server error', details: err.message });
    }
};





exports.getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalClasses = await Class.countDocuments();
        const totalTeachers = await User.countDocuments({ role: 'teacher' });

        // Calculate absent today (Admin/Overall Dashboard)
        // Ensure you're querying for the exact UTC start of the day
        const startOfTodayUTC = moment().utc().startOf('day').toDate();

        // Use aggregation to find unique absent students
        const absentStudents = await Attendance.aggregate([
            {
                $match: {
                    date: startOfTodayUTC // Match attendance records for today's UTC midnight
                }
            },
            {
                $unwind: '$records' // Deconstruct the 'records' array into separate documents
            },
            {
                $match: {
                    'records.status': 'absent' // Match only records where the status is 'absent'
                }
            },
            {
                $group: {
                    _id: '$records.student' // Group by student ID to get unique absent students
                }
            },
            {
                $count: 'absentCount' // Count the unique student IDs
            }
        ]);

        const absentToday = absentStudents.length > 0 ? absentStudents[0].absentCount : 0;

        res.json({
            totalStudents,
            totalClasses,
            totalTeachers,
            absentToday,
        });

    } catch (err) {
        console.error("Error fetching dashboard stats:", err.message);
        res.status(500).json({ message: 'Server error fetching dashboard statistics', details: err.message });
    }
};
exports.getTeacherDashboardStats = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const moment = require('moment');

        // 1. My Total Classes
        const myClasses = await Class.find({ teacher: teacherId });
        const myTotalClasses = myClasses.length;
        const myClassIds = myClasses.map(cls => cls._id);

    
        // 2. My Total Students
        const myStudents = await Student.find({ class: { $in: myClassIds } }).distinct('_id');
        const myTotalStudents = myStudents.length;

        console.log("Found Student IDs (distinct):", myStudents.length); // Add this
        console.log("My Total Students (count):", myTotalStudents); // Add this

        // 3. My Absent Today (already working, good!)
        const startOfTodayUTC = moment().utc().startOf('day').toDate();
        const absentStudentIds = [];
        const attendanceDocuments = await Attendance.find({
            date: startOfTodayUTC,
            class: { $in: myClassIds }
        }, { 'records.student': 1, 'records.status': 1 });

        attendanceDocuments.forEach(doc => {
            doc.records.forEach(record => {
                if (record.status === 'absent') {
                    absentStudentIds.push(record.student.toString());
                }
            });
        });
        const uniqueAbsentStudentIds = new Set(absentStudentIds);
        const myAbsentToday = uniqueAbsentStudentIds.size;
        console.log("My Absent Today:", myAbsentToday); // Add this

        // 4. Upcoming Classes Today
        const upcomingClasses = myTotalClasses;

        res.json({
            myTotalStudents,
            myTotalClasses,
            myAbsentToday,
            upcomingClasses,
        });

    } catch (err) {
        console.error("Error fetching teacher dashboard stats:", err.message);
        res.status(500).json({ message: 'Server error fetching teacher dashboard statistics', details: err.message });
    }
};

// for teacher attendance
// In your routes, make sure the route path is e.g., /teacher/students/:classId
// If it's currently /teacher/students?classId=... then your frontend API call needs to change to pass it as a query param.
// Assuming route is /teacher/students/:classId:
exports.getStudentsForTeacherClass = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const requestedClassId = req.params.classId; // <--- GET CLASS ID FROM ROUTE PARAMS

        // Add a log to confirm what the backend receives
        console.log(`[Backend: getStudentsForTeacherClass] Teacher ID: ${teacherId}, Requested Class ID: ${requestedClassId}`);

        if (!requestedClassId) {
            return res.status(400).json({ message: 'Class ID is required.' });
        }

        // IMPORTANT: Verify that the authenticated teacher is indeed assigned to the requested class.
        // This assumes your Teacher or Class model has a way to link teachers to classes.
        // Based on your `getTeacherAssignedClasses` function, it looks like `Class.find({ teacher: teacherId })` is the way.
        const isTeacherAssignedToRequestedClass = await Class.exists({ _id: requestedClassId, teacher: teacherId });

        if (!isTeacherAssignedToRequestedClass) {
            return res.status(403).json({ message: 'Access denied: You are not assigned to this class.' });
        }

        let query = {
            class: requestedClassId // <--- FILTER BY THE REQUESTED CLASS ID
        };

        // Handle search term if provided
        const { search } = req.query; // Search is still a query param
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { name: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
                { rollNumber: { regex: searchRegex } }
            ];
        }

        const students = await Student.find(query)
            .populate('class', 'name')
            .select('name email rollNumber');

        console.log(`[Backend: getStudentsForTeacherClass] Found ${students.length} students for Class ID: ${requestedClassId}`);
        res.json(students);

    } catch (err) {
        console.error("Error fetching students for teacher's class:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTeacherAssignedClasses = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const assignedClasses = await Class.find({ teacher: teacherId });

        // Add these logs for debugging:
        console.log("Teacher Assigned Classes (IDs and Names):");
        assignedClasses.forEach(cls => {
            console.log(`- Class Name: ${cls.name}, ID: ${cls._id}`);
        });

        res.json(assignedClasses);
    } catch (err) {
        console.error("Error fetching teacher's assigned classes:", err);
        res.status(500).json({ message: 'Server error fetching assigned classes.' });
    }
};

exports.getAttendanceForClassByTeacher = async (req, res) => {
    try {
        const teacherId = req.user._id; // Authenticated teacher's ID
        const classId = req.params.classId; // Get class ID from URL parameters
        const dateString = req.query.date; // Get date string from query parameters

        // --- Console logs for debugging (remove in production) ---
        console.log(`[getAttendanceForClassByTeacher] Teacher ID: ${teacherId}, Class ID: ${classId}, Date String: ${dateString}`);
        // --- End of console logs ---

        // Basic validation
        if (!classId || !dateString) {
            return res.status(400).json({ message: 'Class ID and date are required query parameters.' });
        }

        // 1. Validate the teacher's role (optional, but good practice)
        const user = await User.findById(teacherId); // Fetch the full user document
        if (!user || user.role !== 'teacher') {
            return res.status(403).json({ message: 'Not authorized: Only teachers can access this.' });
        }

        // 2. IMPORTANT: Verify that THIS teacher is assigned to THIS class
        const isTeacherAssignedToClass = await Class.exists({ _id: classId, teacher: teacherId });

        if (!isTeacherAssignedToClass) {
            return res.status(403).json({ message: 'Not authorized: You are not assigned to this class.' });
        }

        // Convert dateString to a Date object for database query
        // IMPORTANT: Use moment.utc().startOf('day') for consistency if your dates are stored as UTC midnight
        const targetDate = moment.utc(dateString).startOf('day').toDate();

        // --- Console logs for debugging (remove in production) ---
        console.log(`[getAttendanceForClassByTeacher] Target Date (UTC midnight): ${targetDate.toISOString()}`);
        // --- End of console logs ---


        // Find attendance records for the specific class and date
        const attendanceRecords = await Attendance.find({
            class: classId,
            date: targetDate // Query using the UTC date object
        })
        .populate('records.student', 'name rollNumber'); // Populate student details within the records array

        // If no attendance records found for this date, return empty array, not an error
        if (!attendanceRecords) {
            return res.status(200).json({ attendanceRecords: [] });
        }

        res.json({ attendanceRecords }); // Ensure the response structure matches what the frontend expects

    } catch (err) {
        console.error("Error fetching attendance for class by teacher:", err);
        res.status(500).json({ message: 'Server error fetching attendance.', details: err.message });
    }
};
//     try {
//         const teacherId = req.user._id; // Authenticated teacher's ID
//         const classId = req.params.classId; // Get class ID from URL parameters
//         const dateString = req.query.date; // Get date string from query parameters

//         // ... (your existing console.logs and initial validations)

//         // Make sure the teacher is indeed assigned to this class
//         const teacher = await User.findById(teacherId);
//         if (!teacher || teacher.role !== 'teacher' || teacher.assignedClass.toString() !== classId) {
//             return res.status(403).json({ message: 'Not authorized: You are not assigned to this class.' });
//         }

//         // Convert dateString to a Date object for database query
//         const targetDate = new Date(dateString);
//         // Set time to start of day to match how it might be stored
//         targetDate.setUTCHours(0, 0, 0, 0);

//         // Find attendance records for the specific class and date
//         // Assuming your Attendance model has 'class', 'date', and 'records' fields
//         const attendanceRecords = await Attendance.find({
//             class: classId,
//             date: targetDate // Query using the date object
//         })
//         .populate('records.student', 'name rollNumber'); // Populate student details within the records array

//         // The frontend expects `attendanceRecords` in the response,
//         // potentially as part of a larger object.
//         res.json({ attendanceRecords }); // Ensure the response structure matches what the frontend expects
//     } catch (err) {
//         console.error("Error fetching attendance for class by teacher:", err);
//         res.status(500).json({ message: 'Server error fetching attendance.', details: err.message });
//     }
// };

//     try {
//         const { classId, date, records } = req.body;
//         const teacherId = req.user._id; // From your auth middleware

//         // 1. Basic validation
//         if (!classId || !date || !records || !Array.isArray(records) || records.length === 0) {
//             return res.status(400).json({ message: 'Invalid attendance data provided.' });
//         }

//         // 2. Security Check: Verify teacher is assigned to this class
//         const teacher = await User.findById(teacherId);
//         if (!teacher || teacher.role !== 'teacher' || teacher.assignedClass.toString() !== classId) {
//             return res.status(403).json({ message: 'Not authorized to mark attendance for this class.' });
//         }

//         // 3. Check if attendance already exists for this class and date
//         const existingAttendance = await Attendance.findOne({
//             class: classId,
//             date: new Date(date), // Ensure date is stored as a Date object in DB
//         });

//         if (existingAttendance) {
//             // If attendance already exists, you might want to prevent re-submission
//             // or update existing records. Your frontend prevents re-submission,
//             // so this indicates a backend attempt at re-submission.
//             return res.status(409).json({ message: 'Attendance for this class and date has already been recorded.' });
//         }

//         // 4. Create new attendance records
//         const newAttendanceRecords = records.map(record => ({
//             student: record.student,
//             class: classId,
//             date: new Date(date),
//             status: record.status,
//             markedBy: teacherId // Record who marked it
//         }));

//         // Save all records in one go if your Attendance model supports it,
//         // or create individual records. Assuming a single `Attendance` document
//         // per class per day containing an array of student records.
//         // Adjust this based on your Attendance model schema.

//         // If Attendance is a single document for the day with a `records` array:
//         const newDailyAttendance = await Attendance.create({
//             class: classId,
//             date: new Date(date),
//             records: newAttendanceRecords.map(rec => ({
//                 student: rec.student,
//                 status: rec.status
//             })),
//             markedBy: teacherId
//         });

//         // If Attendance is one document per student record:
//         // await Attendance.insertMany(newAttendanceRecords);

//         res.status(201).json({ message: 'Attendance marked successfully!' });

//     } catch (err) {
//         console.error("Error marking attendance:", err);
//         res.status(500).json({ message: 'Server error marking attendance.', details: err.message });
//     }
// };

// exports.markAttendanceByTeacher = async (req, res) => {
//     try {
//         const { classId, date, records } = req.body; // 'date' from frontend, e.g., "2025-05-27"
//         const teacherId = req.user.id; // From your authentication middleware

//         // Validate if class belongs to this teacher if necessary
//         const foundClass = await Class.findOne({ _id: classId, teacher: teacherId });
//         if (!foundClass) {
//             return res.status(403).json({ message: 'You are not authorized to mark attendance for this class.' });
//         }

//         // 1. --- IMPORTANT: NEW CODE FOR DATE HANDLING ---
//         // Convert the date string from the frontend to a UTC date object at the start of that day
//         const attendanceDateUTC = moment.utc(date).startOf('day').toDate();
//         // For "2025-05-27", this will result in a Date object representing 2025-05-27T00:00:00.000Z

//         // Check if attendance for this class and date already exists to update or create
//         let attendanceRecord = await Attendance.findOne({
//             class: classId,
//             date: attendanceDateUTC // Use the UTC date for finding existing records
//         });

//         if (attendanceRecord) {
//             // Update existing record
//             attendanceRecord.records = records; // Replace all records, or merge selectively
//             attendanceRecord.takenBy = teacherId;
//             await attendanceRecord.save();
//             return res.status(200).json({ message: 'Attendance updated successfully', attendanceRecord });
//         } else {
//             // Create new record
//             const newAttendance = new Attendance({
//                 class: classId,
//                 date: attendanceDateUTC, // Use the UTC date for saving
//                 records: records,
//                 takenBy: teacherId
//             });
//             await newAttendance.save();
//             return res.status(201).json({ message: 'Attendance marked successfully', newAttendance });
//         }

//     } catch (error) {
//         console.error("Error marking attendance:", error);
//         res.status(500).json({ message: 'Server error marking attendance', error: error.message });
//     }
// };