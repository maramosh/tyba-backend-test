"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var MapController_1 = require("../controllers/MapController");
var verifyToken_1 = require("../utils/verifyToken");
/**
 * Rutas utilizadas para la busqueda de restaurantes y consulta de transacciones.
 */
var router = (0, express_1.Router)();
router.post('/searchRest', verifyToken_1.TokenValidation, MapController_1.decideSearch);
router.get('/transactions', MapController_1.getTransactions);
exports.default = router;
