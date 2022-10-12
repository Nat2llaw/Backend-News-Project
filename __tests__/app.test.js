const app = require("../app");
const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET/api/topics", () => {
  test("200: return topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: topics }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topics) => {
          expect(topics).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("check for correct pathing", () => {
  test("404: misspelt", () => {
    return request(app)
      .get("/api/tpics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

describe("GET/api/articles", () => {
  test("200: return all the articles sort by date descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: article }) => {
        expect(article).toHaveLength(25);
        expect(article).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
        article.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET/api/articles/:article_id", () => {
    test("200: return article with comment_count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: article }) => {
          expect(article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            comment_count: 11,
          });
        });
    });
    test("400: return error", () => {
      return request(app)
        .get("/api/articles/1123123/comments")
        .expect(400)
        .then(({ body: comments }) => {
          expect(comments.msg).toBe("Id not found");
        });
    });
    describe("PATCH/api/articles/:article_id", () => {
      test("200: return article by id with increased vote value", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 110,
            });
          });
      });
      test("400: inc_votes is not a number", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "banana" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
    });
    test("400: article id not in database", () => {
      return request(app)
        .get("/api/articles/1123")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Id not found");
        });
    });
    test("400: wrong type of data", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET/api/articles/:article_id/comments", () => {
    test("200: return comments with relevent article id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: comments }) => {
          expect(comments).toHaveLength(11);
          comments.forEach((comments) => {
            expect(comments).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
  });
  describe(" POST/api/articles/:article_id/comments", () => {
    test("201: create comment with relevent article id if username exists", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "rogersop", body: "Can he fix it?" })
        .expect(201)
        .then(({ body: comments }) => {
          expect(comments).toEqual(
            expect.objectContaining({
              author: "rogersop",
              body: "Can he fix it?",
              article_id: 1,
              comment_id: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number)
            })
          )
        });
    });
    test("400: throw error if username doesn't exist", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "bob the builder", body: "Can he fix it?" })
        .expect(400)
        .then(({ body: comments }) => {
          expect(comments.msg).toEqual("Create Account to Comment");
        });
    });
  });
});
describe("GET/api/articles?topic=mitch", () => {
  test("200: return all the articles with topic mitch sort by date descending", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: article }) => {
        expect(article).toHaveLength(23);
        article.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("400: return error for invalid query", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(400)
      .then(({ body: article }) => {
        expect(article.msg).toBe("Query not valid");
      });
  });
});

describe("GET/api/users/", () => {
  test("200: return users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: users }) => {
        expect(users).toHaveLength(4);
        users.forEach((users) => {
          expect(users).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("400: article id not in database", () => {
    return request(app)
      .get("/api/articles/1123")
      .expect(400)
      .then(({ body: article }) => {
        expect(article).toEqual({ msg: "Id not found" });
      });
  });
});
