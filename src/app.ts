import path from "path";
import express, { Express, Request, Response } from "express";

import itemRouter from "./routes/item.router";

const app = express();

app.use(express.static(path.resolve(__dirname, "..", "public")));

app.use("/item", itemRouter);

export default app;
