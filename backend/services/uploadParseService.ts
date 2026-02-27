import { PDFParse } from 'pdf-parse';
import type { Express } from 'express';
import createHttpError from 'http-errors';

async function uploadPDF( file?: Express.Multer.File ){

   try{
    if (!file) {
        throw createHttpError(400, 'No file uploaded');

    }

    if (file.mimetype !== 'application/pdf') {
        throw createHttpError(415, 'Only PDF file allowed');
    }

    return file.buffer;
   }
   catch (error){

    if( createHttpError.isHttpError( error )){
        throw error;
    }

    throw createHttpError(500, "Failed to process uploaded file");

   }

}

async function parsePDF( pdfBuffer: Buffer ){

    const parser = new PDFParse( { data: pdfBuffer } );

    try{

        const pdfData = await parser.getText();
        const pdfText = pdfData.text?.trim();

        if( !pdfText ){
            throw createHttpError(422, 'could not extract text from pdf');
        }

        return pdfText;
    }
    catch ( error ){
        if( createHttpError.isHttpError( error )){
            throw error;
        }
        throw createHttpError(500, "Failed to parse PDF");
    }
    finally{
        await parser.destroy();
    }

}

async function parsePDFText( file?: Express.Multer.File ){

    try{
        const pdfBuffer = await uploadPDF( file );
        const pdfText = await parsePDF( pdfBuffer );

        return pdfText;
    }
    catch( error ){
        if( createHttpError.isHttpError( error )){
            throw error;
        }
        throw createHttpError(500, "Failed to parse uploaded PDF");
    }

}

export default { parsePDFText };