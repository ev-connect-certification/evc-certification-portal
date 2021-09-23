import Label from "./Label";
import Checkbox from "./Checkbox";
import ThreeCol from "./ThreeCol";
import Select from "./Select";
import {getCheckboxStateProps, getInputStateProps, getSelectStateProps} from "../lib/statePropUtils";
import SecondaryButton from "./SecondaryButton";
import DarkSection from "./DarkSection";
import {
    ConnectorType,
    connectorTypeFormatOpts,
    connectorTypeOpts,
    connectorTypePowerTypeOpts,
    connectorTypes, modelConnectivityOpts, mountTypeOpts, powerLevelOpts
} from "../lib/types";
import Input from "./Input";
import Radio from "./Radio";
import {initConnector} from "../pages/request/new";
import {Dispatch, SetStateAction} from "react";
import ReactSelect from "react-select";

export default function NewHardware({
    isOCPP,
    setIsOCPP,
    isWSS,
    setIsWSS,
    isCreditCard,
    setIsCreditCard,
    paymentFeatures,
    setPaymentFeatures,
    featureSupport,
    setFeatureSupport,
    updateFrequency,
    setUpdateFrequency,
    connectors,
    setConnectors,
    isWSSSingle,
    setIsWSSSingle,
    isConcurrent,
    setIsConcurrent,
    powerLevel,
    setPowerLevel,
    mountType,
    setMountType,
    isHubSatellite,
    setIsHubSatellite,
    cardBrand,
    setCardBrand,
    modelConnectivity,
    setModelConnectivity,
                                    }: {
    isOCPP: boolean,
    setIsOCPP: Dispatch<SetStateAction<boolean>>,
    isWSS: boolean,
    setIsWSS: Dispatch<SetStateAction<boolean>>,
    isCreditCard: boolean,
    setIsCreditCard: Dispatch<SetStateAction<boolean>>,
    paymentFeatures: string[],
    setPaymentFeatures: Dispatch<SetStateAction<string[]>>,
    featureSupport: string[],
    setFeatureSupport: Dispatch<SetStateAction<string[]>>,
    updateFrequency: string,
    setUpdateFrequency: Dispatch<SetStateAction<string>>,
    connectors: ConnectorType[],
    setConnectors: Dispatch<SetStateAction<ConnectorType[]>>,
    isWSSSingle: boolean,
    setIsWSSSingle: Dispatch<SetStateAction<boolean>>,
    isConcurrent: boolean,
    setIsConcurrent: Dispatch<SetStateAction<boolean>>,
    powerLevel: powerLevelOpts,
    setPowerLevel: Dispatch<SetStateAction<powerLevelOpts>>,
    mountType: mountTypeOpts[],
    setMountType: Dispatch<SetStateAction<mountTypeOpts[]>>,
    isHubSatellite: boolean,
    setIsHubSatellite: Dispatch<SetStateAction<boolean>>,
    cardBrand: string,
    setCardBrand: Dispatch<SetStateAction<string>>,
    modelConnectivity: modelConnectivityOpts,
    setModelConnectivity: Dispatch<SetStateAction<modelConnectivityOpts>>,
}) {
    return (
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
            <Label className="mb-2">Supported mount types</Label>
            <ReactSelect
                options={[{label: "Pedestal", value: "pedestal"}, {
                    label: "Pole",
                    value: "pole"
                }, {label: "Wall", value: "wall"}]}
                isMulti={true}
                value={mountType.map(type => ({value: type.toLowerCase(), label: type}))}
                onChange={newValue => setMountType(newValue.map(d => d.label))}
            />
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
                <Label>Over-the-air update support</Label>
                <Select {...getSelectStateProps(
                    featureSupport.includes("ota") ? "yes" : "no",
                    d => {
                        if (d === "yes") setFeatureSupport([...featureSupport, "ota"]);
                        else {
                            let newFeatureSupport = [...featureSupport];
                            const otaIndex = newFeatureSupport.findIndex(d => d === "ota");
                            newFeatureSupport.splice(otaIndex, 1);
                            setFeatureSupport(newFeatureSupport);
                        }
                    })}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </Select>
            </ThreeCol>
            <ThreeCol className="my-6">
                <Label>Power Level</Label>
                <Select  {...getSelectStateProps(powerLevel, setPowerLevel)}>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                </Select>
                <Label>Concurrent charges supported</Label>
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
                <Checkbox id="ctepOrNtep" label="CTEP/NTEP certification"
                    {...getCheckboxStateProps(featureSupport, setFeatureSupport, "ctepOrNtep")}/>
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
            <Label className="mb-2">How often are firmware updates for this model?</Label>
            <Input
                value={updateFrequency}
                onChange={e => setUpdateFrequency((e.target as HTMLInputElement).value)}
            />
        </>
    );
}