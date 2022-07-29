import { RequestHandler } from "express";
import { Client, Issuer, generators, UserinfoResponse } from "openid-client";
import { User } from "../models/user.model";

const ClientNotInitializedError = new Error("Client not initialized");
const CookieNotFoundError = new Error("Cookie is not found in the request");
const NoUserInformationError = new Error("Couldn't get user info.");

export interface AuthenticationProviderOptions {
  discoveryUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUrls: string | Array<string>;
  responseTypes: string | Array<string>;
}

export abstract class AuthenticationProvider {
  name: string;
  issuer?: Issuer;
  initialized: boolean;
  client?: Client;
  clientId: string;
  clientSecret: string;
  discoveryUrl: string;
  redirectUrls: Array<string>;
  responseTypes: Array<string>;

  constructor(name: string, options: AuthenticationProviderOptions) {
    this.name = name;
    this.initialized = false;
    this.discoveryUrl = options.discoveryUrl;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.redirectUrls = Array.isArray(options.redirectUrls)
      ? options.redirectUrls
      : [options.redirectUrls];
    this.responseTypes = Array.isArray(options.responseTypes)
      ? options.responseTypes
      : [options.responseTypes];
  }

  initialize = async () => {
    this.issuer = await Issuer.discover(this.discoveryUrl);
    console.info(`Discovered issuer: ${this.issuer?.issuer}`);
    this.client = new this.issuer.Client({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uris: this.redirectUrls,
      response_types: this.responseTypes,
    });
    this.initialized = true;
  };

  /**
   * Constructs the redirect url based on the Provider settings and the scopes passed in.
   * After constructing the url, redirects the client to the url and sets an id cookie to
   * identify the redirect from the provider.
   * @param scopes Custom scopes to add to the redirect request. Defaults are "openid", "email" and "profile"
   * @returns An express RequestHandler which can be passed to the login route as a middleware
   */
  redirectToLoginPage = (scopes: Array<string> = []): RequestHandler => {
    const cookieName = `oidc:auth:${this.name}`;
    const defaultScopes = ["openid", "email", "profile"];
    const totalScopes = [...defaultScopes, ...scopes];

    return async (req, res, next) => {
      const nonce = generators.nonce();
      // const codeVerifier = generators.codeVerifier();
      // const codeChallenge = generators.codeChallenge(codeVerifier);
      // const codeChallengeMethod = "S256";

      if (!this.client) return next(ClientNotInitializedError);

      const redirectUrl = this.client.authorizationUrl({
        redirect_uri: this.redirectUrls[0],
        scope: totalScopes.join(" "),
        nonce,
        // code_challenge: codeChallenge,
        // code_challenge_method: codeChallengeMethod,
      });

      res.cookie(cookieName, nonce, { httpOnly: true }); // TODO: Encrypt the cookie
      return res.redirect(redirectUrl);
    };
  };

  /**
   * Validates the callback and tries to get the user information from the user information endpoint
   * of the client. The RequestHandler then sets the user object on the request to be used in
   * following middleware
   * @returns An express RequestHandler which can be passed to the callback route as a middleware
   */
  validateCallback = (): RequestHandler => {
    const cookieName = `oidc:auth:${this.name}`;

    return async (req, res, next) => {
      if (!this.client) return next(ClientNotInitializedError);
      if (!req.cookies[cookieName]) return next(CookieNotFoundError);

      const nonce = req.cookies[cookieName] as string;
      const parameters = this.client.callbackParams(req);
      const tokenSet = await this.client.callback(
        this.redirectUrls[0],
        parameters,
        { nonce }
      );

      const userInformation = await this.client.userinfo(tokenSet);
      if (!userInformation) return next(NoUserInformationError);

      req.user = this.generateUserFromUserInformation(userInformation);

      res.clearCookie(cookieName, { httpOnly: true });
      return next();
    };
  };

  /**
   * Function that generates a normalized user object from the user information
   * provided from the provider. The Provider must implement this function as it
   * might be different for different providers.
   */
  abstract generateUserFromUserInformation: (
    userInfo: UserinfoResponse
  ) => User;
}
