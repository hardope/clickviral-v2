import multer from "multer";
import { ASSET_DIR } from './environment';
import{ v4 as uuid } from 'uuid';

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, ASSET_DIR)
    },
    filename: function (_req, file, cb) {
        cb(null, `${uuid()}.${file.originalname.split('.').pop()}`)
    }
})

const upload = multer({ storage: storage })

export default upload;