interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}
export declare class UploadService {
    private getFileExtension;
    private generateFileName;
    uploadFile(bucket: string, file: MulterFile, folder?: string): Promise<string>;
    uploadAvatar(file: MulterFile, userId: string): Promise<string>;
    uploadCover(file: MulterFile, userId: string): Promise<string>;
    uploadPostMedia(file: MulterFile, userId: string): Promise<string>;
    deleteFile(bucket: string, objectName: string): Promise<void>;
}
export {};
//# sourceMappingURL=upload.service.d.ts.map