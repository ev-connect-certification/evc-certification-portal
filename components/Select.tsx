import React, {ReactNode} from "react";

export default function Select(props: React.HTMLProps<HTMLSelectElement>) {
    return (
        <select className={"h-7 border rounded w-full border border-gray-2 shadow-inner px-1 " + (props.className || "")} {...props}>
            {props.children}
        </select>
    );
}