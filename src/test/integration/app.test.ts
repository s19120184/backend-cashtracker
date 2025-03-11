import request from "supertest";
import server, { connectDB } from "../../server";
import { AuthController } from "../../controllers/AuthController";
import { User } from "../../models/User";
import * as authUtilis from "../../utils/auth";
import * as JWTUtils from "../../utils/jwt";

describe("Authentication create account", () => {

  //crear cuenta sin pasarle datos
  it("should display validation errors when form is empty", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({});

    const createAccountMock = jest.spyOn(AuthController, "createAcconunt");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(3);
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  it("should return 400 when the email is invalid", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "luis",
        password: "12345678",
        email: "noEmail"
      });

    const createAccountMock = jest.spyOn(AuthController, "createAcconunt");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  it("should return 400 when the password lenght < 8 ", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "luis",
        password: "1234567",
        email: "correo@correo.com"
      });

    const createAccountMock = jest.spyOn(AuthController, "createAcconunt");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);

    expect(response.body.errors[0].msg).toBe(
      "El password es muy corto minmo 8 Caracteres"
    );
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  it("should return 200 register success ", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "luis",
        password: "12345678",
        email: "test@test.com"
      });

    // const createAccountMock = jest.spyOn(AuthController, "createAcconunt");

    expect(response.status).toBe(201);
    expect(response.body).not.toHaveProperty("errors");
  });

  it("should return code 409 conflic when user is already registered ", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "luis",
        password: "12345678",
        email: "test@test.com"
      });

    // const createAccountMock = jest.spyOn(AuthController, "createAcconunt");

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("El usuario ya esta registrado");
    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(201);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("Authentication Account confirmation with token", () => {
  it("should display error if token is empty or token is no valid", async () => {
    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({
        token: "not-empty"
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("token no valido");
  });

  it("should display error if token doesnt exists", async () => {
    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({
        token: "123456"
      });

    expect(response.status).toBe(401);
    expect(response.status).not.toBe(200);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("token no valido");
  });

  it("should confirm account with a valid token", async () => {
    const token = globalThis.cashTrackerConfirmationToken;
    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({
        token: token
      });

    expect(response.status).not.toBe(401);

    expect(response.status).toBe(200);
    expect(response.body).toBe("Cuenta confirmada correctamente");
  });
});

describe("Authentication - Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display validation errors when the form is empty", async () => {
    const response = await request(server).post("/api/auth/login").send({
      // email: "test@test.com",
      // password: "12345678",
    });

    const loginMock = jest.spyOn(AuthController, "Login");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);
    expect(response.body.errors).not.toHaveLength(1);
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("should return 400 bad request when the email is invalid", async () => {
    const response = await request(server).post("/api/auth/login").send({
      email: "testtest.com",
      password: "12345678"
    });

    const loginMock = jest.spyOn(AuthController, "Login");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("E-mail no valido");

    expect(response.body.errors).not.toHaveLength(2);
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("should return 400 error if the user no found", async () => {
    const response = await request(server).post("/api/auth/login").send({
      email: "test2@test.com",
      password: "12345678"
    });

    expect(response.status).toBe(404);
    expect(response.status).not.toBe(200);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Usuario no encontrado");
  });

  it("should return 403 error if the user account is not confirmed", async () => {
    //simulamos la funcion y lo que esperamos que retorne
    (jest.spyOn(User, "findOne") as jest.Mock).mockReturnValue({
      id: 1,
      confirmed: false,
      password: "jasehdPassword",
      email: "test2@test.com"
    });

    const response = await request(server).post("/api/auth/login").send({
      email: "test2@test.com",
      password: "12345678"
    });

    expect(response.status).toBe(403);
    expect(response.status).not.toBe(200);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("La cuenta no ha sido confirmada");
  });

  it("should return 403 error if the user account is not confirmed method 2", async () => {
    const userData = {
      name: "Test",
      email: "test2@test.com",
      password: "12345678"
    };

    await request(server).post("/api/auth/login").send(userData);

    const response = await request(server).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password
    });

    expect(response.status).toBe(403);
    expect(response.status).not.toBe(200);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("La cuenta no ha sido confirmada");
  });

  it("should return 401 error if the passwors is incorrect", async () => {
    //simulamos la funcion y lo que esperamos que retorne
    const findOne = (jest.spyOn(User, "findOne") as jest.Mock).mockReturnValue({
      id: 1,
      confirmed: true,
      password: "jasehdPassword"
    });

    //para usaros en los expects
    const checkPassword = jest
      .spyOn(authUtilis, "checkPassword")
      .mockResolvedValue(false);

    const response = await request(server).post("/api/auth/login").send({
      email: "test2@test.com",
      password: "12345678"
    });

    expect(response.status).toBe(401);
    expect(response.status).not.toBe(200);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("El password no es correcto");

    expect(findOne).toHaveBeenCalledTimes(1);
    expect(checkPassword).toHaveBeenCalledTimes(1);
  });

  it("should return jwt", async () => {
    //simulamos la funcion y lo que esperamos que retorne
    const findOne = (jest.spyOn(User, "findOne") as jest.Mock).mockReturnValue({
      id: 1,
      confirmed: true,
      password: "hasehdPassword"
    });

    //para usaros en los expects
    const checkPassword = jest
      .spyOn(authUtilis, "checkPassword")
      .mockResolvedValue(true);
    const generateJWT = jest
      .spyOn(JWTUtils, "genrateJWT")
      .mockReturnValue("jsonwebtoken");

    const response = await request(server).post("/api/auth/login").send({
      email: "test@test.com",
      password: "12345678"
    });

    // expect(response.status).toBe(401)
    expect(response.status).toBe(200);

    expect(response.body).toEqual("jsonwebtoken");
    expect(findOne).toHaveBeenCalledTimes(1);

    expect(generateJWT).toHaveBeenCalled();
    expect(generateJWT).toHaveBeenCalledTimes(1);
    expect(generateJWT).toHaveBeenCalledWith(1);

    expect(checkPassword).toHaveBeenCalledTimes(1);
    expect(checkPassword).toHaveBeenCalledWith("12345678", "hasehdPassword");
  });
});

let JWT: string;
//funcion para obtener el JWT
async function autheticateUser() {
  const response = await request(server).post("/api/auth/login").send({
    email: "test@test.com",
    password: "12345678"
  });

  JWT = response.body;
  expect(response.status).toBe(200);
}
//presupuestos
describe("GET /api/budgets", () => {
  //restaurar las funciones d los jest.spy a su implementación original
  beforeAll(() => {
    jest.restoreAllMocks();
  });

  //autenticarnos y obtener el json token
  beforeAll(async () => {
    //obtenemos el jwt
    await autheticateUser();
  });

  //cuado no se tiene un jwt
  it("should rejetc unauthenticated access to budgets without a jwt", async () => {
    const response = await request(server).get("/api/budgets");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("No Autorizado");
  });

  //cuando el jwt no es valido
  it("should rejetc unauthenticated access to budgets without a valid jwt", async () => {
    const response = await request(server)
      .get("/api/budgets")
      .auth("not-valid", { type: "bearer" });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("Token no valido");
  });

  //cuando el token es valido
  it("should allow authenticated access to budgets wit a valid jwt", async () => {
    const response = await request(server)
      .get("/api/budgets")
      .auth(JWT, { type: "bearer" });

    expect(response.body).toHaveLength(0);
    expect(response.statusCode).not.toBe(401);
    expect(response.body.error).not.toBe("No Autorizado");
  });
});

describe("POST /api/budgets", () => {
  //autenticarnos y obtener el json token
  beforeAll(async () => {
    await autheticateUser();
  });

  it("should rejetc unauthenticated post request to budgets without a jwt", async () => {
    const response = await request(server).post("/api/budgets");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("No Autorizado");
  });
  //cuando se envia el formulario vacio
  it("should display validateion when the form is submiteted with invalid data", async () => {
    const response = await request(server)
      .post("/api/budgets")
      .auth(JWT, { type: "bearer" })
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toHaveLength(4);
  });

  it("should create a budget", async () => {
    const response = await request(server)
      .post("/api/budgets")
      .auth(JWT, { type: "bearer" })
      .send({
        name: "testBudget",
        amount: 1000
      });

    expect(response.statusCode).toBe(201);
  });
});

describe("GET /api/budgets/:id", () => {
  //autenticarnos y obtener el json token
  beforeAll(async () => {
    await autheticateUser();
  });

  it("should rejetc unauthenticated get request to budgets id without a jwt", async () => {
    const response = await request(server).post("/api/budgets/1");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("No Autorizado");
  });

  it("should return 400 bad request when id is not valid", async () => {
    const response = await request(server)
      .get("/api/budgets/not-valid")
      .auth(JWT, { type: "bearer" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.statusCode).not.toBe(401);
    expect(response.body.error).not.toBe("No Autorizado");
  });
  //cuando el presupuesto no existe
  it("should return 404 not found when a budget doesnt exists", async () => {
    const response = await request(server)
      .get("/api/budgets/333")
      .auth(JWT, { type: "bearer" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Presupuesto no encontrado");
    expect(response.statusCode).not.toBe(401);
    expect(response.statusCode).not.toBe(400);
  });
  //cuando el presupuesto si existe
  it("should return a single budget by id", async () => {
    const response = await request(server)
      .get("/api/budgets/1")
      .auth(JWT, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.statusCode).not.toBe(401);
    expect(response.statusCode).not.toBe(400);
    expect(response.statusCode).not.toBe(404);
  });
});

//actualizar budgets
describe("PUT /api/budgets/:id", () => {
  //autenticarnos y obtener el json token
  beforeAll(async () => {
    await autheticateUser();
  });

  it("should rejetc unauthenticated PUT request to budgets id without a jwt", async () => {
    const response = await request(server).put("/api/budgets/1");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("No Autorizado");
  });
  it("should display validation errors if te form is empty", async () => {
    const response = await request(server)
      .put("/api/budgets/1")
      .auth(JWT, { type: "bearer" })
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(4);
  });
  //cuando acutualizamos correctamente
  it("should update a budget by id and return a success message ", async () => {
    const response = await request(server)
      .put("/api/budgets/1")
      .auth(JWT, { type: "bearer" })
      .send({
        name: "Updated budget",
        amount: 300
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("Presupuesto actualizado correctamente");
  });
});

describe("DELETE /api/budgets/:id", () => {
  //autenticarnos y obtener el json token
  beforeAll(async () => {
    await autheticateUser();
  });

  it("should rejetc unauthenticated PUT request to budgets id without a jwt", async () => {
    const response = await request(server).delete("/api/budgets/1");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("No Autorizado");
  });
  it("should return not found when a budget doesnt exists", async () => {
    const response = await request(server)
      .delete("/api/budgets/133")
      .auth(JWT, { type: "bearer" })
      .send({});

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Presupuesto no encontrado");
    
  });
  //cuando eliminamos correctamente
  it("should update a budget by id and return a success message ", async () => {
    const response = await request(server)
      .delete("/api/budgets/1")
      .auth(JWT, { type: "bearer" })
      

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("Presupuesto eliminado");
  });
});
