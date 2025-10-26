//om ganeshshaya namah
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {sequelize} from  './src/config/db.js';
import * as models from "./src/model/index.js";
import authRoutes from './src/routes/authRoutes.js'
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;


// Test DB connection
try {
  await sequelize.authenticate();
  console.log('Database connected successfully!');
  await sequelize.sync({alter:true});
  console.log('all tables are created ');
} catch (error) {
  console.error('Database connection failed:', error);
} 

app.use("/api/auth",authRoutes);

app.get('/', (req, res) => {
  res.send('College ERP System Backend is running');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

