import { db } from "../configs/database.connection.js";

export async function authValidate(req, res, next) {
  const headers = req.headers.authorization;
  const token = headers?.replace("Bearer ", "");

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const { rows } = await db.query(
      `
    SELECT * FROM sessions WHERE token = $1`,
      [token]
    );

    if (!rows[0]) {
      res.sendStatus(401);
      return;
    }

    const { rows: users } = await db.query(
      `
    SELECT * FROM users WHERE id = $1`,
      [rows[0].userId]
    );

    if (!users[0]) {
      res.sendStatus(401);
      return;
    }

    res.locals.user = users[0];
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
