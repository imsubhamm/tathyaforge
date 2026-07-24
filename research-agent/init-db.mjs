import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(here, "data");
mkdirSync(dataDir, { recursive: true });

const databasePath = resolve(dataDir, "research.sqlite");
const schema = readFileSync(resolve(here, "schema.sql"), "utf8");
const database = new DatabaseSync(databasePath);
database.exec(schema);
database.close();

console.log(`Research database ready: ${databasePath}`);
