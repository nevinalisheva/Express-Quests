require("dotenv").config();

const express = require("express");

const app = express();

const {hashPassword, verifyPassword, verifyToken} = require("./auth.js");

app.use(express.json());
// a middleware to ensure that all routes are able to read a JSON formatted request body

const port = process.env.APP_PORT ?? 5001;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};


app.get("/", welcome);


const { validateMovie } = require("./validators.js");
const { validateUser } = require("./validators.js");
const userHandlers = require("./userHandlers");
const movieHandlers = require("./movieHandlers");

app.post("/api/users", validateUser, hashPassword, userHandlers.postUser);

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);


app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);


app.use(verifyToken);


app.put("/api/users/:id", validateUser, hashPassword, userHandlers.updateUser);
app.delete("/api/users/:id", userHandlers.deleteUser);

app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
