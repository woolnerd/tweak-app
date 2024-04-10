import { db } from "../client.ts";

export type Database = typeof db;

export type QueryKeys = keyof typeof db.query;
export type MyQueryHelper = typeof db.query.fixtures;
