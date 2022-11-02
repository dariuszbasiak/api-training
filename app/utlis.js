/**
 * Handling and sending error from DB
 * @param {Response} res
 * @param {Error} error
 */
export function sendDatabaseError(res, error) {
  console.error(error);
  res.status(500).json({
    errors: [{value: error, type: 'Database'}],
  });
}
