// Load environment variables
require("dotenv").config();

const express = require("express");
const path = require("path");
const busRoutes = require("./src/routes/busRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Routes
app.use("/", busRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("index", { pageTitle: "Home" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
