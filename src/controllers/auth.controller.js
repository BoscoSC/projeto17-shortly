import { db } from "../configs/database.connection.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

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

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const { rows } = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (!rows) {
      res.sendStatus(401);
      return;
    }

    const correctPassword = bcrypt.compareSync(password, rows[0].password);
    if (correctPassword) {
      const token = uuid();

      await db.query(
        `
      INSERT INTO sessions (token, "userId") VALUES ($1, $2)
      `,
        [token, rows[0].id]
      );

      res.send({ token });
      return;
    }

    res.sendStatus(401);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
