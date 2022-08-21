import { UserinfoResponse } from "openid-client";
import { Scopes } from "../models/user.model";
import {
  AuthenticationProvider,
  AuthenticationProviderOptions,
} from "./base.provider";

export class AzureProvider extends AuthenticationProvider {
  constructor(options: AuthenticationProviderOptions) {
    super("azure", options);
  }

  generateUserFromUserInformation = (userInfo: UserinfoResponse) => {
    return {
      provider: this.name,
      providerId: userInfo.sub,
      mail: userInfo.email as string,
      firstName: userInfo.given_name as string,
      lastName: userInfo.family_name as string,
      displayName: userInfo.name as string,
      scopes: [
        Scopes.ReadItems,
        Scopes.ModifyItems,
        Scopes.ReadLists,
        Scopes.ModifyLists,
      ],
      refreshTokens: [
        {
          token: "",
          expires: new Date(),
          salt: "",
        },
      ],
    };
  };
}
