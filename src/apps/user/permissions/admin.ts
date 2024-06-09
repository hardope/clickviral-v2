import { NextFunction } from 'express';
import { User } from '../models/userModel';

const isAdmin = () => {
    return async (req, res, next: NextFunction) => {

        const userObj = req.user;

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
}

export default isAdmin;