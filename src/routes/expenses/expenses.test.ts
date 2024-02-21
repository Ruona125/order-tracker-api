import supertest from "supertest";
import app from "../../app";
import db from "../../utils/database";

//the test to create expenses
describe("POST /expenses", () => {
  test("it should create expenses and respond with a status code of 200", async () => {
    jest.spyOn(db, "insert").mockResolvedValue(undefined);

    const loginResponse = await supertest(app).post("/user/login").send({
      email: "admin@gmail.com",
      password: "admin",
    });
    const token = loginResponse.body.token;

    const response = await supertest(app)
      .post("/expenses")
      .set("Authorization", `${token}`)
      .send({
        amount: 5555,
        description: "a pair of white shoes",
        name_of_expenses: "shoes",
        date: "2022-11-25",
        order_id: "6d689fe7",
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Expenses Created" });
  });
});

describe("GET /expenses", () => {
  test("it should respond with a list of expenses and a status code of 200", async () => {
    const mockExpensesData: any = [
      {
        expenses_id: "fb00026b",
        ref_no: 1011,
        amount: 5555,
        description: "a pair of white shoes",
        name_of_income: "shoes",
        date: "2022-11-24T23:00:00.000Z",
        order_id: "6d689fe7",
        order_number: "1234",
        cost_of_order: "23000",
        full_name: "esemayo jubril",
      },
    ];
    jest.spyOn(db, "select").mockResolvedValue(mockExpensesData);

    const loginResponse = await supertest(app).post("/user/login").send({
      email: "admin@gmail.com",
      password: "admin",
    });
    const token = loginResponse.body.token;

    const response = await supertest(app)
      .get("/expenses")
      .set("Authorization", `${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    for (const expenses of response.body) {
      expect(expenses).toHaveProperty("expenses_id");
      expect(expenses).toHaveProperty("ref_no");
      expect(expenses).toHaveProperty("amount");
    }
  });

  test("it should handle errors and respond with a status code of 400", async () => {
    jest
      .spyOn(db, "select")
      .mockRejectedValue(new Error("Mocked database error"));
    const loginResponse = await supertest(app).post("/user/login").send({
      email: "admin@gmail.com",
      password: "admin",
    });
    const token = loginResponse.body.token;

    const response = await supertest(app)
      .get("/expenses")
      .set("Authorization", `${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "error getting Expenses" });
  });
});
