import { RequestHandler } from "express";
import { AuthenticationProvider } from "src/auth/provider";
import { UserService } from "../services/user.service";

export function getUserFromDatabase(autoRegister = false): RequestHandler {
  return async (req, res, next) => {
    if (!req.user) {
      return next(
        new Error("User not set. Did you include the validation middleware?")
      );
    }

    let databaseUser = await UserService.getUserByProviderAndId(
      req.user.provider,
      req.user.providerId
    );

    if (!databaseUser && autoRegister) {
      databaseUser = await UserService.createUser(req.user);
    }

    if (!databaseUser) {
      return next(
        new Error(
          "Something went wrong pulling the user from the database. Does it exist?"
        )
      );
    }

    req.user = databaseUser;
    return next();
  };
}

export function useProvider(provider: AuthenticationProvider): RequestHandler {
  return async (req, res, next) => {
    if (!provider.initialized) {
      console.info(`Initializing provider: ${provider.name}`);
      await provider.initialize();
    }

    next();
  };
}
