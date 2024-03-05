require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const validator = require("validator");

const app = express();
const PORT = 3000;
const SECRET_KEY = "YOUR_SECRET_KEY"; // You should use a more secure key and store it in environment variables

const { expressjwt: expressJwt } = require("express-jwt");

// Middleware
app.use(bodyParser.json());
app.use(cors());

const authenticateJwt = expressJwt({
  secret: SECRET_KEY, // Use the same secret key you use for signing your JWTs
  algorithms: ["HS256"], // Ensure this matches the algorithm used to sign the token
  requestProperty: "user", // This is where the middleware will assign the payload of the decoded JWT
}).unless({
  path: [
    // paths that don't require authentication
    "/",
    "/login",
    "/register",
    "/products", // Allow fetching products without authentication
    { url: "/api/auth/google", methods: ["POST"] }, // Allow Google authentication
  ],
});

app.use(authenticateJwt);

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    // Handling unauthorized errors specifically
    res.status(401).send({ error: "Invalid or missing token" });
  }
});

let db = new sqlite3.Database(
  "./userDb.sqlite",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the userDb database.");
  }
);

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!validator.isEmail(email)) {
    return res.status(400).send({ error: "Invalid email format." });
  }

  // Check if email already exists
  db.get(
    `SELECT email FROM users WHERE email = ?`,
    [email],
    async (err, row) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .send({ error: "An error occurred. Please try again." });
      }

      if (row) {
        return res.status(400).send({ error: "Email already in use." });
      }

      // Proceed with registration
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run(
        `INSERT INTO users (email, password) VALUES (?, ?)`,
        [email, hashedPassword],
        function (err) {
          if (err) {
            console.error(err.message);
            return res
              .status(500)
              .send({ error: "An error occurred. Please try again." });
          }
          const userId = this.lastID;

          // After successfully creating the user, create a cart for them
          db.run(
            `INSERT INTO cart (userId) VALUES (?)`,
            [userId],
            function (err) {
              if (err) {
                console.error(err.message);
                return res
                  .status(500)
                  .send({ error: "Failed to create a cart for the user" });
              }
              // Send a success response for the registration, including cart creation
              res.status(201).send({
                message: "User registered successfully, and cart created",
                userId,
              });
            }
          );
        }
      );
    }
  );
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE email = ?`;
      db.get(sql, [email], (err, row) => {
        if (err) {
          console.error(err.message);
          reject("An error occurred. Please try again.");
        } else if (row) {
          resolve(row);
        } else {
          reject("User not found.");
        }
      });
    });

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) throw "Invalid credentials";

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // Before sending the token, check if the user has a cart
    const cartExists = await new Promise((resolve, reject) => {
      db.get(`SELECT id FROM cart WHERE userId = ?`, [user.id], (err, row) => {
        if (err) {
          console.error(err.message);
          reject("Failed to check cart.");
        } else if (row) {
          resolve(true); // Cart exists
        } else {
          resolve(false); // Cart does not exist
        }
      });
    });

    if (!cartExists) {
      // If no cart exists, create one
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO cart (userId) VALUES (?)`,
          [user.id],
          function (err) {
            if (err) {
              console.error(err.message);
              reject("Failed to create a cart.");
            } else {
              resolve();
            }
          }
        );
      });
    }

    // Now that all asynchronous operations are completed, send the response
    res.json({ token, userId: user.id });
  } catch (error) {
    res.status(401).send({ error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

///////

//Fetch All Products
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

//Fetch a Single Product
app.get("/products/:id", (req, res) => {
  const sql = "SELECT * FROM products WHERE id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    if (row) res.json(row);
    else res.status(404).send({ error: "Product not found" });
  });
});

//Add a New Product
app.post("/products", (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  const sql =
    "INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)";
  db.run(sql, [name, description, price, imageUrl], function (err) {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res
      .status(201)
      .send({ message: "Product added successfully", productId: this.lastID });
  });
});

//Update a Product
app.put("/products/:id", (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  const sql =
    "UPDATE products SET name = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?";
  db.run(
    sql,
    [name, description, price, imageUrl, req.params.id],
    function (err) {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      res.send({ message: "Product updated successfully" });
    }
  );
});

//Delete a Product
app.delete("/products/:id", (req, res) => {
  const sql = "DELETE FROM products WHERE id = ?";
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.send({ message: "Product deleted successfully" });
  });
});

