import { Request, Response, NextFunction } from "express";

import { UserService } from "../services/user.service";

const AutorizationHeaderNotPresent = new Error(
  "Authorization header ist empty. Make sure to provide your token."
);
const TokenTypeInvalid = new Error(
  "Token type is invalid. Make sure to provide your token as type Bearer"
);
const AccessTokenDoesNotExist = new Error(
  "Access Token does not exist on request."
);
const RefreshTokenDoesNotExist = new Error(
  "Refresh Token does not exist on request."
);

export async function useAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;

    if (!header) return next(AutorizationHeaderNotPresent);

    const [tokenType, accessToken] = header.split(" ");

    if (tokenType.toLowerCase() !== "bearer") return next(TokenTypeInvalid);
    if (!accessToken) return next(AccessTokenDoesNotExist);

    req.accessToken = await UserService.validateAccessToken(accessToken);
    return next();
  } catch (error) {
    return next(error);
  }
}

export async function useRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;

    if (!header) return next(AutorizationHeaderNotPresent);

    const [tokenType, refreshToken] = header.split(" ");

    if (tokenType.toLowerCase() !== "bearer") return next(TokenTypeInvalid);
    if (!refreshToken) return next(RefreshTokenDoesNotExist);

    req.refreshToken = await UserService.validateRefreshToken(refreshToken);
    return next();
  } catch (error) {
    return next(error);
  }
}
