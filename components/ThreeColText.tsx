import ThreeCol from "./ThreeCol";
import React, {ReactNode} from "react";
import Label from "./Label";

const ThreeColText = ({text, className}: {text: { [key: string]: ReactNode }, className?: string}) => {
    return (
        <ThreeCol className={className || ""}>
            {Object.entries(text).map(([key, value]) => (
                <React.Fragment key={key}>
                    <Label>{key}</Label>
                    <p className="text-sm">{value}</p>
                </React.Fragment>
            ))}
        </ThreeCol>
    );
};

export default ThreeColText;