///////////cart_item//////////////////

// POST /api/cart/items - Adds an item to the cart
app.post("/api/cart/items", (req, res) => {
  // Assuming req.user is set by authentication middleware
  if (!req.user) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const userId = req.user.userId;
  const { productId, quantity } = req.body;

  // Step 1: Retrieve or create the user's cart
  let getOrCreateCartQuery = `INSERT INTO cart (userId) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM cart WHERE userId = ?);`;
  db.run(getOrCreateCartQuery, [userId, userId], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ error: "Error creating or finding cart" });
    }
    console.log(req.headers);
    console.log(req.body);

    // Step 2: Get the cartId for the current user
    db.get(`SELECT id FROM cart WHERE userId = ?`, [userId], (err, cart) => {
      if (err || !cart) {
        console.error(err?.message || "Cart not found");
        return res.status(500).send({ error: "Error fetching user's cart" });
      }
      const cartId = cart.id;

      // Step 3: Add or update the item in the cart
      let checkProductInCartQuery = `SELECT * FROM cart_items WHERE cartId = ? AND productId = ?`;
      db.get(checkProductInCartQuery, [cartId, productId], (err, item) => {
        if (err) {
          console.error(err.message);
          return res.status(500).send({ error: "Error checking cart item" });
        }

        if (item) {
          // Product exists in cart, update its quantity
          let updateQuantityQuery = `UPDATE cart_items SET quantity = quantity + ? WHERE id = ?`;
          db.run(updateQuantityQuery, [quantity, item.id], function (err) {
            if (err) {
              console.error(err.message);
              return res
                .status(500)
                .send({ error: "Error updating item quantity" });
            }
            res.send({ message: "Cart item quantity updated successfully" });
          });
        } else {
          // Product does not exist in cart, insert as new item
          let insertItemQuery = `INSERT INTO cart_items (cartId, productId, quantity) VALUES (?, ?, ?)`;
          db.run(
            insertItemQuery,
            [cartId, productId, quantity],
            function (err) {
              if (err) {
                console.error(err.message);
                return res
                  .status(500)
                  .send({ error: "Error adding new item to cart" });
              }
              res.send({ message: "New item added to cart successfully" });
            }
          );
        }
      });
    });
  });
});

