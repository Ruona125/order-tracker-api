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
exports.resetPassword = exports.changePassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../../utils/database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user_id, old_password, new_password, confirm_password } = req.body;
        try {
            const user = yield (0, database_1.default)("users").where({ user_id }).first();
            if (!user) {
                return res.status(404).json({ error: "user not found" });
            }
            if (!(yield bcrypt_1.default.compare(old_password, user.password))) {
                return res.status(400).json({ error: "old password is incorrect" });
            }
            if (new_password !== confirm_password) {
                return res
                    .status(400)
                    .json({ error: "new password and confirm password do not match" });
            }
            const hashedPassword = yield bcrypt_1.default.hash(new_password, 10);
            yield (0, database_1.default)("users").where({ user_id }).update({ password: hashedPassword });
            return res.status(200).json({ message: "password reset successful" });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
}
exports.changePassword = changePassword;
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, security_question, security_answer, password, confirm_password, } = req.body;
        try {
            const user = yield (0, database_1.default)("users").where({ email }).first();
            if (!user) {
                return res.status(404).json({ error: "user not found" });
            }
            if (user.security_answer !== security_answer) {
                console.log("answer problem");
                return res
                    .status(400)
                    .json({ error: "incorrect security question answer" });
            }
            if (user.security_question !== security_question) {
                console.log("question problem");
                return res.status(400).json({ error: "incorrect security question" });
            }
            if (password !== confirm_password) {
                return res
                    .status(400)
                    .json({ error: "New password and confirm password do not match." });
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            yield (0, database_1.default)("users")
                .where({ user_id: user.user_id })
                .update({ password: hashedPassword });
            return res.status(200).json({ message: "password reset successful" });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ error: "internal server error" });
        }
    });
}
exports.resetPassword = resetPassword;
