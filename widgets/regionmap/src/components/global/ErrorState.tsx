import {activity} from "../../activity";

export function ErrorState({ error }: { error?: any }) {
    activity('intentdiscovery', 'Intent Discovery Failure', error, 'error');

    return <>error</>;
}