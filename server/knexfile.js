// "use strict";
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// const dotenv_1 = __importDefault(require("dotenv"));
// const path_1 = __importDefault(require("path"));
// dotenv_1.default.config();
// const config = {
//     test: {
//         client: "better-sqlite3",
//         connection: {
//             filename: "./test.sqlite3",
//         },
//         useNullAsDefault: true,
//         migrations: { directory: "../src/migrations" },
//         seeds: { directory: "../src/seeds" },
//     },
//     production: {
//         client: "pg",
//         connection: {
//             connectionString: process.env.PG_CONNECTION_STRING,
//             ssl: { rejectUnauthorized: false },
//         },
//         searchPath: ["knex", "public"],
//         useNullAsDefault: true,
//         migrations: { directory: path_1.default.resolve(__dirname, "./dist/migrations") },
//         seeds: { directory: path_1.default.resolve(__dirname, "./dist/seeds") },
//     },
// };
// exports.default = config;
const parse = require("pg-connection-string").parse;
const path = require("path");

// Parse the environment variable into an object containing User, Password, Host, Port etc at separate key-value pairs
const pgconfig = parse(process.env.DATABASE_URL);

// Add SSL setting to default environment variable on a new key-value pair (the value itself is an object)
pgconfig.ssl = { rejectUnauthorized: false };

const db = knex({
  client: "pg",
  connection: pgconfig,
  migrations: { directory: path_1.default.resolve(__dirname, "./dist/migrations") },
  seeds: { directory: path_1.default.resolve(__dirname, "./dist/seeds") }
});

module.exports = db;