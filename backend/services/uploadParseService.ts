import multer from 'multer';
import { PDFParse } from 'pdf-parse';

const upload = multer({ storage: multer.memoryStorage() }).single('resume');

export async function uploadPdf( req ){

    return new Promise( ( resolve, reject ) => {

        upload( req, {} as any, ( error ) => {

            if( error ){
                return reject( error );
            }
            if( !req.file ){
                return reject( new Error('No file uploaded') );
            }
            if( req.file.mimetype !== 'application/pdf' ){
                return reject( new Error('Only PDF file allowed') );
            }

            resolve( req.file.buffer );

        });
    });
}

export async function parsePdf( pdfBuffer ){

    const parser = new PDFParse( { data: pdfBuffer } );

    try{

        const pdfData = await parser.getText();
        const pdfText = pdfData.text?.trim();

        if( !pdfText ){
            throw new Error('could not extract text form pdf');
        }

        return pdfText;
    }
    finally{
        await parser.destroy();
    }

}

export async function parsePdfText( req ){

    const pdfBuffer = await uploadPdf( req );
    const pdfText = await parsePdf( pdfBuffer );

    return pdfText;

}