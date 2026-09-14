require("dotenv").config();

const app = require("./app");

const { connectDatabase, disconnectDatabase } = require("./config/database");

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await connectDatabase();

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

const shutdownServer = async (signal) => {
  console.log(`${signal} received. Shutting down...`);

  if (server) {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  } else {
    await disconnectDatabase();
    process.exit(0);
  }
};

process.on("SIGTERM", () => {
  shutdownServer("SIGTERM");
});

process.on("SIGINT", () => {
  shutdownServer("SIGINT");
});

startServer();
