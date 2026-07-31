import multer from "multer";

// ASSIGNMENT 12

export const uploading = (file)=>{
    const imageStorage = multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, 'uploads'); // tol ma hia null y3ni mfish errors
        },
        filename: (req, file , cb)=>{
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()* 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
        }
    });

    const upload = multer({storage: imageStorage});
    return upload;

}