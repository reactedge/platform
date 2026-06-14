import React from 'react';
import {useState} from "react";
import {Loading} from "./Loading.tsx";
import {getMenuType, resolveDropdownLayout} from "../lib/layout-resolver.ts";
import {MenuItem} from "./MenuItem.tsx";
import {MenuTile} from "./Megamenu/MenuTile.tsx";
import {MenuLevelTwo} from "./Megamenu/MenuLevelTwo.tsx";
import type {MegaMenuProps} from "../domain/megamenu.types.ts";

export function MegamenuContent({ items, loading = false, theme }: MegaMenuProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    if (loading) return <Loading />

    return (
        <div className="mw-megamenu">
            {items && items.map(level1 => {
                const isActive = activeId === level1.id;
                const layout = resolveDropdownLayout(level1.url, theme);
                const menuType = getMenuType(level1, layout);
                const hasSubmenu = menuType !== "none";

                return (
                    <div
                        key={level1.id}
                        className={[
                            "mw-megamenu-item",
                            isActive && "is-active",
                            `menu-${menuType}`
                        ].filter(Boolean).join(" ")}
                        onMouseEnter={() => setActiveId(level1.id)}
                        onMouseLeave={() => setActiveId(null)}
                    >
                        <MenuItem
                            item={level1}
                            isActive={isActive}
                            isParent
                            hasSubmenu={hasSubmenu}
                        />

                        {menuType !== "none" && (
                            <div className="mw-megamenu-dropdown">
                                {menuType === "simple-list" &&
                                    level1.children!.map(child => (
                                        <MenuItem key={child.id} item={child}/>
                                    ))}

                                {menuType === "simple-tiles" && (
                                    <div className="mw-megamenu-tiles">
                                        {level1.children?.map(item => (
                                            <MenuTile key={item.id} item={item}/>
                                        ))}
                                    </div>
                                )}

                                {menuType === "complex" &&
                                    level1.children!.map(level2 => (
                                        <MenuLevelTwo
                                            key={level2.id}
                                            label={level2.label}
                                            children={level2.children}
                                        />
                                    ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
