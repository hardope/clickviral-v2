import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User, securityPreferences } from "../../database/models/userModel";
import * as mail from '../../utils/mail';
import Otp from '../../database/models/otp';
import { JWT_ACCESS_LIFETIME, JWT_REFRESH_LIFETIME, JWT_SECRET } from '../../utils/environment';

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

                if (!isMatch) {
                    res.status(401).send({
                        "message": "Invalid credentials",
                        "status": "unauthorized"
                    });
                    return;
                }

                if (!user.is_active) {
                    res.status(401).send({
                        "message": "Account Not Activated",
                        "status": "unauthorized-inactive"
                    });
                    return;
                }

                const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_ACCESS_LIFETIME });
                const refreshToken = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: JWT_REFRESH_LIFETIME });
                user.last_login = new Date();

                const ip_address = `${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`;
                const device = `${req.headers['user-agent']}`;

                const sec = await securityPreferences.findOne({ user_id: user._id });

                if (sec && sec.two_factor_auth) {
                    mail.notifyLogin2FA(user);

                    res.status(201).send({
                        "message": "Enter OTP sent to your email",
                        "status": "success - otp"
                    });

                    return;
                }

                if (sec && sec.login_notifications) {
                    mail.notifyLogin(user, ip_address, device)
                }

                await user.save();

                res.status(200).send({
                    "data": {
                        "token": token,
                        "refreshToken": refreshToken,
                        "user": user.toJSON()
                    },
                    "message": "User logged in successfully",
                    "status": "success"
                });
            }
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while logging in",
                "status": "error"
            });
        }
    }
}

const twoFactorLogin = () => {
    return async (req: Request, res: Response) => {
        try {
            const email = req.body.email;
            const otp = req.body.otp;
            const user = await User.findOne({
                email: email
            });

            if (!user) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
            } else {
                const otpRecord = await Otp.findOne({
                    user_id: user._id,
                    otp: otp,
                    purpose: "login"
                });

                if (!otpRecord) {
                    res.status(401).send({
                        "message": "Invalid OTP",
                        "status": "unauthorized"
                    });
                } else {
                    const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: JWT_ACCESS_LIFETIME});
                    const refreshToken = jwt.sign({email: user.email}, JWT_SECRET!, {expiresIn: JWT_REFRESH_LIFETIME});
                    user.last_login = new Date();
                    await user.save();
                    await Otp.deleteOne({user_id: user._id, otp: otp, purpose: "login"});
                    res.status(200).send({
                        "data": {
                            "token": token,
                            "refreshToken": refreshToken,
                            "user": user.toJSON()
                        },
                        "message": "User logged in successfully",
                        "status": "success"
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

const refresh = () => {
    return async (req: Request, res: Response) => {
        try {
            const token = req.body.refreshToken;
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
            } else {
                jwt.verify(token, JWT_SECRET, (err, _userobj) => {
                    if (err) {
                        res.status(401).send({
                            "message": "Invalid token",
                            "status": "unauthorized"
                        });
                    } else {
                        const newToken = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: JWT_ACCESS_LIFETIME});
                        res.status(200).send({
                            "data": {
                                "token": newToken,
                                "user": user
                            },
                            "message": "Token refreshed successfully",
                            "status": "success"
                        });
                    }
                });
            }
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while refreshing token",
                "status": "error"
            });
        }
    }
}

export {
    login,
    twoFactorLogin,
    refresh
}