import "../styles/globals.css";
import Navbar from "../components/Navbar";
import {Auth} from "@supabase/ui";
import {supabase} from "../lib/supabaseClient";
import {ToastProvider} from "react-toast-notifications";

function MyApp({Component, pageProps}) {
    return (
        <Auth.UserContextProvider supabaseClient={supabase}>
            <ToastProvider>
                <Navbar/>
                <Component {...pageProps} />
            </ToastProvider>
        </Auth.UserContextProvider>
    );
}

export default MyApp;
