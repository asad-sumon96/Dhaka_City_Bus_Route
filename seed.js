// Load environment variables from .env file
require("dotenv").config();
const fs = require("fs/promises");
const mysql = require("mysql2/promise");

// --- DATABASE SEEDING SCRIPT (FINAL FIX v2) ---
// This script reads data from a JSON file and populates the MySQL database.
// FIX v2: Handles cases where a single route in the JSON contains duplicate station names,
// which violates the UNIQUE(bus_id, station_id) constraint.

const seedDatabase = async () => {
  let connection;
  try {
    // --- 1. CONNECT TO DATABASE ---
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("✅ Database connection successful.");

    // --- 2. CLEAR EXISTING DATA ---
    console.log("🗑️  Clearing existing data...");
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0;");
    await connection.execute("TRUNCATE TABLE routes;");
    await connection.execute("TRUNCATE TABLE buses;");
    await connection.execute("TRUNCATE TABLE stations;");
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("✅ Existing data cleared.");

    // --- 3. READ AND PARSE THE JSON FILE ---
    console.log("📄 Reading JSON data file...");
    const jsonContent = await fs.readFile("dhaka-city-local-bus.json", "utf-8");
    const originalData = JSON.parse(jsonContent).data;
    console.log(`✅ Found ${originalData.length} bus entries in JSON file.`);

    // --- 4. PRE-PROCESS BUS NAMES FOR UNIQUENESS ---
    console.log("📝 Pre-processing bus data to handle duplicates...");
    const nameCounts = {};
    const processedData = originalData.map((bus) => {
      const name = bus.english.trim();
      if (nameCounts[name]) {
        nameCounts[name]++;
        const newName = `${name} (${nameCounts[name]})`;
        return { ...bus, english: newName };
      } else {
        nameCounts[name] = 1;
        return { ...bus, english: name };
      }
    });
    console.log("✅ Bus data pre-processed.");

    // --- 5. POPULATE 'stations' TABLE ---
    console.log("🚌 Populating 'stations' table...");
    const stationNames = new Set();
    processedData.forEach((bus) => {
      bus.routes.forEach((station) => {
        const normalizedStation = station.trim().toLowerCase();
        if (normalizedStation) {
          stationNames.add(normalizedStation);
        }
      });
    });

    const stationNameToIdMap = new Map();
    for (const stationName of stationNames) {
      const displayName = stationName.replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
      const [result] = await connection.execute(
        "INSERT INTO stations (station_name) VALUES (?)",
        [displayName]
      );
      stationNameToIdMap.set(stationName, result.insertId);
    }
    console.log(`✅ Inserted ${stationNames.size} unique stations.`);

    // --- 6. POPULATE 'buses' TABLE ---
    console.log("🚌 Populating 'buses' table...");
    const busNameToIdMap = new Map();
    for (const bus of processedData) {
      const [result] = await connection.execute(
        "INSERT INTO buses (bus_name, bus_image_url, total_distance_km, base_fare) VALUES (?, ?, ?, ?)",
        [bus.english, bus.image, 50.0, 50.0]
      );
      busNameToIdMap.set(bus.english, result.insertId);
    }
    console.log(`✅ Inserted ${processedData.length} buses.`);

    // --- 7. POPULATE 'routes' TABLE ---
    console.log("🔗 Populating 'routes' table...");
    let routesCount = 0;
    for (const bus of processedData) {
      const busId = busNameToIdMap.get(bus.english);
      if (!busId) continue;

      // *** FIX: Track stations already added for THIS bus to prevent duplicates within a single route ***
      const addedStationsForThisBus = new Set();

      for (let i = 0; i < bus.routes.length; i++) {
        const normalizedStation = bus.routes[i].trim().toLowerCase();
        if (!normalizedStation) continue;

        const stationId = stationNameToIdMap.get(normalizedStation);
        const stopOrder = i + 1;

        if (!stationId) {
          console.warn(`Could not find station ID for: "${bus.routes[i]}"`);
          continue;
        }

        // *** FIX: Check if this station has already been added to this bus's route ***
        if (addedStationsForThisBus.has(stationId)) {
          // console.log(`Skipping duplicate station "${bus.routes[i]}" for bus "${bus.english}"`);
          continue; // Skip this duplicate station for this bus
        }

        await connection.execute(
          "INSERT INTO routes (bus_id, station_id, stop_order, distance_from_start) VALUES (?, ?, ?, ?)",
          [busId, stationId, stopOrder, 0.0]
        );
        // Add the station ID to our tracker for this bus
        addedStationsForThisBus.add(stationId);
        routesCount++;
      }
    }
    console.log(`✅ Inserted ${routesCount} route entries.`);

    console.log("\n🎉 Database seeding completed successfully! 🎉");
  } catch (error) {
    console.error("\n❌ An error occurred during database seeding:");
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("\nDatabase connection closed.");
    }
  }
};

seedDatabase();
