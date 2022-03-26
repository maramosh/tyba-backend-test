"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var typeorm_1 = require("typeorm");
var userRoutes_1 = __importDefault(require("./routes/userRoutes"));
var mapRoutes_1 = __importDefault(require("./routes/mapRoutes"));
dotenv_1.default.config();
var app = (0, express_1.default)();
(0, typeorm_1.createConnection)();
//middlewares
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
//routes
app.use(userRoutes_1.default);
app.use(mapRoutes_1.default);
app.listen(3000);
console.log("Server on port", 3000);
