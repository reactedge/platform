import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {ContactUsWrapper} from "./components/ContactUsWrapper.tsx";
import type {ContactUsRawConfig} from "./domain/contact.types.ts";
import {readWidgetConfig} from "./ContactUsConfig.ts";

type Props = {
    rawConfig?: ContactUsRawConfig
}

export default function ContactUsWidget({rawConfig}: Props) {
    const config = readWidgetConfig(rawConfig);

    if (!config) return null;

    return <SystemStateProvider config={config}>
        <ContactUsWrapper config={config} />
    </SystemStateProvider>
}
