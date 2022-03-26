"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var UserController_1 = require("../controllers/UserController");
var AuthController_1 = require("../controllers/AuthController");
/**
 * Rutas utilizadas para la administración de los usuarios, así como también su autenticación.
 */
var router = (0, express_1.Router)();
router.get('/users', UserController_1.getUsers);
router.post('/users', UserController_1.createUser);
router.get('/users/:id', UserController_1.getUser);
router.put('/users', UserController_1.updateUser);
router.delete('/users/:id', UserController_1.deleteUser);
router.post('/signUp', AuthController_1.signUp);
router.post('/logIn', AuthController_1.logIn);
router.get('/logOut', AuthController_1.logOut);
exports.default = router;
