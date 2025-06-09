const express = require("express");
const router = express.Router();

// trial route for testing purposes
router.get("/trial-route", (req, res) => {
  res.json({ message: "Welcome to the test-API!" });
});

//Routes to Authentication pages

module.exports = router;
