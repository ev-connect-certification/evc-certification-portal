import React from "react";
import LinkWrapper from "./LinkWrapper";
import {FiArrowLeft} from "react-icons/fi";

export default function BackLink(props: React.HTMLProps<HTMLAnchorElement>) {
    return (
        <LinkWrapper className="flex items-center font-bold text-gray-1 mb-4" {...props}>
            <FiArrowLeft/>
            <div className="ml-2"><span>{props.children}</span></div>
        </LinkWrapper>
    );
}