import { Request, Response } from "express";

export const getUser = (_req: Request, res: Response) => {
    res.send('Hello World');
};
