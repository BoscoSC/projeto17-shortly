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
    const results = await db.query(`
      SELECT users.id, users.name,
      COUNT (shortens.id) as "linksCount",
      SUM (shortens."visitCount") as "visitCount"
      FROM users
      LEFT JOIN shortens ON shortens."userId" = users.id
      GROUP BY users.id
      ORDER BY "visitCount" DESC
      LIMIT 10
    `);

    res.send(results.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
