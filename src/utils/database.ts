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
    host: 'roundhouse.proxy.rlwy.net',
    user: 'postgres',
    port: 54732,
    password: "g6dgga1*Ed6gDbG4ccdFBcD*eAca552*",
    database: 'railway',
  },
});

 


export default db;
