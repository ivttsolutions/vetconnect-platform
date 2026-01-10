"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const minio_1 = __importStar(require("../config/minio"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
class UploadService {
    getFileExtension(filename) {
        return path_1.default.extname(filename).toLowerCase();
    }
    generateFileName(originalName) {
        const ext = this.getFileExtension(originalName);
        return `${(0, uuid_1.v4)()}${ext}`;
    }
    async uploadFile(bucket, file, folder) {
        const fileName = this.generateFileName(file.originalname);
        const objectName = folder ? `${folder}/${fileName}` : fileName;
        await minio_1.default.putObject(bucket, objectName, file.buffer, file.size, { 'Content-Type': file.mimetype });
        // Return the public URL
        const baseUrl = process.env.MINIO_PUBLIC_URL || `http://192.168.1.132:9000`;
        return `${baseUrl}/${bucket}/${objectName}`;
    }
    async uploadAvatar(file, userId) {
        return this.uploadFile(minio_1.BUCKETS.AVATARS, file, userId);
    }
    async uploadCover(file, userId) {
        return this.uploadFile(minio_1.BUCKETS.COVERS, file, userId);
    }
    async uploadPostMedia(file, userId) {
        return this.uploadFile(minio_1.BUCKETS.POSTS, file, userId);
    }
    async deleteFile(bucket, objectName) {
        try {
            await minio_1.default.removeObject(bucket, objectName);
        }
        catch (error) {
            console.error('Error deleting file:', error);
        }
    }
}
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map