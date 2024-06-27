import { Response } from 'express';
import { User, Otp } from "../../models";
import * as mail from '../../../../utils/mail';

const startResetEmail = () => {
    return async (req, res: Response) => {
        try {

            const user = req.user;

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
    return async (req, res: Response) => {
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

            var loggedUser = req.user;

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

export { startResetEmail, changeEmail };