import { Client } from 'minio';
declare const minioClient: Client;
export declare const BUCKETS: {
    AVATARS: string;
    COVERS: string;
    POSTS: string;
    DOCUMENTS: string;
    PRODUCTS: string;
    ANIMALS: string;
};
export declare function initializeBuckets(): Promise<void>;
export default minioClient;
//# sourceMappingURL=minio.d.ts.map