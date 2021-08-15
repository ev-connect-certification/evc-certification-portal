import PrimaryButton from "./PrimaryButton";
import HomeLinkWrapper from "./HomeLinkWrapper";
import LinkWrapper from "./LinkWrapper";
import Tab from "./Tab";
import {useRouter} from "next/router";
import SecondaryButton from "./SecondaryButton";

export default function Navbar({}: {}) {
    const router = useRouter();

    return (
        <div className="h-12 w-full px-4 fixed top-0 left-0 bg-white border-b flex items-center">
            <HomeLinkWrapper>
                <img src="/logo.svg" alt="EV Connect logo" className="h-6"/>
            </HomeLinkWrapper>
            <HomeLinkWrapper>
                <p className="ml-4 font-bold">EV Connect Certification Portal</p>
            </HomeLinkWrapper>
            <Tab href="/" selected={router.route === "/"}>Models</Tab>
            <PrimaryButton className="ml-auto" href="/request/info">Request certification</PrimaryButton>
            <SecondaryButton onClick={() => null} className="ml-2">Sign in</SecondaryButton>
        </div>
    );
}