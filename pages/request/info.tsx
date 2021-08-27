import SEO from "../../components/SEO";
import HomeLinkWrapper from "../../components/HomeLinkWrapper";
import {FiArrowLeft, FiPlus} from "react-icons/fi";
import H1 from "../../components/H1";
import PrimaryButton from "../../components/PrimaryButton";
import Accordion from "react-robust-accordion";

export default function RequestInfo({}: {}) {
    return (
        <div className="max-w-3xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <H1 className="mb-4">Request new certification: pre-requisites</H1>
            <div className="text-sm text-gray-1 prose max-w-none mb-6">
                <p>This portal allows EV Connect team members and hardware partners to request certifications for new hardware or software.</p>
                <p>To complete the request, you will need the following information:</p>
                <Accordion label={(
                    <div className="flex items-center">
                        <p>If new firmware</p>
                        <FiPlus className="ml-auto"/>
                    </div>
                )} className="border-b">
                    <ul>
                        <li>Model manufacturer and name</li>
                        <li>What has been updated in the firmware</li>
                        <li>Date of next firmware update</li>
                        <li>Who is responsible for deploying firmware update</li>
                    </ul>
                </Accordion>
                <Accordion label={(
                    <div className="flex items-center">
                        <p>If new hardware</p>
                        <FiPlus className="ml-auto"/>
                    </div>
                )} className="border-b">
                    <ul>
                        <li>Model manufacturer and name</li>
                        <li>Model support for OCPP 1.6J and Secure WebSocket (both required for certification)</li>
                        <li>Model connectivity (WiFi/SIM, hub satellite, WebSocket connection configuration)</li>
                        <li>Model mount type (pedestal, pole, wall)</li>
                        <li>Model charging information (power level, connector types, max current, max power, max voltage, concurrent charging support, etc.)</li>
                        <li>Model feature support (smart charging, freevend mode, throttling, daisy-chaining)</li>
                        <li>Payment feature support (credit card reader, RFID, NFC)</li>
                        <li>CTEP/NTEP certification support</li>
                        <li>Frequency of firmware updates</li>
                    </ul>
                    <p>You will also need to upload following documents:</p>
                    <ul>
                        <li>A filled-out <a href="https://evconnect-my.sharepoint.com/:x:/p/szhang1/EQuB6J-A3uNGnJDxEfFJh70BbGs-R37l4SV0VfbDT9LaAg?e=SKgiwj" className="underline">fault code template</a> detailing possible fault codes sent by the model and their
                            corresponding severity level, source, and appropriate response.</li>
                        <li>Installation/usage manuals, data/spec sheets, and other relevant documentation</li>
                    </ul>
                </Accordion>
                <p>Lastly, you will need an access code. To request an access code, send an email to <a href="mailto:certification@evconnect.com">certification@evconnect.com</a>.</p>
            </div>
            <div className="flex">
                <PrimaryButton href="/request/new">Next</PrimaryButton>
            </div>
        </div>
    );
}