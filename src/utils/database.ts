import knex, { Knex } from "knex";
import dotenv from 'dotenv';
dotenv.config();

// const db = knex({
//   client: "pg",
//   connection: {
//     host: "localhost",
//     user: "ubuntu",
//     port: 5432,
//     password: "ubuntu",
//     database: "allthentic",
//   },
// });

const db: Knex = knex({
  client: "pg",
  connection: {
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
});




export default db;
