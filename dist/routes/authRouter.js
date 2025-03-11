"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const AuthController_1 = require("../controllers/AuthController");
const validation_1 = require("../middleware/validation");
const limiter_1 = require("../config/limiter");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(limiter_1.limiter); //aplicamos el limiter a todos los endpoints
router.post("/create-account", (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre no deve ir vacio'), (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('El password es muy corto minmo 8 Caracteres'), (0, express_validator_1.body)('email').isEmail().withMessage('E-mail no valido'), validation_1.handleInputErrors, AuthController_1.AuthController.createAcconunt);
router.post('/confirm-account', limiter_1.limiter, //solo lo aplica a esta url
(0, express_validator_1.body)('token').notEmpty().isLength({ min: 6, max: 6 }).withMessage('token no valido'), validation_1.handleInputErrors, AuthController_1.AuthController.confirmAccout);
router.post('/login', (0, express_validator_1.body)('email').isEmail().withMessage('E-mail no valido'), (0, express_validator_1.body)('password').notEmpty().withMessage('El password es obligatorio'), validation_1.handleInputErrors, AuthController_1.AuthController.Login);
router.post('/forgot-password', (0, express_validator_1.body)('email').isEmail().withMessage('El E-mail no es valido'), validation_1.handleInputErrors, AuthController_1.AuthController.forgortPassword);
//validar token
router.post('/validate-token', (0, express_validator_1.body)('token').isLength({ min: 6, max: 6 }).withMessage('token no valido'), validation_1.handleInputErrors, AuthController_1.AuthController.validateToken);
router.post('/update-password/:token', (0, express_validator_1.param)('token').isNumeric().withMessage('Token no valido'), (0, express_validator_1.body)('password').notEmpty().isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'), (0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Los password no son iguales');
    }
    return true;
}), validation_1.handleInputErrors, AuthController_1.AuthController.updatePasswordWithToken);
router.get('/user', auth_1.autheticate, AuthController_1.AuthController.user);
router.post('/update-password', auth_1.autheticate, (0, express_validator_1.body)('current_password').notEmpty().withMessage('El password no puede ir vacio'), (0, express_validator_1.body)('password').notEmpty().isLength({ min: 8 }).withMessage('El password nuevo es muy corto, minimo 8 caracteres'), validation_1.handleInputErrors, AuthController_1.AuthController.updateCurrentPassword);
router.post('/check-password', auth_1.autheticate, (0, express_validator_1.body)('password').notEmpty().withMessage('El password no puede ir vacio'), validation_1.handleInputErrors, AuthController_1.AuthController.checkPassword);
router.put('/user', auth_1.autheticate, (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre no deve ir vacio'), (0, express_validator_1.body)('email').isEmail().withMessage('E-mail no valido'), validation_1.handleInputErrors, auth_1.emailExists, AuthController_1.AuthController.updateProfile);
exports.default = router;
//# sourceMappingURL=authRouter.js.map