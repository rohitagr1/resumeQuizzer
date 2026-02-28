import multer from 'multer';

const uploadPDF = ( fieldName : string ) => multer({

    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },

}).single(fieldName);

export default { uploadPDF };
