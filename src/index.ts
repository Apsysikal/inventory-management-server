import app from "./app";
import mongoose from "mongoose";
import Logger from "./config/logger";

const databaseUri = String(process.env.MONGODB_URI);
const port = Number(process.env.PORT) || 3000;

mongoose.connection.on("connected", () => {
  Logger.debug(`Mongoose connection open to ${databaseUri}`);
});

mongoose.connection.on("error", (error) => {
  Logger.info("Mongoose error");
  Logger.error(error);
});

mongoose.connection.on("disconnected", () => {
  Logger.info("Mongoose connection disconnected");
});

mongoose
  .connect(databaseUri)
  .then(() => {
    Logger.info("Mongoose connected");

    app.listen(port);
    Logger.info(`App listening on port ${port}`);
  })
  .catch((error) => {
    Logger.info("Failed to connect");
    Logger.error(error);
  });

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    Logger.info("SIGINT, closing connection to database");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  mongoose.connection.close(() => {
    Logger.info("SIGTERM, closing connection to database");
    process.exit(0);
  });
});