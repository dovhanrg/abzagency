import express from "express";
import getUsers from "./getUsers";
import postUsers from "./postUsers";
import getUser from "./getUser";
import getPositions from "./getPositions";
import getToken from "./getToken";
import multer from "multer";
import {uploadOriginalImageDir} from "../index";
import path from "node:path";
import {randomUUID} from "node:crypto";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadOriginalImageDir)
    },
    filename: function (req, file, cb) {
        const fileExt = path.extname(file.originalname);
        const fileName = randomUUID() + fileExt.toLowerCase();
        cb(null, fileName);
    }
})

const upload = multer({
    storage,
    fileFilter: (req, file, callback ) => {
        console.log(req.body);
        const fileExt = path.extname(file.originalname);
        if (!['.jpg', '.jpeg'].includes(fileExt.toLowerCase()) || file.mimetype !== 'image/jpeg') {
            return callback(new Error('File only can be with .jpg or .jpeg extension'));
        }
        return callback(null, true);
    },
    limits: {
        fileSize: 5000000,
    }
});

const router = express.Router();

router.get('/users/:id', getUser);

router.get('/users', getUsers);

router.post('/users', upload.single('photo'), postUsers);

router.get('/positions', getPositions);

router.get('/token', getToken);

export default router;
