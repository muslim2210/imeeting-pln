import mysql from "mysql2/promise";

let db: mysql.Connection | null = null;

export async function getDB() {
  if (!db) {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "1234",
      database: process.env.DB_NAME || "mydb",
    });
  }
  return db;
}
