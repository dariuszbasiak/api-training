import { Router } from 'express'
import { creatExerciseForUser } from '../controllers/exercises/exercises.controller.js'

export const exercisesRouter = Router()

exercisesRouter.post('/users/:_id/exercises', creatExerciseForUser)
