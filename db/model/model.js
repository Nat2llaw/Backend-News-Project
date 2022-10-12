const db = require("../connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArcticlesById = (id) => {
  return (
    db
      .query(
        `SELECT articles.*, (SELECT COUNT(*)::int
            FROM comments WHERE article_id=$1) AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id=comments.article_id WHERE articles.article_id=$1`,
        [id]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 400, msg: "Id not found" });
        }
        return rows;
      })
  );
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.updateVotes = (id, increaseBy) => {
  return db
    .query(
      `UPDATE articles SET votes=votes+$2 WHERE article_id=$1 RETURNING *`,
      [id, increaseBy]
    )
    .then(({ rows: [article] }) => {
      return article;
    });
};
