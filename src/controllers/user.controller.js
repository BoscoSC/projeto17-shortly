import { db } from "../configs/database.connection.js";

export async function userInfo(req, res) {
  const user = res.locals.user;

  try {
    const allVisits = await db.query(
      `
      SELECT SUM(shortens."visitCount")
      FROM shortens
      WHERE "userId" = $1
    `,
      [user.id]
    );

    const userUrls = await db.query(
      `
      SELECT *
      FROM shortens
      WHERE "userId" = $1
    `,
      [user.id]
    );

    const shortenedUrls = userUrls.rows.map((item) => {
      return {
        id: item.id,
        shortUrl: item.shortUrl,
        url: item.url,
        visitCount: item.visitCount,
      };
    });

    res.send({
      id: user.id,
      name: user.name,
      visitCount: allVisits.rows[0].sum,
      shortenedUrls,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}
