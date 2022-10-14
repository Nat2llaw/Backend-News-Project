const express = require("express");
const {
  getTopics,
  getArticlesById,
  getUsers,
  patchVotes,
  getAllArticles,
  getCommentsByArticleId,
  postComment,
  removeComment
} = require("./db/controller/controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.get("/api/articles", getAllArticles);

app.get("/api/articles?topics=mitch", getAllArticles);

app.get("/api/articles?sort_by=author&order=ASC", getAllArticles);

app.patch("/api/articles/:article_id", patchVotes);

app.delete("/api/comments/:comment_id", removeComment)

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "not found" });
  } else if (err.code === "42703") {
    res.status(404).send({ msg: "Invalid query" })
  } else if (err.code === "42P10") {
    res.status(400).send({ msg: "Invalid query type" });
  } else if (err.code === "42601") {
    res.status(400).send({ msg: "Invalid order query" });
  } else {
    console.log(err);
    res.status(500).send({ msg: "Something went wrong" });
  }
});

module.exports = app;
