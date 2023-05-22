import { nanoid } from "nanoid";
import { db } from "../configs/database.connection.js";

export async function shorten(req, res) {
  const { url } = req.body;
  const { id } = res.locals.user;

  const shortened = nanoid(10);

  try {
    const response = await db.query(
      `INSERT INTO shortens (url, "shortUrl", "userId") VALUES ($1, $2, $3) RETURNING id`,
      [url, shortened, id]
    );

    const result = { id: response.rows[0].id, shortUrl: shortened };

    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
