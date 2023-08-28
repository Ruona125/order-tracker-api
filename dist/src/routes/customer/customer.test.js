"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const database_1 = __importDefault(require("../../utils/database"));
describe("POST /customer", () => {
    test("it should create customer and respond with a status code of 200", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(database_1.default, "insert").mockResolvedValue(undefined);
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post("/user/login").send({
            email: "admin@gmail.com",
            password: "admin",
        });
        // Extract the token from the response
        const token = loginResponse.body.token;
        const response = yield (0, supertest_1.default)(app_1.default)
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
    }));
});
describe("GET /customer", () => {
    test("it should respond with a list of customers and status 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCustomerData = [
            {
                customer_id: "004da6d0",
                full_name: "jubril",
                phone_number: "0920393",
                email: "jubril@gmail.com",
                location: "benin city",
            },
        ];
        jest.spyOn(database_1.default, "select").mockResolvedValue(mockCustomerData);
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post("/user/login").send({
            email: "admin@gmail.com",
            password: "admin",
        });
        // Extract the token from the response
        const token = loginResponse.body.token;
        const response = yield (0, supertest_1.default)(app_1.default)
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
    }));
    test("it should handle errors and respond with a stauts code of 400", () => __awaiter(void 0, void 0, void 0, function* () {
        jest
            .spyOn(database_1.default, "select")
            .mockRejectedValue(new Error("Mock database error"));
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post("/user/login").send({
            email: "admin@gmail.com",
            password: "admin",
        });
        // Extract the token from the response
        const token = loginResponse.body.token;
        const response = yield (0, supertest_1.default)(app_1.default)
            .get("/customer")
            .set("Authorization", `${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "error getting customers" });
    }));
});
