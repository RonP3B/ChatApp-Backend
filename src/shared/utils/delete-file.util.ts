import * as fs from 'fs';
import * as path from 'path';

export function deleteFile(type: string, filePath: string): void {
  const filename: string = path.basename(filePath);
  fs.unlinkSync(`./public/${type}/${filename}`);
}
