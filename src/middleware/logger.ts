import { Request, Response, NextFunction } from "express";

const logger = () => {
    return (req: Request, _res: Response, next: NextFunction) => {
        console.log(`[${new Date().toISOString()}] -- ${req.method} -- ${req.path}`);
        next();
    };
}

export default logger;