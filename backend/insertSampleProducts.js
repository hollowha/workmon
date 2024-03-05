const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./userDb.sqlite");

const products = [
  {
    name: "Product 1",
    description: "Description for product 1",
    price: 10.99,
    imageUrl: "https://source.unsplash.com/random/200x200?product=1&sig=0",
  },
  {
    name: "Product 2",
    description: "Description for product 2",
    price: 15.99,
    imageUrl: "https://source.unsplash.com/random/200x200?product=2&sig=1",
  },
  {
    name: "Product 3",
    description: "Description for product 3",
    price: 20.99,
    imageUrl: "https://source.unsplash.com/random/200x200?product=3&sig=2",
  },
  {
    name: "Product 4",
    description: "Description for product 4",
    price: 25.99,
    imageUrl: "https://source.unsplash.com/random/200x200?product=4&sig=3",
  },
  {
    name: "Product 5",
    description: "Description for product 5",
    price: 30.99,
    imageUrl: "https://source.unsplash.com/random/200x200?product=5&sig=4",
  },
  {
    name: "Product 6",
    description: "Description for product 6",
    price: 35.99,
    imageUrl: "https://source.unsplash.com/random/200x200?product=6&sig=5",
  },
  {
    name: "Product 7",
    description: "Description for product 7",
    price: 40.99,
    imageUrl: "https://source.unsplash.com/random/200x200?product=7&sig=6",
  },
  {
    name: "Product 8",
    description: "Description for product 8",
    price: 45.99,
    imageUrl: "https://source.unsplash.com/random/200x200?product=8&sig=7",
  },
  {
    name: "Product 9",
    description: "Description for product 9",
    price: 50.99,
    imageUrl: "https://source.unsplash.com/random/200x200?product=9&sig=8",
  },
  {
    name: "Product 10",
    description: "Description for product 10",
    price: 55.99,
    imageUrl: "https://source.unsplash.com/random/200x200?product=10&sig=9",
  },
  {
    name: "Product 11",
    description: "Description for product 11",
    price: 60.99,
    imageUrl: "https://source.unsplash.com/random/200x200?product=11&sig=10",
  },
  {
    name: "Product 12",
    description: "Description for product 12",
    price: 65.99,
    imageUrl: "https://source.unsplash.com/random/200x200?product=12&sig=11",
  },
];

db.serialize(() => {
  const stmt = db.prepare(
    "INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)"
  );
  for (const product of products) {
    stmt.run(
      product.name,
      product.description,
      product.price,
      product.imageUrl
    );
  }
  stmt.finalize();
});

db.close();
