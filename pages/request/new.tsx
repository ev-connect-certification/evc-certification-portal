import SEO from "../../components/SEO";
import H1 from "../../components/H1";
import H2 from "../../components/H2";
import DarkSection from "../../components/DarkSection";
import Input from "../../components/Input";
import Label from "../../components/Label";
import ThreeCol from "../../components/ThreeCol";
import Select from "../../components/Select";
import {useEffect, useState} from "react";
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
    teamOpts
} from "../../lib/types";
import {supabase} from "../../lib/supabaseClient";
import axios from "axios";
import {getTier} from "../../lib/labels";
import {useRouter} from "next/router";
import {useToasts} from "react-toast-notifications";
import BackLink from "../../components/BackLink";
import TextArea from "../../components/TextArea";
import ReactSelect from "react-select";

const initConnector: ConnectorType = {
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
    const [certificationSupport, setCertificationSupport] = useState<string[]>([]);
    const [featureSupport, setFeatureSupport] = useState<string[]>([]);
    const [updateFrequency, setUpdateFrequency] = useState<string>("");
    const [firmwareInfo, setFirmwareInfo] = useState<string>("");
    const [nextUpdate, setNextUpdate] = useState<string>("");
    const [isFirmwareResponsibility, setIsFirmwareResponsibility] = useState<boolean>(false);
    const [connectors, setConnectors] = useState<ConnectorType[]>([{...initConnector}]);
    const [isWSSSingle, setIsWSSSingle] = useState<boolean>(true);
    const [isConcurrent, setIsConcurrent] = useState<boolean>(false);
    const [powerLevel, setPowerLevel] = useState<powerLevelOpts>("Level 2");
    const [mountType, setMountType] = useState<mountTypeOpts>("Pedestal");
    const [isHubSatellite, setIsHubSatellite] = useState<boolean>(false);
    const [modelConnectivity, setModelConnectivity] = useState<modelConnectivityOpts>("wifi");
    const [modelIds, setModelIds] = useState<number[]>([]);
    const [modelName, setModelName] = useState<string>("test");
    const [manufacturerId, setManufacturerId] = useState<number | null>(null);
    const [cardBrand, setCardBrand] = useState<string>("");
    const [accessCode, setAccessCode] = useState<string>("");
    const [businessValue, setBusinessValue] = useState<string>("");
    const [amountBusiness, setAmountBusiness] = useState<string>("");
    const [urgencyLevel, setUrgencyLevel] = useState<string>("");
    const [tier, setTier] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const {data: ManufacturerData, error: ManufacturerError} = await supabase
                .from<ManufacturerObj>("manufacturers")
                .select("*");

            if (ManufacturerData && ManufacturerData.length) setManufacturers(ManufacturerData);

            setManufacturerId(ManufacturerData[0].id);

            const {data: ModelData, error: ModelError} = await supabase
                .from<ModelObj>("models")
                .select("*");

            if (ModelData && ModelData.length) setModels(ModelData);

            const firstManufacturerModel = ModelData.find(d => d.manufacturerId === ManufacturerData[0].id);

            setModelIds(firstManufacturerModel ? [firstManufacturerModel.id] : []);
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
                certificationSupport,
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
            }
        }

        axios.post("/api/newRequest", postData)
            .then(res => {
                router.push(`/request/${res.data.data.id}`);
                addToast("Request submitted", {appearance: "success", autoDismiss: true});
            })
            .catch(e => alert(e))
            .finally(() => setIsLoading(false));
    }

    const canSubmit = (
        name && email && firmwareVersion && (modelIds.length || modelName) && manufacturerId && accessCode && tier
        && (isHardware ? (
            connectors.length && connectors.every(d => (d.maxPower * d.maxVoltage * d.maxCurrent) > 0)
            && (!isCreditCard || (cardBrand)) && updateFrequency && nextUpdate && isWSS && isOCPP
        ) : (
            firmwareInfo && nextUpdate
        ))
        && (!(team === "sales") || (businessValue && amountBusiness && urgencyLevel))
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
                        <Label>Pre-requisites</Label>
                        <Checkbox
                            id="ocpp"
                            label="Does this model support OCPP 1.6J?"
                            className="my-2"
                            checked={isOCPP}
                            // @ts-ignore
                            onChange={e => setIsOCPP(e.target.checked)}
                        />
                        <Checkbox
                            id="wss"
                            label="Does this model support Secure WebSocket (WSS)?"
                            className="my-2"
                            checked={isWSS}
                            // @ts-ignore
                            onChange={e => setIsWSS(e.target.checked)}
                        />
                        {!(isOCPP && isWSS) && (
                            <p className="text-red-500">Both OCPP and WSS must be supported for certification to be conducted.</p>
                        )}
                        <hr className="my-6 border-gray-2"/>
                        <ThreeCol className="my-6">
                            <Label>Model Connectivity</Label>
                            <Select {...getSelectStateProps(modelConnectivity, setModelConnectivity)}>
                                <option value="wifi">WiFi</option>
                                <option value="sim">SIM</option>
                                <option value="both">Both</option>
                            </Select>
                            <Label>Does this model need a hub satellite?</Label>
                            <Select
                                value={isHubSatellite ? "Yes" : "No"}
                                onChange={e => setIsHubSatellite((e.target as HTMLSelectElement).value === "Yes")}
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Select>
                            <Label>Mount type</Label>
                            <Select {...getSelectStateProps(mountType, setMountType)}>
                                <option value="pedestal">Pedestal</option>
                                <option value="pole">Pole</option>
                                <option value="wall">Wall</option>
                            </Select>
                        </ThreeCol>
                        <ThreeCol className="my-6">
                            <Label>Power Level</Label>
                            <Select  {...getSelectStateProps(powerLevel, setPowerLevel)}>
                                <option value="2">Level 2</option>
                                <option value="3">Level 3</option>
                            </Select>
                            <Label>Concurrent charges supported?</Label>
                            <Select
                                value={isConcurrent ? "Yes" : "No"}
                                onChange={e => setIsConcurrent((e.target as HTMLSelectElement).value === "Yes")}>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Select>
                            <Label>One WebSocket connection per</Label>
                            <Select
                                value={isWSSSingle ? "station" : "connector"}
                                onChange={e => setIsWSSSingle((e.target as HTMLInputElement).value === "station")}
                            >
                                <option value="station">Station</option>
                                <option value="connector">Connector</option>
                            </Select>
                        </ThreeCol>
                        <hr className="my-6 border-gray-2"/>
                        <Label className="mt-8">Feature support (check all that apply):</Label>
                        <div className="grid grid-cols-3 gap-y-2 mt-3">
                            <Checkbox
                                id="rfid"
                                label="RFID readers"
                                {...getCheckboxStateProps(featureSupport, setFeatureSupport, "rfid")}
                            />
                            <Checkbox id="smart" label="Smart charging profiles"
                                {...getCheckboxStateProps(featureSupport, setFeatureSupport, "smart")}
                            />
                            <Checkbox id="freevend" label="Freevend mode"
                                {...getCheckboxStateProps(featureSupport, setFeatureSupport, "freevend")}
                            />
                            <Checkbox id="throttling" label="Throttling"
                                {...getCheckboxStateProps(featureSupport, setFeatureSupport, "throttling")}/>
                            <Checkbox id="ota" label="Over-the-air firmware updates"
                                {...getCheckboxStateProps(featureSupport, setFeatureSupport, "ota")}/>
                            <Checkbox id="daisy" label="Daisy-chaining"
                                {...getCheckboxStateProps(featureSupport, setFeatureSupport, "daisyChaining")}/>
                        </div>
                        <hr className="my-6 border-gray-2"/>
                        <div className="flex items-center">
                            <h3 className="font-bold text-base">Connectors ({connectors.length})</h3>
                            <SecondaryButton onClick={() => {
                                setConnectors([...connectors, {...initConnector}]);
                            }} containerClassName="ml-auto">Add connector</SecondaryButton>
                        </div>
                        {connectors.map((connector, i) => (
                            <DarkSection key={i} light={true}>
                                <ThreeCol>
                                    <Label>Connector Type</Label>
                                    <Select value={connector.type} onChange={e => {
                                        let newConnectors = [...connectors];
                                        const target = e.target as HTMLSelectElement;
                                        newConnectors[i].type = target.value as connectorTypeOpts;
                                        setConnectors(newConnectors);
                                    }}>
                                        {connectorTypes.map(type => (
                                            <option value={type} key={`connector-${i}-${type}`}>{type}</option>
                                        ))}
                                    </Select>
                                    <Label>Connector Format</Label>
                                    <Select value={connector.format} onChange={e => {
                                        let newConnectors = [...connectors];
                                        const target = e.target as HTMLSelectElement;
                                        newConnectors[i].format = target.value as connectorTypeFormatOpts;
                                        setConnectors(newConnectors);
                                    }}>
                                        <option value="cable">Cable</option>
                                        <option value="socket">Socket</option>
                                    </Select>
                                    <Label>Power Type</Label>
                                    <Select value={connector.powerType} onChange={e => {
                                        let newConnectors = [...connectors];
                                        const target = e.target as HTMLSelectElement;
                                        newConnectors[i].powerType = target.value as connectorTypePowerTypeOpts;
                                        setConnectors(newConnectors);
                                    }}>
                                        <option value="DC">DC</option>
                                        <option value="AC_1_PHASE">AC 1 Phase</option>
                                        <option value="AC_3_PHASE">AC 3 Phase</option>
                                    </Select>
                                </ThreeCol>
                                <ThreeCol className="mt-6">
                                    <Label>Max current (A)</Label>
                                    <Input type="number" value={connector.maxCurrent} onChange={e => {
                                        let newConnectors = [...connectors];
                                        const target = e.target as HTMLInputElement;
                                        newConnectors[i].maxCurrent = +target.value;
                                        setConnectors(newConnectors);
                                    }}/>
                                    <Label>Max power (W)</Label>
                                    <Input type="number" value={connector.maxPower} onChange={e => {
                                        let newConnectors = [...connectors];
                                        const target = e.target as HTMLInputElement;
                                        newConnectors[i].maxPower = +target.value;
                                        setConnectors(newConnectors);
                                    }}/>
                                    <Label>Max voltage (V)</Label>
                                    <Input type="number" value={connector.maxVoltage} onChange={e => {
                                        let newConnectors = [...connectors];
                                        const target = e.target as HTMLInputElement;
                                        newConnectors[i].maxVoltage = +target.value;
                                        setConnectors(newConnectors);
                                    }}/>
                                </ThreeCol>
                                <SecondaryButton className="mt-6" onClick={() => {
                                    let newConnectors = [...connectors];
                                    newConnectors.splice(i, 1);
                                    setConnectors(newConnectors);
                                }}>Delete</SecondaryButton>
                            </DarkSection>
                        ))}
                        <hr className="my-6 border-gray-2"/>
                        <Label className="mb-2">Does this model support credit card payments?</Label>
                        <div className="grid grid-cols-2">
                            <Radio
                                id="yes"
                                label="Yes"
                                name="credit-card"
                                checked={isCreditCard}
                                // @ts-ignore
                                onChange={e => setIsCreditCard(e.target.checked)}
                            />
                            <Radio
                                id="no"
                                label="No"
                                name="credit-card"
                                checked={!isCreditCard}
                                // @ts-ignore
                                onChange={e => setIsCreditCard(!e.target.checked)}
                            />
                        </div>
                        {isCreditCard && (
                            <>
                                <Label className="mt-6">What payment features does this model support? (check all that apply)</Label>
                                <div className="grid grid-cols-3 mt-2">
                                    <Checkbox id="nfc" label="NFC"
                                        {...getCheckboxStateProps(paymentFeatures, setPaymentFeatures, "nfc")}/>
                                    <Checkbox id="chip" label="Chip"
                                        {...getCheckboxStateProps(paymentFeatures, setPaymentFeatures, "chip")}/>
                                    <Checkbox id="swipe" label="Swipe"
                                        {...getCheckboxStateProps(paymentFeatures, setPaymentFeatures, "swipe")}/>
                                </div>
                                <Label className="mt-6 mb-2">What brand of card reader is used? (Nayax, Payter, Magtek, etc.)</Label>
                                <Input {...getInputStateProps(cardBrand, setCardBrand)}/>
                            </>
                        )}
                        <hr className="my-6 border-gray-2"/>
                        <Label className="mt-8">Certification support (check all that apply):</Label>
                        <Checkbox id="ctep" label="CTEP certification support" className="my-2"
                            {...getCheckboxStateProps(certificationSupport, setCertificationSupport, "ctep")}
                        />
                        <Checkbox id="ntep" label="NTEP certification support" className="my-2"
                            {...getCheckboxStateProps(certificationSupport, setCertificationSupport, "ntep")}/>
                        <hr className="my-6 border-gray-2"/>
                        <Label className="mt-8 mb-2">How often are firmware updates for this model?</Label>
                        <Input
                            value={updateFrequency}
                            onChange={e => setUpdateFrequency((e.target as HTMLInputElement).value)}
                        />
                    </>
                ) : (
                    <>
                        <Label className="mb-2">What has been updated in the firmware?</Label>
                        <TextArea
                            value={firmwareInfo}
                            onChange={e => setFirmwareInfo((e.target as HTMLInputElement).value)}
                        />
                        <Label className="mt-6 mb-2">When is the next firmware update?</Label>
                        <Input
                            type="date"
                            value={nextUpdate}
                            onChange={e => setNextUpdate((e.target as HTMLInputElement).value)}
                        />
                        <Label className="mt-6 mb-2">Will you be responsible for doing all over-the-air firmware updates?</Label>
                        <div className="grid grid-cols-2">
                            <Radio
                                id="ota-res-yes"
                                label="Yes"
                                name="ota-responsibility"
                                checked={isFirmwareResponsibility}
                                onChange={e => setIsFirmwareResponsibility((e.target as HTMLInputElement).checked)}
                            />
                            <Radio
                                id="ota-res-no"
                                label="No"
                                name="ota-responsibility"
                                checked={!isFirmwareResponsibility}
                                onChange={e => setIsFirmwareResponsibility(!(e.target as HTMLInputElement).checked)}
                            />
                        </div>
                    </>
                )}
            </DarkSection>
            {isHardware && (
                <>
                    <H2>Model documents</H2>
                    <DarkSection>
                        <Label>Fault codes</Label>
                        <p className="mb-2 text-gray-1">Fill in <a href="" className="underline">this spreadsheet template</a> as described on the previous page</p>
                        <Input type="file" accept=".xls,.xlsx"/>
                        <Label className="mt-6">Manuals</Label>
                        <p className="mb-2 text-gray-1">Upload any installation or usage manuals related to this model</p>
                        <Input type="file" multiple/>
                        <Label className="mt-6">Data/spec sheets</Label>
                        <p className="mb-2 text-gray-1">Upload any data or spec sheets for this model</p>
                        <Input type="file"/>
                        <Label className="mt-6">Certificates</Label>
                        <p className="mb-2 text-gray-1">Upload any third-party certification certificates for this model</p>
                        <Input type="file"/>
                    </DarkSection>
                </>
            )}
            {team === "sales" && (
                <>
                    <H2>Sales information</H2>
                    <DarkSection>
                        <Label className="mb-2">Is the contract and PO signed?</Label>
                        <div className="grid grid-cols-2">
                            <Radio id="contract-yes" label="Yes" name="contract"/>
                            <Radio id="contract-no" label="No" name="contract"/>
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
                        <Input type="date"/>
                    </DarkSection>
                </>
            )}
            <H2>Access code</H2>
            <DarkSection>
                <Label>Access code</Label>
                <p className="text-gray-1">To request an access code, send an email to <a href="mailto:contact@evconnect.com" className="underline">contact@evconnect.com</a>.</p>
                <Input className="mt-2" {...getInputStateProps(accessCode, setAccessCode)}/>
            </DarkSection>
            <PrimaryButton disabled={!canSubmit} onClick={onSubmit}>Submit</PrimaryButton>
        </div>
    );
}