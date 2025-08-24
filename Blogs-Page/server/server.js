const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user")
const categoryRoute = require("./routes/category")
const postRoute = require("./routes/post")


dotenv.config();

const app = express();

// tooo large content
// app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.json({ limit: "10mb" }));
const PORT = process.env.PORT;

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);


app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth route is working' });
});


mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("connect mango bd succesfully")
}).catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
});


app.listen(PORT, ()=>{
 console.log(`✅ Server is running on port ${PORT}`);
}) 