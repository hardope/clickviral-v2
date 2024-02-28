import { Request, Response, NextFunction } from 'express';
import User from '../../database/models/userModel';

const isUserorReadonly = () => {
    return async (req: Request, res: Response, next: NextFunction) => {

        try {

            const userObj = await User.findOne({ _id: JSON.parse(req.headers.user as string).id });
            var finduser = await User.findOne({ _id: req.params.id });

            if (!userObj) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
                return;
            }

            if (!finduser) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
                return;
            }

            if (userObj && (userObj.is_admin || userObj.id === finduser.id)) {
                next();
            } else {
                res.status(403).send({
                    "message": "You are not authorized to perform this action",
                    "status": "forbidden"
                });
            }
        }

        catch (error) {
            console.log(error);
            res.status(500).send({
                "message": "An error occurred while checking user permissions",
                "status": "error"
            });
        }
    }
}

export default isUserorReadonly;