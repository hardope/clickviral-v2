import { Request, Response } from "express";
import User from "../database/models/userModel";
import { ActivateAccount } from "../utils/mail";
import Otp from "../database/models/otp";

const getUsers = () => {
    return async (_req: Request, res: Response) => {
        try {
            const users = await User.find();
            if (users.length === 0) {
                // If no users found, send a 404 Not Found status
                res.status(404).send({
                    "message": "No users found",
                    "status": "not_found"
                });
            } else {
                users.forEach(element => {
                    element = element.toJSON();
                });
                // If users found, send them as response
                res.status(200).send({
                    "data": users,
                    "message": "Users retrieved successfully",
                    "status": "success"
                });
            }
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while retrieving users",
                "status": "error"
            });
        }
    };
};

const getUser = () => {
    return async (req: Request, res: Response) => {
        try {
            const user = await User.findById(req.params.id);
                // If user found, send it as response
            res.status(200).send({
                "data": user,
                "message": "User retrieved successfully",
                "status": "success"
            });
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while retrieving user",
                "status": "error"
            });
        }
    }
}

const updateUser = () => {
    return async (req: Request, res: Response) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            // If user found, send it as response
            res.status(200).send({
                "data": user,
                "message": "User updated",
                "status": "success"
            });
        }
        catch (error) {
            res.status(500).send({
                "message": "An error occurred while updating user",
                "status": "error"
            });
        }
    }
}

const deleteUser = () => {
    return async (req: Request, res: Response) => {
        try {
            await User.findByIdAndDelete(req.params.id);

            res.status(204).send();
        }
        catch (error) {
            res.status(500).send({
                "message": "An error occurred while deleting user",
                "status": "error"
            });
        }
    }
}

const searchUser = () => {
    return async (req: Request, res: Response) => {
        try {
            const users = await User.find({
                $or: [
                    { first_name: { $regex: req.query.q, $options: 'i' } },
                    { last_name: { $regex: req.query.q, $options: 'i' } },
                    { username: { $regex: req.query.q, $options: 'i' } },
                ]
            });

            if (users.length === 0) {
                // If no user found, send a 404 Not Found status
                res.status(404).send({
                    "message": "No users found",
                    "status": "not_found"
                });
            } else {
                // If user found, send it as response
                res.status(200).send({
                    "data": users.map(user => user.toJSON()),
                    "message": "Users retrieved successfully",
                    "status": "success"
                });
            }
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while retrieving users",
                "status": "error"
            });
        }
    }
}

const createUser = () => {
    return async (req: Request, res: Response) => {
        try {
            const user = new User(req.body);
            await user.save();
            Otp.create({ user_id: user._id, purpose: 'register' });
            ActivateAccount(user);
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

            await Otp.deleteMany({
                user_id: req.params.id,
                purpose: 'register'
            });
            await Otp.create({ user_id: req.params.id, purpose: 'register' });
            ActivateAccount(user);
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

const findAccount = () => {
    return async (req: Request, res: Response) => {
        try {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
                return;
            }

            res.status(200).send({
                "data": user._id,
                "message": "Found Account",
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

export {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    searchUser,
    verifyUser,
    sendVerificationMail,
    findAccount,
    deactivateUser
};