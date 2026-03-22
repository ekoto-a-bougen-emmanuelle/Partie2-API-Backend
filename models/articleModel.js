const { getDB, saveDatabase } = require('../config/db');

const Article = {
  create: (article, callback) => {
    try {
      const db = getDB();
      const { titre, contenu, auteur, date, categorie, tags } = article;

      db.run(
        `INSERT INTO articles (titre, contenu, auteur, date, categorie, tags)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [titre, contenu, auteur, date, categorie, tags]
      );

      const result = db.exec(`SELECT last_insert_rowid() as id;`);
      const id = result[0].values[0][0];

      saveDatabase();
      callback(null, { id });
    } catch (err) {
      callback(err, null);
    }
  },

  getAll: (filters, callback) => {
    try {
      const db = getDB();
      let sql = `SELECT * FROM articles WHERE 1=1`;
      const params = [];

      if (filters.categorie) {
        sql += ` AND categorie = ?`;
        params.push(filters.categorie);
      }

      if (filters.auteur) {
        sql += ` AND auteur = ?`;
        params.push(filters.auteur);
      }

      if (filters.date) {
        sql += ` AND date = ?`;
        params.push(filters.date);
      }

      const stmt = db.prepare(sql, params);
      const rows = [];

      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }

      stmt.free();
      callback(null, rows);
    } catch (err) {
      callback(err, null);
    }
  },

  getById: (id, callback) => {
    try {
      const db = getDB();
      const stmt = db.prepare(`SELECT * FROM articles WHERE id = ?`, [id]);

      let article = null;
      if (stmt.step()) {
        article = stmt.getAsObject();
      }

      stmt.free();
      callback(null, article);
    } catch (err) {
      callback(err, null);
    }
  },

  update: (id, article, callback) => {
    try {
      const db = getDB();
      const { titre, contenu, categorie, tags } = article;

      db.run(
        `UPDATE articles
         SET titre = ?, contenu = ?, categorie = ?, tags = ?
         WHERE id = ?`,
        [titre, contenu, categorie, tags, id]
      );

      const result = db.exec(`SELECT changes() as changes;`);
      const changes = result[0].values[0][0];

      saveDatabase();
      callback(null, { changes });
    } catch (err) {
      callback(err, null);
    }
  },

  delete: (id, callback) => {
    try {
      const db = getDB();

      db.run(`DELETE FROM articles WHERE id = ?`, [id]);

      const result = db.exec(`SELECT changes() as changes;`);
      const changes = result[0].values[0][0];

      saveDatabase();
      callback(null, { changes });
    } catch (err) {
      callback(err, null);
    }
  },

  search: (query, callback) => {
    try {
      const db = getDB();
      const searchTerm = `%${query}%`;

      const stmt = db.prepare(
        `SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?`,
        [searchTerm, searchTerm]
      );

      const rows = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }

      stmt.free();
      callback(null, rows);
    } catch (err) {
      callback(err, null);
    }
  }
};

module.exports = Article;
