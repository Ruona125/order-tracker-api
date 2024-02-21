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
    // expect(response.body).toEqual({ message: "customer created successfully" });
  });
});

// describe("GET /customer", () => {
//   it("should respond with a list of customers and status 200", async () => {
//     const mockCustomerData:any = [
//       {
//         customer_id: "004da6d0",
//         full_name: "jubril",
//         phone_number: "0920393",
//         email: "jubril@gmail.com",
//         location: "benin city",
//       },
//     ];

//     // Mock the database select method
//     jest.spyOn(db, "select").mockResolvedValue(mockCustomerData);

//     // Make a login request to get the authorization token
//     const loginResponse = await supertest(app).post("/user/login").send({
//       email: "admin@gmail.com",
//       password: "admin",
//     });

//     // Extract the token from the login response
//     const token = loginResponse.body.token;

//     // Make the GET request to /customer with the authorization header
//     const response = await supertest(app)
//       .get("/customer")
//       .set("Authorization", `${token}`);

//     // Assertion
//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);

//     for (const customer of response.body) {
//       expect(customer).toHaveProperty("customer_id");
//       expect(customer).toHaveProperty("full_name");
//       expect(customer).toHaveProperty("phone_number");
//       // expect(customer).toHaveProperty("email");
//       // expect(customer).toHaveProperty("location");
//     }
//   });

//   it("should handle errors and respond with a status code of 400", async () => {
//     // Mock the database select method to throw an error
//     jest
//       .spyOn(db, "select")
//       .mockRejectedValue(new Error("Mock database error"));

//     // Make a login request to get the authorization token
//     const loginResponse = await supertest(app).post("/user/login").send({
//       email: "admin@gmail.com",
//       password: "admin",
//     });

//     // Extract the token from the login response
//     const token = loginResponse.body.token;

//     // Make the GET request to /customer with the authorization header
//     const response = await supertest(app)
//       .get("/customer")
//       .set("Authorization", `${token}`);

//     // Assertion
//     expect(response.status).toBe(400);
//     expect(response.body).toEqual({ message: "error getting customers" });
//   });
// });
