/** Independent layout choices: UI preview only until the service supports layoutId. */
export const CMS_BLOCK_LAYOUTS = [
    {id: 'image-above', label: 'Image above', description: 'Image above the content'},
    {id: 'image-left', label: 'Image left', description: 'Image to the left of the content'},
    {id: 'image-right', label: 'Image right', description: 'Image to the right of the content'},
] as const;

export type CmsBlockLayoutId = (typeof CMS_BLOCK_LAYOUTS)[number]['id'];
