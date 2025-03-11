

import { rateLimit} from 'express-rate-limit'


export const limiter = rateLimit({
    windowMs:  60*1000,// cada cunto tiempo pueden hacer peticioens
    limit:process.env.NODE_ENV==='production' ? 5 : 100,  //cuatas peticiones se pueden hacer
    message:{"error": "Has alcanzado el limite de peticiones"}
})