import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import isUserorReadonly from './permissions/user';
import isAdmin from './permissions/admin';

const authorization = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        var token = req.header('Authorization');
        if (!token) {
            return res.status(401).send({
                "message": "Access denied. No token provided",
                "status": "unauthorized"
            });
        }
        try {
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
            } else {
                return res.status(400).send({
                    "message": "Invalid Bearer token format",
                    "status": "bad_request"
                });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            req.body.user = decoded;
            next();
        } catch (error) {
            res.status(400).send({
                "message": "Invalid token",
                "status": "bad_request"
            });
        }

        return;
    }
}

export { authorization, isUserorReadonly, isAdmin };