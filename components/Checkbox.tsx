import React from "react";

export default function Checkbox({id, label, className, ...props}: {
    id: string,
    label: string,
    className?: string,
} & React.HTMLProps<HTMLInputElement>) {
    return (
        <div className={"flex items-center " + (className || "")}>
            <input type="checkbox" id={id} {...props}/>
            <label htmlFor={id} className="ml-2">{label}</label>
        </div>
    );
}