import Link from "next/link";
import {ReactNode} from "react";
import Button from "./Button";
import PrimaryButton from "./PrimaryButton";

export default function Navbar({}: {}) {
    const LinkWrapper = ({children}: {children: ReactNode}) => (
        <Link href="/">
            <a>
                {children}
            </a>
        </Link>
    );

    return (
        <div className="h-12 w-full px-4 fixed top-0 left-0 bg-white border-b flex items-center">
            <LinkWrapper>
                <img src="/logo.svg" alt="EV Connect logo" className="h-6"/>
            </LinkWrapper>
            <LinkWrapper>
                <p className="ml-4 font-bold">EV Connect Certification Portal</p>
            </LinkWrapper>
            <PrimaryButton className="ml-auto" href="/request">Request certification</PrimaryButton>
        </div>
    );
}