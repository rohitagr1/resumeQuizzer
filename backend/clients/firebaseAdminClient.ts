import admin from 'firebase-admin';
import createHttpError from 'http-errors';

const getFirebaseAdmin = () =>{

    try {

        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if ( !projectId || !clientEmail || !privateKey ){
            throw createHttpError(500, "Missing Firebase Admin env var");
        }

        if (!admin.apps.length){

            admin.initializeApp({
                credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
            });
        }

        return admin;

    }
    catch (error) {

        if( createHttpError.isHttpError(error) ){
            throw error;
        }

        throw createHttpError(500, "Failed to initialize Firebase Admin");

    }
};

export default { getFirebaseAdmin };
