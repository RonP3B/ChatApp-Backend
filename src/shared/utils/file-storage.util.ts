import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';

export function fileStorage(folder: string) {
  return {
    storage: diskStorage({
      destination: `public/${folder}`,
      filename: (_req, file, cb) =>
        cb(null, `${randomUUID()}_${file.originalname}`),
    }),
  };
}
