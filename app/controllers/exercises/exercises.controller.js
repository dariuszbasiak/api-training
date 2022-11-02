import db from '../../db/index.js';
import {sendDatabaseError} from '../../utlis.js';

/**
 * Create an exercise for the user
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 // */
export async function creatExerciseForUser(req, res) {
  const userData = req.body;
  const errors = [];

  if (!userData.description) {
    errors.push({
      type: 'Request',
      value: 'No description provided',
    });
  }

  if (!userData.duration) {
    errors.push({
      type: 'Request',
      value: 'No duration provided',
    });
  }

  if (userData.duration && !Number.isInteger(+userData.duration)) {
    errors.push({
      type: 'Request',
      value: 'Duration must be integer',
    });
  }

  if (errors.length) {
    res.status(400).json({errors});
    return;
  }

  let user;
  let result;

  try {
    user = await db.all('SELECT * FROM users WHERE id = ?',  [req.params._id])
  } catch (e) {
    sendDatabaseError(res,e)
  }
   if (!user) {
     res.status(404).send();
     return
   }

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  const date = regex.test(userData.date) ? userData.date : new Date().toISOString().split('T')[0];

  try {
    result = await db.run(
        'INSERT INTO exercise(userId, duration, description, date) VALUES(?, ?, ?, ?)',
        [req.params._id, userData.duration, userData.description, date ],
    );
  } catch (error) {
    sendDatabaseError(res, error);
  }

  if (result) {
    res.status(201).json({
      _id: req.params._id,
      username: user[0].username,
      duration: +userData.duration,
      date,
      description: userData.description,
    });
    return;
  }

  res
      .status(500)
      .json({errors: [{value: 'Unknown errors', type: 'Internal'}]});
}
