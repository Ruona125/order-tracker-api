"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRegisteredUser = exports.getCertainRegisteredUser = exports.getRegisteredUsers = exports.registerAdmin = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../../utils/database"));
const crypto_1 = require("crypto");
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password, security_question, security_answer } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        try {
            // Insert into the database
            yield (0, database_1.default)("users").insert({
                user_id: (0, crypto_1.randomBytes)(4).toString("hex"),
                name,
                password: passwordHash,
                email,
                roles: "staff",
                security_answer,
                security_question
            });
            res.status(200).json("User successfully created");
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ message: "Error creating user" });
        }
    });
}
exports.registerUser = registerUser;
function registerAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password, security_question, security_answer } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        try {
            // Insert into the database
            yield (0, database_1.default)("users").insert({
                user_id: (0, crypto_1.randomBytes)(4).toString("hex"),
                name,
                password: passwordHash,
                email,
                roles: "admin",
                security_question,
                security_answer
            });
            res.status(200).json("User successfully created");
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ message: "Error creating user" });
        }
    });
}
exports.registerAdmin = registerAdmin;
function getRegisteredUsers(req, res) {
    database_1.default.select("*")
        .from("users")
        .where("roles", "staff")
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(400).json({ message: "error getting users" }));
}
exports.getRegisteredUsers = getRegisteredUsers;
function getCertainRegisteredUser(req, res) {
    const { user_id } = req.params;
    database_1.default.select("*")
        .from("users")
        .where({ user_id })
        .then((user) => {
        if (user.length) {
            return res.json(user[0]);
        }
        else {
            return res.status(400).json("user not found");
        }
    })
        .catch((err) => res.status(400).json({ message: "error getting users" }));
}
exports.getCertainRegisteredUser = getCertainRegisteredUser;
function deleteRegisteredUser(req, res) {
    const { user_id } = req.params;
    (0, database_1.default)("users")
        .where({
        user_id,
    })
        .del()
        .then(() => {
        res.json("user deleted");
    })
        .catch((err) => res.status(400).json("error"));
}
exports.deleteRegisteredUser = deleteRegisteredUser;
