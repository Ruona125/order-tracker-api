import supertest from "supertest";
import app from "../../app"; // Assuming this is where your Express app is exported

describe("/POST /user/login", () => {
  test("it should respond with 200", async () => {
    const response = await supertest(app)
      .post("/user/login")
      .send({
        email: "admin@gmail.com",
        password: "admin",
      });
    expect(response.status).toBe(200);
  });
});
