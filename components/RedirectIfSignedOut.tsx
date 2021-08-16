import {useEffect} from "react";
import {Auth} from "@supabase/ui";
import {useRouter} from "next/router";

export default function RedirectIfSignedOut() {
    const {user} = Auth.useUser();
    const router = useRouter();

    useEffect(() => {if (!user) router.push("/auth/signin")}, [user]);

    return (
        <></>
    );
}