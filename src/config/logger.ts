import winston from "winston";

const level = process.env.NODE_ENV === "development" ? "debug" : "info";

const format = winston.format.combine(
  winston.format.timestamp({ format: "YY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    return `${info.timestamp} ${info.level} ${info.message}`;
  })
);

const transports = [
  new winston.transports.Console({
    level: level,
  }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({ filename: "logs/all.log" }),
];

const Logger = winston.createLogger({
  level: level,
  format: format,
  transports: transports,
});

export default Logger;
