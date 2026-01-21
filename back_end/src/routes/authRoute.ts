// src/routes/authRoute.ts
import express from 'express';
import { loginUser, changePassword } from '../controllers/authController';

const authRoute = express.Router();

authRoute.post('/login', loginUser);
authRoute.post('/change-password', changePassword);

export default authRoute;
