export function emitFiltersUpdate(filters: any) {
    window.ReactEdgeIntent.emit({
        source: "intent-widget",
        type: "filters.update",
        filters
    });
}