const db = require('../connection')

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then(({
        rows }) => {
            return rows
        })
}

exports.fetchArcticlesById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [id]).then(({ rows }) => {
        return rows
    })
}

exports.fetchUsers = () => {
  return db
    .query(`SELECT * FROM users`)
    .then(({ rows }) => {
      return rows;
    });
};