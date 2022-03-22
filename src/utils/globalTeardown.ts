import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

export default async function globalSetup() {
  const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;
  await instance.stop();
}
