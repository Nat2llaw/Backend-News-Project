const express = require("express");
const {
  getTopics,
  getArticlesById,
  getUsers,
  patchVotes,
} = require("./db/controller/controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticlesById)

app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchVotes)

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    console.log(err);
    res.status(500).send({ msg: "Something went wrong" });
  }
});

module.exports = app