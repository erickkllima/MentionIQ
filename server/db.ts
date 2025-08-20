import { drizzle } from 'drizzle-orm/better-sqlite3';
// @ts-ignore
import Database from 'better-sqlite3';
import * as schema from '@shared/schema';

// Conecta/cria o banco SQLite local no arquivo ./db.sqlite
const sqlite = new Database('./db.sqlite');
export const db = drizzle(sqlite, { schema });
