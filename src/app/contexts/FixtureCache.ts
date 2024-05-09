import { createContext } from "react";

export const FixtureCacheContext = createContext<Set<number>>(new Set());
