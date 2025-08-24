const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const UserModel = require('./models/UserModel');
const JournalModel = require('./models/JournalModel');
const ToDoModel = require('./models/ToDoModel');
const app = express();
require('dotenv').config();

// Middleware setup
app.use(cors({
    origin: 'https://focus-flow-lac.vercel.app',  // Replace with your frontend URL
    methods: ['GET', 'POST','PUT','DELETE'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
  app.listen(process.env.PORT, () => {
    console.log("🚀 Server is running on port", process.env.PORT);
  });
})
.catch(err => console.error("❌ MongoDB connection error:", err));


// Middleware for verifying JWT
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json("The token is missing");
    }
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) {
            //added another contion to check if token experied
            if (err.name === "TokenExpiredError") {
                return res.status(401).json("Token has expired");
            }
            return res.status(401).json("The token is invalid");
        }
        req.userId = decoded.userId;
        // added role to diff the dashbaords
        req.role = decoded.role; 
        next();
    });
};

// User registration (Sign Up)
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json(err);
        const newUser = new UserModel({ username, email, password: hash });
        newUser.save()
            .then(() => res.json("User registered successfully"))
            .catch(err => res.status(500).json(err));
    });
});

// User login (Sign In)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json("User not found");
            bcrypt.compare(password, user.password, (err, match) => {
                if (match) {
                  // added role
                    const token = jwt.sign({ userId: user._id, email: user.email, username: user.username, role:user.role }, "jwt-secret-key", 
                        // add experied date
                          { expiresIn: "7d" });
                    res.cookie("token", token, {
                       httpOnly: true, 
                       secure: true, // required for cross-site cookies
                      sameSite: 'None', // required for cross-site cookies
                        maxAge: 7 * 24 * 60 * 60 * 1000,// 7 days in milliseconds here also
                         });
                        //  added user role
                  res.json({ token, role: user.role });
                } else {
                    res.status(400).json("Incorrect password");
                }
            });
        })
        .catch(err => res.status(500).json(err));
});

// Logout
app.get('/logout', (req, res) => {
    //added time coz i added the when i setting token to have 7 dyas
  res.clearCookie('token', { 
    httpOnly: true, 
    maxAge: 7 * 24 * 60 * 60 * 1000,
    
  });
  res.json({ message: "Logged out successfully" });
});

// Create Journal Entry
app.post('/journals', verifyUser, (req, res) => {
    const { title, content } = req.body;
    const newJournal = new JournalModel({
        userId: req.userId,
        title,
        content
    });
    

    newJournal.save()
        .then(() => res.json("Journal entry created successfully"))
        .catch(err => res.status(500).json(err));
});

// Get All Journal Entries
app.get('/journals', verifyUser, (req, res) => {
    JournalModel.find({ userId: req.userId })
        .then(journals => res.json(journals))
        .catch(err => res.status(500).json(err));
});
// added Get a Single Journal Entry by ID (for logged-in user)  for edit page
app.get('/journals/:id', verifyUser, (req, res) => {
  JournalModel.findOne({ _id: req.params.id, userId: req.userId })
    .then(journal => {
      if (!journal) {
        return res.status(404).json({ error: "Journal entry not found" });
      }
      res.json(journal);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});
// Edit Journal Entry
app.put('/journals/:id', verifyUser, (req, res) => {
    const { title, content } = req.body;
    JournalModel.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { title, content }, { new: true })
        .then(updatedJournal => res.json(updatedJournal))
        .catch(err => res.status(500).json(err));
});

// Delete Journal Entry
app.delete('/journals/:id', verifyUser, (req, res) => {
    JournalModel.findOneAndDelete({ _id: req.params.id, userId: req.userId })
        .then(() => res.json("Journal entry deleted"))
        .catch(err => res.status(500).json(err));
});

// Create To-Do List
app.post('/todos', verifyUser, (req, res) => {
    const { title, tasks } = req.body;
    const newToDo = new ToDoModel({
        userId: req.userId,
        title,
        tasks
    });

    newToDo.save()
        .then(() => res.json("To-Do list created successfully"))
        .catch(err => res.status(500).json(err));
});

// Get All To-Do Lists
app.get('/todos', verifyUser, (req, res) => {
    ToDoModel.find({ userId: req.userId })
        .then(todos => res.json(todos))
        .catch(err => res.status(500).json(err));
});
// added  GET single ToDo by id to update for edit page
app.get('/todos/:id', verifyUser, (req, res) => {
    ToDoModel.findOne({ _id: req.params.id, userId: req.userId })
        .then(todo => {
            if (!todo) return res.status(404).json("ToDo not found");
            res.json(todo);
        })
        .catch(err => res.status(500).json(err));
});



// Edit To-Do List
app.put('/todos/:id', verifyUser, (req, res) => {
    const { title, tasks } = req.body;
    ToDoModel.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { title, tasks }, { new: true })
        .then(updatedToDo => res.json(updatedToDo))
        .catch(err => res.status(500).json(err));
});

// Delete To-Do List
app.delete('/todos/:id', verifyUser, (req, res) => {
    ToDoModel.findOneAndDelete({ _id: req.params.id, userId: req.userId })
        .then(() => res.json("To-Do list deleted"))
        .catch(err => res.status(500).json(err));
});










// Get all users (for admin use only, can add verifyUser + role check middleware later)
app.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find().select('-password'); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get single user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Update user by ID (you can also allow partial updates)
app.put('/users/:id', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const updateData = { username, email, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json("User not found");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json("User not found");
    res.json("User deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Change Password (must be logged in)
app.put('/change-password', verifyUser, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Find user by ID from JWT
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json("User not found");

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json("Current password is incorrect");

    // Hash new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json("Password changed successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
});



// for profile
app.get('/me', verifyUser, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select('-password');
    if (!user) return res.status(404).json("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
});


app.put('/me', verifyUser, async (req, res) => {
  const { username, password } = req.body;

  try {
    const updateData = {};
    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await UserModel.findByIdAndUpdate(req.userId, updateData, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json("User not found");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
