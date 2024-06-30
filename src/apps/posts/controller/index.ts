import { Request, Response } from 'express';

const index = () => {
    return async (_req: Request, res: Response) => {
        res.status(200).send({
            "message": "Welcome to posts service",
            "status": "success"
        });
    }
}

export {
    index
}