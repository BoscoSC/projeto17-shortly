import { db } from "../configs/database.connection.js";
import bcrypt from "bcrypt";

export async function register(req, res) {
  const { name, email, password } = req.body;

  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    const userExists = await db.query(
      `
      SELECT * FROM users WHERE email = $1
    `,
      [email]
    );

    if (userExists.rowCount > 0) {
      res.sendStatus(409);
      return;
    }

    await db.query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
    `,
      [name, email, passwordHash]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
