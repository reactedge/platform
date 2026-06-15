import type {AiInterpretationRequest, AiInterpretationResponse} from "../hooks/infra/useAiInterpreter.tsx";
import type {IntentApiClient} from "../integration/intent/intentApiClient.ts";
import type {WidgetActivity} from "../activity";

export async function sendRequestToAi({
        payload,
        intentApiClient,
        onSuccess,
        onError,
        setLoading,
        activity
    }: {
    payload: AiInterpretationRequest
    intentApiClient: IntentApiClient
    onSuccess: (json: AiInterpretationResponse) => void
    onError?: (err: unknown) => void
    setLoading: (loading: boolean) => void,
    activity: WidgetActivity
}) {
    try {
        setLoading(true)

        const json = await intentApiClient.interpret(payload)
        //const json = await intentApiClient.dummy(payload)
        activity.log('ai-engine', 'AI Engine Interpretation', json)

        onSuccess(json)

    } catch (err) {
        activity.log(
            'intent-error',
            'Intent evaluation failed',
            { error: err }
        )

        if (onError) {
            onError(err)
        }
    } finally {
        setLoading(false)
    }
}