import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../database/models/userModel';
import * as mail from '../utils/mail';
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
                mail.resetPassword(user);

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

const startResetEmail = () => {
    return async (req: Request, res: Response) => {
        try {

            const user = JSON.parse(req.headers.user as string);

            if (!user) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
            } else {
                mail.resetEmail(user, req.body.new_email);

                res.status(200).send({
                    "message": "Reset email link sent to your email",
                    "status": "success"
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                "message": "An error occurred while sending reset email link",
                "status": "error"
            });
        }
    }
}

const changeEmail = () => {
    return async (req: Request, res: Response) => {
        try {
            const email = req.body.email;
            const otp = req.body.otp;
            const new_email_otp = req.body.new_email_otp;
            const user = await User.findOne({ email: email });

            if (!user) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
                return;
            }

            var loggedUser = JSON.parse(req.headers.user as string);

            if (user.email != loggedUser.email) {
                res.status(401).send({
                    "message": "Unauthorized",
                    "status": "unauthorized"
                });
                return;
            }

            const otpRecord = await Otp.findOne({user_id: user.id, otp: otp, purpose: "change_email"});

            if (!otpRecord) {
                res.status(401).send({
                    "message": "Invalid OTP",
                    "status": "unauthorized"
                });
                return;
            }

            var additional_data = JSON.parse(otpRecord.additional_data as string);

            if (additional_data.new_email_otp != new_email_otp) {
                res.status(401).send({
                    "message": "Invalid OTP",
                    "status": "unauthorized"
                });
                return;
            }

            user.email = additional_data.new_email;
            await user.save();

            res.status(200).send({
                "message": "Email changed successfully",
                "status": "success"
            });

        } catch (error: any) {
            
            if (error.code === 11000) {
                res.status(409).send({
                    "message": "Email in use by another user",
                    "status": "conflict"
                });
                return;
            }

            res.status(500).send({
                "message": "An error occurred while changing email",
                "status": "error"
            });
        }
    }
}

export { login, forgotPassword, resetPassword, startResetEmail, changeEmail };
