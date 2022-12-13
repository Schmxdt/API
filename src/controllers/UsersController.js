const { hash } = require("bcryptjs");
const appError = require("../utils/appError");
const sqliteConnection = require("../database/sqlite");
const { response } = require("express");
class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );
    if (checkUserExists) {
      throw new appError("Esse e-mail ja esta em uso");
    }

    const hashedPassword = hash(password, 8);

    await database.run(
      "INSERT INTO users (name , email, password) Values (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email } = req.body;
    const { id } = req.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id =  (?)", [
      id,
    ]);

    if (!user) {
      throw new AppError("Usuario nao encontrado");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new appError("Esse e-mail ja esta em uso");
    }

    user.name = name;
    user.email = email;

    await database.run(`
    UPDATE users SET
    name = ?,
    email = ?,
    updated_at = ?,
    WHERE id = ?,
    [user.name, user.email, new Date(), id]`);

    return res.json();
  }
}

module.exports = UsersController;

/*
   * index - GET pra listar varios rergistros.
   * show - GET pra exibir um registro especifico
   * create - POST pra criar um registro
   * update - PUT para atualizar um registro
   * delete - DELETE para remover um registro
  -=-=-=-mais de 5 criar um controller separado-=-=-=- 
  -pode ter somente 1,2,3 nao precisar ter todos mas acima de 5 nao-
   */
