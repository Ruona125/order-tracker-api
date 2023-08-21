import { Request, Response } from "express";
import { randomBytes } from "crypto";
import moment from "moment";
import db from "../../utils/database";

export async function createMilestone(req: Request, res: Response) {
  const { description, countdown_timer, order_id } = req.body;
  let timer;

  if (countdown_timer === "a") {
    timer = moment().add(7, "days").format(); // Format the moment object as a string
  } else if (countdown_timer === "b") {
    timer = moment().add(3, "days").format();
  } else if (countdown_timer === "c") {
    timer = moment().add(1, "days").format();
  } else if (countdown_timer === "d") {
    timer = moment().add(12, "hours").format();
  } else if (countdown_timer === "e") {
    timer = moment().add(3, "hours").format();
  } else if (countdown_timer === "f") {
    timer = moment().add(1, "month").format();
  } else if (countdown_timer === "g") {
    timer = moment().add(2, "month").format();
  }

  return db("milestone")
    .returning("*")
    .insert({
      milestone_id: randomBytes(4).toString("hex"),
      description,
      countdown_timer: timer, // Save the formatted string in the database
      order_id,
    })
    .then((milestone) => {
      res.json(milestone[0]);
    })
    .catch((err) => res.status(400).json("error creating milestone"));
}

export function viewMilestone(req: Request, res: Response) {
  db.select(
    db.raw(
      "m.milestone_id, m.milestone_status, m.description, m.countdown_timer, m.order_id, o.order_number, c.full_name from milestone as m inner join orders as o on m.order_id=o.order_id INNER JOIN customer AS c ON o.customer_id = c.customer_id order by m.countdown_timer asc"
    )
  )
    .then((milestone) => res.status(200).json(milestone))
    .catch((err) => res.status(400).json(err));
}

export function viewCertainMilestone(req: Request, res: Response) {
  const { milestone_id } = req.params;
  db.select("*")
    .from("milestone")
    .where({ milestone_id })
    .then((milestones) => {
      if (milestones.length) {
        res.json(milestones[0]);
      } else {
        res.status(400).json("milestone not found");
      }
    })
    .catch((err) => res.status(400).json("error getting milestone"));
}

interface UpdateMilestoneRequest extends Request {
  params: {
    milestone_id: string;
  };
  body: {
    description: string;
    countdown_timer: string;
    milestone_status: string;
  };
}

export function updateMilestone(req: UpdateMilestoneRequest, res: Response) {
  const { milestone_id } = req.params;
  const { description, countdown_timer, milestone_status } = req.body;

  const countdownDurations: { [key: string]: moment.Duration } = {
    a: moment.duration(7, "days"), // 7 days
    b: moment.duration(3, "days"), // 3 days
    c: moment.duration(1, "days"), // 1 day
    d: moment.duration(12, "hours"), // 12 hours
    e: moment.duration(3, "hours"), // 3 hours
    f: moment.duration(1, "month"), // 1 month
    g: moment.duration(2, "months"), // 2 month
  };

  const duration = countdownDurations[countdown_timer];

  if (!duration) {
    return res.status(400).json("Invalid countdown timer value");
  }

  const updatedDate = moment().add(duration);

  return db("milestone")
    .where({ milestone_id })
    .update({
      milestone_status,
      description,
      countdown_timer: updatedDate.format(),
    })
    .then((resp) => {
      if (resp) {
        res.json("success");
      } else {
        res.status(400).json("not found");
      }
    })
    .catch((err) => res.status(400).json("can't update milestone"));
}

export function deleteMilestone(req: Request, res: Response) {
  const { milestone_id } = req.params;
  db("milestone")
    .where({ milestone_id })
    .del()
    .then(() => {
      res.json("milestone deleted");
    })
    .catch((err) => res.status(400).json("unable to delete milestone"));
}
