import tinify from 'tinify';
import {uploadCroppedImageDir, uploadOriginalImageDir} from "../index";

const api_key = 'zcywqhQSTmTVwXxdF5rGvXKf6dhk0n3s';

tinify.key = api_key;


const imageResizer = async (fileName: string) => {
    const source = tinify.fromFile(uploadOriginalImageDir + fileName);
    const resized = source.resize({
        method: 'thumb',
        width: 70,
        height: 70,
    });
    await resized.toFile(uploadCroppedImageDir + fileName);
}

export default imageResizer;
