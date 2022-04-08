import { Request, Response } from "express";
import morgan, { StreamOptions } from "morgan";
import Logger from "../config/logger";

const stream: StreamOptions = {
  write: (message: string) => Logger.debug(message.replace(/\n$/, "")),
};

const skip = () => {
  return process.env.NODE_ENV === "development" ? false : true;
};

const options: morgan.Options<Request, Response> = {
  skip,
  stream,
};

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  options
);

export default morganMiddleware;
