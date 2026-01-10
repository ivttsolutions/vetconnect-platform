"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUCKETS = void 0;
exports.initializeBuckets = initializeBuckets;
const minio_1 = require("minio");
const minioClient = new minio_1.Client({
    endPoint: process.env.MINIO_ENDPOINT || '192.168.1.132',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});
exports.BUCKETS = {
    AVATARS: 'avatars',
    COVERS: 'covers',
    POSTS: 'posts',
    DOCUMENTS: 'documents',
    PRODUCTS: 'products',
    ANIMALS: 'animals',
};
// Initialize buckets
async function initializeBuckets() {
    for (const bucket of Object.values(exports.BUCKETS)) {
        try {
            const exists = await minioClient.bucketExists(bucket);
            if (!exists) {
                await minioClient.makeBucket(bucket);
                console.log(`✅ Bucket '${bucket}' created`);
            }
        }
        catch (error) {
            console.error(`Error with bucket '${bucket}':`, error);
        }
    }
}
exports.default = minioClient;
//# sourceMappingURL=minio.js.map