// GET /api/cart/items - Fetch cart items for the authenticated user
app.get("/api/cart/items", (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const userId = req.user.userId;

  // Query to get the user's cart items including product details
  const query = `
      SELECT ci.id, ci.quantity, p.id AS productId, p.name, p.price, p.imageUrl
      FROM cart_items ci
      JOIN cart c ON ci.cartId = c.id
      JOIN products p ON ci.productId = p.id
      WHERE c.userId = ?
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ error: "Error fetching cart items" });
    }
    res.json(rows);
  });
});

// PUT /api/cart/items/:itemId/increase - Increase item quantity
app.put("/api/cart/items/:itemId/increase", (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const { itemId } = req.params;
  const sql = `UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?`;

  db.run(sql, [itemId], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ error: "Error updating item quantity" });
    }
    if (this.changes > 0) {
      res.send({ message: "Quantity increased successfully" });
    } else {
      res.status(404).send({ error: "Item not found" });
    }
  });
});
// PUT /api/cart/items/:itemId/decrease - Decrease item quantity
app.put("/api/cart/items/:itemId/decrease", (req, res) => {
  // if (!req.user) {
  //   return res.status(401).send({ error: "Unauthorized" });
  // }

  // const { itemId } = req.params;
  // const sql = `UPDATE cart_items SET quantity = quantity - 1 WHERE id = ?`;

  // db.run(sql, [itemId], function (err) {
  //   if (err) {
  //     console.error(err.message);
  //     return res.status(500).send({ error: "Error updating item quantity" });
  //   }
  //   if (this.changes > 0) {
  //     res.send({ message: "Quantity decreased successfully" });
  //   } else {
  //     res.status(404).send({ error: "Item not found" });
  //   }
  // });

  if (!req.user) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const { itemId } = req.params;
  // 首先减少商品数量
  const decreaseSql = `UPDATE cart_items SET quantity = quantity - 1 WHERE id = ? AND quantity > 0`;

  db.run(decreaseSql, [itemId], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ error: "Error updating item quantity" });
    }

    if (this.changes > 0) {
      // 检查更新后的商品数量，如果为0，则移除
      const checkQuantitySql = `SELECT quantity FROM cart_items WHERE id = ?`;

      db.get(checkQuantitySql, [itemId], (err, row) => {
        if (err) {
          console.error(err.message);
          return res
            .status(500)
            .send({ error: "Error checking item quantity" });
        }

        if (row && row.quantity <= 0) {
          // 数量小於0，从购物车移除该商品
          const removeSql = `DELETE FROM cart_items WHERE id = ?`;

          db.run(removeSql, [itemId], function (err) {
            if (err) {
              console.error(err.message);
              return res.status(500).send({ error: "Error removing item" });
            }

            res.send({ message: "Item removed successfully" });
          });
        } else {
          // 数量未达到0，正常响应
          res.send({
            message: "Quantity decreased successfully",
            quantity: row ? row.quantity : null,
          });
        }
      });
    } else {
      res
        .status(404)
        .send({ error: "Item not found or quantity already at minimum" });
    }
  });
});

// DELETE /api/cart/items/:itemId - Remove an item from the cart
app.delete("/api/cart/items/:itemId", (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const { itemId } = req.params;
  const sql = `DELETE FROM cart_items WHERE id = ?`;

  db.run(sql, [itemId], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ error: "Error removing item from cart" });
    }
    res.send({ message: "Item removed successfully" });
  });
});

// Fetch user profile
app.get("/api/user/profile", (req, res) => {
  // Assuming req.user is set by your authentication middleware
  if (!req.user || !req.user.userId) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const userId = req.user.userId;
  const sql = `SELECT email FROM users WHERE id = ?`;
  db.get(sql, [userId], (err, row) => {
    if (err || !row) {
      return res
        .status(500)
        .send({ error: "User not found or error fetching user data." });
    }
    res.json({ email: row.email });
  });
});

///////////auth//////////////////

app.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Check if the user exists in the database
    db.get(
      `SELECT * FROM users WHERE email = ?`,
      [payload.email],
      async (err, user) => {
        if (err) {
          console.error(err.message);
          return res.status(500).send({ error: "Database error" });
        }

        let userId;
        if (user) {
          // User exists, use the existing user ID
          userId = user.id;
        } else {
          // User doesn't exist, create a new user with null password
          userId = await new Promise((resolve, reject) => {
            db.run(
              `INSERT INTO users (email, login_method) VALUES (?, 'google')`,
              [payload.email],
              function (err) {
                if (err) {
                  console.error(err.message);
                  reject(new Error("Failed to create new user"));
                } else {
                  resolve(this.lastID);
                }
              }
            );
          });
        }

        // Create a token for your application
        const userToken = jwt.sign({ userId: userId }, SECRET_KEY, {
          expiresIn: "1h",
        });

        res.json({
          message: "User authenticated successfully",
          userId: userId,
          token: userToken, // Send this token to your frontend
        });
      }
    );
  } catch (error) {
    console.error("Authentication failed", error);
    res.status(401).send({ error: "Authentication failed" });
  }
});
