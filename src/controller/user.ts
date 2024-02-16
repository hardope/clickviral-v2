import { Request, Response } from "express";
import User from "../database/models/userModel";

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

const createUser = () => {
    return async (req: Request, res: Response) => {
        try {
            const user = new User(req.body);
            await user.save();
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

export { getUsers, createUser };