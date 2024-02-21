import supertest from "supertest";
import app from "../../app"; // Import your Express app
import db from "../../utils/database"; // Import the actual db object or module

//the test to create income
describe("POST /income", () => {
  test("it should create income and respond with status 200", async () => {
    // Mock the db insert method to simulate a successful insertion
    jest.spyOn(db, "insert").mockResolvedValue(undefined);

    // Make a request to the login route to get a valid token
    const loginResponse = await supertest(app).post("/user/login").send({
      email: "admin@gmail.com",
      password: "admin",
    });

    // Extract the token from the response
    const token = loginResponse.body.token;

    // Make a request to the protected income route with the valid token
    const response = await supertest(app)
      .post("/income")
      .set("Authorization", `${token}`) // Use Bearer token format
      .send({
        amount: 5555,
        description: "a pair of white shoes",
        name_of_income: "shoes",
        date: "2022-11-25",
        order_id: "6d689fe7",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "income created" });
  });
});

//the test to get income
describe("GET /income", () => {
  test("it should respond with a list of incomes and status 200", async () => {
    // Mock the database select method to simulate a successful retrieval
    const mockIncomeData: any = [
      {
        income_id: "fb00026b",
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
    jest.spyOn(db, "select").mockResolvedValue(mockIncomeData);

    // Make a request to the login route to get a valid token
    const loginResponse = await supertest(app).post("/user/login").send({
      email: "admin@gmail.com",
      password: "admin",
    });

    // Extract the token from the response
    const token = loginResponse.body.token;

    // Make a request to the protected income route
    const response = await supertest(app)
      .get("/income")
      .set("Authorization", `${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Check if the response body is an array

    // Perform more specific checks based on your expected data structure
    // For example, you can loop through the array and check properties of each income object
    for (const income of response.body) {
      expect(income).toHaveProperty("income_id");
      expect(income).toHaveProperty("ref_no");
      expect(income).toHaveProperty("amount");
      // ... continue with other property checks
    }
  });

  test("it should handle errors and respond with status 400", async () => {
    // Mock the database select method to simulate an error
    jest
      .spyOn(db, "select")
      .mockRejectedValue(new Error("Mocked database error"));

    // Make a request to the login route to get a valid token
    const loginResponse = await supertest(app).post("/user/login").send({
      email: "admin@gmail.com",
      password: "admin",
    });

    // Extract the token from the response
    const token = loginResponse.body.token;

    // Make a request to the protected income route
    const response = await supertest(app)
      .get("/income")
      .set("Authorization", `${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "error getting income" });
  });
});

// describe("GET /income/:income_id", () => {
//   test("it should respond with the specified income and status 200 if found", async () => {
//     // Mock the database select method to simulate a successful retrieval
//     const mockIncomeData: any = [
//       {
//         income_id: "fb00026b",
//         ref_no: 1011,
//         amount: 5555,
//         description: "a pair of white shoes",
//         name_of_income: "shoes",
//         date: "2022-11-24T23:00:00.000Z",
//         order_id: "6d689fe7",
//       },
//     ];
//     jest.spyOn(db, "select").mockResolvedValue(mockIncomeData);

//     // Make a request to the login route to get a valid token
//     const loginResponse = await supertest(app).post("/user/login").send({
//       email: "admin@gmail.com",
//       password: "admin",
//     });

//     // Extract the token from the response
//     const token = loginResponse.body.token;

//     // Make a request to the protected income route with a valid income_id
//     const validIncomeId = "fb00026b";
//     const response = await supertest(app)
//       .get(`/income/${validIncomeId}`)
//       .set("Authorization", `${token}`); // Use Bearer token format

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(
//       expect.objectContaining({ income_id: validIncomeId })
//     );
//   });

//   //   test("it should respond with status 404 if income is not found", async () => {
//   //     // Mock the database select method to simulate an empty result (income not found)
//   //     jest.spyOn(db, "select").mockResolvedValue([]);

//   //     // Make a request to the login route to get a valid token
//   //     const loginResponse = await supertest(app).post("/user/login").send({
//   //       email: "admin@gmail.com",
//   //       password: "admin",
//   //     });

//   //     // Extract the token from the response
//   //     const token = loginResponse.body.token;

//   //     // Make a request to the protected income route with an invalid income_id
//   //     const invalidIncomeId = "fb00026x";
//   //     const response = await supertest(app)
//   //       .get(`/income/${invalidIncomeId}`)
//   //       .set("Authorization", `${token}`);

//   //     expect(response.status).toBe(404);
//   //     expect(response.body).toEqual({ message: "income not found" });
//   //   });

//   //   test("it should handle errors and respond with status 500", async () => {
//   //     // Mock the database select method to simulate an error
//   //     jest
//   //       .spyOn(db, "select")
//   //       .mockRejectedValue(new Error("Mocked database error"));

//   //     // Make a request to the login route to get a valid token
//   //     const loginResponse = await supertest(app).post("/user/login").send({
//   //       email: "admin@gmail.com",
//   //       password: "admin",
//   //     });

//   //     // Extract the token from the response
//   //     const token = loginResponse.body.token;

//   //     // Make a request to the protected income route
//   //     const validIncomeId = "fb00026b";
//   //     const response = await supertest(app)
//   //       .get(`/income/${validIncomeId}`)
//   //       .set("Authorization", `${token}`);

//   //     expect(response.status).toBe(500);
//   //     expect(response.body).toEqual({ message: "error getting income" });
//   //   });
// });
