
import {loadingStyle, spinnerStyle} from "./Megamenu/Loading.ts";
import {useConfigState} from "../state/Config/useConfigState.ts";

export function Loading() {
    const {settings} = useConfigState();

    return (
        <div style={loadingStyle}>
            <div style={{
                ...spinnerStyle,
                borderTopColor: settings?.primaryColor
            }} />
        </div>
    );
}
