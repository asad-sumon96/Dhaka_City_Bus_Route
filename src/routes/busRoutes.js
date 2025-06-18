const express = require("express");
const router = express.Router();
const busController = require("../controllers/busController");

// Homepage route
router.get("/", busController.getHomePage);

// Placeholder routes for the new header links
router.get("/route", busController.getRoutePage);
router.get("/bus-list", busController.getBusListPage);

// Route to handle the search form submission
router.post("/find-buses", busController.findBuses);

// API endpoint to get details for a specific bus (for the modal)
router.get("/api/bus/:busId", busController.getBusDetails);

module.exports = router;
