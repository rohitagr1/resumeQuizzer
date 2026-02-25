import multer from 'multer';

const uploadPDF = multer({

    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },

}).single('resume');

export default { uploadPDF };

// " still hardcoding resume here will fix it later on "