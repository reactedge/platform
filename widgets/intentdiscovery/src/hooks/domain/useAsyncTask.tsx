import {useEffect, useState} from "react";

export function useAsyncTask<T>(
    enabled: boolean,
    task: () => Promise<T>,
    deps: any[]
) {
    const [state, setState] = useState<{
        loading: boolean
        data: T | null
        error: Error | null
    }>({
        loading: false,
        data: null,
        error: null
    })

    useEffect(() => {
        if (!enabled) return

        let cancelled = false

        const run = async () => {
            setState({ loading: true, data: null, error: null })

            try {
                const result = await task()
                if (!cancelled) {
                    setState({ loading: false, data: result, error: null })
                }
            } catch (err) {
                if (!cancelled) {
                    setState({
                        loading: false,
                        data: null,
                        error: err instanceof Error ? err : new Error("Unknown error")
                    })
                }
            }
        }

        run()

        return () => { cancelled = true }

    }, [enabled, ...deps])

    return state
}