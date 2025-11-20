import { sequelize } from "./config/db.js";      // Load DB connection
import "./model/index.js";                       // Load all models
import { generateTimeTable } from "./services/generateTimeTable.js";

(async () => {
    try {
        // Connect to database
        await sequelize.authenticate();
        console.log("Database connected successfully!");

        // Call your function only
        const timetable = await generateTimeTable("BCA001", "Odd");

        // Print the timetable output
        console.log(JSON.stringify(timetable, null, 2));

        // Close connection (optional)
        await sequelize.close();
    } catch (error) {
        console.error("ERROR:", error);
    }
})();
