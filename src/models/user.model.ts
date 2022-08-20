import { model, Schema } from "mongoose";

export enum ItemScope {
  ReadItems = "Items.Read",
  ModifyItems = "Items.Modify",
}

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
  scopes: Array<ItemScope>;
  refreshTokens: Array<RefreshToken>;
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
      default: [ItemScope.ReadItems],
    },
    refreshTokens: {},
  },
  {
    timestamps: true,
  }
);

const UserModel = model<User>("User", schema);

export { User, UserModel };
