const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '..', 'blog.sqlite');

let SQL;
let db;

async function initDB() {
  SQL = await initSqlJs({});

  if (fs.existsSync(dbFilePath)) {
    const fileBuffer = fs.readFileSync(dbFilePath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT NOT NULL,
      contenu TEXT NOT NULL,
      auteur TEXT NOT NULL,
      date TEXT NOT NULL,
      categorie TEXT NOT NULL,
      tags TEXT
    );
  `);

  saveDatabase();
  console.log('Base de données SQLite initialisée avec sql.js');
}

function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbFilePath, buffer);
}

function getDB() {
  return db;
}

module.exports = {
  initDB,
  getDB,
  saveDatabase
};
