"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPostCertainToken = exports.verifyCertainToken = exports.authorize = exports.staffAuth = exports.adminAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function adminAuth(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        req.roles = decoded.roles;
        if (decoded.roles !== "admin") {
            return res.status(401).json("Unauthorized");
        }
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
exports.adminAuth = adminAuth;
function staffAuth(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        req.roles = decoded.roles;
        if (decoded.roles !== "staff" && decoded.roles !== "admin") {
            return res.status(401).json("Unauthorized");
        }
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
exports.staffAuth = staffAuth;
function authorize(req, res, next) {
    // Get the token from the request headers or query parameters
    const token = req.headers.authorization || req.query.token;
    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }
    try {
        // Verify and decode the token
        const decoded = jsonwebtoken_1.default.verify(token, 'your_secret_key');
        // Check if the token has expired
        if (decoded.exp <= Date.now() / 1000) {
            return res.status(401).json({ message: 'Token has expired' });
        }
        // Token is valid, proceed to the next middleware
        next();
    }
    catch (error) {
        // Token verification failed
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
}
exports.authorize = authorize;
function verifyCertainToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        req.userId = decoded.userId;
        if (decoded.userId !== req.params.user_id) {
            return res.status(401).json("unauthorize");
        }
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
exports.verifyCertainToken = verifyCertainToken;
function verifyPostCertainToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        req.userId = decoded.userId;
        if (decoded.userId !== req.body.user_id) {
            return res.status(401).json("unauthorize");
        }
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
exports.verifyPostCertainToken = verifyPostCertainToken;
