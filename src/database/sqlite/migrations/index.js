//const sqliteConnection = require("../../sqlite");
const sqliteConnection = require("../../../database");

const createUsers = require("./createUsers");

async function migrationsRuns() {
  const schemas = createUsers;

  sqliteConnection()
    .then((db) => db.exec(schemas))
    .catch((error) => console.error(error));
}
module.exports = sqliteConnection;
module.exports = migrationsRuns;
