const { rows } = require("pg/lib/defaults");
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
        `SELECT articles.*, (SELECT COUNT(*)::INT
            FROM comments WHERE article_id=$1) AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id=comments.article_id WHERE articles.article_id=$1`,
        [id]
      )
      .then(({ rows: [rows] }) => {
        console.log(rows)
        if (rows === undefined) {
          return Promise.reject({ status: 400, msg: "Id not found" });
        }
        return rows;
      })
  );
};

exports.fetchAllArticles = (topicQuery) => {
  console.log(topicQuery)
  if (topicQuery === undefined) {
    return db
      .query(
        `SELECT articles.*, (SELECT COUNT(*)::INT
            FROM comments WHERE articles.article_id=comments.article_id) AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id=comments.article_id
            ORDER BY created_at DESC`
      )
      .then(({ rows }) => {
        return rows;
      });
  } else {
    return db
      .query(
        `SELECT articles.*, (SELECT COUNT(*)::INT
            FROM comments WHERE articles.article_id=comments.article_id) AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id=comments.article_id
            WHERE articles.topic=$1
            ORDER BY created_at DESC`,
            [topicQuery]
      )
      .then(({ rows }) => {
        return rows;
      });
  }
}

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
