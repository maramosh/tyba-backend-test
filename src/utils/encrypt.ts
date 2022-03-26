import bcrypt from 'bcryptjs'


/**
 * Función que encripta la contraseña dada por parámetro con el fin de hacer más seguro el tratamiento de datos.
 * @param password Contraseña a encriptar
 * @returns Contraseña encriptada
 */
export const encryptPassword = async (password:string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt); 
}

/**
 * Función que valida si la contraseña que esta ingresando el usuario corresponde a la misma que está guardada en
 * la base de datos.
 * @param passwordSinEncrypt Contraseña que ingresa el usuario.
 * @param passwordGuardada Contraseña guardada en la base de datos.
 * @returns true en caso de que las contraseñas sean las mismas, false en caso contrario.
 */
export const validatePassword = async function(passwordSinEncrypt:string, passwordGuardada:string): Promise<boolean> {
    return await bcrypt.compare( passwordSinEncrypt, passwordGuardada);
}