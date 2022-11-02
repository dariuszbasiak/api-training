import express from 'express';

const app = express();
import cors from 'cors';
// require('dotenv').config();
import path from 'path';
import {fileURLToPath} from 'url';
import bodyParser from 'body-parser';

import {
  createUser,
  getAllUsers,
  getUserById,
  getUsersLogs,
} from './app/controllers/users/users.controller.js';

const dir = path.dirname(fileURLToPath(import.meta.url));

import db from './app/db/index.js';
import {creatExerciseForUser} from './app/controllers/exercises/exercises.controller.js';

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(path.resolve(dir, 'views/index.html'));
});

db.init();

app.post('/api/users', createUser);
app.get('/api/users', getAllUsers);
app.get('/api/users/:_id', getUserById);
app.get('/api/users/:_id/logs', getUsersLogs);

app.post('/api/users/:_id/exercises', creatExerciseForUser);

const listener = app.listen(process.env.PORT || 3000, () => {
});
