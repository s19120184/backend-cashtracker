
import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import { User } from "../../../models/User";
import { checkPassword, generateToken, hashPassword } from "../../../utils/auth";
import { AuthEmail } from "../../../utils/email/authEmail";
import { genrateJWT } from "../../../utils/jwt";


jest.mock("../../../models/User");
jest.mock("../../../utils/auth")
jest.mock("../../../utils/jwt")
describe("AuthContoller.createAccount", () => {
    
    beforeEach(() => {
        jest.resetAllMocks()//reiniciar los mock
    })
    it("should return a 409 status and an error message if email is already registered",async () => {

        (User.findOne as jest.Mock).mockResolvedValue(true)
        const req =createRequest({
            method: "POST",
            url:'api/auth/create-account',
            body:{
                email: 'test@example.com',
                password:'testpassword'
            }
        })


        const res= createResponse()
        await AuthController.createAcconunt(req,res)

        expect(res.statusCode).toBe(409)
        expect(res._getJSONData()).toHaveProperty('error','El usuario ya esta registrado')
        expect(User.findOne).toHaveBeenCalled()
        expect(User.findOne).toHaveBeenCalledTimes(1)

    })

    it('should register a new user and return success message', async () => {
    
        const req =createRequest({
            method: "POST",
            url:'api/auth/create-account',
            body:{
                email: 'test@example.com',
                password:'testpassword',
                name:'testname'
            }
        })

        const res= createResponse()
        const mockUser={...req.body, save:jest.fn()};
        
        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (hashPassword as jest.Mock).mockResolvedValue('hashPassword');
        (generateToken as jest.Mock).mockReturnValue('123454');//para funciones sincronas 

        //dos argunemtos el primero la classe el sugundo la funcion que esperamos que se ejecute
        jest.spyOn(AuthEmail, 'sendConfirmationEmail').mockImplementation(()=>Promise.resolve());

        await AuthController.createAcconunt(req,res)

        expect(res.statusCode).toBe(201)
        expect(User.create).toHaveBeenCalledWith(req.body)
        expect(User.create).toHaveBeenCalledTimes(1)
        expect(mockUser.save).toHaveBeenCalled()
        expect(mockUser.password).toBe("hashPassword")
        expect(mockUser.token).toBe('123454')
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
            name:req.body.name,
            email:req.body.email,
            token:"123454"
        })
    })
})

describe("AuyhController.login",() => {
    it("should return 404 if user not found", async () => {

        (User.findOne as jest.Mock).mockResolvedValue(null)
        const req =createRequest({
            method: "POST",
            url:'api/auth/login',
            body:{
                email: 'test@example.com',
                password:'testpassword',
            }
        })

        const res= createResponse()
        await AuthController.Login(req, res)
        const data =res._getJSONData()

        expect(res.statusCode).toBe(404)
        expect(data).toEqual({error:"Usuario no encontrado"})
    })

    it("should return 403 if account has not a been confirmed", async () => {

        (User.findOne as jest.Mock).mockResolvedValue({
            id: 1,
            email: "test@example.com",
            password: "testpassword",
            confirmed: false
        })
        const req =createRequest({
            method: "POST",
            url:'api/auth/login',
            body:{
                email: 'test@example.com',
                password:'testpassword',
            }
        })

        const res= createResponse()
        await AuthController.Login(req, res)
        const data =res._getJSONData()

        expect(res.statusCode).toBe(403)
        expect(data).toEqual({error:"La cuenta no ha sido confirmada"})
    })

    it("should return 401 if the password is incorrect", async () => {

        (User.findOne as jest.Mock).mockResolvedValue({
            id: 1,
            email: "test@example.com",
            password: "testpassword",
            confirmed: true
        })
        const req =createRequest({
            method: "POST",
            url:'api/auth/login',
            body:{
                email: 'test@example.com',
                password:'testpassword',
            }
        })

        const res= createResponse();

        (checkPassword as jest.Mock).mockResolvedValue(false)

        await AuthController.Login(req, res)
        const data =res._getJSONData()

        expect(res.statusCode).toBe(401)
        expect(data).toEqual({error:"El password no es correcto"})
        expect(checkPassword).toHaveBeenCalledWith(req.body.password ,'testpassword')
        expect(checkPassword).toHaveBeenCalledTimes(1)
    })

    it("should return a JWT if authentication is succsessful", async () => {

        const userMock={
            id: 1,
            email: "test@example.com",
            password: "testpassword",
            confirmed: true
        };

        
        const req =createRequest({
            method: "POST",
            url:'api/auth/login',
            body:{
                email: 'test@example.com',
                password:'testpassword',
            }
        })

        const res= createResponse();

        //generamos un jwt falso
        const fakeJWT= 'fake_jwt';
        (User.findOne as jest.Mock).mockResolvedValue(userMock);
        (checkPassword as jest.Mock).mockResolvedValue(true);
        (genrateJWT as jest.Mock).mockReturnValue(fakeJWT);//simulamos el retorno del jwt

        await AuthController.Login(req, res);

        const data =res._getJSONData();

      
        expect(res.statusCode).toBe(200)
        expect(data) .toEqual(fakeJWT)
        expect(genrateJWT).toHaveBeenCalledWith(userMock.id)
        expect(genrateJWT).toHaveBeenCalledTimes(1)
    })
})