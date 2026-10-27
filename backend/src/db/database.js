const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DB_DIR, 'swiftship.sqlite');
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');

class DatabaseWrapper {
  constructor() {
    this.db = null;
    this.SQL = null;
    this.saveTimeout = null;
  }

  async init() {
    if (this.db) return this;

    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    this.SQL = await initSqlJs();

    if (fs.existsSync(DB_FILE)) {
      const fileBuffer = fs.readFileSync(DB_FILE);
      this.db = new this.SQL.Database(fileBuffer);
    } else {
      this.db = new this.SQL.Database();
      const schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf8');
      this.db.exec(schemaSql);
      this.saveImmediate();
    }

    // Ensure foreign keys are enabled
    this.db.exec('PRAGMA foreign_keys = ON;');
    return this;
  }

  saveImmediate() {
    if (!this.db) return;
    try {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_FILE, buffer);
    } catch (err) {
      console.error('Error writing SQLite DB to disk:', err);
    }
  }

  scheduleSave() {
    if (this.saveTimeout) return;
    this.saveTimeout = setTimeout(() => {
      this.saveImmediate();
      this.saveTimeout = null;
    }, 250);
  }

  exec(sql) {
    if (!this.db) throw new Error('Database not initialized');
    this.db.exec(sql);
    this.scheduleSave();
  }

  query(sql, params = []) {
    if (!this.db) throw new Error('Database not initialized');
    const stmt = this.db.prepare(sql);
    if (params && params.length > 0) {
      stmt.bind(params);
    }
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  get(sql, params = []) {
    const rows = this.query(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  run(sql, params = []) {
    if (!this.db) throw new Error('Database not initialized');
    this.db.run(sql, params);
    
    // Retrieve last insert ID and changes
    const idResult = this.db.exec('SELECT last_insert_rowid() AS id, changes() AS changes;');
    let lastInsertRowid = 0;
    let changes = 0;
    if (idResult.length > 0 && idResult[0].values.length > 0) {
      lastInsertRowid = idResult[0].values[0][0];
      changes = idResult[0].values[0][1];
    }
    this.scheduleSave();
    return { lastInsertRowid, changes };
  }
}

const dbWrapper = new DatabaseWrapper();

module.exports = dbWrapper;
