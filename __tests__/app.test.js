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
      .then(({ body: article }) => {
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
      .then(({ body }) => {
        expect(body.msg).toBe("Id not found" );
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
              avatar_url: expect.any(String)
            })
          );
        });
      });
  });
  test("404: mispelt endpoint", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then(({ misspeltUsers }) => {
        expect(misspeltUsers).toEqual(undefined);
      });
  });
});

// describe.only("GET/api/articles/:article_id", () => {
//   test("200: return article by id with increased vote value", () => {
//     return request(app)
//       .get("/api/articles/1")
//       .send({ inc_votes: 10 })
//       .expect(200)
//       .then(({ body: article }) => {
//         console.log(article)
//         expect(article).toHaveLength(1);
//         article.forEach((article) => {
//           expect(article).toEqual(
//             {
//               article_id: 1,
//               title: 'Living in the shadow of a great man',
//               topic: 'mitch',
//               author: 'butter_bridge',
//               body: 'I find this existence challenging',
//               created_at: '2020-07-09T20:11:00.000Z',
//               votes: 110
//             })
//         });
//       });
//   });
// })