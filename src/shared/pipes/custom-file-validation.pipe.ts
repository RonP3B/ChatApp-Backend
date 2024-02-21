import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { allowedMimeTypes } from '../utils/allowed-mime-types.util';
import { FileTypeMaxSize } from '../enums';

@Injectable()
export class CustomFileValidationPipe implements PipeTransform {
  constructor(private readonly isFileRequired: boolean) {}

  transform(value: Express.Multer.File): Express.Multer.File {
    if (!value && !this.isFileRequired) {
      return null;
    }

    if (!value && this.isFileRequired) {
      throw new BadRequestException('File is required.');
    }

    const mimeTypeParts = value.mimetype.split('/');
    const fileTypeCategory = mimeTypeParts[0];

    if (!(fileTypeCategory in allowedMimeTypes)) {
      throw new BadRequestException('Invalid file format.');
    }

    if (!allowedMimeTypes[fileTypeCategory].includes(value.mimetype)) {
      throw new BadRequestException('Invalid file format.');
    }

    const fileType = value.mimetype.split('/')[0];
    const fileSize: number = value.size;
    const maxSize: number = FileTypeMaxSize[fileType.toUpperCase()];

    if (fileSize > maxSize) {
      throw new BadRequestException(
        `File size must be equal or less than ${maxSize / (1024 * 1024)}MB.`,
      );
    }

    return value;
  }
}
