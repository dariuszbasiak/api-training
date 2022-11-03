import { Router } from 'express';
import {createUser, getAllUsers, getUserById, getUsersLogs} from "../controllers/users/users.controller.js";

export const usersRouter = Router();

usersRouter.post('/users', createUser);
usersRouter.get('/users', getAllUsers);
usersRouter.get('/users/:_id', getUserById);
usersRouter.get('/users/:_id/logs', getUsersLogs);