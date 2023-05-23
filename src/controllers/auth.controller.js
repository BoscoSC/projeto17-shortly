import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { getUserByEmail, insertUser } from "../repositories/user.repository.js";
import { insertSession } from "../repositories/auth.repository.js";

export async function register(req, res) {
  const { name, email, password } = req.body;

  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    const userExists = await getUserByEmail(email);

    if (userExists.rowCount > 0) {
      res.sendStatus(409);
      return;
    }

    await insertUser(name, email, passwordHash);

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const { rows } = await getUserByEmail(email);

    if (rows.length === 0) {
      res.sendStatus(401);
      return;
    }

    const correctPassword = bcrypt.compareSync(password, rows[0].password);
    if (correctPassword) {
      const token = uuid();
      const userId = rows[0].id;

      await insertSession(token, userId);

      res.send({ token });
      return;
    }

    res.sendStatus(401);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
