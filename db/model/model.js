const db = require("../connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArcticlesById = (id) => {
  return db
    .query(`ALTER TABLE articles ADD comment_count INT NOT NULL DEFAULT 0 `)
    .then(() => {
        return db.query(
          `UPDATE articles SET comment_count=(SELECT COUNT(*)
           FROM comments WHERE article_id=$1);`,[id]
        );
    })
    .then(() => {
      return db.query(`SELECT * FROM articles WHERE article_id=$1`, [id]);
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Id not found" });
      }
      return rows;
    });
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
