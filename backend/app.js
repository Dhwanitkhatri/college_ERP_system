
import express from 'express';
import cors from 'cors';
import sequelize from './src/config/db.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;


// Test DB connection
try {
  await sequelize.authenticate();
  console.log('Database connected successfully!');
} catch (error) {
  console.error('Database connection failed:', error);
} 
app.get('/', (req, res) => {
  res.send('College ERP System Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

