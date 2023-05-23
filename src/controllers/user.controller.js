import {
  getShortUrlsByUserId,
  getSumVisitCount,
} from "../repositories/shortens.repository.js";
import { getRanking } from "../repositories/user.repository.js";

export async function userInfo(req, res) {
  const user = res.locals.user;

  try {
    const allVisits = await getSumVisitCount(user.id);

    const userUrls = await getShortUrlsByUserId(user.id);

    const shortenedUrls = userUrls.rows.map((item) => {
      return {
        id: item.id,
        shortUrl: item.shortUrl,
        url: item.url,
        visitCount: item.visitCount,
      };
    });

    const body = {
      id: user.id,
      name: user.name,
      visitCount: allVisits.rows[0].sum,
      shortenedUrls,
    };

    res.send(body);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function ranking(req, res) {
  try {
    const results = await getRanking();

    res.send(results.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
