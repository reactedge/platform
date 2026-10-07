import {z} from 'zod';
import type {Config} from '../../config';
import {createCloudinarySignature} from '../../lib/cloudinary-signature';

const DestroyResponseSchema = z.object({
    result: z.string(),
}).passthrough();

type CloudinaryConfig = Config['cloudinary'];
type Fetcher = typeof fetch;

export class CloudinaryImageStore {
    constructor(
        private readonly config: CloudinaryConfig,
        private readonly fetcher: Fetcher = fetch,
    ) {}

    async deleteMany(publicIds: string[]): Promise<void> {
        await Promise.all(publicIds.map(publicId => this.delete(publicId)));
    }

    private async delete(publicId: string): Promise<void> {
        this.ensureConfigured();

        const timestamp = Math.floor(Date.now() / 1000);
        const signature = createCloudinarySignature({public_id: publicId, timestamp}, this.config.apiSecret);
        const form = new URLSearchParams({
            public_id: publicId,
            timestamp: String(timestamp),
            api_key: this.config.apiKey,
            signature,
        });

        const response = await this.fetcher(
            `https://api.cloudinary.com/v1_1/${encodeURIComponent(this.config.cloudName)}/image/destroy`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: form,
            },
        );

        const body = DestroyResponseSchema.safeParse(await response.json());
        if (!response.ok || !body.success || !['ok', 'not found'].includes(body.data.result)) {
            throw new Error(`Unable to delete Cloudinary image "${publicId}".`);
        }
    }

    private ensureConfigured(): void {
        const {cloudName, apiKey, apiSecret} = this.config;
        if (!cloudName || !apiKey || !apiSecret) throw new Error('Cloudinary is not configured.');
    }
}
