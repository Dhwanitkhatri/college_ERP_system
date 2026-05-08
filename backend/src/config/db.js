//om ganeshay namah 🙏
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

// load .env from backend folder
dotenv.config();

console.log("Database Host:", process.env.DB_HOST); // Debugging line
console.log("Database User:", process.env.DB_USER);
console.log("Database Password:", process.env.DB_PASSWORD);
console.log("Database Name:", process.env.DB_NAME);
console.log("Database Dialect:", process.env.DB_DIALECT);
console.log("Database Port:", process.env.DB_PORT);

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
  }
);

try {
  await sequelize.authenticate();
  console.log(" Database connected successfully!");
} catch (error) {
  console.error(" Database connection failed:", error);
}
