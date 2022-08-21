import { HydratedDocument } from "mongoose";
import jwt, { SignOptions } from "jsonwebtoken";

import { User, UserModel } from "../models/user.model";

export interface IAccessTokenPayload {
  id: string;
  displayName: string;
  scopes: string[];
}

export interface IRefreshTokenPayload {
  id: string;
}

const AccessTokenNotSetError = new Error(
  "Access Token is empty. Make sure JWT_ACCESS_TOKEN_SECRET environment variable is set"
);
const RefreshTokenNotSetError = new Error(
  "Refresh Token is empty. Make sure JWT_REFRESH_TOKEN_SECRET environment variable is set"
);

const accessTokenSecret = String(process.env.JWT_ACCESS_TOKEN_SECRET);
const refreshTokenSecret = String(process.env.JWT_REFRESH_TOKEN_SECRET);

if (!accessTokenSecret) throw AccessTokenNotSetError;
if (!refreshTokenSecret) throw RefreshTokenNotSetError;

function defaultAccessTokenOptions(): SignOptions {
  return {
    algorithm: "HS256",
    expiresIn: "15m",
  };
}

function defaultRefreshTokenOptions(): SignOptions {
  return {
    algorithm: "HS256",
    expiresIn: "1d",
  };
}

class UserService {
  static async getUserById(id: string): Promise<HydratedDocument<User> | null> {
    return await UserModel.findById(id);
  }

  static async createUser(data: User): Promise<HydratedDocument<User>> {
    return await new UserModel(data).save();
  }

  static async findUser(
    id: string
  ): Promise<Promise<HydratedDocument<User> | null>> {
    return await UserModel.findById(id);
  }

  static async findOrCreateUser(data: User): Promise<HydratedDocument<User>> {
    const filter = { provider: data.provider, providerId: data.providerId };
    const user = await UserModel.findOne(filter);

    if (user) {
      return user;
    }

    return await new UserModel(data).save();
  }

  static async generateAccessToken(user: HydratedDocument<User>) {
    return new Promise<string>((resolve, reject) => {
      const { _id: id, displayName, scopes } = user;
      const options = defaultAccessTokenOptions();

      const payload = {
        id,
        displayName,
        scopes,
      };

      jwt.sign(payload, accessTokenSecret, options, (error, token) => {
        if (error) {
          return reject(error);
        }

        return resolve(token as string);
      });
    });
  }

  static async validateAccessToken(token: string) {
    return new Promise<IAccessTokenPayload>((resolve, reject) => {
      const options = defaultAccessTokenOptions();

      jwt.verify(token, accessTokenSecret, options, (error, payload) => {
        if (error) {
          return reject(error);
        }

        return resolve(payload as IAccessTokenPayload);
      });
    });
  }

  static async generateRefreshToken(user: HydratedDocument<User>) {
    return new Promise<string>((resolve, reject) => {
      const { _id: id } = user;
      const options = defaultRefreshTokenOptions();

      const payload = {
        id,
      };

      jwt.sign(payload, refreshTokenSecret, options, (error, token) => {
        if (error) {
          return reject(error);
        }

        return resolve(token as string);
      });
    });
  }

  static async validateRefreshToken(token: string) {
    return new Promise<IRefreshTokenPayload>((resolve, reject) => {
      const options = defaultAccessTokenOptions();

      jwt.verify(token, refreshTokenSecret, options, (error, payload) => {
        if (error) {
          return reject(error);
        }

        return resolve(payload as IRefreshTokenPayload);
      });
    });
  }
}

export { UserService };
