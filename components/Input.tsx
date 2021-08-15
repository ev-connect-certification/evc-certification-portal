import React from "react";

export default function Input(props: React.HTMLProps<HTMLInputElement>) {
    let newProps = {...props};
    delete newProps.className;

    return (
        <input className={"h-7 rounded w-full border border-gray-2 px-2 shadow-inner bg-white " + (props.className || "")} {...newProps}/>
    );
}