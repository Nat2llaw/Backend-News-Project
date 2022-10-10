const express = require("express");
const { getTopics, getArticlesById } = require("./db/controller/controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticlesById)

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "something went wrong" });
});

module.exports = app