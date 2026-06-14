import { mountWidget } from "./mountWidget";
import {loadTranslations} from "./services/translationLoader.ts";
import {loadMagentoFonts} from "./services/fontLoader.ts";

class MinicartWidget extends HTMLElement {
    connectedCallback() {
        loadMagentoFonts();
        loadTranslations(this);
        mountWidget(this);
    }
}

customElements.define("minicart-widget", MinicartWidget);
