import type { NextFunction, Request, Response } from "express";
import { success } from "zod";

const responseHandler = ( _req : Request, res: Response, next: NextFunction) => {

    res.locals.send = ( body : Record<string, unknown> = {}, statusCode = 200, message = "OK" ) => {

        return res.status(statusCode).json({ success: true, message, ...body });

    };

    next();

};

export default { responseHandler };
