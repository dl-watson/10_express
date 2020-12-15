const { Router } = require("express");
const Recipe = require("../models/recipe");

module.exports = Router()
  .post("/", (req, res, next) => {
    Recipe.insert(req.body)
      .then((recipe) => res.send(recipe))
      .catch(next);
  })
  .get("/", (req, res, next) => {})
  .get("/", (req, res, next) => {})
  .put("/", (req, res, next) => {})
  .delete("/", (req, res, next) => {});
