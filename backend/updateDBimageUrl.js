const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("userDb.sqlite");

// 1. Arwen
// 2. Brielle
// 3. Calliope
// 4. Elodie
// 5. Freya
// 6. Hadley
// 7. Imogen
// 8. Jolene
// 9. Keira
// 10. Lyla
// 11. Maeve
// 12. Norah
const updates = [
  // {
  //   id: 25,
  //   imageUrl: "@/assets/products/Gemini_Generated_Image.jfif",
  // },
  // {
  //   id: 26,
  //   imageUrl: "@/assets/products/Gemini_Generated_Image (1).jfif",
  // },
  // {
  //   id: 27,
  //   imageUrl: "@/assets/products/Gemini_Generated_Image (2).jfif",
  // },
  // {
  //   id: 28,
  //   imageUrl: "@/assets/products/Gemini_Generated_Image (3).jfif",
  // },
  // {
  //   id: 29,
  //   imageUrl: "@/assets/products/Gemini_Generated_Image (4).jfif",
  // },
  // {
  //   id: 30,
  //   imageUrl: "@/assets/products/Gemini_Generated_Image (5).jfif",
  // },
  // {
  //   id: 31,

  //   imageUrl: "@/assets/products/Gemini_Generated_Image (6).jfif",
  // },
  // {
  //   id: 32,
  //   imageUrl: "@/assets/products/Gemini_Generated_Image (7).jfif",
  // },
  // {
  //   id: 33,
  //   imageUrl: "@/assets/products/Gemini_Generated_Image (8).jfif",
  // },
  // {
  //   id: 34,
  //   imageUrl: "@/assets/products/Gemini_Generated_Image (9).jfif",
  // },
  // {
  //   id: 35,
  //   imageUrl: "@/assets/products/Gemini_Generated_Image (10).jfif",
  // },
  // {
  //   id: 36,
  //   imageUrl: "@/assets/products/Gemini_Generated_Image (11).jfif",
  // },

  {
    id: 25,
    name: "Arwen",
  },
  {
    id: 26,
    name: "Brielle",
  },
  {
    id: 27,
    name: "Calliope",
  },
  {
    id: 28,
    name: "Elodie",
  },
  {
    id: 29,
    name: "Freya",
  },
  {
    id: 30,
    name: "Hadley",
  },
  {
    id: 31,
    name: "Imogen",
  },
  {
    id: 32,
    name: "Jolene",
  },
  {
    id: 33,
    name: "Keira",
  },
  {
    id: 34,
    name: "Lyla",
  },
  {
    id: 35,
    name: "Maeve",
  },
  {
    id: 36,
    name: "Norah",
  },
];

updates.forEach((update) => {
  db.run(
    `UPDATE products SET name = ? WHERE id = ?`,
    [update.name, update.id],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row(s) updated: ${this.changes}`);
    }
  );
});

// Close the database connection
db.close();
