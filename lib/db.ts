import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data.sqlite");
const db = new Database(DB_PATH);

db.prepare(`
  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    size INTEGER NOT NULL,
    created_at TEXT NOT NULL
  )
`).run();

export type FileMeta = {
  id: number;
  filename: string;
  original_name: string;
  size: number;
  created_at: string;
};

export function insertFile(filename: string, originalName: string, size: number) {
  const stmt = db.prepare(`
    INSERT INTO files (filename, original_name, size, created_at)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(filename, originalName, size, new Date().toISOString());
  return result.lastInsertRowid as number;
}

export function getAllFiles(): FileMeta[] {
  return db.prepare("SELECT * FROM files ORDER BY id DESC").all() as FileMeta[];
}

export function getFile(id: number): FileMeta | undefined {
  return db.prepare("SELECT * FROM files WHERE id = ?").get(id) as FileMeta | undefined;
}

export function deleteFile(id: number) {
  return db.prepare("DELETE FROM files WHERE id = ?").run(id);
}
