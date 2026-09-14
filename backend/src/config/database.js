const mongoose = require("mongoose");

const connectDatabase = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection failed:", error.message);
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
