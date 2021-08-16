import {ReactNode} from "react";
import Link from "next/link";

interface ButtonPropsBase {
    children: ReactNode,
    isLoading?: boolean,
    className?: string,
    containerClassName?: string,
    disabled?: boolean,
}

interface ButtonPropsLink extends ButtonPropsBase {
    href: string,
    onClick?: never,
}

interface ButtonPropsButton extends ButtonPropsBase {
    href?: never,
    onClick: () => any,
}

export type ButtonProps = ButtonPropsLink | ButtonPropsButton;

export default function Button({children, href, onClick, className, disabled, isLoading, containerClassName}: ButtonProps) {
    const classNames = " " + (className || "");

    return (
        <div className={"relative " + (containerClassName || "")}>
            {href ? (
                <Link href={href}>
                    <a className={classNames}>
                        <div className={isLoading ? "invisible" : ""}>{children}</div>
                    </a>
                </Link>
            ) : (
                <button className={classNames} onClick={onClick} disabled={disabled}>
                    <div className={isLoading ? "invisible" : ""}>{children}</div>
                </button>
            )}
            {isLoading && <div className="sz-spinner"/>}
        </div>
    )
}