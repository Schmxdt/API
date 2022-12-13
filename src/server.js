require("express-async-errors");
const migrationsRun = require("./database/sqlite/migrations");
const appError = require("./utils/appError");

const express = require("express");
const routes = require("./routes");

migrationsRun();

const app = express();
app.use(express.json());

app.use(routes);

app.use((error, req, res, next) => {
  if (error instanceof appError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: "error.message",
    });
  }

  console.error(error);

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});
/*
app.get("/message/:id/:user", (req, res) => {
  // /message/2/Pedro
  const { id, user } = req.params;
  res.send(`Id da mensagem : ${id}.
  Usuario : ${user}.`);
});  */

/*
app.get("/users", (req, res) => {
  ///   users?page=10&limit=4
  const { page, limit } = req.query;

  res.send(`Pagina : ${page}. , Mostrar: ${limit}.`);
});*/

const port = 3333;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
