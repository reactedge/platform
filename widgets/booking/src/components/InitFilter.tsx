import {WeekPreference} from "./WeekPreference.tsx";
import {EventTypeGroupPreference} from "./EventTypeGroupPreference.tsx";
import {EventTypePreference} from "./EventTypePreference.tsx";
import {useVisitIntentState} from "../state/Intent/useVisitIntentState.ts";
import {useConfigState} from "../state/Config/useConfigState.ts";
import {getVisitIntentStep} from "../domain/intent/getVisitIntentStep.ts";
import type {Venue} from "../types/domain/types.ts";
import {HostPreference} from "./HostPreference.tsx";
import {activity} from "../activity";

export function InitFilter() {
    const { config } = useConfigState();
    const { setWeekIntent, setEventTypeGroup, setEventType, setEventHost, visitIntent } = useVisitIntentState()

    const visitIntentStep = getVisitIntentStep(visitIntent)
    const selections = {
        week: undefined,
        eventTypeGroup: undefined,
        eventType: undefined,
        host: undefined
    }
    const venue = config?.venue as Venue

    activity('init-filter', 'Init Filter',{visitIntentStep, selections});

    return (
        <div className="booking-init">
            <h2 className="booking-title">
                Let&apos;s make this booking easy
            </h2>

            {visitIntentStep === 'Host' && (
                <div className="booking-row">
                    <h3>
                        {`Who do you want to meet at ${venue?.name}`}
                    </h3>
                    <HostPreference
                        value={selections?.host}
                        onSelect={(host) => {
                            setEventHost(host)
                        }}
                    />
                </div>
            )}

            {visitIntentStep === 'Week' && (
                <div className="booking-row">
                  <h3>
                    {`When do you need your visit at ${venue?.name}`}
                  </h3>
                    <WeekPreference
                        value={selections?.week}
                        onSelect={(week) => {
                            setWeekIntent(week)
                        }}
                    />
                </div>
            )}

            {visitIntentStep === 'EventTypeGroup' && (
                <div className="booking-row">
                  <h3>
                    Select a category that matches your appointment
                  </h3>
                    <EventTypeGroupPreference
                        value={selections?.eventTypeGroup}
                        onSelect={(group) => {
                            setEventTypeGroup(group)
                        }}
                    />
                </div>
            )}

            {visitIntentStep === 'EventType' && (
                <div className="booking-row">
                  <h3>
                    What type of visit do you need?
                  </h3>
                    <EventTypePreference
                        value={selections?.eventType}
                        onSelect={(eventType) => {
                            setEventType(eventType)
                        }}
                    />
                </div>
            )}
        </div>
    )
}
