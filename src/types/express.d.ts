import express from "express";
import { HydratedDocument } from "mongoose";
import { User } from "../models/user.model";
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "../services/user.service";

declare global {
  namespace Express {
    interface Request {
      user?: User | HydratedDocument<User>;
      accessToken?: IAccessTokenPayload;
      refreshToken?: IRefreshTokenPayload;
    }
  }
}
