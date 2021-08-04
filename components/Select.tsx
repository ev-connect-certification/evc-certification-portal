import {ReactNode} from "react";

export default function Select({children, className}: { children: ReactNode, className?: string }) {
    return (
        <select className={"h-7 border rounded w-full border border-gray-2 shadow-inner px-1 " + (className || "")}>
            {children}
        </select>
    );
}