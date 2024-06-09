import { Request, Response } from "express";
import { User } from "../../models";

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

export { updateUser, deleteUser };