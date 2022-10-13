const {
  fetchTopics,
  fetchArcticlesById,
  fetchUsers,
  updateVotes,
  fetchAllArticles,
  fetchCommentsByArticleId,
  addNewComment,
  deletingComment,
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

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  fetchCommentsByArticleId(id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const id = req.params.article_id
  const newComment = req.body;
  addNewComment(id, newComment)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeComment = (req, res, next) => {
  const commentToRemove = req.params.comment_id
  deletingComment(commentToRemove)
    .then((deletedComment) => {
    res.status(204).send(deletedComment)
  })
}

exports.getAllArticles = (req, res, next) => {
  const topicQuery = req.query.topic;
  const sortByQuery = req.query.sort_by;
  const orderQuery = req.query.order;
  fetchAllArticles(topicQuery, sortByQuery, orderQuery)
    .then((allArticles) => {
      res.status(200).send(allArticles);
    })
    .catch((err) => {
      next(err);
    });
}

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