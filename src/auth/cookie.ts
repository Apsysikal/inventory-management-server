import { Request, Response, CookieOptions } from "express";

const ENCODING_TYPE = "base64";

function stringifyCookiePayload(payload: object) {
  const stringifiedPayload = JSON.stringify(payload);
  const buffer = Buffer.from(stringifiedPayload);
  return buffer.toString(ENCODING_TYPE);
}

function parseCookiePayload(payload: string) {
  const buffer = Buffer.from(payload, ENCODING_TYPE);
  const stringifiedPayload = buffer.toString();
  return JSON.parse(stringifiedPayload);
}

function defaultCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
  };
}

export function storeTemporaryCookie(
  key: string,
  res: Response,
  value: object
) {
  const payload = stringifyCookiePayload(value);

  return res.cookie(key, payload, defaultCookieOptions());
}

export function getTemporaryCookie(key: string, req: Request, res: Response) {
  if (!req.cookies[key]) return undefined;

  const payload = req.cookies[key];
  const parsedPayload = parseCookiePayload(payload);

  res.clearCookie(key, defaultCookieOptions());

  return parsedPayload;
}
