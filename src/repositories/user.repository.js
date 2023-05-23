import { db } from "../configs/database.connection.js";

export async function getUserById(id) {
  return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
}

export async function getUserByEmail(email) {
  return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
}

export async function insertUser(name, email, passwordHash) {
  return db.query(
    `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
  `,
    [name, email, passwordHash]
  );
}

export async function getRanking() {
  return db.query(`
  SELECT users.id, users.name,
  COUNT (shortens.id) as "linksCount",
  SUM (shortens."visitCount") as "visitCount"
  FROM users
  LEFT JOIN shortens ON shortens."userId" = users.id
  GROUP BY users.id
  ORDER BY "visitCount" DESC
  LIMIT 10
`);
}
