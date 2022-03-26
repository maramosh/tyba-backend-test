import {Router} from 'express'
import {getTransactions, decideSearch} from '../controllers/MapController'
import {TokenValidation} from '../utils/verifyToken'

/**
 * Rutas utilizadas para la busqueda de restaurantes y consulta de transacciones.
 */

const router = Router()

router.post('/searchRest', TokenValidation, decideSearch);
router.get('/transactions', getTransactions);

export default router