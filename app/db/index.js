import sqlite3 from 'sqlite3';
import path from 'path';
import {fileURLToPath} from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
/** singleton class for Database **/
class DB {
  _dbInstance;
  static _instance;

  /** if instance exist returning existing one
   * otherwise creating new
   * @constructor
   * @return {DB}
   */
  constructor() {
    if (DB._instance === null) {
      DB._instance === this;
    } else {
      return DB._instance;
    }
  }

  /**
   * Creating conection to sqlite3
   */
  init() {
    this._dbInstance = new sqlite3.Database(
        path.resolve(dir, 'database.db'),
        sqlite3.OPEN_READWRITE,
        this._handleError,
    );
    this._createUserTable();
    this._creatExercisesTable();
  }

  /**
   * Handling error when instantiating DB
   * @param {Error} err error thrown when connecting to DB
   * @private
   */
  _handleError(err) {
    console.error(err?.message);
  }

  /**
   * Creating users table
   * @private
   */
  _createUserTable() {
    if (this._dbInstance) {
      this._dbInstance.run(
          'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username)',
      );
    }
  }

  /**
   * Creating exercise table
   * @private
   */
  _creatExercisesTable() {
    if (this._dbInstance) {
      this._dbInstance.run(
          `CREATE TABLE IF NOT EXISTS
                exercise(
                exerciseId INTEGER PRIMARY KEY, 
                userId INTEGER, 
                duration INTEGER, 
                description VARCHAR, 
                date DATE)`,
      );
    }
  }

  /**
   * Running DB query using promise
   * @param {string} sql sql query string
   * @param {any[]} params replacement array for sqlite3
   * @return {Promise<unknown>}
   */
  run(sql, params) {
    return new Promise((resolve, reject) => {
      this._dbInstance.run(sql, params, function(err, result) {
        if (err) {
          reject(err);
        } else {
          // eslint-disable-next-line
          resolve(result ? result : { ...this });
        }
      });
    });
  }

  /**
   * Running DB query all using promise
   * @param {string} sql SQL query string
   * @param {any[]} params replacement array for sqlite3
   * @return {Promise<unknown>}
   */
  all(sql, params) {
    return new Promise((resolve, reject) => {
      this._dbInstance.all(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

const db = new DB();
export default db;
