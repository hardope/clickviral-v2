import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../database/models/userModel';
import { ResetPassword } from '../utils/mail';
import Otp from '../database/models/otp';

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

                if (user.is_active === false) {
                    res.status(401).send({
                        "message": "Account Not Activated",
                        "status": "unauthorized"
                    });
                } else {

                    if (isMatch) {
                        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!, { expiresIn: '1h' });
                        user.last_login = new Date();
                        await user.save();
                        res.status(200).send({
                            "data": {
                                "token": token,
                                "user": user.toJSON()
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
            }
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while logging in",
                "status": "error"
            });
        }
    }
}

const forgotPassword = () => {
    return async (req: Request, res: Response) => {
        try {
            const email = req.body.email;
            const user = await User.findOne({ email: email });

            if (!user) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
            } else {
                Otp.create({user_id: user._id, purpose: "password_reset"});
                ResetPassword(user);

                res.status(200).send({
                    "message": "Password reset link sent to your email",
                    "status": "success"
                });
            }
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while sending reset link",
                "status": "error"
            });
        }
    }
}

const resetPassword = () => {
    return async (req: Request, res: Response) => {
        try {
            const email = req.body.email;
            const otp = req.body.otp;
            const password = req.body.password;
            const user = await User.findOne({ email: email });

            if (!user) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
            } else {
                const otpRecord = await Otp.findOne({user_id: user._id, otp: otp, purpose: "password_reset"});

                if (!otpRecord) {
                    res.status(401).send({
                        "message": "Invalid OTP",
                        "status": "unauthorized"
                    });
                } else {
                    user.password = password;
                    await user.save();
                    await Otp.deleteOne({user_id: user._id, otp: otp, purpose: "password_reset"});

                    res.status(200).send({
                        "message": "Password reset successfully",
                        "status": "success"
                    });
                }
            }
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while resetting password",
                "status": "error"
            });
        }
    }
}

export { login, forgotPassword, resetPassword };
