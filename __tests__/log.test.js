const fs = require("fs");
const pool = require("../lib/utils/pool");
const request = require("supertest");
const app = require("../lib/app");
const Log = require("../lib/models/log");
const Recipe = require("../lib/models/recipe");

describe("log-lab routes", () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync("./sql/setup.sql", "utf-8"));
  });

  afterAll(() => {
    return pool.end();
  });

  it("creates a log", async () => {
    const recipe = await request(app)
      .post("/api/v1/recipes")
      .send({
        name: "cookies",
        directions: [
          "preheat oven to 375",
          "mix ingredients",
          "put dough on cookie sheet",
          "bake for 10 minutes",
        ],
      });

    const logs = await request(app).post("/api/v1/logs").send({
      recipeId: recipe.id,
      dateOfEvent: "January 16th, 2020",
      notes: "These cookies were terrible.",
      rating: 0,
    });

    const res = await request(app).get(`/api/v1/logs/${logs.body.id}`);

    expect(res.body).toEqual({
      id: expect.any(String),
      recipeId: null,
      dateOfEvent: "January 16th, 2020",
      notes: "These cookies were terrible.",
      rating: 0,
    });
  });

  it("gets all logs", async () => {
    const recipe = await request(app)
      .post("/api/v1/recipes")
      .send({
        name: "cookies",
        directions: [
          "preheat oven to 375",
          "mix ingredients",
          "put dough on cookie sheet",
          "bake for 10 minutes",
        ],
      });

    const logs = await Promise.all(
      [
        {
          recipeId: recipe.body.id,
          dateOfEvent: "January 16th, 2020",
          notes: "These cookies were terrible.",
          rating: 0,
        },
        {
          recipeId: recipe.body.id,
          dateOfEvent: "January 16th, 2020",
          notes: "These cookies were terrible.",
          rating: 0,
        },
        {
          recipeId: recipe.body.id,
          dateOfEvent: "January 16th, 2020",
          notes: "These cookies were terrible.",
          rating: 0,
        },
      ].map((log) => Log.insert(log))
    );

    return request(app)
      .get("/api/v1/logs")
      .then((res) => {
        logs.forEach((log) => {
          expect(res.body).toContainEqual(log);
        });
      });
  });

  it("gets a log by id", async () => {
    const recipe = await request(app)
      .post("/api/v1/recipes")
      .send({
        name: "cookies",
        directions: [
          "preheat oven to 375",
          "mix ingredients",
          "put dough on cookie sheet",
          "bake for 10 minutes",
        ],
      });

    const log = await Log.insert({
      recipeId: recipe.id,
      dateOfEvent: "January 16th, 2020",
      notes: "These cookies were terrible.",
      rating: 0,
    });

    return request(app)
      .get(`/api/v1/logs/${log.id}`)
      .then((res) => expect(res.body).toEqual(log));
  });

  it("updates a log by id", async () => {
    const recipe = await request(app)
      .post("/api/v1/recipes")
      .send({
        name: "cookies",
        directions: [
          "preheat oven to 375",
          "mix ingredients",
          "put dough on cookie sheet",
          "bake for 10 minutes",
        ],
      });

    const log = await request(app).post("/api/v1/logs").send({
      recipeId: recipe.body.id,
      dateOfEvent: "January 16th, 2020",
      notes: "These cookies were terrible.",
      rating: 0,
    });

    return request(app)
      .get(`/api/v1/logs/${log.body.id}`)
      .then((res) => expect(res.body).toEqual(log.body));
  });

  it("deletes a log by id", async () => {
    const recipe = await request(app)
      .post("/api/v1/recipes")
      .send({
        name: "cookies",
        directions: [
          "preheat oven to 375",
          "mix ingredients",
          "put dough on cookie sheet",
          "bake for 10 minutes",
        ],
      });

    const log = await request(app).post("/api/v1/logs").send({
      recipeId: recipe.body.id,
      dateOfEvent: "January 16th, 2020",
      notes: "These cookies were terrible.",
      rating: 0,
    });

    return request(app)
      .delete(`/api/v1/logs/${log.body.id}`)
      .then((res) => expect(res.body).toEqual(log.body));
  });
});
