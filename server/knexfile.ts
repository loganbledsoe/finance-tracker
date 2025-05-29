import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  test: {
    client: "better-sqlite3",
    connection: {
      filename: "./test.sqlite3",
    },
    useNullAsDefault: true,
    migrations: { directory: "./src/migrations" },
    seeds: { directory: "./src/seeds" },
  },
  production: {
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ["knex", "public"],
    useNullAsDefault: true,
    migrations: { directory: "./src/migrations" },
    seeds: { directory: "./src/seeds" },
  },
};

export default config;
