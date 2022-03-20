"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("./server");
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3000;
const server = new server_1.Server(app);
server.start(port);
