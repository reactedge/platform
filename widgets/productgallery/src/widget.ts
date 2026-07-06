import { mountWidget } from "./mountWidget";

class PDPGalleryWidget extends HTMLElement {
    connectedCallback() {
        mountWidget(this);
    }
}

customElements.define("productgallery-widget", PDPGalleryWidget);
