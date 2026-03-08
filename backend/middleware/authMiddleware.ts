import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import firebaseAdminClient from "../clients/firebaseAdminClient.ts";

const  firebaseAuthenticater = async ( req: Request, res: Response, next: NextFunction ) => {

    try{
                            // "Bearer <token>" //
        const authHeader = req.headers.authorization;

        if( !authHeader?.startsWith('Bearer ') ){
            throw createHttpError(401, "missinf or invalid authorization header");
        }

        const idToken = authHeader.split(' ')[1];

        if ( !idToken ){
            throw createHttpError(401, "Missing Firebase ID Token");
        }

        const admin = firebaseAdminClient.getFirebaseAdmin();

        const decodedToken = await admin.auth().verifyIdToken(idToken);

        res.locals.user = { uid: decodedToken.uid, email: decodedToken.email || null, };

        return next();
    }

    catch (error) {

        if( createHttpError.isHttpError(error) ){
            return next(error);
        }

        return next( createHttpError(401, "Unauthorized: invalid or expired Token" ));
    }
};

export default { firebaseAuthenticater };
