import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  test: {
    client: "better-sqlite3",
    connection: {
      filename: "./test.sqlite3",
    },
    useNullAsDefault: true,
    migrations: { directory: "../src/migrations" },
    seeds: { directory: "../src/seeds" },
  },
  production: {
    client: "pg",
    connection: {
      connectionString: process.env.PG_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
    },
    searchPath: ["knex", "public"],
    useNullAsDefault: true,
    migrations: { directory: path.resolve(__dirname, "./src/migrations") },
    seeds: { directory: path.resolve(__dirname, "./src/seeds") },
  },
};

export default config;
