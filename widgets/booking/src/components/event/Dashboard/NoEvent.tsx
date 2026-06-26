import {useMediaQuery} from "../../../hooks/ui/useMediaQuery.tsx";
import {useVenueTranslation} from "../../../hooks/ui/useVenueTranslation.ts";

export const NoEvent = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const t = useVenueTranslation();

    return (
        <div className="week-event-list"
             data-layout={isMobile ? 'mobile' : 'desktop'}>
            <div className="day-unavailable">
                {t('Not event found this week')}
            </div>
        </div>
    )
}