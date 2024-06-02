import { Request, Response } from "express";
import { User } from "../../database/models/userModel";

const grantAdminAccess = () => {
    return async (req: Request, res: Response) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { is_admin: true }, { new: true });

            res.status(200).send({
                "data": user,
                "message": "Admin access granted successfully",
                "status": "success"
            });

        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while granting admin access",
                "status": "error"
            });
        }
    }
}

const revokeAdminAccess = () => {
    return async (req: Request, res: Response) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { is_admin: false }, { new: true });

            res.status(200).send({
                "data": user,
                "message": "Admin access revoked successfully",
                "status": "success"
            });

        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while revoking admin access",
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

export { activateUser, deactivateUser, grantAdminAccess, revokeAdminAccess};