import { mountWidget } from "./mountWidget";
import './index.css'

class PDPGalleryWidget extends HTMLElement {
    connectedCallback() {
        mountWidget(this);
    }
}

customElements.define("productgallery-widget", PDPGalleryWidget);
