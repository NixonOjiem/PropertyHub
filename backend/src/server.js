const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const cors = require("cors");
const db = require("./config/db.js"); // database connection
const authRoutes = require("./middleware/auth"); //middleware for authentication

dotenv.config();

const app = express();

// Configure CORS specifically for your frontend origin
const corsOptions = {
  origin: "http://localhost:3000", // Allow only your frontend origin
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
};

app.use(cors(corsOptions)); // Use the configured CORS options
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
