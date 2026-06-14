import {useVisitIntentState} from "../../../state/Intent/useVisitIntentState.ts";
import {useConfigState} from "../../../state/Config/useConfigState.ts";
import {FilterSection} from "../FilterSection.tsx";
import {PresenterOptions} from "./HostFilter/PresenterOptions.tsx";
import {useState} from "react";

export function HostFilter() {
    const { visitIntent, setEventHost } = useVisitIntentState();
    const { config } = useConfigState();
    const [isEditing, setIsEditing] = useState(false);

    if (!config.eventHosts || config.eventHosts.length <= 1) {
        return null;
    }

    const hasPresenter = visitIntent.hostId !== '';

    function formatSelectedPresenter(hostId: string): string {
        if (!hostId) return '';

        return (
            config.eventHosts.find((host) => host.id === hostId)?.name ?? ''
        );
    }

    const summary =
        visitIntent.hostId === ''
            ? 'Any'
            : formatSelectedPresenter(visitIntent.hostId);

    return (
        <FilterSection
            title="Presenter"
            isResolved={hasPresenter && !isEditing}
            summary={summary}
            onEdit={() => setIsEditing(true)}
        >
            {isEditing && (<PresenterOptions
                hosts={config.eventHosts}
                selectedId={visitIntent.hostId}
                onSelect={(id) => {
                    setEventHost(id);
                    setIsEditing(false);
                }}
            />)}
        </FilterSection>
    );
}
