import { Request, Response, NextFunction } from 'express';
import User from '../../database/models/userModel';

const isUserorReadonly = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = req.body.user.id;
        const user_id = req.params.id;
        try {
            const userObj = await User.findOne({ _id: user });

            if (userObj && (userObj.is_admin || userObj._id.toString() === user_id)) {
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

export default isUserorReadonly;