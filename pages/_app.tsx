import "../styles/globals.css";
import Navbar from "../components/Navbar";
import {Auth} from "@supabase/ui";
import {supabase} from "../lib/supabaseClient";
import {ToastProvider} from "react-toast-notifications";
import {Router} from "next/router";
import NProgress from "nprogress";
import "../styles/nprogress.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());


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
