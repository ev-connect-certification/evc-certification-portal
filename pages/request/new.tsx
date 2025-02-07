import SEO from "../../components/SEO";
import H1 from "../../components/H1";
import H2 from "../../components/H2";
import DarkSection from "../../components/DarkSection";
import Input from "../../components/Input";
import Label from "../../components/Label";
import ThreeCol from "../../components/ThreeCol";
import Select from "../../components/Select";
import React, {useEffect, useRef, useState} from "react";
import Checkbox from "../../components/Checkbox";
import Radio from "../../components/Radio";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import {getCheckboxStateProps, getInputStateProps, getSelectStateProps} from "../../lib/statePropUtils";
import {
    ConnectorType,
    connectorTypeFormatOpts,
    connectorTypeOpts,
    connectorTypePowerTypeOpts,
    connectorTypes,
    ManufacturerObj,
    modelConnectivityOpts,
    ModelObj,
    mountTypeOpts,
    powerLevelOpts,
    teamOpts,
    urgencyLevelOpts
} from "../../lib/types";
import {supabase} from "../../lib/supabaseClient";
import axios from "axios";
import {getTier} from "../../lib/labels";
import {useRouter} from "next/router";
import {useToasts} from "react-toast-notifications";
import BackLink from "../../components/BackLink";
import TextArea from "../../components/TextArea";
import ReactSelect from "react-select";
import NewHardware from "../../components/NewHardware";
import NewFirmware from "../../components/NewFirmware";

export const initConnector: ConnectorType = {
    type: "CCS",
    format: "cable",
    powerType: "DC",
    maxPower: 0,
    maxVoltage: 0,
    maxCurrent: 0,
};

