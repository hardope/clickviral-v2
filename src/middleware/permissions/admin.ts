import { Request, Response, NextFunction } from 'express';
import User from '../../database/models/userModel';

const isAdmin = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = req.body.user.id;

        try {
            const userObj = await User.findOne({ _id: user });

            if (userObj && userObj.is_admin) {

                if (req.params.id) {
                    const user = await User.findOne({ _id: req.params.id });

                    if (!user) {
                        res.status(404).send({
                            "message": "User not found",
                            "status": "not_found"
                        });
                        return;
                    }
                }

                next();
            } else {
                res.status(403).send({
                    "message": "You are not authorized to perform this action",
                    "status": "forbidden"
                });
            }
        }

        catch (error) {
            res.status(500).send({
                "message": "An error occurred while checking user permissions",
                "status": "error"
            });
        }
    }
}

export default isAdmin;