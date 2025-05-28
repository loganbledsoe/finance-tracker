import knex from "knex";
// @ts-ignore
import knexConfig from "../knexfile";

const environment = process.env.NODE_ENV || "test";
const db = knex(knexConfig[environment]);

export default db;
