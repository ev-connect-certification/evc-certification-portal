import {GetServerSideProps} from "next";
import {supabaseAdmin} from "../../lib/supabaseAdmin";
import {CertificationRequestObj, ManufacturerObj, ModelObj} from "../../lib/types";
import SEO from "../../components/SEO";
import LinkWrapper from "../../components/LinkWrapper";
import {FiArrowLeft} from "react-icons/fi";
import H1 from "../../components/H1";
import H2 from "../../components/H2";
import ThreeCol from "../../components/ThreeCol";
import Label from "../../components/Label";
import {getTeam, getTier} from "../../lib/labels";
import React from "react";
import DarkSection from "../../components/DarkSection";
import AnchorLink from "react-anchor-link-smooth-scroll";
import {Auth} from "@supabase/ui";

const ThreeColText = ({text, className}: {text: { [key: string]: string }, className?: string}) => {
    return (
        <ThreeCol className={className || ""}>
            {Object.entries(text).map(([key, value]) => (
                <React.Fragment key={key}>
                    <Label>{key}</Label>
                    <p className="text-sm">{value}</p>
                </React.Fragment>
            ))}
        </ThreeCol>
    );
};

export default function RequestPage({requestObj}: {requestObj: CertificationRequestObj & {models: ModelObj} & {manufacturers: ManufacturerObj}}) {
    const {
        connectors,
        isCreditCard,
        cardBrand,
        paymentFeatures,
        powerLevel,
        mountType,
        isConcurrent,
        certificationSupport,
        featureSupport,
        isWifi,
        isSIM,
        isHubSatellite,
        isWSSSingle,
        updateFrequency,
    } = requestObj.models;

    const {user} = Auth.useUser();

    return (
        <div className="max-w-5xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            {user && (
                <LinkWrapper className="flex items-center font-bold text-gray-1 mb-4" href="/request/all">
                    <FiArrowLeft/>
                    <div className="ml-2"><span>All requests</span></div>
                </LinkWrapper>
            )}
            <H1 className="mb-4">Request: {requestObj.manufacturers.name} {requestObj.models.name} @ {requestObj.firmwareVersion}</H1>
            <div className="flex items-stretch mt-6">
                <div className="w-64 border-r pr-6 mr-6">
                    <div className="sticky top-16">
                        {["timeline", "requesterInfo", "requestDetails", "modelInfo"].map(d => (
                            <p className="text-sm mb-3 text-gray-1">
                                <AnchorLink href={`#${d}`} offset={56}>{{
                                    timeline: "Timeline and results",
                                    requesterInfo: "Requester info",
                                    requestDetails: "Request details",
                                    modelInfo: "Model info",
                                }[d]}</AnchorLink>
                            </p>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <H2 id="timeline">Timeline and results</H2>
                    <hr className="my-12 text-gray-1"/>
                    <H2 id="requesterInfo">Requester information</H2>
                    <ThreeColText text={{
                        Name: requestObj.requesterName,
                        Email: requestObj.requesterEmail,
                        Team: getTeam(requestObj.requesterTeam),
                    }} className="my-6"/>
                    <hr className="my-12 text-gray-1"/>
                    <H2 id="requestDetails">Request details</H2>
                    <ThreeColText text={{
                        Manufacturer: requestObj.manufacturers.name,
                        Model: requestObj.models.name,
                    }} className="my-6"/>
                    {/*<hr className="my-6 text-gray-1"/>*/}
                    <ThreeColText text={{
                        Type: requestObj.isHardware ? "New hardware" : "New software",
                        "Firmware Version": requestObj.firmwareVersion,
                        "Certification Tier": getTier(requestObj.tier),
                    }} className="my-6"/>
                    {!requestObj.isHardware && (
                        <>
                            <hr className="my-6 text-gray-1"/>
                            <Label className="mb-2">What's new in this firmware version?</Label>
                            <p className="text-sm">{requestObj.firmwareInfo}</p>
                            <ThreeCol className="my-6">
                                <Label>When is the next firmware update?</Label>
                                <p className="text-sm">{requestObj.nextUpdate}</p>
                                <Label className="col-span-2">Will you be responsible for doing all over-the-air firmware updates?</Label>
                                <p className="text-sm">{requestObj.isFirmwareResponsibility ? "Yes" : "No"}</p>
                            </ThreeCol>
                        </>
                    )}
                    <hr className="my-12 text-gray-1"/>
                    <H2 id="modelInfo">Model information</H2>
                    <ThreeColText text={{
                        "Model Connectivity": isWifi ? isSIM ? "Both" : "WiFi" : "SIM",
                        "Does this model need a hub satellite?": isHubSatellite ? "Yes" : "No",
                        "Mount Type": mountType,
                    }} className="my-6"/>
                    <ThreeColText text={{
                        "Power Level": "Level " + powerLevel,
                        "Concurrent charges supported?": isConcurrent ? "Yes" : "No",
                        "One webSocket connection per": isWSSSingle ? "Station" : "Connector",
                    }} className="my-6"/>
                    <hr className="my-6 text-gray-1"/>
                    <ThreeColText text={{
                        "RFID reader support": featureSupport.includes("rfid") ? "Yes" : "No",
                        "Smart charging profiles support": featureSupport.includes("smart") ? "Yes" : "No",
                        "Freevend mode support": featureSupport.includes("freevend") ? "Yes" : "No",
                    }} className="my-6"/>
                    <ThreeColText text={{
                        "Throttling support": featureSupport.includes("throttling") ? "Yes" : "No",
                        "Over-the-air firmware update support": featureSupport.includes("ota") ? "Yes" : "No",
                        "Daisy-chaining support": featureSupport.includes("daisy") ? "Yes" : "No",
                    }} className="my-6"/>
                    <hr className="my-6 text-gray-1"/>
                    <Label>Connectors ({connectors.length})</Label>
                    {connectors.map((d, i) => (
                        <DarkSection key={i}>
                            <ThreeColText text={{
                                "Connector Type": d.type,
                                "Connector Format": d.format.substr(0, 1).toUpperCase() + d.format.substr(1),
                                "Power Type": d.powerType,
                            }} className="mb-6"/>
                            <ThreeColText text={{
                                "Max current (A)": d.maxCurrent + " A",
                                "Max power (W)": d.maxPower + " W",
                                "Max voltage (V)": d.maxVoltage + " V",
                            }} className="mt-6"/>
                        </DarkSection>
                    ))}
                    <hr className="my-6 text-gray-1"/>
                    <ThreeCol>
                        <Label>Credit card support?</Label>
                        <p className="text-sm">{isCreditCard ? "Yes" : "No"}</p>
                        {isCreditCard && (
                            <>
                                <Label>Card reader brand</Label>
                                <p className="text-sm">{cardBrand}</p>
                            </>
                        )}
                    </ThreeCol>
                    <ThreeColText text={{
                        "NFC support": paymentFeatures.includes("nfc") ? "Yes" : "No",
                        "Chip support": paymentFeatures.includes("chip") ? "Yes" : "No",
                        "Swipe support": paymentFeatures.includes("swipe") ? "Yes" : "No",
                    }} className="my-6"/>
                    <hr className="my-6 text-gray-1"/>
                    <ThreeColText text={{
                        "NTEP certification": certificationSupport.includes("ntep") ? "Yes" : "No",
                        "CTEP certification": certificationSupport.includes("ctep") ? "Yes" : "No",
                    }} className="my-6"/>
                    {updateFrequency && (
                        <>
                            <hr className="my-6 text-gray-1"/>
                            <Label className="mb-2">How often are firmware updates for this model?</Label>
                            <p className="text-sm">{updateFrequency}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const {id} = params;

    if (!id || isNaN(Number(id))) return {notFound: true};

    const {data, error} = await supabaseAdmin
        .from<CertificationRequestObj>("requests")
        .select("*, models (*), manufacturers (*)")
        .eq("id", +id);

    console.log(data, error);

    if (error) return {notFound: true};

    if (!(data && data.length)) return {notFound: true};

    return {props: {requestObj: data[0]}};
}