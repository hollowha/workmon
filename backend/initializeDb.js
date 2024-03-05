const sqlite3 = require("sqlite3").verbose();

// Open a database handle
let db = new sqlite3.Database("./userDb.sqlite", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQlite database.");
});

db.serialize(() => {
  // Queries scheduled here will be serialized.
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`,
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Table created or already exists.");
      }
    }
  );
  // Create products table
  db.run(
    `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        imageUrl TEXT
      )`,
    (err) => {
      if (err) console.error(err.message);
      else console.log("Products table created or already exists.");
    }
  );

  // Create cart table (if planning to implement persistent carts)
  db.run(
    `CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id)
      )`,
    (err) => {
      if (err) console.error(err.message);
      else console.log("Cart table created or already exists.");
    }
  );

  // Create cart_items table
  db.run(
    `CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cartId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (cartId) REFERENCES cart (id),
        FOREIGN KEY (productId) REFERENCES products (id)
      )`,
    (err) => {
      if (err) console.error(err.message);
      else console.log("Cart items table created or already exists.");
    }
  );
});

// Close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Closed the database connection.");
});
