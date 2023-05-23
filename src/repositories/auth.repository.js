import { db } from "../configs/database.connection.js";

export async function getSessionByToken(token) {
  return db.query(`SELECT * FROM sessions WHERE token = $1`, [token]);
}

export async function insertSession(token, userId) {
  return db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2)`, [
    token,
    userId,
  ]);
}
