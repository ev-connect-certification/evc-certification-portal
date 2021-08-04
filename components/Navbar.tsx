import PrimaryButton from "./PrimaryButton";
import HomeLinkWrapper from "./HomeLinkWrapper";

export default function Navbar({}: {}) {
    return (
        <div className="h-12 w-full px-4 fixed top-0 left-0 bg-white border-b flex items-center">
            <HomeLinkWrapper>
                <img src="/logo.svg" alt="EV Connect logo" className="h-6"/>
            </HomeLinkWrapper>
            <HomeLinkWrapper>
                <p className="ml-4 font-bold">EV Connect Certification Portal</p>
            </HomeLinkWrapper>
            <PrimaryButton className="ml-auto" href="/request">Request certification</PrimaryButton>
        </div>
    );
}