import SEO from "../../components/SEO";
import H1 from "../../components/H1";
import Auth from "../../components/supabase/Auth";
import {supabase} from "../../lib/supabaseClient";

export default function Signin() {
    return (
        <div className="max-w-sm mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <H1>Admin portal</H1>
            <Auth supabaseClient={supabase}/>
        </div>
    );
}