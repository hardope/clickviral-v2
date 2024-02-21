import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../database/models/userModel';

const login = () => {
    return async (req: Request, res: Response) => {
        try {
            const
                email = req.body.email,
                password = req.body.password;
            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
            } else {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: 3600 });
                    res.status(200).send({
                        "data": {
                            "token": token
                        },
                        "message": "User logged in successfully",
                        "status": "success"
                    });
                } else {
                    res.status(401).send({
                        "message": "Invalid credentials",
                        "status": "unauthorized"
                    });
                }
            }
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while logging in",
                "status": "error"
            });
        }
    }
}

export { login };