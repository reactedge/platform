import {useActivityContext} from "../../activity/Context/useActivityContext.ts";

export function ErrorState({ error }: { error?: any }) {
    const activity = useActivityContext()
    activity.log('intentdiscovery', 'Intent Discovery Failure', error, 'error');

    return <>error</>;
}