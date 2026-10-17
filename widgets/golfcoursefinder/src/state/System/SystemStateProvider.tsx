import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { WidgetConfig } from "../../Config.ts";
import { GolfCourseSearchService } from "../../domain/golf-course-search.service.ts";
import { LocalSystemStateContext } from "./SystemState.tsx";

interface SystemStateProviderProps {
    children: ReactNode;
    config: WidgetConfig;
}

export const SystemStateProvider: React.FC<SystemStateProviderProps> = ({ children, config }) => {
    const golfCourseSearch = useMemo(
        () => new GolfCourseSearchService(config.integrations.golfcoursesApi.api),
        [config.integrations.golfcoursesApi.api],
    );
    const [apiReachable, setApiReachable] = useState<boolean | null>(null);

    useEffect(() => {
        let active = true;
        void golfCourseSearch.checkAvailability().then(reachable => {
            if (active) setApiReachable(reachable);
        });
        return () => { active = false; };
    }, [golfCourseSearch]);

    const state = useMemo(() => ({ golfCourseSearch, apiReachable }), [golfCourseSearch, apiReachable]);
    return (
        <LocalSystemStateContext.Provider value={state}>
            {children}
        </LocalSystemStateContext.Provider>
    );
};