export default function RequestPage() {
    const router = useRouter();
    const {addToast} = useToasts();
    const [manufacturers, setManufacturers] = useState<ManufacturerObj[]>([]);
    const [models, setModels] = useState<ModelObj[]>([]);
    const [team, setTeam] = useState<teamOpts>("manufacturer");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [firmwareVersion, setFirmwareVersion] = useState<string>("");
    const [isHardware, setIsHardware] = useState<boolean>(false);
    const [isOCPP, setIsOCPP] = useState<boolean>(false);
    const [isWSS, setIsWSS] = useState<boolean>(false);
    const [isCreditCard, setIsCreditCard] = useState<boolean>(false);
    const [paymentFeatures, setPaymentFeatures] = useState<string[]>([]);
    const [featureSupport, setFeatureSupport] = useState<string[]>([]);
    const [updateFrequency, setUpdateFrequency] = useState<string>("");
    const [firmwareInfo, setFirmwareInfo] = useState<string>("");
    const [nextUpdate, setNextUpdate] = useState<string>("");
    const [isFirmwareResponsibility, setIsFirmwareResponsibility] = useState<boolean>(false);
    const [connectors, setConnectors] = useState<ConnectorType[]>([{...initConnector}]);
    const [isWSSSingle, setIsWSSSingle] = useState<boolean>(true);
    const [isConcurrent, setIsConcurrent] = useState<boolean>(false);
    const [powerLevel, setPowerLevel] = useState<powerLevelOpts>("Level 2");
    const [mountType, setMountType] = useState<mountTypeOpts[]>(["Pedestal"]);
    const [isHubSatellite, setIsHubSatellite] = useState<boolean>(false);
    const [modelConnectivity, setModelConnectivity] = useState<modelConnectivityOpts>("wifi");
    const [modelIds, setModelIds] = useState<number[]>([]);
    const [modelName, setModelName] = useState<string>("");
    const [manufacturerId, setManufacturerId] = useState<number | null>(null);
    const [cardBrand, setCardBrand] = useState<string>("");
    const [accessCode, setAccessCode] = useState<string>("");
    const [businessValue, setBusinessValue] = useState<string>("");
    const [amountBusiness, setAmountBusiness] = useState<string>("");
    const [urgencyLevel, setUrgencyLevel] = useState<urgencyLevelOpts>("high");
    const [isContractSigned, setIsContractSigned] = useState<boolean>(false);
    const [shipDate, setShipDate] = useState<string>("");
    const [tier, setTier] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fileIter, setFileIter] = useState<number>(0);

    const faultCodeFileUploadRef = useRef<HTMLInputElement>(null);
    const otherFilesUploadRef = useRef<HTMLInputElement>(null);

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

            const firstManufacturerModel = ModelData.find(d => d.manufacturerId === ManufacturerData[0].id);
        })();
    }, []);

    function onSubmit() {
        setIsLoading(true);

        let postData: any = {
            accessCode: accessCode,
            name: name,
            email: email,
            team: team,
            firmwareVersion: firmwareVersion,
            manufacturerId: manufacturerId,
            tier: tier,
            isHardware: isHardware,
        }

        if (isHardware) {
            postData = {
                ...postData,
                modelName,
                connectors,
                isCreditCard,
                cardBrand,
                paymentFeatures,
                powerLevel,
                mountType,
                isConcurrent,
                isHubSatellite,
                isWSSSingle,
                featureSupport,
                updateFrequency,
                isWifi: ["wifi", "both"].includes(modelConnectivity),
                isSIM: ["sim", "both"].includes(modelConnectivity),
            }
        } else {
            postData = {
                ...postData,
                modelIds: modelIds,
                firmwareInfo: firmwareInfo,
                nextUpdate: nextUpdate,
                isFirmwareResponsibility: isFirmwareResponsibility,
            }
        }

        if (team === "sales") {
            postData = {
                ...postData,
                businessValue,
                amountBusiness,
                urgencyLevel,
                shipDate,
                isContractSigned,
            }
        }

        axios.post("/api/newRequest", postData)
            .then(res => {
                if (isHardware) {
                    const formData = new FormData();
                    formData.append("faultCode", faultCodeFileUploadRef.current.files[0]);

                    for (let i = 0; i < otherFilesUploadRef.current.files.length; i++) {
                        formData.append("otherFiles", otherFilesUploadRef.current.files.item(i));
                    }

                    axios
                        .post(
                        `/api/uploadModelFiles?manufacturerId=${manufacturerId}&modelId=${res.data.modelIds[0]}&accessCode=${accessCode}`,
                            formData
                        )
                        .catch(e => {
                            addToast(`File upload failed with error: ${e}`, {appearance: "error", autoDismiss: true});
                        })
                        .finally(() => {
                            router.push(`/request/${res.data.data.id}`);
                            addToast("Request submitted", {appearance: "success", autoDismiss: true});
                        });
                } else {
                    router.push(`/request/${res.data.data.id}`);
                    addToast("Request submitted", {appearance: "success", autoDismiss: true});
                }
            })
            .catch(e => alert(e))
            .finally(() => setIsLoading(false));
    }

    const canSubmit = (
        name && email && firmwareVersion && (modelIds.length || modelName) && manufacturerId && tier
        && (isHardware ? (
            connectors.length && connectors.every(d => (d.maxPower * d.maxVoltage * d.maxCurrent) > 0)
            && (!isCreditCard || (cardBrand)) && updateFrequency && isWSS && isOCPP
            && faultCodeFileUploadRef.current && faultCodeFileUploadRef.current.files[0]
        ) : (
            firmwareInfo && nextUpdate
        ))
        && (team !== "sales" || (businessValue && amountBusiness && urgencyLevel && shipDate))
    );

    const selectModelOptions = models
        .filter(d => d.manufacturerId === manufacturerId)
        .map(d => ({label: d.name, value: d.id.toString()}));

    return (
        <div className="max-w-3xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <BackLink href="/request/info">Back</BackLink>
            <H1 className="mb-4">Request new certification</H1>
            <H2>Requester information</H2>
            <DarkSection>
                <ThreeCol>
                    <Label>Name</Label>
                    <Input
                        placeholder="Enter your name"
                        {...getInputStateProps(name, setName)}
                    />
                    <Label>Email</Label>
                    <Input
                        placeholder="Enter your email"
                        {...getInputStateProps(email, setEmail)}
                    />
                    <Label>Team</Label>
                    <Select {...getSelectStateProps(team, setTeam)}>
                        <option value="manufacturer">Hardware Partner</option>
                        <option value="sales">EVC Sales</option>
                        <option value="other">Other</option>
                    </Select>
                </ThreeCol>
            </DarkSection>
            <H2>Request information</H2>
            <DarkSection>
                <ThreeCol className="mb-6">
                    <Label>Request type</Label>
                    <Select {...getSelectStateProps(isHardware ? "hardware" : "firmware", d => setIsHardware(d === "hardware"))}>
                        <option value="hardware">New hardware</option>
                        <option value="firmware">New firmware</option>
                    </Select>
                    <Label>Manufacturer</Label>
                    <Select {...getSelectStateProps(manufacturerId ? manufacturerId.toString() : "", d => setManufacturerId(+d))}>
                        {manufacturers.map(d => (
                            <option value={d.id} key={`manufacturer-option-${d.id}`}>{d.name}</option>
                        ))}
                    </Select>
                    <Label>Firmware Version</Label>
                    <Input {...getInputStateProps(firmwareVersion, setFirmwareVersion)}/>
                </ThreeCol>
                <Label className="mb-2">Model{isHardware ? "" : "s"}</Label>
                {isHardware ? (
                    <Input {...getInputStateProps(modelName, setModelName)}/>
                ) : (
                    <ReactSelect
                        isMulti={true}
                        options={selectModelOptions}
                        onChange={(newValue) => setModelIds(newValue.map(d => +d.value))}
                        value={selectModelOptions.filter(d => modelIds.includes(+d.value))}
                    />
                )}
                <Label className="mb-2 mt-6">Certification tier</Label>
                <Select {...getSelectStateProps(tier.toString(), d => setTier(+d))}>
                    {Array(5).fill(0).map((d, i) => (
                        <option value={i + 1} key={i}>{getTier(i + 1)}</option>
                    ))}
                </Select>
                <hr className="my-6 border-gray-2"/>
                {isHardware ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <NewFirmware
                            firmwareInfo={firmwareInfo}
                            setFirmwareInfo={setFirmwareInfo}
                            nextUpdate={nextUpdate}
                            setNextUpdate={setNextUpdate}
                            isFirmwareResponsibility={isFirmwareResponsibility}
                            setIsFirmwareResponsibility={setIsFirmwareResponsibility}
                        />
                    </>
                )}
            </DarkSection>
            {isHardware && (
                <>
                    <H2>Model documents</H2>
                    <DarkSection>
                        <Label>Fault codes (required)</Label>
                        <p className="mb-2 text-gray-1">Fill in <a href="https://evconnect-my.sharepoint.com/:x:/p/szhang1/EQuB6J-A3uNGnJDxEfFJh70BbGs-R37l4SV0VfbDT9LaAg?e=SKgiwj" className="underline">this spreadsheet template</a> as described on the previous page</p>
                        <input type="file" accept=".xlsx" ref={faultCodeFileUploadRef} onChange={() => setFileIter(fileIter + 1)}/>
                        <Label className="mt-6">Manuals and data sheets (optional)</Label>
                        <p className="mb-2 text-gray-1">Upload any installation/usage manuals or data/spec sheets related to this model</p>
                        <input type="file" multiple ref={otherFilesUploadRef}/>
                    </DarkSection>
                </>
            )}
            {team === "sales" && (
                <>
                    <H2>Sales information</H2>
                    <DarkSection>
                        <Label className="mb-2">Is the contract and PO signed?</Label>
                        <div className="grid grid-cols-2">
                            <Radio
                                id="contract-yes"
                                label="Yes"
                                name="contract"
                                checked={isContractSigned}
                                onChange={e => setIsContractSigned((e.target as HTMLInputElement).checked)}
                            />
                            <Radio
                                id="contract-no" label="No" name="contract"
                                checked={!isContractSigned}
                                onChange={e => setIsContractSigned(!(e.target as HTMLInputElement).checked)}
                            />
                        </div>
                        <ThreeCol className="my-6">
                            <Label>Business value of selling the unit?</Label>
                            <Input {...getInputStateProps(businessValue, setBusinessValue)}/>
                            <Label>What is the amount of business?</Label>
                            <Input {...getInputStateProps(amountBusiness, setAmountBusiness)}/>
                            <Label>Urgency level for certification</Label>
                            <Select {...getSelectStateProps(urgencyLevel, setUrgencyLevel)}>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </Select>
                        </ThreeCol>
                        <Label className="mb-2">When are units planned on being shipped?</Label>
                        <Input type="date" {...getInputStateProps(shipDate, setShipDate)}/>
                    </DarkSection>
                </>
            )}
            <PrimaryButton disabled={!canSubmit} onClick={onSubmit}>Submit</PrimaryButton>
        </div>
    );
}