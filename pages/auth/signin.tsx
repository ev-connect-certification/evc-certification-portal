import SEO from "../../components/SEO";
import H1 from "../../components/H1";
import {Auth} from "@supabase/ui";
import {supabase} from "../../lib/supabaseClient";
import {useRouter} from "next/router";
import {useEffect} from "react";

export default function Signin() {
    const router = useRouter();
    const {user} = Auth.useUser();

    useEffect(() => {
        if (user) router.push("/?newsignin=true");
    }, [user]);

    return (
        <div className="max-w-sm mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <H1>Admin access</H1>
            <Auth supabaseClient={supabase}/>
        </div>
    );
}