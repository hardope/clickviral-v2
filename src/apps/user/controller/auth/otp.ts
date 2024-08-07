import { Request, Response } from 'express';
import { User, Otp } from '../../models';

const verifyOtp = () => {
    return async (req: Request, res: Response) => {
        try {
            const email = req.body.email;
            const otp = req.body.otp;
            const purpose = req.body.purpose;
            const user = await User.findOne({ email: email });

            if (!user) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
            } else {
                const otpRecord = await Otp.findOne({user_id: user._id, otp: otp, purpose: purpose});

                if (!otpRecord) {
                    res.status(401).send({
                        "message": "Invalid OTP",
                        "status": "unauthorized"
                    });
                } else {
                    res.status(200).send({
                        "message": "OTP verified successfully",
                        "status": "success"
                    });
                }
            }
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while verifying OTP",
                "status": "error"
            });
        }
    }
}

export { verifyOtp }