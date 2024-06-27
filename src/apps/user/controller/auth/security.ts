import { Request, Response } from 'express';
import { securityPreferences } from "../../models";

const updateSecurity = () => {

    return async (req: Request, res: Response) => {
        try {
            const user = JSON.parse(req.headers.user as string);
            const sec = await securityPreferences.findOneAndUpdate({user_id: user.id}, req.body, { new: true});

            res.status(200).send({
                "data": sec,
                "message": "Security preferences updated successfully",
                "status": "success"
            });
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while fetching security preferences",
                "status": "error"
            });
        }
    }
}

const getSecurity = () => {

    return async (req: Request, res: Response) => {
        try {
            const user = JSON.parse(req.headers.user as string);
            const sec = await securityPreferences.findOne({user_id: user.id});

            res.status(200).send({
                "data": sec,
                "message": "Security preferences fetched successfully",
                "status": "success"
            });
        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while fetching security preferences",
                "status": "error"
            });
        }
    }
}

export { updateSecurity, getSecurity };