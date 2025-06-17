const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db.js"); // Your MySQL connection pool
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- Helper Function to Generate JWT ---
// It's good practice to have this separate to ensure consistency
const generateAppToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

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
      const token = generateAppToken(result.insertId);
      return res.status(201).json({ message: "Signup successful", token });
    }

    res.status(500).json({ error: "Signup failed" });
  } catch (error) {
    // Check for duplicate entry error (error code ER_DUP_ENTRY for MySQL)
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "Email or username already exists." });
    }
    console.error("Signup error:", error);
    res.status(500).json({ error: "An internal error occurred during signup" });
  }
});

// **Manual Login**
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const [rows] = await pool.execute(
      "SELECT id, password_hash FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateAppToken(user.id);
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An internal error occurred during login" });
  }
});

// **Signup/Login with Google**
router.post("/google", async (req, res) => {
  const { token: idToken } = req.body;

  try {
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const {
      sub: google_id,
      name: username,
      email,
      picture: image_url,
    } = payload;

    // 1. Check if user exists by google_id OR email
    const [existingUsers] = await pool.execute(
      "SELECT * FROM users WHERE google_id = ? OR email = ?",
      [google_id, email]
    );

    let user = existingUsers[0];

    // 2. Handle user creation/update
    if (!user) {
      // Create new user with Google data
      const [result] = await pool.execute(
        "INSERT INTO users (email, username, google_id, image_url, auth_provider, is_verified) VALUES (?, ?, ?, ?, ?, ?)",
        [email, username, google_id, image_url, "google", true]
      );

      // Fetch newly created user
      const [newUsers] = await pool.execute(
        "SELECT * FROM users WHERE id = ?",
        [result.insertId]
      );
      user = newUsers[0];
    } else {
      // Update existing user with Google credentials if missing
      if (!user.google_id || !user.image_url) {
        await pool.execute(
          "UPDATE users SET google_id = ?, image_url = ?, auth_provider = ?, is_verified = ? WHERE id = ?",
          [google_id, image_url, "google", true, user.id]
        );

        // Refresh user data
        const [updatedUsers] = await pool.execute(
          "SELECT * FROM users WHERE id = ?",
          [user.id]
        );
        user = updatedUsers[0];
      }
    }

    // 3. Generate JWT token
    const appToken = generateAppToken(user.id);

    res.status(200).json({
      message: "Google authentication successful",
      token: appToken,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        image: user.image_url,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(401).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
});

module.exports = router;
