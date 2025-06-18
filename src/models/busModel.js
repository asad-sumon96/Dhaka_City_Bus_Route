const db = require("./db");

// Get all stations for dropdowns
exports.getAllStations = async () => {
  const [rows] = await db.query(
    "SELECT * FROM stations ORDER BY station_name ASC"
  );
  return rows;
};

// Find buses that travel between two stations, now BIDIRECTIONAL
exports.findBusesBetweenStations = async (fromStationId, toStationId) => {
  const query = `
        SELECT DISTINCT
            b.bus_id,
            b.bus_name,
            b.bus_image_url
        FROM routes r1
        JOIN routes r2 ON r1.bus_id = r2.bus_id
        JOIN buses b ON r1.bus_id = b.bus_id
        WHERE
            r1.station_id = ? 
            AND r2.station_id = ?;
    `;
  // The line "AND r1.stop_order < r2.stop_order;" has been removed
  // to find buses that stop at both stations, regardless of direction.
  // We also added DISTINCT to ensure a bus only appears once in the results.
  const [rows] = await db.query(query, [fromStationId, toStationId]);
  return rows;
};

// Get all details for a specific bus, including its full route
exports.getBusDetailsById = async (busId) => {
  const busQuery = "SELECT * FROM buses WHERE bus_id = ?";
  const [busRows] = await db.query(busQuery, [busId]);

  if (busRows.length === 0) return null;

  const routeQuery = `
        SELECT s.station_name, r.stop_order
        FROM routes r
        JOIN stations s ON r.station_id = s.station_id
        WHERE r.bus_id = ?
        ORDER BY r.stop_order ASC;
    `;
  const [stopRows] = await db.query(routeQuery, [busId]);

  return {
    ...busRows[0],
    stops: stopRows,
  };
};
