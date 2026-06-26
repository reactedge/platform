import {useVenueTranslation} from "../../../../hooks/ui/useVenueTranslation.ts";

export const NoDayEventList: React.FC = () => {
    const t = useVenueTranslation();

    return (
        <div className="day-unavailable">
            {t('Not a working day')}
        </div>
    )
}