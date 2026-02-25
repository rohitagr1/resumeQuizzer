import { PDFParse } from 'pdf-parse';
import type { Express } from 'express';

async function uploadPDF( file?: Express.Multer.File ){

   try{
    if (!file) {
        throw new Error('No file uploaded');
    }

    if (file.mimetype !== 'application/pdf') {
        throw new Error('Only PDF file allowed');
    }

    return file.buffer;
   }
   catch (error: any){
    throw new Error(error?.message || 'Failes to process uploaded file')
   }

}

async function parsePDF( pdfBuffer: Buffer ){

    const parser = new PDFParse( { data: pdfBuffer } );

    try{

        const pdfData = await parser.getText();
        const pdfText = pdfData.text?.trim();

        if( !pdfText ){
            throw new Error('could not extract text from pdf');
        }

        return pdfText;
    }
    catch (error : any){
        throw new Error(error?.message || 'Failed to parse PDF');
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
    catch(error: any){
        throw new Error(error?.message || 'Failes to parse uploaded PDF');
    }

}

export default { parsePDFText };