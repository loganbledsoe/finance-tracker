"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const config = {
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
        migrations: { directory: path_1.default.resolve(__dirname, "./migrations") },
        seeds: { directory: path_1.default.resolve(__dirname, "./seeds") },
    },
};
exports.default = config;
