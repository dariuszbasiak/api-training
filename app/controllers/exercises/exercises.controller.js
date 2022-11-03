import db from '../../db/index.js'
import { sendDatabaseError } from '../../utlis.js'

/**
 * Validate and creat correct format of the date
 * @param {string} date
 * @returns {*|string}
 * @private
 */
function _getFormattedDate(date) {
    const regex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
    const newDate = regex.test(date)
        ? date
        : new Date().toISOString().split('T')[0]
    return newDate
}

/**
 * Create an exercise for the user
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 // */
export async function creatExerciseForUser(req, res) {
    const userData = req.body
    const errors = []

    if (!userData.description) {
        errors.push({
            type: 'Request',
            value: 'No description provided',
        })
    }

    if (!userData.duration) {
        errors.push({
            type: 'Request',
            value: 'No duration provided',
        })
    }

    if (userData.duration && !Number.isInteger(+userData.duration)) {
        errors.push({
            type: 'Request',
            value: 'Duration must be integer',
        })
    }

    if (errors.length) {
        res.status(400).json({ errors })
        return
    }

    let user

    try {
        user = await db.all('SELECT * FROM users WHERE id = ?', [
            req.params._id,
        ])
    } catch (e) {
        sendDatabaseError(res, e)
    }
    if (!user[0]) {
        res.status(404).send()
        return
    }

    const date = _getFormattedDate(userData.date)
    let result

    try {
        result = await db.run(
            'INSERT INTO exercise(userId, duration, description, date) VALUES(?, ?, ?, ?)',
            [req.params._id, userData.duration, userData.description]
        )
    } catch (error) {
        sendDatabaseError(res, error)
    }

    if (result) {
        res.status(201).json({
            _id: req.params._id,
            username: user[0].username,
            duration: +userData.duration,
            date: new Date(date).toDateString(),
            description: userData.description,
        })
        return
    }

    res.status(500).json({
        errors: [{ value: 'Unknown errors', type: 'Internal' }],
    })
}
