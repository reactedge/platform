import {BookingSystemWrapper} from "./components/BookingSystemWrapper.tsx";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {activity} from "./activity";
import {UserStateProvider} from "./state/User/UserStateProvider.tsx";
import {type BookingConfig, readWidgetConfig} from "./BookingSystemConfig.tsx";

type Props = {
    rawConfig: BookingConfig,
    host: HTMLElement;
};

export function BookingSystemWidget({ rawConfig, host }: Props) {
    const config = readWidgetConfig(rawConfig, host);

    if (!config) return null;

    if (!config.booking) {
        activity('bootstrap', 'Widget is not correctly configured', null, 'warn');
        return null;
    }

    return (
            <SystemStateProvider config={config.booking}>
                <UserStateProvider config={config.user}>
                    <BookingSystemWrapper venueId={config.booking.venueId} />
                </UserStateProvider>
            </SystemStateProvider>
    );
}
