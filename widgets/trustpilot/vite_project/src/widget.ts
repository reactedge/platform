import { mountWidget } from "./mountWidget";
import './styles/trustpilot.css'

class TrustpilotWidget extends HTMLElement {
    connectedCallback() {
        mountWidget(this);
    }
}

customElements.define("trustpilot-widget", TrustpilotWidget);
