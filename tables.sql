CREATE TABLE IF NOT EXISTS pokemon(
id SERIAL PRIMARY KEY,
name TEXT,
img TEXT,
weight TEXT,
height TEXT
);


CREATE TABLE IF NOT EXISTS users(
id SERIAL PRIMARY KEY,
name TEXT,
password TEXT
);

CREATE TABLE IF NOT EXISTS users_pokemons(
id SERIAL PRIMARY KEY,
pokemon_id INTEGER,
user_id INTEGER
)
