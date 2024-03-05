const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./userDb.sqlite", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the userDb database.");
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    login_method TEXT DEFAULT 'email'
  )`);

  db.run(`INSERT INTO users_new (id, email, password, login_method)
          SELECT id, email, password, 'email' FROM users`);

  db.run(`DROP TABLE users`);

  db.run(`ALTER TABLE users_new RENAME TO users`);
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Closed the database connection.");
});
