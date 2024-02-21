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
//the test to create expenses
describe("POST /expenses", () => {
    test("it should create expenses and respond with a status code of 200", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(database_1.default, "insert").mockResolvedValue(undefined);
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post("/user/login").send({
            email: "admin@gmail.com",
            password: "admin",
        });
        const token = loginResponse.body.token;
        const response = yield (0, supertest_1.default)(app_1.default)
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
    }));
});
describe("GET /expenses", () => {
    test("it should respond with a list of expenses and a status code of 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockExpensesData = [
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
        jest.spyOn(database_1.default, "select").mockResolvedValue(mockExpensesData);
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post("/user/login").send({
            email: "admin@gmail.com",
            password: "admin",
        });
        const token = loginResponse.body.token;
        const response = yield (0, supertest_1.default)(app_1.default)
            .get("/expenses")
            .set("Authorization", `${token}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        for (const expenses of response.body) {
            expect(expenses).toHaveProperty("expenses_id");
            expect(expenses).toHaveProperty("ref_no");
            expect(expenses).toHaveProperty("amount");
        }
    }));
    test("it should handle errors and respond with a status code of 400", () => __awaiter(void 0, void 0, void 0, function* () {
        jest
            .spyOn(database_1.default, "select")
            .mockRejectedValue(new Error("Mocked database error"));
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post("/user/login").send({
            email: "admin@gmail.com",
            password: "admin",
        });
        const token = loginResponse.body.token;
        const response = yield (0, supertest_1.default)(app_1.default)
            .get("/expenses")
            .set("Authorization", `${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "error getting Expenses" });
    }));
});
