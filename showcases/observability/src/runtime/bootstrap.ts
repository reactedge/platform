import {startObservability} from "./observability";
import {mount} from "../widget";

export async function boot() {
    startObservability();
    mountWidget();
}

export async function mountWidget() {
    const config = await fetch('/cdn/config.json').then(r => r.json());

    const el = document.querySelector('widget-observable');

    if (!(el instanceof HTMLElement)) {
        return;
    }

    mount(el, config);
}