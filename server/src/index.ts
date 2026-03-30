import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import aiRoutes from './routes/ai';
import imageRoutes from './routes/images';
import inventoryRoutes from './routes/inventory';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Kitchen Kernel server is running 🍳' });
});

app.use('/api/ai', aiRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/inventory', inventoryRoutes);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🍳 Kitchen Kernel server running on port ${PORT}`);
  });
};

start();
