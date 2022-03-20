import path from "path";
import express, { Express, Request, Response } from "express";

const app = express();

app.use(express.static(path.resolve(__dirname, "..", "public")));

app.all("/api", (req: Request, res: Response) => {
  res.end("You have reached the api endpoint");
});

export default app;
