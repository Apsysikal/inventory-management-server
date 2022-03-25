import app from "./app";
import mongoose from "mongoose";

const databaseUri = String(process.env.MONGODB_URI);
const port = Number(process.env.PORT) || 3000;

mongoose.connection.on("connected", () => {
  console.debug(`Mongoose connection open to ${databaseUri}`);
});

mongoose.connection.on("error", (error) => {
  console.info("Mongoose error");
  console.error(error);
});

mongoose.connection.on("disconnected", () => {
  console.info("Mongoose connection disconnected");
});

mongoose
  .connect(databaseUri)
  .then(() => {
    console.info("Mongoose connected");

    app.listen(port);
    console.info(`App listening on port ${port}`);
  })
  .catch((error) => {
    console.info("Failed to connect");
    console.error(error);
  });

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.info("SIGINT, closing connection to database");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  mongoose.connection.close(() => {
    console.info("SIGTERM, closing connection to database");
    process.exit(0);
  });
});
