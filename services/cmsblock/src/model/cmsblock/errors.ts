export class CmsBlockValidationError extends Error {
    constructor(message: string) { super(message); this.name = 'CmsBlockValidationError'; }
}

export class CmsBlockWorkflowError extends Error {
    constructor(message: string) { super(message); this.name = 'CmsBlockWorkflowError'; }
}
