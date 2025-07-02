const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const path = require('path');
const servicesConfig = require(path.join(__dirname, '../../src/components/servicesConfig.js')).default || require(path.join(__dirname, '../../src/components/servicesConfig.js'));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user_auth",
});

function decodeServiceCode(code) {
  if (!code || typeof code !== 'string' || code.length < 1) return {};
  const match = code.match(/^(\d+)/);
  if (!match) return {};
  const serviceNum = parseInt(match[1], 10);
  let rest = code.slice(match[1].length);
  const serviceObj = servicesConfig[serviceNum - 1];
  if (!serviceObj) return {};
  let service = serviceObj.label;
  let option = null;
  let sub_option = null;
  let currentSubcats = serviceObj.subcategories;
  let i = 0;
  while (rest.length > 0 && currentSubcats && currentSubcats.length > 0) {
    if (i === 0) {
      // First sub: letter
      const idx = rest[0].charCodeAt(0) - 97;
      if (idx < 0 || idx >= currentSubcats.length) break;
      option = currentSubcats[idx].label;
      currentSubcats = currentSubcats[idx].subcategories;
      rest = rest.slice(1);
    } else {
      // Next subs: number
      const numMatch = rest.match(/^(\d+)/);
      if (!numMatch) break;
      const idx = parseInt(numMatch[1], 10) - 1;
      if (idx < 0 || idx >= (currentSubcats ? currentSubcats.length : 0)) break;
      sub_option = currentSubcats[idx].label;
      currentSubcats = currentSubcats[idx].subcategories;
      rest = rest.slice(numMatch[1].length);
    }
    i++;
  }
  return { service, option, sub_option };
}

// Register
router.post("/register", (req, res) => {
  // Debug log
  console.log("[REGISTER] Received body:", req.body);
  const { email, name, phone, selected_services, service_details } = req.body;

  // Add debug log for service_details
  console.log("[REGISTER] service_details received:", service_details);

  if (!email)
    return res.status(400).json({ message: "Email is required" });

  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length > 0)
      return res.status(400).json({ message: "User already exists" });

    // Debug log
    console.log("[REGISTER] Inserting:", [email, name, phone, selected_services]);
    const insertSql = "INSERT INTO users (email, name, phone_number, selected_services) VALUES (?, ?, ?, ?)";
    db.query(insertSql, [email, name || null, phone || null, selected_services || null], (err) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({ message: "Insert error" });
      }
      // Get the new user's ID
      const getIdSql = "SELECT id FROM users WHERE email = ?";
      db.query(getIdSql, [email], (err, idResults) => {
        if (err || !idResults || idResults.length === 0) {
          return res.status(500).json({ message: "User ID fetch error" });
        }
        const userId = idResults[0].id;
        
        // Insert all service details as comma-separated values in a single row
        if (service_details && Array.isArray(service_details) && service_details.length > 0) {
          const services = service_details.map(detail => detail.service || '').join(',');
          const options = service_details.map(detail => detail.option || '').join(',');
          const sub_options = service_details.map(detail => detail.sub_option || '').join(',');
          // Add debug log for the final strings
          console.log("[REGISTER] Storing service details:", { services, options, sub_options });
          
          const insertDetailsSql = `
            INSERT INTO user_service_details (user_id, service, service_option, sub_option, updated_at)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              service = VALUES(service),
              service_option = VALUES(service_option),
              sub_option = VALUES(sub_option),
              updated_at = VALUES(updated_at)
          `;
          db.query(insertDetailsSql, [userId, services, options, sub_options, new Date()], (err2) => {
            if (err2) {
              console.error("Insert service details error:", err2);
              // Don't fail registration, just log
            }
            res.status(200).json({ message: "User registered", user: { id: userId, email } });
          });
        } else {
          res.status(200).json({ message: "User registered", user: { id: userId, email } });
        }
      });
    });
  });
});

