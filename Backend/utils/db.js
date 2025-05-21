const mongoose = require("mongoose");

let isConnected = false;
let connectionPromise = null;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return mongoose.connection;
  }

  if (connectionPromise) {
    console.log("Connection in progress, waiting...");
    return connectionPromise;
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    maxPoolSize: 10,
    minPoolSize: 1,
  };

  try {
    console.log("Connecting to MongoDB Atlas...");

    connectionPromise = mongoose.connect(process.env.MONGODB_URI, options);

    await connectionPromise;

    isConnected = true;
    console.log("MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      isConnected = false;
      connectionPromise = null;
    });

    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    isConnected = false;
    connectionPromise = null;
    throw error;
  }
};

module.exports = { connectToDatabase };
