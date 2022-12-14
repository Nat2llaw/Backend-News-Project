const { rows } = require("pg/lib/defaults");
const db = require("../connection");
const { getArticlesById } = require("../controller/controller");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArcticlesById = (id) => {
  return db
    .query(
      `SELECT DISTINCT articles.*, (SELECT COUNT(*)::INT
            FROM comments WHERE article_id=$1) AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id=comments.article_id WHERE articles.article_id=$1`,
      [id]
    )
    .then(({ rows: [rows] }) => {
      if (rows === undefined) {
        return Promise.reject({ status: 404, msg: "Id not found" });
      }
      return rows;
    });
};

exports.fetchCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT *
      FROM comments
      WHERE article_id=$1
      ORDER BY created_at DESC`,
      [id]
    )
    .then(({ rows }) => {
      exports.fetchArcticlesById(id)
        .then((article) => {
          if (article.comment_count === 0) {
            return rows
          }
        })
      return rows
    })
};

exports.addNewComment = (id, newComment) => {
  const { username, body } = newComment;
  if (!body) {
    return Promise.reject({ status: 400, msg: "no body" });
  }
  if (!username) {
    return Promise.reject({ status: 400, msg: "no username" });
  }  
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
      [id, newComment.username, newComment.body]
    )
    .then(({ rows: [comment] }) => {
      return comment;
    })
    .catch((err) => {
      return Promise.reject({ status: 404, msg: "not found" }); 
    })
};

exports.deletingComment = (commentToRemove) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *`, [commentToRemove]
  )
    .then(({ rows: deleted }) => {
      if (deleted.length === 0) {
        return Promise.reject({ status: 404, msg: "no comment to delete"})
      }
    return deleted
  })
}

exports.fetchAllArticles = (topicQuery, sortByQuery, orderQuery) => {
  if (topicQuery) {
    return db
      .query(
        `SELECT DISTINCT articles.*, (SELECT COUNT(*)::INT
          FROM comments WHERE articles.article_id=comments.article_id) AS comment_count
          FROM articles
          LEFT JOIN comments ON articles.article_id=comments.article_id
          WHERE articles.topic=$1
          ORDER BY ${sortByQuery} ${orderQuery}`, [topicQuery]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Invalid query" });
        }
        return rows;
      });
  } else {
    return db
      .query(
        `SELECT DISTINCT articles.*, (SELECT COUNT(*)::INT
          FROM comments WHERE articles.article_id=comments.article_id) AS comment_count
          FROM articles
          LEFT JOIN comments ON articles.article_id=comments.article_id
          ORDER BY ${sortByQuery} ${orderQuery}`
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