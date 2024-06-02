import { Request, Response } from "express";
import { User } from "../../database/models/userModel";

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

export { searchUser, findAccount };