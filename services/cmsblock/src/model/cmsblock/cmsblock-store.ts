import {generateBlock, validateDraft} from './generator';
import {CmsBlockWorkflowError} from './errors';
import type {CmsBlockRecord, CmsBlockDraft} from './types';
import type {BlockGenerator} from './ai-generator';
import {CmsBlockPersistence} from './store/persistence';
import {CmsBlockRevisionStore} from './store/revisions';

export class CmsBlockStore {
    private readonly persistence: CmsBlockPersistence;
    private readonly revisions: CmsBlockRevisionStore;

    constructor(directory: string, private readonly generator: BlockGenerator = async draft => generateBlock(draft)) {
        this.persistence = new CmsBlockPersistence(directory);
        this.revisions = new CmsBlockRevisionStore(this.persistence);
    }

    get(): Promise<CmsBlockRecord | null> {
        return this.persistence.get();
    }

    save(input: unknown): Promise<CmsBlockRecord> {
        const draft: CmsBlockDraft = validateDraft(input);
        return this.persistence.mutate(current => ({
            id: 'demo',
            ...draft,
            revision: current?.revision ?? 0,
            pending: null,
            published: current?.published ?? null,
        }));
    }

    async generate(): Promise<CmsBlockRecord> {
        const current = await this.get();
        if (!current) throw new CmsBlockWorkflowError('Save the source content before generating.');
        const draft = validateDraft(current);
        const expected = JSON.stringify({source: current.source, templateId: current.templateId, layoutId: draft.layoutId});
        const generated = await this.generator(draft);
        return this.persistence.mutate(latest => {
            if (!latest || JSON.stringify({
                source: latest.source, templateId: latest.templateId,
                layoutId: validateDraft(latest).layoutId,
            }) !== expected) {
                throw new CmsBlockWorkflowError('Source changed while generating. Save and generate again.');
            }
            const revision = latest.revision + 1;
            return {
                ...latest, revision,
                pending: {...generated, templateId: draft.templateId, layoutId: draft.layoutId, revision, status: 'inreview'},
            };
        });
    }

    updatePending(input: unknown): Promise<CmsBlockRecord> {
        return this.revisions.updatePending(input);
    }

    approve(): Promise<CmsBlockRecord> {
        return this.revisions.approve();
    }

    reject(): Promise<CmsBlockRecord> {
        return this.revisions.reject();
    }
}
