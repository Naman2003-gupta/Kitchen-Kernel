import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || '';
    if (!uri) {
      console.warn('⚠️  No MONGO_URI found, skipping DB connection');
      return;
    }
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
};