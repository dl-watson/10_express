DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS logs;

-- Add an ingredients field, which is an array with amount, measurement, and name (use a JSONB column).
CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  directions TEXT[],
  ingredients JSONB NOT NULL
);

CREATE TABLE logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recipe_id BIGINT REFERENCES recipes(id),
  date_of_event TEXT NOT NULL,
  notes TEXT NOT NULL,
  rating INTEGER NOT NULL
);