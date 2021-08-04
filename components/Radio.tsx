import React from "react";

export default function Radio({id, label, name, className, ...props}: {id: string, label: string, name: string, className?: string} & React.HTMLProps<HTMLInputElement>) {
    return (
        <div className={"flex items-center " + (className || "")}>
            <input
                type="radio"
                id={id}
                name={name}
                {...props}
            />
            <label className="ml-2" htmlFor={id}>{label}</label>
        </div>
    );
}