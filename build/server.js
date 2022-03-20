"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
class Server {
    constructor(app) {
        this.app = app;
        this.app.use(express_1.default.static(path_1.default.resolve(__dirname + "/../public/frontend/")));
        this.app.get("/api", (req, res) => {
            res.end("You have reached the api endpoint");
        });
        this.app.get("*", (req, res) => {
            res.sendFile(path_1.default.resolve(__dirname + "/../public/frontend/build/index.html"));
        });
    }
    start(port) {
        this.app.listen(port, () => console.log(`Server listening on port ${port}!`));
    }
}
exports.Server = Server;
