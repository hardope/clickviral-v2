import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from "../../database/models/userModel";
import * as mail from '../../utils/mail';
import Otp from '../../database/models/otp';

const changePassword = () => {
    return async (req: Request, res: Response) => {
        try {
            const old_password = req.body.old_password;
            const new_password = req.body.new_password;

            const user_data = JSON.parse(req.headers.user as string);
            const user = await User.findOne({ id: user_data.id });

            if (!user) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
                return;
            }

            const isMatch = await bcrypt.compare(old_password, user.password);

            if (!isMatch) {
                res.status(401).send({
                    "message": "Invalid credentials",
                    "status": "unauthorized"
                });
                return;
            }

            if (old_password == new_password) {
                res.status(400).send({
                    "message": "New password cannot be the same as old password",
                    "status": "bad_request"
                });
                return;
            }

            user.password = new_password;
            await user.save();

            res.status(200).send({
                "message": "Password changed successfully",
                "status": "success"
            });

        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while changing password",
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
                const otpRecord = await Otp.findOne({user_id: user._id, otp: otp, purpose: "forgot_password"});

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

export { changePassword, resetPassword, forgotPassword }