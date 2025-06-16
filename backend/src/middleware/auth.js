const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db.js"); // Import the connection pool
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");

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
  const { email, password } = req.body; // 'email' from frontend is used here

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?", // Querying by 'email' as per frontend
      [email]
    );

    if (
      rows.length === 0 ||
      !(await bcrypt.compare(password, rows[0].password_hash)) // <-- CORRECTED LINE
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

// **Signup with Google**
router.post("/google", async (req, res) => {
  const { token } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  console.log("google client id", process.env.GOOGLE_CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, name, email, picture: image } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    // Create new user if doesn't exist
    if (!user) {
      user = new User({
        username: name,
        email,
        googleId,
        image,
        isVerified: true,
      });
      await user.save();
    }

    // Generate JWT token (use your existing token generation logic)
    const token = generateJWT(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

module.exports = router;
