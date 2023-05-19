import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status';
import User, { UserType } from '../models/userSchema';

const secret = (process.env.JWT_SECRET as string) || 'examples';

export async function auth(req: Request | any, res: Response, next: NextFunction) {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(httpStatus.UNAUTHORIZED).json({
                Error: 'Kindly sign in as a user',
            });
            return;
        }

        let verified = jwt.verify(token, secret);
        const { id } = verified as unknown as { id: string };
        if (!verified) {
            return res.status(httpStatus.UNAUTHORIZED).json({ Error: 'User not verified, you cannot access this route' });
        }
        req.user = id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(httpStatus.FORBIDDEN).json({ Error: 'User is not logged in' });
    }
}




export async function checkAdmin(req: Request | any, res: Response, next: NextFunction) {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                error: 'Kindly sign in',
            });
        }

        let verified;
        try {
            verified = jwt.verify(token, secret);
        } catch (error) {
            return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });
        }

        const { id } = verified as { id: string };
        if (!verified) {
            return res.status(httpStatus.UNAUTHORIZED).json({ error: 'User not verified, you cannot access this route' });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user || user.userType !== UserType.Admin) {
            return res.status(httpStatus.FORBIDDEN).json({ error: 'You are not authorized to access this resource' });
        }

        req.user = id;
        next();
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
}

