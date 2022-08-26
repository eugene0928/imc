import { diskStorage } from "multer";
import { join } from "path";

export const myStorage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(process.cwd(), "uploads"))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    },
})