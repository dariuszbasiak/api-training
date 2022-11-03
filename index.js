import express from 'express'
import cors from 'cors'
// require('dotenv').config();
import path from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'

const app = express()

const dir = path.dirname(fileURLToPath(import.meta.url))

import db from './app/db/index.js'
import { usersRouter } from './app/routers/users.router.js'
import { exercisesRouter } from './app/routers/exercises.router.js'

db.init()

app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(express.static('public'))
app.use('/api', usersRouter)
app.use('/api', exercisesRouter)
app.get('/', (req, res) => {
    res.sendFile(path.resolve(dir, 'views/index.html'))
})

const listener = app.listen(process.env.PORT || 3000, () => {})
