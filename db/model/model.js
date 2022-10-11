const db = require('../connection')

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then(({
        rows }) => {
            return rows
        })
}

exports.fetchArcticlesById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 400, msg: 'Id not found'})
        }
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

exports.updateVotes = (id, voteCount) => {
    console.log(id)
    console.log(voteCount)
    return db
        .query(`UPDATE articles SET votes=$2 WHERE article_id=$1`, [id, voteCount])
        .then(({ rows }) => {
            return rows;
    })
}