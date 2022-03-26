import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'


interface IPayload{
    id: string;
    iat: number;
    exp: number; 
}

/**
 * Esta función valida el token que posee el header del request, en caso de que no sea valido o que el usuario no se
 * encuentre logeado muestra un mensaje de error.
 * @param req Parametro correspondiente a la Request
 * @param res Parametro correspondiente a el Response 
 * @param next 
 * @returns Mensaje de error en el caso de que se presente.
 */
export const TokenValidation = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('auth-token');
    const loggedOut = req.headers.cookie?.includes("loggedout")    
    if(!token){
        return res.status(401).json('Access denied');
    }
    else if (loggedOut){
        return res.status(401).json("You're not logged in");
    }
    const payload = jwt.verify(token, process.env.TOKEN_SECRET || 'tokentest') as IPayload;
    req.userId = payload.id;
   
    next();
}
