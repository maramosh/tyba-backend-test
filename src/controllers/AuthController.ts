import {Request, Response} from 'express'
import {getRepository, getConnection} from 'typeorm'
import {User} from '../entity/User'
import {encryptPassword,validatePassword} from '../utils/encrypt'
import jwt from 'jsonwebtoken'


/**
 * Esta función corresponde a registrar (SignUp) un usuario, recibe los datos de usuario por parametro, 
 * posteriormente lo crea y guarda en la base de datos. (Con la contraseña encriptada para efectos de seguridad).
 * @param req Parametro correspondiente a la Request
 * @param res Parametro correspondiente a el Response
 * @returns Response con el usuario creado y con su token
 */
export const signUp = async(req: Request, res: Response): Promise<Response> => {
    const user = await getConnection()
    .getRepository(User)
    .createQueryBuilder("User")
    .where("User.email = :User_email", { User_email: req.body.email})
    .getOne();
    
    if(!user && req.body.email !== "" && req.body.password !== "" && req.body.firstName !==  "" && req.body.lastName !== ""){
        // Encriptamos la contraseña
        req.body.password = await encryptPassword(req.body.password);
        const newUser =  getRepository(User).create(req.body);
        const results = await getRepository(User).save(newUser);

        // Creamos el token
        const token:string  = jwt.sign({_id: req.body.password}, process.env.TOKEN_SECRET || 'tokentest'); 
        const expires = new Date(Date.now() +  24 * 60 * 60 * 1000);
        const cookieOptions = {
            expires,
            httpOnly: true,
        };
        res.cookie("jwt", token, cookieOptions);
        return res.header('Token',token).json(results);
    } else if (req.body.email === "" || req.body.password === "" || req.body.firstName ===  "" || req.body.lastName === ""){
        return res.status(400).json({msg: "Please fill all the values"})
    } 

    return res.status(404).json({msg: "User already exists"});
}


/**
 * Esta función corresponde a ingresar (LogIn) un usuario, recibe los datos por parámetro y los valida. En caso 
 * de estar correctos lo logea, en caso contrario muestra un mensaje de error. 
 * @param req Parametro correspondiente a la Request
 * @param res Parametro correspondiente a el Response 
 * @returns Response con el usuario logeado y su token, si los datos son incorrectos, retorna un mensaje de error. 
 */
export const logIn = async(req: Request, res: Response): Promise<Response> => {

    const user = await getConnection()
    .getRepository(User)
    .createQueryBuilder("User")
    .where("User.email = :User_email", { User_email: req.body.email})
    .getOne();
    
    if(user){
        // Validamos la contraseña
        const esValida = await validatePassword(req.body.password, user.password);
        if(!esValida){
            return res.status(404).json({msg: 'Invalid password'});
        }

        // Creamos el token
        const token:string  = jwt.sign({ id: user.id}, process.env.TOKEN_SECRET || 'tokentest' , {
            expiresIn: "1d" 
        })
        const expires = new Date(Date.now() +  24 * 60 * 60 * 1000);
        const cookieOptions = {
            expires,
            httpOnly: true,
        };
        res.cookie("jwt", token, cookieOptions);
        return res.header('auth-token', token).json(user);
    }
    
    return res.status(404).json({msg: 'Email or password is wrong'});
}

/**
 * Esta función corresponde al cierre de sesión (LogOut) de un usuario, en este caso lo que se hace es setear las cookies
 * con el token como loggedout dado que desde el lado del servidor no es posible eliminar el token.
 * @param req Parametro correspondiente a la Request
 * @param res Parametro correspondiente a el Response 
 */
export const logOut = async (req: Request, res: Response) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 3 * 1000),
        httpOnly: true,
      });
    res.status(200).json({ Status: "Logged out successfully" });
}
