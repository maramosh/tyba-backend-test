"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenValidation = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Esta función valida el token que posee el header del request, en caso de que no sea valido o que el usuario no se
 * encuentre logeado muestra un mensaje de error.
 * @param req Parametro correspondiente a la Request
 * @param res Parametro correspondiente a el Response
 * @param next
 * @returns Mensaje de error en el caso de que se presente.
 */
var TokenValidation = function (req, res, next) {
    var _a;
    var token = req.header('auth-token');
    var loggedOut = (_a = req.headers.cookie) === null || _a === void 0 ? void 0 : _a.includes("loggedout");
    if (!token) {
        return res.status(401).json('Access denied');
    }
    else if (loggedOut) {
        return res.status(401).json("You're not logged in");
    }
    var payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || 'tokentest');
    req.userId = payload.id;
    next();
};
exports.TokenValidation = TokenValidation;
