import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const validateSchema = (schema: Joi.ObjectSchema): any => {

  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
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