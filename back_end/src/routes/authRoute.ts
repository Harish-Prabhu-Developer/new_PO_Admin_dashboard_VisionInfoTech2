// src/routes/authRoute.ts
import express from 'express';
import { loginUser } from '../controllers/authController';

const authRoute = express.Router();

authRoute.post('/login', loginUser);

export default authRoute;
