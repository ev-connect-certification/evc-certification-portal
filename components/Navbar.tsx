import PrimaryButton from "./PrimaryButton";
import HomeLinkWrapper from "./HomeLinkWrapper";
import Tab from "./Tab";
import {useRouter} from "next/router";
import SecondaryButton from "./SecondaryButton";
import {Auth} from "@supabase/ui";
import {supabase} from "../lib/supabaseClient";
import {useToasts} from "react-toast-notifications";

export default function Navbar({}: {}) {
    const {user} = Auth.useUser();
    const router = useRouter();
    const {addToast} = useToasts();

    return (
        <div className="h-12 w-full px-4 fixed top-0 left-0 bg-white border-b flex items-center">
            <HomeLinkWrapper>
                <img src="/logo.svg" alt="EV Connect logo" className="h-6"/>
            </HomeLinkWrapper>
            <HomeLinkWrapper>
                <p className="ml-4 font-bold">EV Connect Certification Portal</p>
            </HomeLinkWrapper>
            <Tab href="/" selected={router.route === "/"}>Models</Tab>
            <PrimaryButton className="ml-auto" href="/request/info">{user ? "Add request" : "Request certification"}</PrimaryButton>
            {user ? (
                <SecondaryButton onClick={() => {
                    supabase.auth.signOut().then(() => {
                        addToast("Successfully signed out", {appearance: "success", autoDismiss: true});
                    }).catch(e => {
                        addToast(`Failed to sign out: ${e}`, {appearance: "error", autoDismiss: true});
                    });
                }} className="ml-2">Sign out</SecondaryButton>
            ) : (
                <SecondaryButton href="/auth/signin" className="ml-2">Sign in</SecondaryButton>
            )}
        </div>
    );
}