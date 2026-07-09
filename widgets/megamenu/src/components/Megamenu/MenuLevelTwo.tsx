import {MenuItem} from "../MenuItem.tsx";
import type {NavItem} from "../../domain/megamenu.types.ts";

interface MenuProps {
    label: string;
    children?: NavItem[];
}

export function MenuLevelTwo({label, children}: MenuProps) {
    if (!children?.length) return null;

    return (
        <div className="mw-megamenu-col">
            <div className="mw-megamenu-col__title">
                {label}
            </div>

            <ul className="mw-megamenu-col__list">
                {children.map(level3 => (
                    <li
                        key={level3.id}
                        className="mw-megamenu-col__item"
                    >
                        <MenuItem item={level3}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}