import SEO from "../../components/SEO";
import H1 from "../../components/H1";
import {GetServerSideProps} from "next";
import {supabase} from "../../lib/supabaseClient";
import {ssrRedirect} from "../../lib/apiResponses";
import RedirectIfSignedOut from "../../components/RedirectIfSignedOut";
import {useEffect, useState} from "react";
import {CertificationRequestObj} from "../../lib/types";
import LinkWrapper from "../../components/LinkWrapper";
import {format} from "date-fns";

export default function RequestInfo({}: {}) {
    const [requests, setRequests] = useState<(CertificationRequestObj & {models: {name: string}} & {manufacturers: {name: string}})[] | null>(null);

    useEffect(() => {
        (async () => {
            const {data, error} = await supabase
                .from<CertificationRequestObj>("requests")
                .select("*, models (name), manufacturers (name)");

            if (error) console.log(error);

            // @ts-ignore supabase doesn't handle types for lookups
            setRequests(data);
        })();
    }, []);

    return (
        <div className="max-w-5xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <RedirectIfSignedOut/>
            <H1 className="mb-4">Incoming certification requests</H1>
            {requests ? !!requests.length ? (
                <>
                    <div className="h-12 flex items-center">
                        <div className="w-32 text-gray-1"><span>Manufacturer</span></div>
                        <div className="w-64 text-gray-1"><span>Model</span></div>
                        <div className="w-32 text-gray-1"><span>Firmware version</span></div>
                        <div className="w-32 text-gray-1"><span>Request date</span></div>
                        <div className="w-32 text-gray-1"><span>Tier</span></div>
                        <div className="w-32 text-gray-1"><span>Status</span></div>
                    </div>
                    <hr className="text-gray-1"/>
                    {requests.map(request => (
                        <LinkWrapper key={request.id} href={`/request/${request.id}`} className="flex h-12 items-center">
                            <div className="flex-shrink-0 w-32"><span>{request.manufacturers.name}</span></div>
                            <div className="flex-shrink-0 w-64"><span>{request.models.name}</span></div>
                            <div className="flex-shrink-0 w-32 text-gray-1"><span>{request.firmwareVersion}</span></div>
                            <div className="flex-shrink-0 w-32 text-gray-1"><span>{format(new Date(request.requestDate), "MMMM d, yyyy")}</span></div>
                            <div className="flex-shrink-0 w-32 text-gray-1"><span>Tier {request.tier}</span></div>
                            <div className="flex-grow-1 flex items-center">
                                <div className="rounded-full bg-yellow-300 w-2 h-2 mr-3"/>
                                <div><span>Pending approval</span></div>
                            </div>
                        </LinkWrapper>
                    ))}
                </>
            ) : (
                <>
                    <p className="text-sm text-gray-1">No requests found.</p>
                </>
            ) : (
                <>
                    <p>Loading...</p>
                </>
            )}
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
    const {user, error} = await supabase.auth.api.getUserByCookie(req);

    if (!user) return ssrRedirect("/auth/signin");

    return {props: {}};
}