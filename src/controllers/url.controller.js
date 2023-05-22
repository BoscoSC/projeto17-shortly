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

export async function urlById(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(`SELECT * FROM shortens WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      res.sendStatus(404);
      return;
    }

    const response = {
      id: result.rows[0].id,
      shortUrl: result.rows[0].shortUrl,
      url: result.rows[0].url,
    };

    res.send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
