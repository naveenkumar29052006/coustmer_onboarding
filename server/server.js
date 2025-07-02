const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MySQL Setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Error:", err);
  } else {
    console.log("✅ MySQL connected as ID", db.threadId);
  }
});

// ✅ Routes
// Auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Communication routes (Email, SMS, WhatsApp)
const emailRoutes = require("./routes/email");
app.use("/api/email", emailRoutes);

// Webhooks routes (Voice and SMS)
const webhookRoutes = require("./routes/webhooks");
app.use("/api/webhooks", webhookRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📞 Voice webhook: http://localhost:${PORT}/api/webhooks/voice`);
  console.log(`💬 SMS webhook: http://localhost:${PORT}/api/webhooks/sms`);
});
