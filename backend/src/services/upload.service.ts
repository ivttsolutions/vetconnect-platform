import minioClient, { BUCKETS } from '../config/minio';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Type for multer file
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export class UploadService {
  private getFileExtension(filename: string): string {
    return path.extname(filename).toLowerCase();
  }

  private generateFileName(originalName: string): string {
    const ext = this.getFileExtension(originalName);
    return `${uuidv4()}${ext}`;
  }

  async uploadFile(
    bucket: string,
    file: MulterFile,
    folder?: string
  ): Promise<string> {
    const fileName = this.generateFileName(file.originalname);
    const objectName = folder ? `${folder}/${fileName}` : fileName;

    await minioClient.putObject(
      bucket,
      objectName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );

    // Return the public URL
    const baseUrl = process.env.MINIO_PUBLIC_URL || `http://192.168.1.132:9000`;
    return `${baseUrl}/${bucket}/${objectName}`;
  }

  async uploadAvatar(file: MulterFile, userId: string): Promise<string> {
    return this.uploadFile(BUCKETS.AVATARS, file, userId);
  }

  async uploadCover(file: MulterFile, userId: string): Promise<string> {
    return this.uploadFile(BUCKETS.COVERS, file, userId);
  }

  async uploadPostMedia(file: MulterFile, userId: string): Promise<string> {
    return this.uploadFile(BUCKETS.POSTS, file, userId);
  }

  async deleteFile(bucket: string, objectName: string): Promise<void> {
    try {
      await minioClient.removeObject(bucket, objectName);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
}
