const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const cors = require("cors");
const db = require("./config/db.js"); // database connection
const authRoutes = require("./middleware/auth"); //middleware for authentication

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", routes);
app.use("/auth", authRoutes); // Use the auth middleware for authentication routes

db.getConnection()
  .then((connection) => {
    console.log("Database connected successfully!");
    connection.release();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
