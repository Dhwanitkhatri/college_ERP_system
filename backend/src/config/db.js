//om ganeshay namah 🙏
import dotenv from "dotenv";
import { Sequelize } from "sequelize";


// load .env from backend folder
dotenv.config();



export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
  }
);

try {
  await sequelize.authenticate();
  console.log(" Database connected successfully!");
} catch (error) {
  console.error(" Database connection failed:", error);
}


