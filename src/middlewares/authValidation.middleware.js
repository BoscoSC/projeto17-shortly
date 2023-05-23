import { getSessionByToken } from "../repositories/auth.repository.js";
import { getUserById } from "../repositories/user.repository.js";

export async function authValidate(req, res, next) {
  const headers = req.headers.authorization;
  const token = headers?.replace("Bearer ", "");

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const { rows } = await getSessionByToken(token);

    if (!rows[0]) {
      res.sendStatus(401);
      return;
    }

    const userId = rows[0].userId;

    const { rows: users } = await getUserById(userId);

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
