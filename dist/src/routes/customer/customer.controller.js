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
exports.modifyCustomer = exports.deleteCustomer = exports.getCertainCustomer = exports.getCustomers = exports.createCustomer = void 0;
const crypto_1 = require("crypto");
const database_1 = __importDefault(require("../../utils/database"));
function createCustomer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { full_name, phone_number, email, location } = req.body;
        try {
            yield (0, database_1.default)("customer").insert({
                customer_id: (0, crypto_1.randomBytes)(4).toString("hex"),
                full_name,
                phone_number,
                email,
                location,
            });
            res.status(200).json({ message: "customer created successfully" });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ message: "error creating customer" });
        }
    });
}
exports.createCustomer = createCustomer;
function getCustomers(req, res) {
    database_1.default.select("*")
        .from("customer")
        .then((customer) => res.status(200).json(customer))
        .catch((err) => res.status(400).json({ message: "error getting customer" }));
}
exports.getCustomers = getCustomers;
function getCertainCustomer(req, res) {
    const { customer_id } = req.params;
    database_1.default.select("*")
        .from("customer")
        .where({ customer_id })
        .then((customer) => {
        if (customer.length) {
            return res.json(customer[0]);
        }
        else {
            return res.status(404).json({ message: "customer not found" });
        }
    })
        .catch((err) => res.status(400).json({ message: "error getting customer" }));
}
exports.getCertainCustomer = getCertainCustomer;
function deleteCustomer(req, res) {
    const { customer_id } = req.params;
    (0, database_1.default)("customer")
        .where({ customer_id })
        .del()
        .then(() => {
        res.json("customer deleted");
    })
        .catch((err) => res.status(400).json("error"));
}
exports.deleteCustomer = deleteCustomer;
function modifyCustomer(req, res) {
    const { customer_id } = req.params;
    const { full_name, phone_number, email, location } = req.body;
    (0, database_1.default)("customer")
        .where({ customer_id })
        .update({ full_name, phone_number, email, location })
        .then((resp) => {
        if (resp) {
            res.json("success");
        }
        else {
            res.status(400).json("error updating customer details");
        }
    })
        .catch((err) => res.json("err"));
}
exports.modifyCustomer = modifyCustomer;
