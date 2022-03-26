import {Router} from 'express'
import {getUsers, createUser, getUser, updateUser, deleteUser} from '../controllers/UserController'
import {signUp, logIn, logOut} from '../controllers/AuthController'

/**
 * Rutas utilizadas para la administración de los usuarios, así como también su autenticación.
 */

const router = Router()

router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:id', getUser );
router.put('/users', updateUser);
router.delete('/users/:id', deleteUser );


router.post('/signUp', signUp);
router.post('/logIn', logIn);
router.get('/logOut', logOut)


export default router