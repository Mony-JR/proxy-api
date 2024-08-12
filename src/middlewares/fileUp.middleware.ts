import { Request, Response, NextFunction } from 'express';

export function fileAndBodyMiddleware(req: Request, _res: Response, next: NextFunction) {
    if (req.file) {
        req.body.file = req.file;
    }
    next();
}
