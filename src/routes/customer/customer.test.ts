import supertest from "supertest";
import app from "../../app";
import db from "../../utils/database";

describe("POST /customer", () => {
  test("it should create customer and respond with a status code of 200", async () => {
    jest.spyOn(db, "insert").mockResolvedValue(undefined);

    const loginResponse = await supertest(app).post("/user/login").send({
      email: "admin@gmail.com",
      password: "admin",
    });

    // Extract the token from the response
    const token = loginResponse.body.token;

    const response = await supertest(app)
      .post("/customer")
      .set("Authorization", `${token}`)
      .send({
        full_name: "jubril",
        phone_number: "0920393",
        email: "jubril@gmail.com",
        location: "benin city",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "customer created successfully" });
  });
});

describe("GET /customer", () => {
  test("it should respond with a list of customers and status 200", async () => {
    const mockCustomerData: any = [
      {
        customer_id: "004da6d0",
        full_name: "jubril",
        phone_number: "0920393",
        email: "jubril@gmail.com",
        location: "benin city",
      },
    ];
    jest.spyOn(db, "select").mockResolvedValue(mockCustomerData);

    const loginResponse = await supertest(app).post("/user/login").send({
      email: "admin@gmail.com",
      password: "admin",
    });

    // Extract the token from the response
    const token = loginResponse.body.token;

    const response = await supertest(app)
      .get("/customer")
      .set("Authorization", `${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    for (const customer of response.body) {
      expect(customer).toHaveProperty("customer_id");
      expect(customer).toHaveProperty("phone_number");
      expect(customer).toHaveProperty("email");
      expect(customer).toHaveProperty("location");
    }
  });

  test("it should handle errors and respond with a stauts code of 400", async () => {
    jest
      .spyOn(db, "select")
      .mockRejectedValue(new Error("Mock database error"));

    const loginResponse = await supertest(app).post("/user/login").send({
      email: "admin@gmail.com",
      password: "admin",
    });

    // Extract the token from the response
    const token = loginResponse.body.token;

    const response = await supertest(app)
      .get("/customer")
      .set("Authorization", `${token}`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "error getting customers" });
  });
});
