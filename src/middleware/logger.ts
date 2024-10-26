import { Request, Response, NextFunction } from "express";

const logger = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();
        res.on("finish", () => {
            const elapsed = Date.now() - start;
            console.log(`[${new Date().toISOString()}] -- ${req.method} -- ${req.path} -- ${res.statusCode} -- ${elapsed}ms`);
        });
        next();
    };
}

export default logger;
