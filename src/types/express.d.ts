import express from "express";
import { HydratedDocument } from "mongoose";
import { User, TokenUser } from "../models/user.model";
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "../services/user.service";

declare global {
  namespace Express {
    interface Request {
      user?: User | HydratedDocument<User> | TokenUser;
      accessToken?: IAccessTokenPayload;
      refreshToken?: IRefreshTokenPayload;
    }
  }
}
