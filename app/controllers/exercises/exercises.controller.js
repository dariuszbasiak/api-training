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

  let result;

  try {
    result = await db.run(
        'INSERT INTO exercise(userId, duration, description, date) VALUES(?, ?, ?, ?)',
        [req.params._id, userData.duration, userData.description, userData.date],
    );
  } catch (error) {
    sendDatabaseError(res, error);
  }

  if (result) {
    res.status(201).json({
      userId: +req.params._id,
      exerciseId: result.lastID,
      duration: +userData.duration,
      date: userData.date,
      description: userData.description,
    });
    return;
  }

  res
      .status(500)
      .json({errors: [{value: 'Unknown errors', type: 'Internal'}]});
}
