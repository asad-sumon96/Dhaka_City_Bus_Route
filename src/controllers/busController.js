const busModel = require("../models/busModel");

// Controller to render the homepage with station dropdowns
exports.getHomePage = async (req, res) => {
  try {
    const stations = await busModel.getAllStations();
    res.render("index", {
      pageTitle: "Find Your Bus",
      stations: stations,
    });
  } catch (error) {
    console.error("Error fetching stations for homepage:", error);
    res.status(500).send("Error loading the page.");
  }
};

// NEW: Controller for Route page
exports.getRoutePage = (req, res) => {
  res.render("route", { pageTitle: "All Routes" });
};

// NEW: Controller for Bus List page
exports.getBusListPage = (req, res) => {
  res.render("bus-list", { pageTitle: "Bus List" });
};

// Controller to handle the bus search
exports.findBuses = async (req, res) => {
  try {
    const { fromStation, toStation } = req.body;

    if (!fromStation || !toStation) {
      return res.redirect("/");
    }

    const buses = await busModel.findBusesBetweenStations(
      fromStation,
      toStation
    );
    const stations = await busModel.getAllStations();
    const fromStationName = stations.find(
      (s) => s.station_id == fromStation
    )?.station_name;
    const toStationName = stations.find(
      (s) => s.station_id == toStation
    )?.station_name;

    res.render("results", {
      pageTitle: "Search Results",
      buses: buses,
      fromName: fromStationName,
      toName: toStationName,
    });
  } catch (error) {
    console.error("Error in findBuses controller:", error);
    res.status(500).send("Server error while searching for buses.");
  }
};

// Controller to get details for a single bus (API endpoint)
exports.getBusDetails = async (req, res) => {
  try {
    const { busId } = req.params;
    const details = await busModel.getBusDetailsById(busId);
    if (details) {
      res.json(details);
    } else {
      res.status(404).json({ message: "Bus not found" });
    }
  } catch (error) {
    console.error("Error in getBusDetails controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
