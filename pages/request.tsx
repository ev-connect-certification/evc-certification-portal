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

export default function RequestPage() {
    const [isHardware, setIsHardware] = useState<boolean>(false);

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
                        <option value="product">EVC Product</option>
                        <option value="other">Other</option>
                    </Select>
                </ThreeCol>
            </DarkSection>
            <H2>Request information</H2>
            <DarkSection>
                <Label className="mb-2">Request type</Label>
                <div className="grid grid-cols-2">
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="firmware"
                            name="request_type"
                            checked={!isHardware}
                            onChange={e => setIsHardware(!e.target.checked)}
                        />
                        <label className="ml-2" htmlFor="firmware">New firmware</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="hardware"
                            name="request_type"
                            checked={isHardware}
                            onChange={e => setIsHardware(e.target.checked)}
                        />
                        <label className="ml-2" htmlFor="hardware">New hardware</label>
                    </div>
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
                {isHardware && (
                    <>
                        <Label>Power Level</Label>
                        <Select>
                            <option value="2">Level 2</option>
                            <option value="3">Level 3</option>
                        </Select>
                        <ThreeCol className="my-6">
                            <Label>Max current (A)</Label>
                            <Input/>
                            <Label>Max power (W)</Label>
                            <Input/>
                            <Label>Max voltage (V)</Label>
                            <Input/>
                        </ThreeCol>
                    </>
                )}
            </DarkSection>
        </div>
    );
}