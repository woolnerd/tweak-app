import { QueryBuilder } from "drizzle-orm/sqlite-core";

import { db } from "@/db/client";

export type Database = typeof db;

export type QueryKeys = keyof typeof db.query;
export type MyQueryHelper = typeof db.query.fixtures;
