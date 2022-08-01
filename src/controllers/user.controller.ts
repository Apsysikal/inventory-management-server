import { NextFunction, Request, RequestHandler, Response } from "express";
import { HydratedDocument } from "mongoose";

import { User } from "../models/user.model";
import { UserService } from "../services/user.service";

const UserObjectDoesNotExist = new Error(
  "User not set. Did you include the validation middleware?"
);
const UserDoesNotExist = new Error("The user does not exist");
const RefreshTokenDoesNotExist = new Error(
  "Refresh Token does not exist on request."
);
const AccessTokenDoesNotExist = new Error(
  "Access Token does not exist on request."
);

export const findOrCreateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return next(UserObjectDoesNotExist);

    req.user = await UserService.findOrCreateUser(req.user);
    return next();
  } catch (error) {
    return next(error);
  }
};

export const generateTokenSet: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return next(UserObjectDoesNotExist);

    const user = req.user as HydratedDocument<User>;
    const accessToken = await UserService.generateAccessToken(user);
    const refreshToken = await UserService.generateRefreshToken(user);

    return res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const generateAccessToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.refreshToken) return next(RefreshTokenDoesNotExist);

    const databaseUser = await UserService.getUserById(req.refreshToken.id);

    if (!databaseUser) return next(UserDoesNotExist);

    const accessToken = await UserService.generateAccessToken(databaseUser);

    return res.json({
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const validateAccessToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.accessToken) return next(AccessTokenDoesNotExist);

    return res.json({
      ...req.accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const validateRefreshToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.refreshToken) return next(RefreshTokenDoesNotExist);

    return res.json({
      ...req.refreshToken,
    });
  } catch (error) {
    return next(error);
  }
};
