import { NextFunction, Request, Response } from "express";

const loger = (req: Request, _res: Response, next: NextFunction) => {
    const now = new Date();
    const method = req.method;
    console.log("Hello world");
    console.log(`[${now.toISOString()}] ${method} ${req.url}`);
    
    next();
};

export default loger;
