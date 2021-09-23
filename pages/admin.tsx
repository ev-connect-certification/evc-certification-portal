import SEO from "../components/SEO";
import H1 from "../components/H1";
import React, {useEffect, useState} from "react";
import {GetServerSideProps} from "next";
import {supabase} from "../lib/supabaseClient";
import {ssrRedirect} from "../lib/apiResponses";
import Label from "../components/Label";
import PrimaryButton from "../components/PrimaryButton";
import Input from "../components/Input";
import ThreeCol from "../components/ThreeCol";
import {useToasts} from "react-toast-notifications";
import {getInputStateProps, getSelectStateProps} from "../lib/statePropUtils";
import H2 from "../components/H2";
import Select from "../components/Select";
import {
    CertificationRequestObj,
    ConnectorType, featureSupportOpts,
    ManufacturerObj,
    modelConnectivityOpts,
    ModelObj,
    mountTypeOpts, paymentFeaturesOpts,
    powerLevelOpts, TestObj
} from "../lib/types";
import ReactSelect from "react-select";
import {initConnector} from "./request/new";
import NewHardware from "../components/NewHardware";
import DarkSection from "../components/DarkSection";
import generator, {generate} from "generate-password";
import {supabaseAdmin} from "../lib/supabaseAdmin";
import NewFirmware from "../components/NewFirmware";

