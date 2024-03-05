const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./userDb.sqlite");

db.serialize(() => {
  db.run("DELETE FROM products", function (err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Deleted ${this.changes} products.`);
    }
  });
});

db.close();
