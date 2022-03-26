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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = exports.getRestLatLng = exports.getRestCity = exports.decideSearch = void 0;
var google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
var typeorm_1 = require("typeorm");
var Consult_1 = require("../entity/Consult");
/**
 * Esta función corresponde a la toma de decisión entre buscar por ciudad o buscar por coordenadas ya que dada
 * la implementación de la Api de google estas busquedas no pueden realizarse con los mismos métodos.
 * @param req Parametro correspondiente a la Request
 * @param res Parametro correspondiente a el Response
 * @param next
 */
var decideSearch = function (req, res, next) {
    var body = req.body;
    if (body.city) {
        (0, exports.getRestCity)(req, res, next);
    }
    else {
        (0, exports.getRestLatLng)(req, res, next);
    }
};
exports.decideSearch = decideSearch;
/**
 * Esta función corresponde a la busqueda de restaurantes dada una ciudad, lo que hace es tomar la ciudad del body
 * del request y mediante el método textSearch de la Api de google buscar los restaurantes que cumplan con dicho parámetro.
 * @param req Parametro correspondiente a la Request
 * @param res Parametro correspondiente a el Response
 * @param next
 */
var getRestCity = function (req, res, next) {
    var body = req.body;
    var clientMap = new google_maps_services_js_1.Client({});
    clientMap.textSearch({
        params: {
            query: body.city,
            type: google_maps_services_js_1.PlaceType1.restaurant,
            key: process.env.GOOGLE_MAPS_API_KEY + "",
        }, timeout: 1000,
    }).then(function (r) {
        var timeElapsed = Date.now();
        var today = new Date(timeElapsed);
        var newConsult = (0, typeorm_1.getRepository)(Consult_1.Consult).create({
            date: today.toUTCString(),
            latitude: "",
            longitude: "",
            city: body.city
        });
        (0, typeorm_1.getRepository)(Consult_1.Consult).save(newConsult);
        return res.json(r.data.results);
    })
        .catch(function (e) {
        console.error('Error Api Google', e);
        return next(res.sendStatus(500));
    });
};
exports.getRestCity = getRestCity;
/**
 * Esta función corresponde a la busqueda de restaurantes dada unas coordenadas, lo que hace es tomar las coordenadas
 * (latitud y longitud) del body del request y mediante el método textSearch de la Api de google buscar los
 * restaurantes que cumplan con dicho parámetro. A su vez, cada que se hace un request, esta función la guarda en la
 * base de datos para su posterior consulta.
 * @param req Parámetro correspondiente a la request
 * @param res Parámetro correspondiente a el response
 * @param next
 */
var getRestLatLng = function (req, res, next) {
    var body = req.body;
    var clientMap = new google_maps_services_js_1.Client({});
    clientMap
        .placesNearby({
        params: {
            location: [body.lat, body.lng],
            key: process.env.GOOGLE_MAPS_API_KEY + "",
            type: "restaurant",
            rankby: google_maps_services_js_1.PlacesNearbyRanking.distance
        },
        timeout: 1000, // milliseconds
    })
        .then(function (r) {
        var timeElapsed = Date.now();
        var today = new Date(timeElapsed);
        var newConsult = (0, typeorm_1.getRepository)(Consult_1.Consult).create({
            date: today.toUTCString(),
            latitude: body.lat,
            longitude: body.lng,
            city: ""
        });
        (0, typeorm_1.getRepository)(Consult_1.Consult).save(newConsult);
        return res.json(r.data.results);
    })
        .catch(function (e) {
        console.error('Error Api Google', e);
        return next(res.sendStatus(500));
    });
};
exports.getRestLatLng = getRestLatLng;
/**
 * Esta función corresponde a ver todas las consultas que se han hecho historicamente.
 * @param req Parámetro correspondiente a la request
 * @param res Parámetro correspondiente a el response
 * @returns Retorna en el respond un Json que contiene todas las consultas existentes en la base de datos.
 */
var getTransactions = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var transactions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, typeorm_1.getRepository)(Consult_1.Consult).find()];
            case 1:
                transactions = _a.sent();
                return [2 /*return*/, res.json(transactions)];
        }
    });
}); };
exports.getTransactions = getTransactions;
