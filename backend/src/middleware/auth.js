const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

const router = express.Router();

// **Manual Signup**

router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const db = await mysql.createConnection(dbConfig);
    const [result] = await db.execute(
      "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
      [email, username, hashedPassword]
    );

    await db.end(); // Close the connection

    if (result.affectedRows) {
      const token = jwt.sign(
        { userId: result.insertId },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ message: "Signup successful", token });
    } else {
      res.status(500).json({ error: "Signup failed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Manual Login**

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    await db.end(); // Close the connection

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
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
