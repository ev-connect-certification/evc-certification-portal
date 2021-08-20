import {ModelObj} from "../lib/types";
import DarkSection from "./DarkSection";
import H2 from "./H2";
import ThreeColText from "./ThreeColText";
import Label from "./Label";
import ThreeCol from "./ThreeCol";
import React, {useEffect, useState} from "react";
import {Auth} from "@supabase/ui";
import {supabase} from "../lib/supabaseClient";
import Button from "./Button";
import DownloadButton from "./DownloadButton";

export default function ModelSection({model}: {model: ModelObj}) {
    const {user} = Auth.useUser();

    const {
        connectors,
        isCreditCard,
        cardBrand,
        paymentFeatures,
        powerLevel,
        mountType,
        isConcurrent,
        featureSupport,
        isWifi,
        isSIM,
        isHubSatellite,
        isWSSSingle,
        updateFrequency,
        isImport,
    } = model;

    const [faultCodeFileKey, setFaultCodeFileKey] = useState<string>("");
    const [otherFileKeys, setOtherFileKeys] = useState<string[]>([]);

    useEffect(() => {
        if (user) {
            (async () => {
                const {data: faultCodeData, error: faultCodeError} = await supabase
                    .storage
                    .from("model-files")
                    .list(`${model.manufacturerId}/${model.id}/faultCode`);

                if (faultCodeError) console.log(faultCodeError);

                if (faultCodeData && faultCodeData.length) setFaultCodeFileKey(faultCodeData[0].name);

                const {data, error} = await supabase
                    .storage
                    .from("model-files")
                    .list(`${model.manufacturerId}/${model.id}/other`);

                if (error) console.log(error);

                if (data && data.length) setOtherFileKeys(data.map(d => d.name));
            })();
        }
    }, [user]);

    return (
        <DarkSection key={`model-${model.id}`}>
            <H2>{model.name}</H2>
            <ThreeColText text={{
                "Model Connectivity": isImport ? "Unknown" : isWifi ? isSIM ? "Both" : "WiFi" : "SIM",
                "Does this model need a hub satellite?": isImport ? "Unknown" : isHubSatellite ? "Yes" : "No",
                "Mount Type": mountType.join(", "),
            }} className="my-6"/>
            <ThreeColText text={{
                "Power Level": "Level " + powerLevel,
                "Concurrent charges supported?": isConcurrent ? "Yes" : "No",
                "One webSocket connection per": isImport ? "Unknown" : isWSSSingle ? "Station" : "Connector",
            }} className="my-6"/>
            <hr className="my-6 text-gray-1"/>
            <ThreeColText text={{
                "RFID reader support": isImport ? "Unknown" : featureSupport.includes("rfid") ? "Yes" : "No",
                "Smart charging profiles support": isImport ? "Unknown" : featureSupport.includes("smart") ? "Yes" : "No",
                "Freevend mode support": isImport ? "Unknown" : featureSupport.includes("freevend") ? "Yes" : "No",
            }} className="my-6"/>
            <ThreeColText text={{
                "Throttling support": isImport ? "Unknown" : featureSupport.includes("throttling") ? "Yes" : "No",
                "CTEP/NTEP certification support": isImport ? "Unknown" : featureSupport.includes("ctepOrNtep") ? "Yes" : "No",
                "Daisy-chaining support": isImport ? "Unknown" : featureSupport.includes("daisy") ? "Yes" : "No",
            }} className="my-6"/>
            <hr className="my-6 text-gray-1"/>
            <Label>Connectors ({connectors.length})</Label>
            {connectors.map((d, i) => (
                <DarkSection key={i} light={true}>
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
                <Label>Over-the-air firmware updates</Label>
                <p className="text-sm">{isImport ? "Unknown" : featureSupport.includes("ota") ? "Yes" : "No"}</p>
                <Label>Credit card support</Label>
                <p className="text-sm">{isImport ? "Unknown" : isCreditCard ? "Yes" : "No"}</p>
                {isCreditCard && (
                    <>
                        <Label>Card reader brand</Label>
                        <p className="text-sm">{cardBrand}</p>
                    </>
                )}
            </ThreeCol>
            <ThreeColText text={{
                "NFC support": isImport ? "Unknown" : paymentFeatures.includes("nfc") ? "Yes" : "No",
                "Chip support": isImport ? "Unknown" : paymentFeatures.includes("chip") ? "Yes" : "No",
                "Swipe support": isImport ? "Unknown" : paymentFeatures.includes("swipe") ? "Yes" : "No",
            }} className="my-6"/>
            {updateFrequency && (
                <>
                    <hr className="my-6 text-gray-1"/>
                    <Label className="mb-2">How often are firmware updates for this model?</Label>
                    <p className="text-sm">{isImport ? "Unknown" : updateFrequency}</p>
                </>
            )}
            {faultCodeFileKey && (
                <>
                    <Label className="mb-2 mt-6">Fault code file</Label>
                    <DownloadButton
                        bucketName="model-files"
                        fileKey={faultCodeFileKey}
                        filePath={`${model.manufacturerId}/${model.id}/faultCode/`}
                    />
                </>
            )}
            {!!otherFileKeys.length && (
                <>
                    <Label className="mb-2 mt-6">Manuals, data sheets, and other documents</Label>
                    {otherFileKeys.map(fileKey => (
                        <DownloadButton
                            bucketName="model-files"
                            fileKey={fileKey}
                            filePath={`${model.manufacturerId}/${model.id}/other/`}
                        />
                    ))}
                </>
            )}
        </DarkSection>
    )
}