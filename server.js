const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const diagnosisRoutes = require("./routes/diagnosisRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect database
connectDB();

// routes
app.get("/ping", (req, res) => {
  res.status(200).send("Server is alive");
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/diagnosis", diagnosisRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});