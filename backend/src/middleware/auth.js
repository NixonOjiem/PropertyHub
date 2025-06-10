const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db.js"); // Import the connection pool
const router = express.Router();

// **Manual Signup**
router.post("/signup", async (req, res) => {
  const { email, username, password, phone } = req.body;

  try {
    if (!email || !username || !password || !phone) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users (email, username, password_hash, phone) VALUES (?, ?, ?, ?)",
      [email, username, hashedPassword, phone]
    );

    if (result.affectedRows) {
      const token = jwt.sign(
        { userId: result.insertId },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.json({ message: "Signup successful", token });
    }

    res.status(500).json({ error: "Signup failed" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "An internal error occurred during signup" });
  }
});

// **Manual Login**
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (
      rows.length === 0 ||
      !(await bcrypt.compare(password, rows[0].password))
    ) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An internal error occurred during login" });
  }
});

module.exports = router;
