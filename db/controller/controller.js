const {
  fetchTopics,
  fetchArcticlesById,
  fetchUsers,
  updateVotes,
} = require("../model/model");

exports.getTopics = (req, res, next) => {
    fetchTopics()
      .then((topic) => {
        res.status(200).send(topic);
      })
      .catch((err) => {
      next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
  const id = req.params.article_id;
  fetchArcticlesById(id)
    .then((article) => {
      if (article.length === 0) {
        res.status(404).send({ msg: "no such article id" });
      } else {
        res.status(200).send(article);
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotes = (res, req, next) => {
  updateVotes(res.params, res.body.inc_votes).then((article) =>
  {
    res.status(203).send({article})
  })
    .catch((err) => {
      next(err)
    })
}