import React from "react";

export default function TextArea(props: React.HTMLProps<HTMLTextAreaElement>) {
    let newProps = {...props};
    delete newProps.className;

    return (
        <textarea
            className={"rounded w-full border border-gray-2 p-2 shadow-inner bg-white resize-none " + (props.className || "")}
            rows={4} {...newProps}
        />
    );
}