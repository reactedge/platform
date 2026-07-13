export interface GalleryTile {
    src: string;
    srcset?: string;
    sizes?: string;
    alt?: string;
}

export interface WidgetConfig {
    tiles:  GalleryTile[];
}