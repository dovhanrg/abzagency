import express, {NextFunction, Response, Request} from "express";
import {AppDataSource} from "./data-source";
import router from "./router";
import initUsers from "./seeds/initUsers";
import * as fs from "fs";
import multer from "multer";
import path from "node:path";
import cors from 'cors';

AppDataSource.initialize().then(async (data) => {
    await initUsers();
})
    .catch(error => console.log('ERROR: ', error));


export const uploadOriginalImageDir = './uploads/original/';
export const uploadCroppedImageDir = './uploads/cropped/';
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

app.use('/static', express.static(path.join(__dirname, '..', 'uploads/cropped')));

console.log(path.join(__dirname, '..', '..', 'client/build', 'index.html'));

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
    return console.log(`Express is listening at http://localhost:${port}`);
});