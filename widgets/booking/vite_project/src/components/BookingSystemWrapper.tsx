import {useVenue} from "../hooks/domain/useVenue.tsx";
import {useEventHosts} from "../hooks/domain/useEventHosts.tsx";
import {useEventTypeGroups} from "../hooks/domain/useEventTypeGroups.tsx";
import {ErrorState} from "./global/ErrorState.tsx";
import {activity} from "../activity";
import {Spinner} from "./global/Spinner.tsx";
import type {ConfigInfoState} from "../state/Config/type.ts";
import {VisitIntentStateProvider} from "../state/Intent/VisitIntentStateProvider.tsx";
import {BookingSystem} from "./BookingSystem.tsx";
import {ConfigStateProvider} from "../state/Config/ConfigStateProvider.tsx";
import {Turnstile} from "../security/Turnstile.tsx";
import {useSystemState} from "../state/System/useSystemState.ts";
import {useHumanVerification} from "../hooks/domain/useHumanVerification.tsx";

interface Props {
    venueId: string
}

export function BookingSystemWrapper({venueId}: Props) {
    const { venue, venueError: venueError } = useVenue(venueId);
    const { cloudflareKey, isTurnstileEnabled } = useSystemState()
    const turnstileEnabled = isTurnstileEnabled();
    const { onToken, isHumanVerified } = useHumanVerification();
    const canStartBooking = isHumanVerified;

    const {
        eventHosts,
        hostsError,
    } = useEventHosts(venue?.id);

    const {
        groups,
        eventTypeGroupError
    } = useEventTypeGroups(venue?.id);

    if (venueError || hostsError || eventTypeGroupError) {
        activity('bootstrap', 'Keystone data cannot be returned', {venue, hostsError, eventTypeGroupError}, 'error');
        return <ErrorState />;
    }

    if (!venue || !eventHosts || !groups) {
        activity('config-load', 'Keystone Data not loaded',{venue, eventHosts, groups});
        return <Spinner />;
    }

    activity('config-load', 'Config Data',{venue, eventHosts, groups});

    if (!turnstileEnabled) {
        activity('form-ready', 'Turnstile Disabled',{
            cloudflareKey
        }, 'warn');
    }

    const config: ConfigInfoState = {
        venue,
        eventHosts,
        eventTypeGroups: groups
    };

    return (
        <ConfigStateProvider config={config}>
            <VisitIntentStateProvider eventTypeGroups={config.eventTypeGroups} eventHosts={config.eventHosts}>
                <BookingSystem canStartBooking={canStartBooking} />
                {/* 2. The security gate */}
                {turnstileEnabled && (
                    <Turnstile
                        siteKey={cloudflareKey}
                        containerId="booking-turnstile"
                        onToken={onToken}
                    />
                )}
            </VisitIntentStateProvider>
        </ConfigStateProvider>
    );
}
