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
      .then(({ body }) => {
        expect.objectContaining({ body });
      });
  });
  test("404: mispelt endpoint", () => {
    return request(app)
      .get("/api/tpics")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
});

describe("GET/api/articles/:article_id", () => {
  test("200: return article by id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect.objectContaining(body);
      });
  });
  test("404:article id not in database", () => {
    return request(app)
      .get("/api/articles/1123")
      .expect(404)
        .then(({ body }) => {
          console.log(body)
        expect.objectContaining(body);
      });
  });
});
