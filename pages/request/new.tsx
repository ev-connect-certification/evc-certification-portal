import SEO from "../../components/SEO";
import H1 from "../../components/H1";
import HomeLinkWrapper from "../../components/HomeLinkWrapper";
import {FiArrowLeft} from "react-icons/fi";
import H2 from "../../components/H2";
import DarkSection from "../../components/DarkSection";
import Input from "../../components/Input";
import Label from "../../components/Label";
import ThreeCol from "../../components/ThreeCol";
import Select from "../../components/Select";
import {Dispatch, FormEvent, SetStateAction, useEffect, useState} from "react";
import Checkbox from "../../components/Checkbox";
import Radio from "../../components/Radio";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import {getCheckboxStateProps, getInputStateProps, getSelectStateProps} from "../../lib/statePropUtils";
import LinkWrapper from "../../components/LinkWrapper";

type connectorTypeFormatOpts = "cable" | "socket";
type connectorTypePowerTypeOpts = "DC" | "AC_1_PHASE" | "AC_3_PHASE";

interface ConnectorType {
    type: string,
    format: connectorTypeFormatOpts,
    powerType: connectorTypePowerTypeOpts,
    maxPower: number,
    maxVoltage: number,
    maxCurrent: number,
};

const initConnector: ConnectorType = {
    type: "CCS",
    format: "cable",
    powerType: "DC",
    maxPower: 0,
    maxVoltage: 0,
    maxCurrent: 0,
};

const connectorTypes = ["SAE", "SAE_COMBO", "CHADEMO", "CCS", "CCS2", "MENNEKES", "MENNEKES_COMBO", "SCAME_SOCKET", "SCAME_CONNECTOR", "TESLA_R", "TESLA_S"];

export default function RequestPage() {
    type teamOptions = "manufacturer" | "sales" | "other";
    const [team, setTeam] = useState<teamOptions>("manufacturer");
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
    const [powerLevel, setPowerLevel] = useState<"Level 2" | "Level 3">("Level 2");
    const [mountType, setMountType] = useState<"Pedestal" | "Wall" | "Pole">("Pedestal");
    const [isHubSatellite, setIsHubSatellite] = useState<boolean>(false);
    const [modelConnectivity, setModelConnectivity] = useState<"WiFi" | "SIM" | "Both">("WiFi");
    const [modelName, setModelName] = useState<string>("");
    const [modelSelection, setModelSelection] = useState<string>("");
    const [manufacturer, setManufacturer] = useState<string>("");
    const [cardBrand, setCardBrand] = useState<string>("");

    useEffect(() => {

    }, []);

    return (
        <div className="max-w-3xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <LinkWrapper className="flex items-center font-bold text-gray-1 mb-4" href="/request/info">
                <FiArrowLeft/>
                <div className="ml-2"><span>Back</span></div>
            </LinkWrapper>
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
                <Label className="mb-2">Request type</Label>
                <div className="grid grid-cols-2">
                    <Radio
                        id="firmware"
                        label="New firmware"
                        name="request_type"
                        checked={!isHardware}
                        // @ts-ignore
                        onChange={e => setIsHardware(!e.target.checked)}
                    />
                    <Radio
                        id="hardware"
                        label="New hardware"
                        name="request_type"
                        checked={isHardware}
                        // @ts-ignore
                        onChange={e => setIsHardware(e.target.checked)}
                    />
                </div>
                <ThreeCol className="my-6">
                    <Label>Manufacturer</Label>
                    <Select {...getSelectStateProps(manufacturer, setManufacturer)}>
                        <option value="test">test</option>
                    </Select>
                    <Label>Model</Label>
                    {isHardware ? (
                        <Input {...getInputStateProps(modelName, setModelName)}/>
                    ) : (
                        <Select {...getSelectStateProps(modelSelection, setModelSelection)}>
                            <option value="test">test</option>
                        </Select>
                    )}
                    <Label>Firmware Version</Label>
                    <Input {...getInputStateProps(firmwareVersion, setFirmwareVersion)}/>
                </ThreeCol>
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
                            }} className="ml-auto">Add connector</SecondaryButton>
                        </div>
                        {connectors.map((connector, i) => (
                            <DarkSection key={i} light={true}>
                                <ThreeCol>
                                    <Label>Connector Type</Label>
                                    <Select value={connector.type} onChange={e => {
                                        let newConnectors = [...connectors];
                                        const target = e.target as HTMLSelectElement;
                                        newConnectors[i].type = target.value;
                                        setConnectors(newConnectors);
                                    }}>
                                        {connectorTypes.map(type => (
                                            <option value={type} key={`connector-${i}-${type}`}>{type}</option>
                                        ))}
                                    </Select>
                                    <Label>Connector Type</Label>
                                    <Select value={connector.format} onChange={e => {
                                        let newConnectors = [...connectors];
                                        const target = e.target as HTMLSelectElement;
                                        newConnectors[i].format = target.value as ("cable" | "socket");
                                        setConnectors(newConnectors);
                                    }}>
                                        <option value="cable">Cable</option>
                                        <option value="socket">Socket</option>
                                    </Select>
                                    <Label>Power Type</Label>
                                    <Select value={connector.powerType} onChange={e => {
                                        let newConnectors = [...connectors];
                                        const target = e.target as HTMLSelectElement;
                                        newConnectors[i].powerType = target.value as ("DC" | "AC_1_PHASE" | "AC_3_PHASE");
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
                        <Input
                            value={firmwareInfo}
                            onChange={e => setFirmwareInfo((e.target as HTMLInputElement).value)}
                        />
                        <Label className="mb-2 mt-6">When is the next firmware update?</Label>
                        <Input
                            type="date"
                            value={nextUpdate}
                            onChange={e => setNextUpdate((e.target as HTMLInputElement).value)}
                        />
                        <Label className="mb-2 mt-6">Will you be responsible for doing all over-the-air firmware updates?</Label>
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
                            <Input/>
                            <Label>What is the amount of business?</Label>
                            <Input/>
                            <Label>Urgency level for certification</Label>
                            <Select>
                                <option value="test">test</option>
                            </Select>
                        </ThreeCol>
                        <Label className="mb-2">When are units planned on being shipped?</Label>
                        <Input type="date"/>
                    </DarkSection>
                </>
            )}
            <PrimaryButton onClick={() => null} disabled={true}>Next</PrimaryButton>
        </div>
    );
}