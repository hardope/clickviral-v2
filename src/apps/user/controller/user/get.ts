import { Request, Response } from "express"; 
import { User } from "../../models";

const getUsers = () => {
    return async (_req, res) => {
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

const getMe = () => {
    return async (req, res) => {
        res.status(200).send({
            "data": req.user.toJSON(),
            "message": "User retrieved successfully",
            "status": "success"
        });
    }
}

const getUserByUsername = () => {
    return async (req: Request, res: Response) => {
        try {
            const user = await User.findOne({ username: req.params.username });
            if (!user) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
                return;
            }
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

export { getUsers, getUser, getMe, getUserByUsername };