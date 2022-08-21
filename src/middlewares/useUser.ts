import { NextFunction, Request, RequestHandler, Response } from "express";
import { TokenUser } from "src/models/user.model";

export const useUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.accessToken) return next("No access-token");
    const { id, displayName, scopes } = req.accessToken;
    req.user = {
      id,
      displayName,
      scopes,
    } as TokenUser;
    return next();
  } catch (error) {
    return next(error);
  }
};
