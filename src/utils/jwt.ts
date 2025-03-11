import jwt from 'jsonwebtoken';


export const genrateJWT = (id: string):string=>{
    
    //el primer parametro del sig deve ser un objeto
    const token = jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '30d'
    })

    return token

}