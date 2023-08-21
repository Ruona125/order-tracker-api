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
exports.test = exports.logout = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../../utils/database"));
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        //make sure the user input an email and password value
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        try {
            //find the user in the database
            const user = yield (0, database_1.default)("users").where({ email }).first();
            if (!user) {
                return res.status(401).json({ message: "invalid Login details" });
            }
            //check if the password is correct
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "invalid Login details" });
            }
            //Generate a jwt token
            const token = jsonwebtoken_1.default.sign({ userId: user.user_id, roles: user.roles }, "your_secret_key", { expiresIn: "1h" });
            //This is to check if the user_id is stored in the token
            const decode = jsonwebtoken_1.default.decode(token);
            // console.log(decode.roles);
            // console.log(decode.exp)
            //this is to insert the data into the sessions table
            yield (0, database_1.default)("sessions").insert({
                user_id: user.user_id,
                token: token,
            });
            //return the user details with token.
            const userWithToken = Object.assign(Object.assign({}, user), { token });
            return res.status(200).json(userWithToken);
        }
        catch (err) {
            console.log(err);
            res.status(401).json({ message: "error loggin in" });
        }
    });
}
exports.login = login;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const authToken = req.headers.authorization;
        try {
            // Delete the session record based on the token
            yield (0, database_1.default)("sessions").where({ token: authToken }).del();
            res.status(200).json({ message: "Logout successful" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred during logout" });
        }
    });
}
exports.logout = logout;
function test(req, res) {
    res.status(200).json("welcome!!!");
}
exports.test = test;
