import { apiClient } from '../lib/api-client';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export enum FILE_TYPE {
    ORGANIZATION_LOGO = 'organization_logo',
    USER_AVATAR = 'user_avatar',
    PRODUCT = 'product',
    WORK_ORDER = 'work_order',
    MESSAGE = 'message',
    GERBER = 'gerber',
    BOM = 'bom',
    CENTROID = 'centroid',
    SCHEMATIC = 'schematic',
    ASSEMBLY_DRAWING = 'assembly_drawing',
    PICK_AND_PLACE = 'pick_and_place',
    SPECIFICATION = 'specification',
    OTHER = 'other',
}

export type AttachmentType = FILE_TYPE | string;

export interface InitUploadResponse {
    attachmentId: string;
    url: string;
    expiresAt: string;
}

export interface ConfirmedAttachment {
    id: string;
    isUploaded: boolean;
    fileName: string;
    mimeType: string;
    url?: string;
}

// ─────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────

export const attachmentsService = {
    /**
     * STEP 1 – Request a pre-signed upload URL from the backend.
     * POST /attachments/upload
     */
    async initUpload(
        file: File,
        type: AttachmentType
    ): Promise<InitUploadResponse> {
        return apiClient.post<InitUploadResponse>('/attachments/upload', {
            fileName: file.name,
            mimeType: file.type,
            type,
        });
    },

    /**
     * STEP 2 – Upload the binary file directly to MinIO/S3 via the pre-signed URL.
     *
     * ⚠️  This MUST use a plain fetch (not apiClient) because:
     *  - The URL is external (MinIO/S3), not the NestJS API.
     *  - Adding an Authorization header would break the pre-signed signature.
     *  - Content-Type must match exactly what was sent in Step 1.
     */
    async uploadToStorage(presignedUrl: string, file: File): Promise<void> {
        const response = await fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type,
            },
            body: file,
        });

        if (!response.ok) {
            throw new Error(
                `Storage upload failed (${response.status} ${response.statusText}). ` +
                'The pre-signed URL may have expired – please try again.'
            );
        }
    },

    /**
     * STEP 3 – Confirm the upload to the backend so the attachment is marked as valid.
     * POST /attachments/:attachmentId/confirm
     */
    async confirmUpload(attachmentId: string): Promise<ConfirmedAttachment> {
        return apiClient.post<ConfirmedAttachment>(
            `/attachments/${attachmentId}/confirm`
        );
    },

    // ─────────────────────────────────────────────────────────
    // Convenience helper – runs all 3 steps in sequence.
    // Returns the attachmentId ready to be stored on a resource.
    // ─────────────────────────────────────────────────────────

    /**
     * Full upload flow:
     *  1. Request presigned URL
     *  2. PUT binary file to storage
     *  3. Confirm with backend
     *
     * @param file - The file to upload
     * @param type - The attachment category (e.g. 'ORGANIZATION_LOGO')
     * @returns The confirmed attachmentId
     */
    async uploadFile(file: File, type: AttachmentType): Promise<string> {
        // Step 1: get presigned URL
        const { attachmentId, url } = await attachmentsService.initUpload(file, type);

        // Step 2: direct binary upload to S3/MinIO
        await attachmentsService.uploadToStorage(url, file);

        // Step 3: notify backend of successful upload
        await attachmentsService.confirmUpload(attachmentId);

        return attachmentId;
    },
};
