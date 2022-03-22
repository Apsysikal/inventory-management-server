import app from "./app";
import mongoose from "mongoose";

const dbUri = "mongodb://db:27017/test";

mongoose.connection.on("connected", () => {
  console.debug(`Mongoose connection open to ${dbUri}`);
});

mongoose.connection.on("error", (error) => {
  console.info("Mongoose error");
  console.error(error);
});

mongoose.connection.on("disconnected", () => {
  console.info("Mongoose connection disconnected");
});

mongoose
  .connect(dbUri)
  .then(() => {
    console.info("Mongoose connected");
  })
  .catch((error) => {
    console.info("Failed to connect");
    console.error(error);
  });

const port = Number(process.env.PORT) || 3000;

app.listen(port);

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
