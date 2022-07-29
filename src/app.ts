import path from "path";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { AuthenticationProviderOptions } from "./auth/provider";
import { GoogleProvider } from "./auth/google";
import { AzureProvider } from "./auth/azure";
import { getUserFromDatabase, useProvider } from "./middlewares/auth";

import itemRouter from "./routes/item.route";

const googleProviderOptions: AuthenticationProviderOptions = {
  discoveryUrl: String(process.env.GOOGLE_DISCOVERY_URL),
  clientId: String(process.env.GOOGLE_CLIENT_ID),
  clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
  redirectUrls: String(process.env.GOOGLE_REDIRECT_URL),
  responseTypes: "code",
};

const azureProviderOptions: AuthenticationProviderOptions = {
  discoveryUrl: String(process.env.AZURE_DISCOVERY_URL),
  clientId: String(process.env.AZURE_CLIENT_ID),
  clientSecret: String(process.env.AZURE_CLIENT_SECRET),
  redirectUrls: String(process.env.AZURE_REDIRECT_URL),
  responseTypes: "code",
};

const googleProvider = new GoogleProvider(googleProviderOptions);
const azureProvider = new AzureProvider(azureProviderOptions);

const app = express();

app.use(cors());
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(useProvider(googleProvider));
app.use(useProvider(azureProvider));

app.get("/auth/google", googleProvider.redirectToLoginPage());
app.get("/auth/google/callback", [
  googleProvider.validateCallback(),
  getUserFromDatabase(true),
  async (req: Request, res: Response) => {
    return res.json(req.user);
  },
]);

app.get("/auth/azure", azureProvider.redirectToLoginPage());
app.get("/auth/azure/callback", [
  azureProvider.validateCallback(),
  getUserFromDatabase(true),
  async (req: Request, res: Response) => {
    return res.json(req.user);
  },
]);

app.use("/item", itemRouter);

export default app;
