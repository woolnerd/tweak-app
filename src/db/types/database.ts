import { db } from "@/db/client"
import { QueryBuilder } from "drizzle-orm/sqlite-core";

export type Database = typeof db;

export type QueryKeys = keyof typeof db.query;
export type MyQueryHelper = typeof db.query.fixtures;
