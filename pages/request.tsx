import SEO from "../components/SEO";
import H1 from "../components/H1";
import HomeLinkWrapper from "../components/HomeLinkWrapper";
import {FiArrowLeft} from "react-icons/fi";
import H2 from "../components/H2";
import DarkSection from "../components/DarkSection";
import Input from "../components/Input";
import Label from "../components/Label";
import ThreeCol from "../components/ThreeCol";
import Select from "../components/Select";
import {useState} from "react";
import Checkbox from "../components/Checkbox";
import {redirect} from "next/dist/next-server/server/api-utils";
import Radio from "../components/Radio";

export default function RequestPage() {
    const [isHardware, setIsHardware] = useState<boolean>(false);
    const [isOCPP, setIsOCPP] = useState<boolean>(false);
    const [isWSS, setIsWSS] = useState<boolean>(false);
    const [isCreditCard, setIsCreditCard] = useState<boolean>(false);

    return (
        <div className="max-w-3xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <HomeLinkWrapper className="flex items-center font-bold text-gray-1 mb-4">
                <FiArrowLeft/>
                <div className="ml-2"><span>Back</span></div>
            </HomeLinkWrapper>
            <H1 className="mb-4">Request new certification</H1>
            <H2>Requester information</H2>
            <DarkSection>
                <ThreeCol>
                    <Label>Name</Label>
                    <Input
                        placeholder="Enter your name"
                    />
                    <Label>Email</Label>
                    <Input
                        placeholder="Enter your email"
                    />
                    <Label>Team</Label>
                    <Select>
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
                        onChange={e => setIsHardware(!e.target.checked)}
                    />
                    <Radio
                        id="hardware"
                        label="New hardware"
                        name="request_type"
                        checked={isHardware}
                        onChange={e => setIsHardware(e.target.checked)}
                    />
                </div>
                <ThreeCol className="my-6">
                    <Label>Manufacturer</Label>
                    <Select>
                        <option value="test">test</option>
                    </Select>
                    <Label>Model</Label>
                    {isHardware ? (
                        <Input/>
                    ) : (
                        <Select>
                            <option value="test">test</option>
                        </Select>
                    )}
                    <Label>Firmware Version</Label>
                    <Input/>
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
                            onChange={e => setIsOCPP(e.target.checked)}
                        />
                        <Checkbox
                            id="wss"
                            label="Does this model support Secure WebSocket (WSS)?"
                            className="my-2"
                            checked={isWSS}
                            onChange={e => setIsWSS(e.target.checked)}
                        />
                        {!(isOCPP && isWSS) && (
                            <p className="text-red-500">Both OCPP and WSS must be supported for certification to be conducted.</p>
                        )}
                        <hr className="my-6 border-gray-2"/>
                        <Label className="mb-2">WebSocket Connection Details</Label>
                        <Select>
                            <option value="2">Entire charging point has one WebSocket connection</option>
                            <option value="3">Each connector has individual WebSocket connection</option>
                        </Select>
                        <ThreeCol className="my-6">
                            <Label>Model Connectivity</Label>
                            <Select>
                                <option value="wifi">WiFi</option>
                                <option value="sim">SIM</option>
                                <option value="both">Both</option>
                            </Select>
                            <Label>Does this model need a hub satellite?</Label>
                            <Select>
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </Select>
                            <Label>Power Level</Label>
                            <Select>
                                <option value="2">Level 2</option>
                                <option value="3">Level 3</option>
                            </Select>
                        </ThreeCol>
                        <ThreeCol className="my-6">
                            <Label>Max current (A)</Label>
                            <Input/>
                            <Label>Max power (W)</Label>
                            <Input/>
                            <Label>Max voltage (V)</Label>
                            <Input/>
                        </ThreeCol>
                        <hr className="my-6 border-gray-2"/>
                        <Label className="mb-2">Does this model support credit card payments?</Label>
                        <div className="grid grid-cols-2">
                            <Radio
                                id="yes"
                                label="Yes"
                                name="credit-card"
                                checked={isCreditCard}
                                onChange={e => setIsCreditCard(e.target.checked)}
                            />
                            <Radio
                                id="no"
                                label="No"
                                name="credit-card"
                                checked={!isCreditCard}
                                onChange={e => setIsCreditCard(!e.target.checked)}
                            />
                        </div>
                        {isCreditCard && (
                            <>
                                <Label className="mt-8">What payment features does this model support? (check all that apply)</Label>
                                <Checkbox id="nfc" label="NFC" className="my-2"/>
                                <Checkbox id="chip" label="Chip" className="my-2"/>
                                <Checkbox id="swipe" label="Swipe" className="my-2"/>
                            </>
                        )}
                        <hr className="my-6 border-gray-2"/>
                        <Label className="mt-8">CTEP/NTEP certification (check all that apply)</Label>
                        <Checkbox id="ctep" label="Does this model support CTEP certification?" className="my-2"/>
                        <Checkbox id="ntep" label="Does this model support NTEP certification?" className="my-2"/>
                        <Label className="mt-8">Feature support (check all that apply)</Label>
                        <Checkbox id="rfid" label="Does this model support RFID readers?" className="my-2"/>
                        <Checkbox id="smart" label="Does this model support smart charging profiles?" className="my-2"/>
                        <Checkbox id="freevend" label="Does this model support freevend mode?" className="my-2"/>
                        <Checkbox id="concurrent" label="Does this model support concurrent charging?" className="my-2"/>
                        <Checkbox id="ota" label="Does this model support over-the-air firmware updates?" className="my-2"/>
                        <Checkbox id="daisy" label="Is this model daisy-chained?" className="my-2"/>
                        <Label className="mt-8 mb-2">How often are firmware updates for this model?</Label>
                        <Input/>
                    </>
                ) : (
                    <>
                        <Label className="mb-2">What has been updated in the firmware?</Label>
                        <Input/>
                        <Label className="mb-2 mt-6">When is the next firmware update?</Label>
                        <Input type="date"/>
                        <Label className="mb-2 mt-6">Will you be responsible for doing all over-the-air firmware updates?</Label>
                        <div className="grid grid-cols-2">
                            <Radio id="ota-res-yes" label="Yes" name="ota-responsibility"/>
                            <Radio id="ota-res-no" label="No" name="ota-responsibility"/>
                        </div>
                    </>
                )}
            </DarkSection>
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
                <Input/>
            </DarkSection>
        </div>
    );
}