// src/lib/file-upload.util.ts
import { diskStorage } from 'multer';
import { extname } from 'path';

export const fileUploadOptions = (folder: string) => ({
  storage: diskStorage({
    destination: `public/upload/${folder}`,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),
});

export const getFileUrl = (folder: string, file: Express.Multer.File) => {
  return `public/upload/${folder}/${file.filename}`;
};
