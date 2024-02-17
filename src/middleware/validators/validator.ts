import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const validateSchema = (schema: Joi.ObjectSchema): any => {

return async (req: Request, res: Response, next: NextFunction) => {
    const { error } = await schema.validate(req.body, {abortEarly: false});
    if (error) {
        return res.status(400).send({
            message: error.details[0].message,
            status: "error",
        });
    }
        next();
        return;
    };
}