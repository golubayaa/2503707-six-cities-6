import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './index.js';
import multer, { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { extension } from 'mime-types';
import { existsSync, mkdirSync } from 'node:fs';

export interface FileUploadOptions {
  uploadDir: string;
  fieldName: string;
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  fileNamePrefix?: string;
}

export class FileUploadMiddleware implements Middleware {
  private readonly options: Required<FileUploadOptions>;
  private readonly uploadFn: (req: Request, res: Response, next: (err?: multer.MulterError) => void) => void;

  constructor(options: FileUploadOptions) {
    this.options = {
      maxFileSize: 2 * 1024 * 1024,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileNamePrefix: 'file',
      ...options,
    };

    this.ensureUploadDir();
    this.uploadFn = this.createMulter();
  }

  private ensureUploadDir(): void {
    if (!existsSync(this.options.uploadDir)) {
      mkdirSync(this.options.uploadDir, { recursive: true });
    }
  }

  private createMulter(): (req: Request, res: Response, next: (err?: any) => void) => void {
    const storage = diskStorage({
      destination: (_req, _file, callback) => callback(null, this.options.uploadDir),
      filename: (_req, file, callback) => {
        const ext = extension(file.mimetype) || 'bin';
        const filename = `${this.options.fileNamePrefix}_${nanoid(10)}.${ext}`;
        callback(null, filename);
      },
    });

    return multer({
      storage,
      limits: { fileSize: this.options.maxFileSize },
      fileFilter: (_req, file, callback) => {
        if (this.options.allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error(`Unsupported file type: ${file.mimetype}`));
        }
      },
    }).single(this.options.fieldName);
  }

  private processUpload(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      this.uploadFn(req, res, (err: any) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.processUpload(req, res);
    } catch (error: any) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: `File exceeds maximum size of ${this.options.maxFileSize} bytes`,
        });
        return;
      }
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: `Unexpected field name. Expected: ${this.options.fieldName}`,
        });
        return;
      }
      res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message || 'File upload failed',
      });
      return;
    }

    if (!req.file) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'File is required' });
      return;
    }

    next();
  }

  static forAvatar(uploadDir = 'upload/avatars'): FileUploadMiddleware {
    return new FileUploadMiddleware({
      uploadDir,
      fieldName: 'avatar',
      maxFileSize: 2 * 1024 * 1024,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileNamePrefix: 'avatar',
    });
  }
}
