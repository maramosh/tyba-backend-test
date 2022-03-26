import {Request, Response} from 'express'
import {getRepository, getConnection} from 'typeorm'
import {User} from '../entity/User'
import {encryptPassword,validatePassword} from '../utils/encrypt'
import jwt from 'jsonwebtoken'
import { userInfo } from 'os'


/**
 * Función que corresponde a ver todos los usuarios existentes en la base de datos.
 * @param req Parametro correspondiente a la Request
 * @param res Parametro correspondiente a el Response 
 * @returns 
 */
export const getUsers = async(req: Request, res: Response): Promise<Response> => {
    const users = await getRepository(User).find();
    return res.json(users);
}

/**
 * Función que corresponde a ver el usuario con el id dado por parámetro.
 * @param req Parametro correspondiente a la Request
 * @param res Parametro correspondiente a el Response 
 * @returns 
 */
export const getUser = async(req: Request, res: Response): Promise<Response> => {
    const user = await getRepository(User).findOne(req.params.id);
    return res.json(user);
}

/**
 * Función que corresponde a la creación de un nuevo usuario.
 * @param req Parametro correspondiente a la Request
 * @param res Parametro correspondiente a el Response 
 * @returns 
 */
export const createUser = async(req: Request, res: Response): Promise<Response> => {
   const newUser =  getRepository(User).create(req.body);
   const results = await getRepository(User).save(newUser);
   return res.json(results);
}

/**
 * Función que corresponde a actualizar un usuario con los datos en el body del request. 
 * @param req Parametro correspondiente a la Request
 * @param res Parametro correspondiente a el Response 
 * @returns 
 */
export const updateUser = async(req: Request, res: Response): Promise<Response> => {
    const user = await getRepository(User).findOne(req.params.id);
    if(user){
        getRepository(User).merge(user, req.body);
        const results = await getRepository(User).save(user);
        return res.json(results);
    }

    return res.status(404).json({msg: 'Not user found'});
}

/**
 * Función que corresponde a la eliminación de un usuario.
 * @param req Parametro correspondiente a la Request
 * @param res Parametro correspondiente a el Response 
 * @returns 
 */
export const deleteUser = async(req: Request, res: Response): Promise<Response> => {
    const user = await getRepository(User).delete(req.params.id);
    return res.json(user);
}


