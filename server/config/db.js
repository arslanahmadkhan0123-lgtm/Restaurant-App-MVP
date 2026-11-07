const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Primary MongoDB unavailable: ${error.message}`);
    memoryServer = await MongoMemoryServer.create();
    const conn = await mongoose.connect(memoryServer.getUri(), {
      dbName: 'restaurant_app'
    });
    console.log('MongoDB memory server started for development');
    global.__USING_MEMORY_DB__ = true;
  }
};

module.exports = connectDB;