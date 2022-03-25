import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

export default async function globalSetup() {
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).__MONGOINSTANCE = instance;
  process.env.MONGO_URI = uri;
  process.env.MONGO_DB = "test";

  await mongoose.connect(`${process.env.MONGO_URI}${process.env.MONGO_DB}`);
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
}