// Login
router.get("/login", (req, res) => {
  const { email, password } = req.query;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (results.length > 0) {
      const user = {
        id: results[0].id,
        email: results[0].email,
        // Add any other user fields you need
      };
      res.status(200).json({ 
        message: "Login success", 
        user: user 
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

// Get all users
router.get("/users", (req, res) => {
  const sql = "SELECT id, name, email, phone_number, selected_services, additional_info, whatsapp_status, email_status, created_at FROM users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    
    // Parse selected_services and additional_info JSON for each user as arrays
    const users = results.map(user => ({
      ...user,
      selected_services: user.selected_services ? user.selected_services.split(",") : [],
      additional_info: user.additional_info ? user.additional_info.split(",") : []
    }));
    
    // Fetch service details for each user
    const fetchServiceDetails = async () => {
      const usersWithDetails = [];
      
      for (const user of users) {
        const detailsSql = "SELECT service, service_option, sub_option FROM user_service_details WHERE user_id = ?";
        db.query(detailsSql, [user.id], (err2, details) => {
          if (err2) {
            console.error("Error fetching service details for user", user.id, err2);
            user.service_details = [];
          } else {
            user.service_details = details;
          }
          
          usersWithDetails.push(user);
          
          // If we've processed all users, send the response
          if (usersWithDetails.length === users.length) {
            res.status(200).json({ users: usersWithDetails });
          }
        });
      }
    };
    
    fetchServiceDetails();
  });
});

// Update user's services after onboarding
router.put("/users/:id/services", (req, res) => {
  const { id } = req.params;
  const { services } = req.body;
  if (!services) return res.status(400).json({ message: "Services are required" });
  const sql = "UPDATE users SET selected_services = ? WHERE id = ?";
  db.query(sql, [services, id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.status(200).json({ message: "Services updated" });
  });
});

// Update user's service details
router.put("/users/:id/service-details", (req, res) => {
  const { id } = req.params;
  const { service_details } = req.body;
  
  if (!service_details || !Array.isArray(service_details)) {
    return res.status(400).json({ message: "Service details array is required" });
  }
  
  // First, delete existing service details for this user
  const deleteSql = "DELETE FROM user_service_details WHERE user_id = ?";
  db.query(deleteSql, [id], (err) => {
    if (err) return res.status(500).json({ message: "DB error deleting existing details" });
    
    // Then insert new service details
    if (service_details.length > 0) {
      // Assign a random price for each service detail
      const values = service_details.map(detail => {
        const price = Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000;
        detail.price = price;
        return [
          id,
          detail.service || null,
          detail.option || null,
          detail.sub_option || null,
          new Date(),
          price
        ];
      });
      const insertSql = "INSERT INTO user_service_details (user_id, service, service_option, sub_option, updated_at, price) VALUES ?";
      db.query(insertSql, [values], (err2) => {
        if (err2) return res.status(500).json({ message: "DB error inserting service details" });
        // Calculate total price for this user
        const totalPrice = values.reduce((sum, row) => sum + (row[5] || 0), 0);
        // Store total price in users table
        const updateUserSql = "UPDATE users SET total_price = ? WHERE id = ?";
        db.query(updateUserSql, [totalPrice, id], (err3) => {
          if (err3) {
            console.error("Error updating total price:", err3);
            // Optionally handle error, but still return success for service details
          }
          res.status(200).json({ message: "Service details and total price updated", total_price: totalPrice });
        });
      });
    } else {
      res.status(200).json({ message: "Service details updated" });
    }
  });
});

// Update user's selected_services and additional_info after onboarding or later
router.put("/users/:id/services-info", (req, res) => {
  const { id } = req.params;
  const { selected_services, additional_info } = req.body;
  // Debug log
  console.log(`[UPDATE SERVICES-INFO] User ID: ${id}, selected_services:`, selected_services, ", additional_info:", additional_info);
  const sql = "UPDATE users SET selected_services = ?, additional_info = ? WHERE id = ?";
  db.query(sql, [selected_services, additional_info, id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.status(200).json({ message: "Services and info updated" });
  });
});

module.exports = router;
