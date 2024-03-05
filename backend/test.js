const sqlite3 = require("sqlite3").verbose();

// Open the database
let db = new sqlite3.Database(
  "./userDb.sqlite",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    }
    console.log("Connected to the SQlite database.");
  }
);

// Alter table to add login_method column
db.run(
  `ALTER TABLE users ADD COLUMN login_method TEXT DEFAULT 'email'`,
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Column login_method added to users table successfully.");
    }

    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Closed the database connection.");
    });
  }
);
