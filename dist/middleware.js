"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const middleware = (req, res, next) => {
    const header = req.headers["authorization"];
    console.log(header);
    try {
        const decoded = jsonwebtoken_1.default.verify(header, config_1.JWT_PASSWORD);
        console.log(decoded);
        if (decoded) {
            //@ts-ignore
            req.userId = decoded.id;
            next();
        }
    }
    catch (error) {
        res.status(500).json({ msg: "Middleware throwing error.Unauthorised acess" });
        return;
    }
};
exports.middleware = middleware;
