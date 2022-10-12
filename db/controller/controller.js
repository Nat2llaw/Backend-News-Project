const {
  fetchTopics,
  fetchArcticlesById,
  fetchUsers,
  updateVotes,
  fetchAllArticles,
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
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  console.log(req.query.topic)
  const topicQuery = req.query.topic;
  fetchAllArticles(topicQuery)
    .then((all) => {
      res.status(200).send(all);
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

exports.patchVotes = (req, res, next) => {
  const id = req.params.article_id;
  const increaseBy = req.body.inc_votes;
  updateVotes(id, increaseBy)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
