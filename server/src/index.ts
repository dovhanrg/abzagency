import express, {NextFunction, Response, Request} from "express";
import {AppDataSource} from "./data-source";
import router from "./router";
import initUsers from "./seeds/initUsers";
import * as fs from "fs";
import multer from "multer";
import cors from 'cors';

AppDataSource.initialize().then(async (data) => {
    await initUsers();
})
    .catch(error => {
        console.log('ERROR: ', error);
        throw Error(error);
    });


export const uploadOriginalImageDir = '/app/data/uploads/original/';
export const uploadCroppedImageDir = '/app/data/uploads/cropped/';
const port = 4000;
const app = express();

if (!fs.existsSync(uploadOriginalImageDir) || !fs.existsSync(uploadCroppedImageDir)) {
    fs.mkdirSync(uploadOriginalImageDir, {recursive: true});
    fs.mkdirSync(uploadCroppedImageDir, {recursive: true});
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.text());
app.use(cors());

app.use('/image', express.static(uploadCroppedImageDir));

app.use('/api/v1/', router);


app.use((err: multer.MulterError | Record<string, unknown>, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
            issues: ['File must be size in under 5mb', 'File must be with extension .jpg or .jpeg']
        });
    } else if (err instanceof Error) {
        console.log(err);
        res.status(500).json({success: false, message: err.message});
    } else {
        console.error('UnknownError: ', err);
        res.status(500).json({success: false, message: 'Something broke!'});
    }
});


app.listen(port, () => {
    console.log(`Express is listening on port: ${port}`);
});