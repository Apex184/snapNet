import Joi from 'joi';
import jwt from 'jsonwebtoken';

export const generateLoginToken = (user: { [key: string]: unknown }): string => {
    const pass = process.env.JWT_SECRET as string;
    return jwt.sign(user, pass, { expiresIn: '1d' });
};