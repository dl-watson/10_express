const fs = require("fs");
const pool = require("../lib/utils/pool");
const request = require("supertest");
const app = require("../lib/app");
const Recipe = require("../lib/models/recipe");

describe("recipe-lab routes", () => {
  beforeEach(async () => {
    await pool.query(fs.readFileSync("./sql/setup.sql", "utf-8"));

    const recipe = await Recipe.insert({
      name: "cookies",
      ingredients: [
        { amount: "1.5", measurement: "cups", name: "chocolate chips" },
      ],
      directions: [],
    });
  });

  afterAll(() => {
    return pool.end();
  });

  it("creates a recipe", () => {
    return request(app)
      .post("/api/v1/recipes")
      .send({
        name: "cookies",
        directions: [
          "preheat oven to 375",
          "mix ingredients",
          "put dough on cookie sheet",
          "bake for 10 minutes",
        ],
      })
      .then((res) => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: "cookies",
          directions: [
            "preheat oven to 375",
            "mix ingredients",
            "put dough on cookie sheet",
            "bake for 10 minutes",
          ],
        });
      });
  });

  it("gets all recipes", async () => {
    const recipes = await Promise.all(
      [
        { name: "cookies", directions: [] },
        { name: "cake", directions: [] },
        { name: "pie", directions: [] },
      ].map((recipe) => Recipe.insert(recipe))
    );

    return request(app)
      .get("/api/v1/recipes")
      .then((res) => {
        recipes.forEach((recipe) => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it("gets a recipe by id", async () => {
    const recipe = await Recipe.insert({ name: "cookies", directions: [] });

    return request(app)
      .get(`/api/v1/recipes/${recipe.id}`)
      .then((res) => expect(res.body).toEqual(recipe));
  });

  it("updates a recipe by id", async () => {
    const recipe = await Recipe.insert({
      name: "cookies",
      directions: [
        "preheat oven to 375",
        "mix ingredients",
        "put dough on cookie sheet",
        "bake for 10 minutes",
      ],
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: "good cookies",
        directions: [
          "preheat oven to 375",
          "mix ingredients",
          "put dough on cookie sheet",
          "bake for 10 minutes",
        ],
      })
      .then((res) => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: "good cookies",
          directions: [
            "preheat oven to 375",
            "mix ingredients",
            "put dough on cookie sheet",
            "bake for 10 minutes",
          ],
        });
      });
  });

  it("updates a recipe by id", async () => {
    const recipe = await Recipe.insert({ name: "cookies", directions: [] });

    return request(app)
      .delete(`/api/v1/recipes/${recipe.id}`)
      .then((res) => expect(res.body).toEqual(recipe));
  });
});
