// src/utils/jwthelper.ts
import jwt from 'jsonwebtoken';

export const generateToken = (user: any) => {
    return jwt.sign({ user }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '7d',
    });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (error) {
        return null;
    }
};