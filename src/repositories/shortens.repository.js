import { db } from "../configs/database.connection.js";

export async function getSumVisitCount(userId) {
  return db.query(
    `
    SELECT SUM(shortens."visitCount")
    FROM shortens
    WHERE "userId" = $1
  `,
    [userId]
  );
}

export async function getShortUrlsById(id) {
  return db.query(`SELECT * FROM shortens WHERE id = $1`, [id]);
}

export async function getShortUrlsByUserId(userId) {
  return db.query(`SELECT * FROM shortens WHERE "userId" = $1`, [userId]);
}

export async function insertShortUrl(url, shortened, id) {
  return db.query(
    `INSERT INTO shortens (url, "shortUrl", "userId") VALUES ($1, $2, $3) RETURNING id`,
    [url, shortened, id]
  );
}

export async function getShortUrlsByShortUrl(shortUrl) {
  return db.query(`SELECT * FROM shortens WHERE "shortUrl" = $1`, [shortUrl]);
}

export async function updateVisitCount(shortUrl) {
  return db.query(
    `UPDATE shortens SET "visitCount" = "visitCount" + 1 WHERE "shortUrl" = $1`,
    [shortUrl]
  );
}

export async function deleteShortenById(id) {
  return db.query(`DELETE FROM shortens WHERE id = $1`, [id]);
}
