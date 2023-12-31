"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const db = knex({
//   client: "pg",
//   connection: {
//     host: "localhost",
//     user: "ubuntu",
//     port: 5432,
//     password: "ubuntu",
//     database: "allthentic",
//   },
// });
const db = (0, knex_1.default)({
    client: "pg",
    connection: {
        host: process.env.HOST,
        user: process.env.USER,
        port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
    },
});
exports.default = db;
