import type { ErrorRequestHandler } from "express";
import createHttpError from "http-errors";
import { success } from "zod";

const errorHandler: ErrorRequestHandler = ( err, _req, res, next ) => {

    if( res.headersSent){
        return next(err);
    }

    if( createHttpError.isHttpError( err ) ){

        return res.status(err.statusCode).json({ success: false, error: err.message });

    }

    const message = err instanceof Error ? err.message : "Internal Server Error";

    return res.status(500).json({ success: false, error : message });

};

export default { errorHandler };
