import { Request, Response, NextFunction } from "express";

const logger = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        res.on("finish", () => {
            console.log(`[${new Date().toISOString()}] -- ${req.method} -- ${req.path} -- ${res.statusCode}`);
        });
        next();
    };
}

export default logger;
