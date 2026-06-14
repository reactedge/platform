import {loadingStyle, spinnerStyle} from "./MinicartUI/Loading.ts";
import {buttonWrapper} from "./MinicartUI/minicartDrawerStyles.ts";

export function Loading({config}: any) {

    return (
        <div style={buttonWrapper}>
            <div style={loadingStyle}>
                <div style={{
                    ...spinnerStyle,
                    borderTopColor: config.primaryColor
                }} />
            </div>
        </div>
    );
}
