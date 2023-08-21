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
exports.deleteMilestone = exports.updateMilestone = exports.viewCertainMilestone = exports.viewMilestone = exports.createMilestone = void 0;
const crypto_1 = require("crypto");
const moment_1 = __importDefault(require("moment"));
const database_1 = __importDefault(require("../../utils/database"));
function createMilestone(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { description, countdown_timer, order_id } = req.body;
        let timer;
        if (countdown_timer === "a") {
            timer = (0, moment_1.default)().add(7, "days").format(); // Format the moment object as a string
        }
        else if (countdown_timer === "b") {
            timer = (0, moment_1.default)().add(3, "days").format();
        }
        else if (countdown_timer === "c") {
            timer = (0, moment_1.default)().add(1, "days").format();
        }
        else if (countdown_timer === "d") {
            timer = (0, moment_1.default)().add(12, "hours").format();
        }
        else if (countdown_timer === "e") {
            timer = (0, moment_1.default)().add(3, "hours").format();
        }
        else if (countdown_timer === "f") {
            timer = (0, moment_1.default)().add(1, "month").format();
        }
        else if (countdown_timer === "g") {
            timer = (0, moment_1.default)().add(2, "month").format();
        }
        return (0, database_1.default)("milestone")
            .returning("*")
            .insert({
            milestone_id: (0, crypto_1.randomBytes)(4).toString("hex"),
            description,
            countdown_timer: timer,
            order_id,
        })
            .then((milestone) => {
            res.json(milestone[0]);
        })
            .catch((err) => res.status(400).json("error creating milestone"));
    });
}
exports.createMilestone = createMilestone;
function viewMilestone(req, res) {
    database_1.default.select(database_1.default.raw("m.milestone_id, m.milestone_status, m.description, m.countdown_timer, m.order_id, o.order_number, c.full_name from milestone as m inner join orders as o on m.order_id=o.order_id INNER JOIN customer AS c ON o.customer_id = c.customer_id order by m.countdown_timer asc"))
        .then((milestone) => res.status(200).json(milestone))
        .catch((err) => res.status(400).json(err));
}
exports.viewMilestone = viewMilestone;
function viewCertainMilestone(req, res) {
    const { milestone_id } = req.params;
    database_1.default.select("*")
        .from("milestone")
        .where({ milestone_id })
        .then((milestones) => {
        if (milestones.length) {
            res.json(milestones[0]);
        }
        else {
            res.status(400).json("milestone not found");
        }
    })
        .catch((err) => res.status(400).json("error getting milestone"));
}
exports.viewCertainMilestone = viewCertainMilestone;
function updateMilestone(req, res) {
    const { milestone_id } = req.params;
    const { description, countdown_timer, milestone_status } = req.body;
    const countdownDurations = {
        a: moment_1.default.duration(7, "days"),
        b: moment_1.default.duration(3, "days"),
        c: moment_1.default.duration(1, "days"),
        d: moment_1.default.duration(12, "hours"),
        e: moment_1.default.duration(3, "hours"),
        f: moment_1.default.duration(1, "month"),
        g: moment_1.default.duration(2, "months"), // 2 month
    };
    const duration = countdownDurations[countdown_timer];
    if (!duration) {
        return res.status(400).json("Invalid countdown timer value");
    }
    const updatedDate = (0, moment_1.default)().add(duration);
    return (0, database_1.default)("milestone")
        .where({ milestone_id })
        .update({
        milestone_status,
        description,
        countdown_timer: updatedDate.format(),
    })
        .then((resp) => {
        if (resp) {
            res.json("success");
        }
        else {
            res.status(400).json("not found");
        }
    })
        .catch((err) => res.status(400).json("can't update milestone"));
}
exports.updateMilestone = updateMilestone;
function deleteMilestone(req, res) {
    const { milestone_id } = req.params;
    (0, database_1.default)("milestone")
        .where({ milestone_id })
        .del()
        .then(() => {
        res.json("milestone deleted");
    })
        .catch((err) => res.status(400).json("unable to delete milestone"));
}
exports.deleteMilestone = deleteMilestone;
