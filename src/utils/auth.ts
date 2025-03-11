

import bcrypt from "bcrypt";

export const hashPassword= async(password:string) =>{
    //salt cadena de caracters aleatorea ,10 rondas cantida de veces que re ejecuata el hash
    const salt= await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}


export const checkPassword = async (password: string, passwordDb:string) => {
    const result = await bcrypt.compare(password, passwordDb)
    return result
}

export const generateToken = ()=> Math.floor(100000 + Math.random() * 900000).toString()
