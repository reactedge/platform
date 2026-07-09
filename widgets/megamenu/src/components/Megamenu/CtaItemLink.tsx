import {renderIcon} from "./Icon.tsx";

interface CtaLinkProps {
    url?: string;
    label: string;
    icon?: "arrow" | "external";
}

export function CtaItemLink({ url, label, icon }: CtaLinkProps) {
    return (
        <a
            href={url}
            className="mw-cta-link"
        >
            <span className="mw-cta-link__label">{label}</span>

            {icon && (
                <span
                    className="mw-cta-link__icon"
                    aria-hidden="true"
                >
                    {renderIcon(icon)}
                </span>
            )}
        </a>
    );
}