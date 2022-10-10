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
  test("404: mispelt endpoint", () => {
    return request(app)
      .get("/api/tpics")
      .expect(404)
      .then(({ body:tpics }) => {
        expect(tpics).toEqual({});
      });
  });
});

describe("GET/api/articles/:article_id", () => {
  test("200: return article by id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: article }) => {
        console.log(article)
        expect(article).toHaveLength(1);
        article.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number)
            })
          );
        });
      });
  });
  test("400:article id not in database", () => {
    return request(app)
      .get("/api/articles/1123")
      .expect(400)
        .then(({ body:article }) => {
          expect(article).toEqual({});
      });
  });
});
