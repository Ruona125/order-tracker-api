import { Request, Response } from "express";
import { randomBytes } from "crypto";
import moment from "moment";
import db from "../../utils/database";

export async function createTask(req: Request, res: Response) {
  const { task, user_id, deadline } = req.body;
  let timer;

  if (deadline === "a") {
    timer = moment().add(7, "days").format(); // Format the moment object as a string
  } else if (deadline === "b") {
    timer = moment().add(3, "days").format();
  } else if (deadline === "c") {
    timer = moment().add(1, "days").format();
  } else if (deadline === "d") {
    timer = moment().add(1, "hours").format();
  } else if (deadline === "e") {
    timer = moment().add(3, "hours").format();
  } else if (deadline === "f") {
    timer = moment().add(5, "hours").format();
  }

  return db("tasks")
    .returning("*")
    .insert({
      task_id: randomBytes(4).toString("hex"),
      status: "pending",
      task,
      user_id,
      deadline: timer,
    })
    .then((task) => {
      res.json(task[0]);
    })
    .catch((err) => res.status(400).json("error creating task"));
}

export async function ViewTasks(req: Request, res: Response) {
  db.select(
    db.raw(
      `name, t.status, t.user_id, t.task, t.task_id, t.deadline, u.name from tasks as t inner join users as u on t.user_id=u.user_id order by t.deadline asc`
    )
  )
    .then((task) => res.status(200).json(task))
    .catch((err) => res.status(400).json({ message: "error getting tasks" }));
}

export async function viewCertainTask(req: Request, res: Response) {
  const { user_id } = req.params;
  db.select("*")
    .from("tasks")
    .where({ user_id })
    .then((task) => {
      if (task.length) {
        return res.status(200).json(task);
      } else {
        return res.status(400).json({ message: "error getting task" });
      }
    });
}

export function completeTask(req: Request, res: Response) {
  db.select(
    "name",
    "t.status",
    "t.user_id",
    "t.task",
    "t.task_id",
    "t.deadline",
    "u.name"
  )
    .from("tasks as t")
    .innerJoin("users as u", "t.user_id", "u.user_id")
    .where("status", "complete")
    .then((task) => {
      if (task.length) {
        return res.status(200).json(task);
      } else {
        return res.status(400).json({ message: "No task found" });
      }
    });
}

export function pendingTask(req: Request, res: Response) {
  db.select(
    "name",
    "t.status",
    "t.user_id",
    "t.task",
    "t.task_id",
    "t.deadline", 
    "u.name"
  )
    .from("tasks as t")
    .innerJoin("users as u", "t.user_id", "u.user_id")
    .where("status", "pending")
    .then((task) => {
      if (task.length) {
        return res.status(200).json(task);
      } else {
        return res.status(400).json({ message: "No task found" });
      }
    });
}

export async function viewCertainTaskAdmin(req: Request, res: Response) {
  const { task_id } = req.params;
  db.select("*")
    .from("tasks")
    .where({ task_id })
    .then((task) => {
      if (task.length) {
        return res.status(200).json(task[0]);
      } else {
        return res.status(400).json({ message: "error getting task" });
      }
    });
}

interface UpdateTaskRequest extends Request {
  params: {
    task_id: string;
  };
  body: {
    status: string;
    task: string;
    deadline: string;
  };
}

export function modifyTask(req: UpdateTaskRequest, res: Response) {
  const { task_id } = req.params;
  const { status, task, deadline } = req.body;
  const deadlineDurations: { [key: string]: moment.Duration } = {
    a: moment.duration(7, "days"), // 7 days
    b: moment.duration(3, "days"), // 3 days
    c: moment.duration(1, "days"), // 1 day
    d: moment.duration(1, "hours"), // 1 hour
    e: moment.duration(3, "hours"), // 3 hours
    f: moment.duration(5, "hours"), // 5 hours
  };

  const duration = deadlineDurations[deadline];

  if (!duration) {
    return res.status(400).json("invalid duration");
  }

  const updateData = moment().add(duration, "days");

  return db("tasks")
    .where({ task_id })
    .update({
      task,
      status,
      deadline: updateData.format(),
    })
    .then((resp) => {
      if (resp) {
        res.json("success");
      } else {
        res.status(400).json({ message: "error updating task" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "error updating task" });
    });
}

export function deleteTask(req: Request, res: Response) {
  const { task_id } = req.params;
  db("tasks")
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
