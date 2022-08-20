import crypto from "crypto";

const accessTokenSecret = crypto.randomBytes(256).toString("hex");
const refreshTokenSecret = crypto.randomBytes(256).toString("hex");

console.info(`Access Token Secret: ${accessTokenSecret}`);
console.info(`Refresh Token Secret: ${refreshTokenSecret}`);
