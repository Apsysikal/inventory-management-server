import { RequestHandler } from "express";
import { AuthenticationProvider } from "src/auth/base.provider";

export function useProvider(provider: AuthenticationProvider): RequestHandler {
  return async (req, res, next) => {
    if (!provider.initialized) {
      console.info(`Initializing provider: ${provider.name}`);
      await provider.initialize();
    }

    next();
  };
}
