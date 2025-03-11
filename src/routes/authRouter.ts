import { Router }  from 'express'
import {body, param} from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'
import { limiter } from '../config/limiter'
import { autheticate, emailExists } from '../middleware/auth'

const router = Router()

router.use(limiter)//aplicamos el limiter a todos los endpoints

router.post("/create-account", 
     body('name').notEmpty().withMessage('El nombre no deve ir vacio'),
     body('password').isLength({min:8}).withMessage('El password es muy corto minmo 8 Caracteres'),
     body('email').isEmail().withMessage('E-mail no valido'),
     handleInputErrors,


    AuthController.createAcconunt
)


router.post('/confirm-account',
      limiter,//solo lo aplica a esta url
      body('token').notEmpty().isLength({min:6 ,max:6}).withMessage('token no valido'),
      handleInputErrors,

     AuthController.confirmAccout
)

router.post('/login',
    body('email').isEmail().withMessage('E-mail no valido'),
    body('password').notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    AuthController.Login
)

router.post('/forgot-password',
    body('email').isEmail().withMessage('El E-mail no es valido'),
    handleInputErrors,
    AuthController.forgortPassword

)
//validar token
router.post('/validate-token',
    body('token').isLength({min:6 ,max:6}).withMessage('token no valido'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token').isNumeric().withMessage('Token no valido'),
    body('password').notEmpty().isLength({min:8}).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value , {req})=>{
         if(value !== req.body.password){
            throw new Error('Los password no son iguales')
         }   
         return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken

)


router.get('/user',
    autheticate,
    AuthController.user
)

router.post('/update-password',
    autheticate,
    body('current_password').notEmpty().withMessage('El password no puede ir vacio'),
    body('password').notEmpty().isLength({min:8}).withMessage('El password nuevo es muy corto, minimo 8 caracteres'),
    handleInputErrors,
    AuthController.updateCurrentPassword

)

router.post('/check-password',
    autheticate,
    body('password').notEmpty().withMessage('El password no puede ir vacio'),
    handleInputErrors,
    AuthController.checkPassword
)

router.put('/user',
    autheticate,
    body('name').notEmpty().withMessage('El nombre no deve ir vacio'),
    body('email').isEmail().withMessage('E-mail no valido'),
    handleInputErrors,
    emailExists,
    AuthController.updateProfile

)


export default router