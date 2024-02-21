"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./src/app"));
const PORT = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 8000;
const server = http_1.default.createServer(app_1.default);
server.listen(PORT, '0.0.0.0', () => {
    console.log(`listeing to port ${PORT}`);
});
