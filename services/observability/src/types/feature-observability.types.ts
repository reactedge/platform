

export interface WidgetState {
    readonly searchTerm: string;
    readonly status:
        | 'idle'
        | 'searching'
        | 'success'
        | 'error';
}