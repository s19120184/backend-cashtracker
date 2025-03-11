"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const AuthController_1 = require("../../../controllers/AuthController");
const User_1 = require("../../../models/User");
const auth_1 = require("../../../utils/auth");
const authEmail_1 = require("../../../utils/email/authEmail");
const jwt_1 = require("../../../utils/jwt");
jest.mock("../../../models/User");
jest.mock("../../../utils/auth");
jest.mock("../../../utils/jwt");
describe("AuthContoller.createAccount", () => {
    beforeEach(() => {
        jest.resetAllMocks(); //reiniciar los mock
    });
    it("should return a 409 status and an error message if email is already registered", async () => {
        User_1.User.findOne.mockResolvedValue(true);
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: 'api/auth/create-account',
            body: {
                email: 'test@example.com',
                password: 'testpassword'
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await AuthController_1.AuthController.createAcconunt(req, res);
        expect(res.statusCode).toBe(409);
        expect(res._getJSONData()).toHaveProperty('error', 'El usuario ya esta registrado');
        expect(User_1.User.findOne).toHaveBeenCalled();
        expect(User_1.User.findOne).toHaveBeenCalledTimes(1);
    });
    it('should register a new user and return success message', async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: 'api/auth/create-account',
            body: {
                email: 'test@example.com',
                password: 'testpassword',
                name: 'testname'
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const mockUser = { ...req.body, save: jest.fn() };
        User_1.User.create.mockResolvedValue(mockUser);
        auth_1.hashPassword.mockResolvedValue('hashPassword');
        auth_1.generateToken.mockReturnValue('123454'); //para funciones sincronas 
        //dos argunemtos el primero la classe el sugundo la funcion que esperamos que se ejecute
        jest.spyOn(authEmail_1.AuthEmail, 'sendConfirmationEmail').mockImplementation(() => Promise.resolve());
        await AuthController_1.AuthController.createAcconunt(req, res);
        expect(res.statusCode).toBe(201);
        expect(User_1.User.create).toHaveBeenCalledWith(req.body);
        expect(User_1.User.create).toHaveBeenCalledTimes(1);
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.password).toBe("hashPassword");
        expect(mockUser.token).toBe('123454');
        expect(authEmail_1.AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            token: "123454"
        });
    });
});
describe("AuyhController.login", () => {
    it("should return 404 if user not found", async () => {
        User_1.User.findOne.mockResolvedValue(null);
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: 'api/auth/login',
            body: {
                email: 'test@example.com',
                password: 'testpassword',
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await AuthController_1.AuthController.Login(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: "Usuario no encontrado" });
    });
    it("should return 403 if account has not a been confirmed", async () => {
        User_1.User.findOne.mockResolvedValue({
            id: 1,
            email: "test@example.com",
            password: "testpassword",
            confirmed: false
        });
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: 'api/auth/login',
            body: {
                email: 'test@example.com',
                password: 'testpassword',
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await AuthController_1.AuthController.Login(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(403);
        expect(data).toEqual({ error: "La cuenta no ha sido confirmada" });
    });
    it("should return 401 if the password is incorrect", async () => {
        User_1.User.findOne.mockResolvedValue({
            id: 1,
            email: "test@example.com",
            password: "testpassword",
            confirmed: true
        });
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: 'api/auth/login',
            body: {
                email: 'test@example.com',
                password: 'testpassword',
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        auth_1.checkPassword.mockResolvedValue(false);
        await AuthController_1.AuthController.Login(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(401);
        expect(data).toEqual({ error: "El password no es correcto" });
        expect(auth_1.checkPassword).toHaveBeenCalledWith(req.body.password, 'testpassword');
        expect(auth_1.checkPassword).toHaveBeenCalledTimes(1);
    });
    it("should return a JWT if authentication is succsessful", async () => {
        const userMock = {
            id: 1,
            email: "test@example.com",
            password: "testpassword",
            confirmed: true
        };
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: 'api/auth/login',
            body: {
                email: 'test@example.com',
                password: 'testpassword',
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        //generamos un jwt falso
        const fakeJWT = 'fake_jwt';
        User_1.User.findOne.mockResolvedValue(userMock);
        auth_1.checkPassword.mockResolvedValue(true);
        jwt_1.genrateJWT.mockReturnValue(fakeJWT); //simulamos el retorno del jwt
        await AuthController_1.AuthController.Login(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual(fakeJWT);
        expect(jwt_1.genrateJWT).toHaveBeenCalledWith(userMock.id);
        expect(jwt_1.genrateJWT).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=AuthController.test.js.map