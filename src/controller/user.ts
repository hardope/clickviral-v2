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

const getUser = () => {
    return async (req: Request, res: Response) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                // If no user found, send a 404 Not Found status
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
            } else {
                // If user found, send it as response
                res.status(200).send({
                    "data": user,
                    "message": "User retrieved successfully",
                    "status": "success"
                });
            }
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
            const user = await User.findByIdAndUpdate
                (req.params.id, req.body, { new: true });
            if (!user) {
                // If no user found, send a 404 Not Found status
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
            }
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
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                // If no user found, send a 404 Not Found status
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
            }
            // If user found, send a 204 No Content status
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
                    "data": users,
                    "message": "Users retrieved successfully",
                    "status": "success"
                });
            }
        } catch (error) {
            console.log(error);
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

export { getUsers, createUser, getUser, updateUser, deleteUser, searchUser};