export default function Admin() {
    const {addToast} = useToasts();
    const [manufacturerName, setManufacturerName] = useState<string>("");
    const [addManufacturerLoading, setAddManufacturerLoading] = useState<boolean>(false);
    const [modelIds, setModelIds] = useState<number[]>([]);
    const [firmwareVersion, setFirmwareVersion] = useState<string>("");

    // new firmware version
    const [manufacturerId, setManufacturerId] = useState<number>(null);
    const [manufacturers, setManufacturers] = useState<ManufacturerObj[]>([]);
    const [models, setModels] = useState<ModelObj[]>([]);
    const [addFirmwareLoading, setAddFirmwareLoading] = useState<boolean>(false);
    const [firmwareInfo, setFirmwareInfo] = useState<string>("");
    const [nextUpdate, setNextUpdate] = useState<string>("");
    const [isFirmwareResponsibility, setIsFirmwareResponsibility] = useState<boolean>(false);

    // new model
    const [modelName, setModelName] = useState<string>("");
    const [addModelLoading, setAddModelLoading] = useState<boolean>(false);
    const [isOCPP, setIsOCPP] = useState<boolean>(false);
    const [isWSS, setIsWSS] = useState<boolean>(false);
    const [isCreditCard, setIsCreditCard] = useState<boolean>(false);
    const [paymentFeatures, setPaymentFeatures] = useState<string[]>([]);
    const [featureSupport, setFeatureSupport] = useState<string[]>([]);
    const [updateFrequency, setUpdateFrequency] = useState<string>("");
    const [connectors, setConnectors] = useState<ConnectorType[]>([{...initConnector}]);
    const [isWSSSingle, setIsWSSSingle] = useState<boolean>(true);
    const [isConcurrent, setIsConcurrent] = useState<boolean>(false);
    const [powerLevel, setPowerLevel] = useState<powerLevelOpts>("Level 2");
    const [mountType, setMountType] = useState<mountTypeOpts[]>(["Pedestal"]);
    const [isHubSatellite, setIsHubSatellite] = useState<boolean>(false);
    const [modelConnectivity, setModelConnectivity] = useState<modelConnectivityOpts>("wifi");
    const [cardBrand, setCardBrand] = useState<string>("");

    const selectModelOptions = models
        .filter(d => d.manufacturerId === manufacturerId)
        .map(d => ({label: d.name, value: d.id.toString()}));

    useEffect(() => {
        (async () => {
            const {data: ManufacturerData, error: ManufacturerError} = await supabase
                .from<ManufacturerObj>("manufacturers")
                .select("*")
                .order("name");

            if (ManufacturerData && ManufacturerData.length) setManufacturers(ManufacturerData);

            setManufacturerId(ManufacturerData[0].id);

            const {data: ModelData, error: ModelError} = await supabase
                .from<ModelObj>("models")
                .select("*");

            if (ModelData && ModelData.length) setModels(ModelData);
        })();
    }, []);

    async function onAddManufacturer() {
        setAddManufacturerLoading(true);

        const {data, error} = await supabase.from("manufacturers")
            .insert([{name: manufacturerName}]);

        setAddManufacturerLoading(false);

        if (error) addToast(error.message, {appearance: "error", autoDismiss: true});
        else {
            addToast("Manufacturer successfully added", {appearance: "success", autoDismiss: true});
            setManufacturerName("");
        }
    }

    async function onAddModel() {
        setAddModelLoading(true);

        try {
            const {data, error} = await supabase
                .from<ModelObj>("models")
                .insert([
                    {
                        manufacturerId: manufacturerId,
                        name: modelName,
                        connectors: connectors,
                        isCreditCard: isCreditCard,
                        cardBrand: cardBrand,
                        paymentFeatures: paymentFeatures as paymentFeaturesOpts[] || [],
                        powerLevel: powerLevel,
                        mountType: mountType,
                        isConcurrent: isConcurrent,
                        featureSupport: featureSupport as featureSupportOpts[] || [],
                        isWifi: ["wifi", "both"].includes(modelConnectivity),
                        isSIM: ["sim", "both"].includes(modelConnectivity),
                        isHubSatellite: isHubSatellite,
                        isWSSSingle: isWSSSingle,
                        updateFrequency: updateFrequency,
                    }
                ]);

            if (error) throw error;

            if (!(data && data.length)) throw new Error("Failed to add model");

            addToast("Added model", {appearance: "success", autoDismiss: true});

            setModelName("");
            setConnectors([]);
            setCardBrand("");
            setPaymentFeatures([]);
            setFeatureSupport([]);
            setUpdateFrequency("");
        } catch (e) {
            addToast(e.message, {appearance: "error", autoDismiss: true});
        }
    }

    async function onAddFirmware() {
        setAddFirmwareLoading(true);

        try {
            const {data, error} = await supabase
                .from<CertificationRequestObj>("requests")
                .insert([
                    {
                        isHardware: false,
                        requesterName: "Historical",
                        requesterEmail: "certification@evconnect.com",
                        requesterTeam: "other",
                        firmwareVersion,
                        tier: 1,
                        manufacturerId,
                        firmwareInfo,
                        nextUpdate,
                        isFirmwareResponsibility,
                        accessCode: generator.generate({length: 6, numbers: true,}),

                    }
                ]);

            if (error) throw error;

            if (!(data && data.length)) throw "Failed to create model";

            const {data: linkData, error: linkError} = await supabase
                .from("requestModelLinks")
                .insert(modelIds.map(d => ({
                    modelId: d,
                    requestId: data[0].id,
                })));

            if (linkError) throw linkError;

            const {data: testData, error: testError} = await supabase
                .from<TestObj>("tests")
                .insert([
                    {
                        accessCode: generate({length: 6, numbers: true}),
                        requestId: data[0].id,
                        status: "pass",
                        results: [],
                    }
                ]);

            if (testError) throw testError;

            setAddFirmwareLoading(false);
            addToast("Successfully added firmware", {appearance: "success", autoDismiss: true});
            setFirmwareVersion("");
            setModelIds([]);
        } catch (e) {
            addToast(e.message, {appearance: "error", autoDismiss: true});
        }
    }

    const canSubmitFirmware = (
        firmwareVersion && modelIds.length && manufacturerId && firmwareInfo && nextUpdate
    );

    const canSubmitModel = (
        modelName && manufacturerId && connectors.length && connectors.every(d => (d.maxPower * d.maxVoltage * d.maxCurrent) > 0)
        && (!isCreditCard || (cardBrand)) && updateFrequency && isWSS && isOCPP
    )

    return (
        <div className="max-w-3xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <H1>Admin management portal</H1>
            <H2 className="mt-6 mb-4">Add manufacturer</H2>
            <div className="flex items-end w-full">
                <div className="flex-grow-1 w-full">
                    <Label className="mb-2">Manufacturer name</Label>
                    <Input {...getInputStateProps(manufacturerName, setManufacturerName)}/>
                </div>
                <PrimaryButton
                    onClick={onAddManufacturer}
                    className="mt-2 ml-2"
                    isLoading={addManufacturerLoading}
                >Add</PrimaryButton>
            </div>
            <hr className="my-8"/>
            <H2 className="mb-4">Add firmware</H2>
            <ThreeCol>
                <Label>Manufacturer</Label>
                <Select {...getSelectStateProps(manufacturerId ? manufacturerId.toString() : "", d => setManufacturerId(+d))}>
                    {manufacturers.map(d => (
                        <option value={d.id} key={`manufacturer-option-${d.id}`}>{d.name}</option>
                    ))}
                </Select>
                <Label className="col-span-2">Firmware version</Label>
                <Input className="col-span-2" {...getInputStateProps(firmwareVersion, setFirmwareVersion)}/>
            </ThreeCol>
            <Label className="mt-6 mb-2">Models</Label>
            <ReactSelect
                isMulti={true}
                options={selectModelOptions}
                onChange={(newValue) => setModelIds(newValue.map(d => +d.value))}
                value={selectModelOptions.filter(d => modelIds.includes(+d.value))}
            />
            <hr className="my-3 invisible"/>
            <NewFirmware
                firmwareInfo={firmwareInfo}
                setFirmwareInfo={setFirmwareInfo}
                nextUpdate={nextUpdate}
                setNextUpdate={setNextUpdate}
                isFirmwareResponsibility={isFirmwareResponsibility}
                setIsFirmwareResponsibility={setIsFirmwareResponsibility}
            />
            <PrimaryButton disabled={!canSubmitFirmware} onClick={onAddFirmware} isLoading={addFirmwareLoading} className="mt-6">Add</PrimaryButton>
            <hr className="my-8"/>
            <H2 className="mb-4">Add model</H2>
            <Label className="mb-2">Manufacturer</Label>
            <Select {...getSelectStateProps(manufacturerId ? manufacturerId.toString() : "", d => setManufacturerId(+d))}>
                {manufacturers.map(d => (
                    <option value={d.id} key={`manufacturer-option-${d.id}`}>{d.name}</option>
                ))}
            </Select>
            <Label className="mt-6 mb-2">Model name</Label>
            <Input {...getInputStateProps(modelName, setModelName)}/>
            <DarkSection>
                <NewHardware
                    isOCPP={isOCPP}
                    setIsOCPP={setIsOCPP}
                    isWSS={isWSS}
                    setIsWSS={setIsWSS}
                    isCreditCard={isCreditCard}
                    setIsCreditCard={setIsCreditCard}
                    paymentFeatures={paymentFeatures}
                    setPaymentFeatures={setPaymentFeatures}
                    featureSupport={featureSupport}
                    setFeatureSupport={setFeatureSupport}
                    updateFrequency={updateFrequency}
                    setUpdateFrequency={setUpdateFrequency}
                    connectors={connectors}
                    setConnectors={setConnectors}
                    isWSSSingle={isWSSSingle}
                    setIsWSSSingle={setIsWSSSingle}
                    isConcurrent={isConcurrent}
                    setIsConcurrent={setIsConcurrent}
                    powerLevel={powerLevel}
                    setPowerLevel={setPowerLevel}
                    mountType={mountType}
                    setMountType={setMountType}
                    isHubSatellite={isHubSatellite}
                    setIsHubSatellite={setIsHubSatellite}
                    cardBrand={cardBrand}
                    setCardBrand={setCardBrand}
                    modelConnectivity={modelConnectivity}
                    setModelConnectivity={setModelConnectivity}
                />
            </DarkSection>
            <PrimaryButton
                onClick={onAddModel}
                isLoading={addManufacturerLoading}
                disabled={!canSubmitModel}
            >Add</PrimaryButton>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
    const {user, error} = await supabase.auth.api.getUserByCookie(req);

    if (!user) return ssrRedirect("/auth/signin");

    return {props: {}};
}