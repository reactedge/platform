import {getEventDateTime, getEventType} from "../../../../domain/formatters/getEventType.ts";
import {EventHostSelect} from "./EventHostSelect.tsx";
import {EventEndTime} from "./EventEndTime.tsx";
import type {DayGroupEvent} from "../../../../types/domain/dashboard.type.tsx";
import {useVenueTranslation} from "../../../../hooks/ui/useVenueTranslation.ts";

interface ViewEventBookingProps {
    groupEvent: DayGroupEvent
}

export function EventBookingForm({groupEvent}: ViewEventBookingProps) {
    const t = useVenueTranslation();

    return (<>
        <div className="drawer-section">
            <div className="drawer-summary">
                <strong>{getEventType(groupEvent)}</strong>
                <p>{getEventDateTime(groupEvent)}</p>
            </div>
        </div>

        <div className="drawer-section">
            <label className="drawer-label">{t("Event host")}</label>
            <EventHostSelect eventGroup={groupEvent}/>
        </div>

        {/*{config.offerShampoo && (
                                <div className="view-group-event__row">
                                    <span className="view-group-event__label">
                                      {t("Shampoo")}
                                    </span>
                                    <ShampooSelect/>
                                </div>
                            )}*/}

        <div className="drawer-section drawer-outcome">
            <span className="drawer-label">{t("End at")}</span>
            <strong><EventEndTime/></strong>
        </div>

        {/*{config.showPrice && (*/}
        {/*    <div className="view-group-event__row">*/}
        {/*        <span className="view-group-event__label">*/}
        {/*          {t("Price")}*/}
        {/*        </span>*/}
        {/*        <EventPrice/>*/}
        {/*    </div>*/}
        {/*)}*/}
    </>)
}