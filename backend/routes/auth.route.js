import express from 'express';
import { login, logout, sighnup } from '../controller/auth.controller.js';

const authRouter = express.Router();


authRouter.post('/signup',sighnup)
authRouter.post('/signin',login)
authRouter.get('/logout',logout)


export default authRouter;