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
exports.deleteTask = exports.modifyTask = exports.viewCertainTaskAdmin = exports.pendingTask = exports.completeTask = exports.viewCertainTask = exports.ViewTasks = exports.createTask = void 0;
const crypto_1 = require("crypto");
const moment_1 = __importDefault(require("moment"));
const database_1 = __importDefault(require("../../utils/database"));
function createTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { task, user_id, deadline } = req.body;
        let timer;
        if (deadline === "a") {
            timer = (0, moment_1.default)().add(7, "days").format(); // Format the moment object as a string
        }
        else if (deadline === "b") {
            timer = (0, moment_1.default)().add(3, "days").format();
        }
        else if (deadline === "c") {
            timer = (0, moment_1.default)().add(1, "days").format();
        }
        else if (deadline === "d") {
            timer = (0, moment_1.default)().add(1, "hours").format();
        }
        else if (deadline === "e") {
            timer = (0, moment_1.default)().add(3, "hours").format();
        }
        else if (deadline === "f") {
            timer = (0, moment_1.default)().add(5, "hours").format();
        }
        return (0, database_1.default)("tasks")
            .returning("*")
            .insert({
            task_id: (0, crypto_1.randomBytes)(4).toString("hex"),
            status: "pending",
            task,
            user_id,
            deadline: timer,
        })
            .then((task) => {
            res.json(task[0]);
        })
            .catch((err) => res.status(400).json("error creating task"));
    });
}
exports.createTask = createTask;
function ViewTasks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        database_1.default.select(database_1.default.raw(`name, t.status, t.user_id, t.task, t.task_id, t.deadline, u.name from tasks as t inner join users as u on t.user_id=u.user_id order by t.deadline asc`))
            .then((task) => res.status(200).json(task))
            .catch((err) => res.status(400).json({ message: "error getting tasks" }));
    });
}
exports.ViewTasks = ViewTasks;
function viewCertainTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user_id } = req.params;
        database_1.default.select("*")
            .from("tasks")
            .where({ user_id })
            .then((task) => {
            if (task.length) {
                return res.status(200).json(task);
            }
            else {
                return res.status(400).json({ message: "error getting task" });
            }
        });
    });
}
exports.viewCertainTask = viewCertainTask;
function completeTask(req, res) {
    database_1.default.select("name", "t.status", "t.user_id", "t.task", "t.task_id", "t.deadline", "u.name")
        .from("tasks as t")
        .innerJoin("users as u", "t.user_id", "u.user_id")
        .where("status", "complete")
        .then((task) => {
        if (task.length) {
            return res.status(200).json(task);
        }
        else {
            return res.status(400).json({ message: "No task found" });
        }
    });
}
exports.completeTask = completeTask;
function pendingTask(req, res) {
    database_1.default.select("name", "t.status", "t.user_id", "t.task", "t.task_id", "t.deadline", "u.name")
        .from("tasks as t")
        .innerJoin("users as u", "t.user_id", "u.user_id")
        .where("status", "pending")
        .then((task) => {
        if (task.length) {
            return res.status(200).json(task);
        }
        else {
            return res.status(400).json({ message: "No task found" });
        }
    });
}
exports.pendingTask = pendingTask;
function viewCertainTaskAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { task_id } = req.params;
        database_1.default.select("*")
            .from("tasks")
            .where({ task_id })
            .then((task) => {
            if (task.length) {
                return res.status(200).json(task[0]);
            }
            else {
                return res.status(400).json({ message: "error getting task" });
            }
        });
    });
}
exports.viewCertainTaskAdmin = viewCertainTaskAdmin;
function modifyTask(req, res) {
    const { task_id } = req.params;
    const { status, task, deadline } = req.body;
    const deadlineDurations = {
        a: moment_1.default.duration(7, "days"),
        b: moment_1.default.duration(3, "days"),
        c: moment_1.default.duration(1, "days"),
        d: moment_1.default.duration(1, "hours"),
        e: moment_1.default.duration(3, "hours"),
        f: moment_1.default.duration(5, "hours"), // 5 hours
    };
    const duration = deadlineDurations[deadline];
    if (!duration) {
        return res.status(400).json("invalid duration");
    }
    const updateData = (0, moment_1.default)().add(duration, "days");
    return (0, database_1.default)("tasks")
        .where({ task_id })
        .update({
        task,
        status,
        deadline: updateData.format(),
    })
        .then((resp) => {
        if (resp) {
            res.json("success");
        }
        else {
            res.status(400).json({ message: "error updating task" });
        }
    })
        .catch((err) => {
        console.log(err);
        res.status(400).json({ message: "error updating task" });
    });
}
exports.modifyTask = modifyTask;
function deleteTask(req, res) {
    const { task_id } = req.params;
    (0, database_1.default)("tasks")
        .where({ task_id })
        .del()
        .then(() => {
        res.status(200).json("task deleted");
    })
        .catch((err) => {
        console.log(err);
        res.status(400).json({ message: err });
    });
}
exports.deleteTask = deleteTask;
