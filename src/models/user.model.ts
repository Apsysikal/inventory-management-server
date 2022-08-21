import { model, Schema } from "mongoose";

export enum Scopes {
  ReadItems = "Items.Read",
  ModifyItems = "Items.Modify",
  ReadLists = "Lists.Read",
  ModifyLists = "Lists.Modify",
}

export type ScopeType = typeof Scopes;

export interface RefreshToken {
  token: string;
  expires: Date;
  salt: string;
}

interface User {
  provider: string;
  providerId: string; // Unique identifier of the user from the provider
  mail: string;
  firstName: string;
  lastName: string;
  displayName: string;
  scopes: Array<Scopes>;
  refreshTokens: Array<RefreshToken>;
}

export interface TokenUser {
  id: string;
  displayName: string;
  scopes: string[];
}

const schema = new Schema<User>(
  {
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
    mail: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    displayName: {
      type: String,
      required: true,
    },
    scopes: {
      type: [String],
      required: true,
      default: [
        Scopes.ReadItems,
        Scopes.ModifyItems,
        Scopes.ReadLists,
        Scopes.ModifyLists,
      ],
    },
    refreshTokens: {},
  },
  {
    timestamps: true,
  }
);

const UserModel = model<User>("User", schema);

export { User, UserModel };
