import path from "path";
import express from "express";
import cors from "cors";

import itemRouter from "./routes/item.route";

const app = express();

app.use(cors());
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/item", itemRouter);

export default app;
