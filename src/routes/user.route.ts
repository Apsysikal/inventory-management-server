import { Router } from "express";

import { AuthenticationProviderOptions } from "../auth/base.provider";
import { GoogleProvider } from "../auth/google.provider";
import { AzureProvider } from "../auth/azure.provider";
import { useProvider } from "../middlewares/useProvider";
import {
  findOrCreateUser,
  generateAccessToken,
  generateTokenSet,
  validateAccessToken,
  validateRefreshToken,
} from "../controllers/user.controller";
import { useAccessToken, useRefreshToken } from "../middlewares/useToken";

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

// /user
const userRouter = Router();

userRouter.use(useProvider(googleProvider));
userRouter.use(useProvider(azureProvider));

// Setup routes for Google
// Make sure that the callback is correctly setup on the provider
// Setup here: https://console.cloud.google.com/
userRouter.get("/auth/google", googleProvider.redirectToLoginPage());
userRouter.get("/auth/google/callback", [
  googleProvider.validateCallback(),
  findOrCreateUser,
  generateTokenSet,
]);

// Setup routes for Azure
// Make sure that the callback is correctly setup on the provider
// Setup here: https://portal.azure.com/
userRouter.get("/auth/azure", azureProvider.redirectToLoginPage());
userRouter.get("/auth/azure/callback", [
  azureProvider.validateCallback(),
  findOrCreateUser,
  generateTokenSet,
]);

userRouter.post("/refresh-token", [useRefreshToken, generateAccessToken]);
userRouter.get("/validate-access-token", [useAccessToken, validateAccessToken]);
userRouter.get("/validate-refresh-token", [
  useRefreshToken,
  validateRefreshToken,
]);

export default userRouter;
