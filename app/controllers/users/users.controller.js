import db from '../../db/index.js';
import {sendDatabaseError} from '../../utlis.js';

/**
 * Creating user
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
export async function createUser(req, res) {
  let results;
  const username = req.body?.username;
  if (!username) {
    res.status(400).json({
      errors: [{
        value: 'No user name',
        type: 'Request'
      }]
    })
  }
  try {
    results = await db.run(`INSERT INTO users (username) VALUES(?)`, [
      username,
    ]);
  } catch (error) {
    sendDatabaseError(res, error);
    return;
  }

  if (results) {
    res.status(201).json({_id: results.lastID, username});
    return;
  }

  res.status(500).send();
}

/**
 * Getting user by id
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
export async function getUserById(req, res) {
  const id = req.params?._id;

  let result;

  try {
    result = await db.all('SELECT * FROM users WHERE id = ?', [+id]);
  } catch (error) {
    sendDatabaseError(res, error);
    return;
  }

  if (result) {
    res.json(result.map(({username, id}) => ({username, _id: id})));
    return;
  }
  res.status(404).send({
    errors: [{type: 'No data'}],
  });
  return;
}

/**
 * Getting all user
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
export async function getAllUsers(req, res) {
  let result;

  try {
    result = await db.all('SELECT * FROM users');
  } catch (error) {
    sendDatabaseError(res, error);
    return;
  }

  if (result?.length) {
    res.json(result.map(({id, username}) => ({_id: id, username,__v:0})));
    return;
  }

  res.status(404);
}

/**
 * Getting user logs
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
export async function getUsersLogs(req, res) {
  const userId = req.params._id;
  const queryParams = req.query;

  let addQuery = '';
  const limit = [];
  const sqlParams = [];
  let whereQuery = '';
  if (queryParams.limit && +queryParams.limit > -1) {
    addQuery += ' LIMIT ?';
    limit.push(+queryParams.limit);
  }

  if (queryParams.from) {
    whereQuery += ' AND date >= ?';
    sqlParams.push(queryParams.from);
  }

  if (queryParams.to) {
    whereQuery += ' AND date <= ?';
    sqlParams.push(queryParams.to);
  }
  if (!userId) {
    res
        .status(400)
        .json({errors: [{value: 'No user id', type: 'Request'}]});
  }

  let rows;
  try {
    const sqlQuery = `SELECT * FROM exercise INNER JOIN users ON users.id = ? ${whereQuery}  ${addQuery}`;
    console.log(sqlQuery, [userId, ...sqlParams, ...limit])
    rows = await db.all(sqlQuery, [userId, ...sqlParams, ...limit]);
  } catch (error) {
    sendDatabaseError(res, error);
  }

  let matchingCount;

  try {
    const sqlQuery = `SELECT COUNT(*) FROM exercise WHERE userId = ? ${whereQuery}`;
    matchingCount = await db.all(sqlQuery, [userId, ...sqlParams]);
  } catch (error) {
    sendDatabaseError(res, error);
  }

  console.log(rows)
  if (rows?.length) {
    const username = rows[0].username;
    res.json({
      username,
      _id: +userId,
      log: rows.map(log => ({duration: log.duration, description: log.description, date: new Date(log.date).toDateString()})),
      count: matchingCount && matchingCount[0] ? matchingCount[0]['COUNT(*)'] : null,
    });

    return;
  }

  res.status(404).send();
}
