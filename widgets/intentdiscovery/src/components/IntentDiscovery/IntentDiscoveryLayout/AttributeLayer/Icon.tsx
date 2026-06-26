import React from "react";

type Props = {
    attribute_code: string
    size?: number
}

export const Icon = ({attribute_code, size }: Props) => {
    if (size === undefined) size = 25
    return (
        <img className="intent-icon" width={`${size}px`} src={`/media/icons/${attribute_code}.svg`}/>
    )
}