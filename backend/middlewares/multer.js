import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  // 1. Destination ko change karke sirf ./public kar diya
  destination: function (req, file, cb) {
    cb(null, "./public"); 
  },

  // 2. Filename logic (timestamp add karna safe rehta hai)
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 5MB limit
});

export default upload;