import type { NextFunction, Request, Response } from "express";

function errorHandle( err: unknown, req: Request, res: Response, next: NextFunction ){

    if( err instanceof Error ){
        return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });

}

export default { errorHandle };
