import { Request, Response } from "express";
import { User, securityPreferences, Otp } from "../../models";
import { activateAccount } from "../../../../utils/mail";

const createUser = () => {
    return async (req: Request, res: Response) => {
        try {
            const user = new User(req.body);
            await user.save();
            activateAccount(user);
            securityPreferences.create({ user_id: user._id });
            res.status(201).send({
                "data": user,
                "message": "User created successfully",
                "status": "success"
            });
        } catch (error: any) {

            if (error.code === 11000) {
                res.status(400).send({
                    "message": `${Object.keys(error.keyValue)[0]} already exists`,
                    "status": "error"
                });
                return;
            }
            res.status(500).send({
                "message": "An error occurred while creating user",
                "status": "error"
            });
        }
    }
}

const verifyUser = () => {
    return async (req: Request, res: Response) => {
        try {

            const otp = await Otp.find({ user_id: req.params.id, purpose: 'register' });

            if (otp[0].otp === req.body.otp) {

                if (otp[0].created_at < new Date(new Date().getTime() - 15 * 60000)) {
                    res.status(400).send({
                        "message": "OTP expired",
                        "status": "error"
                    });
                    return;
                }

                await User.findByIdAndUpdate(req.params.id, { is_active: true });
                res.status(200).send({
                    "message": "User verified successfully",
                    "status": "success"
                });
            } else {
                res.status(400).send({
                    "message": "Invalid OTP",
                    "status": "error"
                });
            }
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while verifying user",
                "status": "error"
            });
        }
    }
}

const sendVerificationMail = () => {
    return async (req: Request, res: Response) => {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
                return;
            }

            activateAccount(user);
            res.status(200).send({
                "message": "Verification email sent",
                "status": "success"
            });
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while sending verification email",
                "status": "error"
            });
        }
    }
}

const deactivateUser = () => {
    return async (req: Request, res: Response) => {
        try {
            await User.findByIdAndUpdate(req.params.id, { is_active: false });

            res.status(200).send({
                "message": "User deactivated successfully",
                "status": "success"
            });

        } catch (error) {

            res.status(500).send({
                "message": "An error occurred while deactivating user",
                "status": "error"
            });
        }
    }
}

export { createUser, verifyUser, sendVerificationMail, deactivateUser };