import { Request, Response } from "express";
import User from "../database/models/userModel";
import dotenv from "dotenv";
dotenv.config();

const CreateAdmin = () => {
    return async (req: Request, res: Response) => {
        try {

            var admin_code = req.body.admin_code;

            if (!process.env.ADMIN_CODES || !process.env.ADMIN_CODES.includes(admin_code)) {
                res.status(401).send({
                    "message": "Invalid admin code",
                    "status": "unauthorized"
                });
                return;
            }

            const user = new User(req.body);
            user.is_admin = true;
            user.is_active = true;
            await user.save();
            res.status(201).send({
                "data": user,
                "message": "Admin created successfully",
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
                "message": "An error occurred while creating admin",
                "status": "error"
            });
        }
    }
}

const activateUser = () => {
    return async (req: Request, res: Response) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { is_active: true }, { new: true });

            res.status(200).send({
                "data": user,
                "message": "User activated successfully",
                "status": "success"
            });
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while activating user",
                "status": "error"
            });
        }
    }
}

const deactivateUser = () => {
    return async (req: Request, res: Response) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true });

            res.status(200).send({
                "data": user,
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

export { CreateAdmin, activateUser, deactivateUser };