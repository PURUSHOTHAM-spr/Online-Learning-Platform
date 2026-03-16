import multer from 'multer';
import os from 'os';

// Use OS temporary directory to briefly store local file copies before Cloudinary upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, os.tmpdir());
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({ storage: storage });
