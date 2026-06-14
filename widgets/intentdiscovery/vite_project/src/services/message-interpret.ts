import type {AiInterpretationRequest, AiInterpretationResponse} from "../hooks/infra/useAiInterpreter.tsx";
import {activity} from "../activity";
import type {IntentApiClient} from "../integration/intent/intentApiClient.ts";

export async function sendRequestToAi({
        payload,
        intentApiClient,
        onSuccess,
        onError,
        setLoading
    }: {
    payload: AiInterpretationRequest
    intentApiClient: IntentApiClient
    onSuccess: (json: AiInterpretationResponse) => void
    onError?: (err: unknown) => void
    setLoading: (loading: boolean) => void
}) {
    try {
        setLoading(true)

        const json = await intentApiClient.interpret(payload)
        //const json = await intentApiClient.dummy(payload)
        activity('ai-engine', 'AI Engine Interpretation', json)

        onSuccess(json)

    } catch (err) {
        activity(
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