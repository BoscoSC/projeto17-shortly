import { nanoid } from "nanoid";
import {
  deleteShortenById,
  getShortUrlsById,
  getShortUrlsByShortUrl,
  insertShortUrl,
  updateVisitCount,
} from "../repositories/shortens.repository.js";

export async function shorten(req, res) {
  const { url } = req.body;
  const { id } = res.locals.user;

  const shortened = nanoid(10);

  try {
    const response = await insertShortUrl(url, shortened, id);

    const result = { id: response.rows[0].id, shortUrl: shortened };

    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function urlById(req, res) {
  const { id } = req.params;

  try {
    const result = await getShortUrlsById(id);

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

export async function redirectToUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const result = await getShortUrlsByShortUrl(shortUrl);

    if (result.rowCount === 0) {
      res.sendStatus(404);
      return;
    }

    await updateVisitCount(shortUrl);

    res.redirect(result.rows[0].url);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteUrl(req, res) {
  const { id } = req.params;
  const { user } = res.locals;

  try {
    const result = await getShortUrlsById(id);

    if (result.rowCount === 0) {
      res.sendStatus(404);
      return;
    }

    if (result.rows[0].userId !== user.id) {
      res.sendStatus(401);
      return;
    }

    await deleteShortenById(id);

    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
