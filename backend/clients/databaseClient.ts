import { Pool } from "pg";
import createHttpError from "http-errors";

let pool : Pool | null = null;

const getDatabasePool = () => {

    try{

        const databaseUrl = process.env.DATABASE_URL;

        if( !databaseUrl ){
            throw createHttpError(500, "Missing Database url");
        }

        if( !pool ){
            pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
        }

        return pool;
    }
    catch (error) {

        if( createHttpError.isHttpError(error) ){
            throw error;
        }

        throw createHttpError(500, "Falied to initialize database client");

    }

};

const checkDatabaseConnection = async () => {

    const db = getDatabasePool();

    await db.query("select 1");

};

export default { getDatabasePool, checkDatabaseConnection };

