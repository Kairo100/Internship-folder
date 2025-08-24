const express = require("express");
const mongoose = require("mongoose");
const attendanceRoutes = require("./routes/attendance");

const app = express();
app.use(express.json());
app.use("/api/attendance", attendanceRoutes);

mongoose.connect("mongodb://localhost:27017/attendance", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
