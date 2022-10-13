const express = require("express");
const {
  getTopics,
  getArticlesById,
  getUsers,
  patchVotes,
  getAllArticles,
  getCommentsByArticleId,
  postComment,
} = require("./db/controller/controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.get("/api/articles", getAllArticles);

app.get("/api/articles?topic=mitch", getAllArticles);

app.patch("/api/articles/:article_id", patchVotes);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "Create an account to comment" });
  } else {
    console.log(err);
    res.status(500).send({ msg: "Something went wrong" });
  }
});

module.exports = app;
