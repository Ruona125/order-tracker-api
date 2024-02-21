"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const port = 8000;
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send("hello");
});
app.get("/hi", (req, res) => {
    res.send("hi");
});
app.listen(port, () => {
    console.log("listeing to port 8000");
});
// "build": "rimraf dist && npx tsc",
// "prestart": "npm run build",
// "start": "node server.ts",
// "preserve": "npm run build",
// "serve": "concurrently \"npx tsc -w\" & \"nodemon dist/server.js\""
