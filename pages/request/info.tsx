import SEO from "../../components/SEO";
import HomeLinkWrapper from "../../components/HomeLinkWrapper";
import {FiArrowLeft} from "react-icons/fi";
import H1 from "../../components/H1";
import PrimaryButton from "../../components/PrimaryButton";

export default function RequestInfo({}: {}) {
    return (
        <div className="max-w-3xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <H1 className="mb-4">Request new certification: pre-requisites</H1>
            <div className="text-sm text-gray-1 prose max-w-none mb-6">
                <p>This portal allows EV Connect team members and hardware partners to request certifications for new hardware or software.</p>
                <p>To complete the request, you will need the following information:</p>
                <ul>
                    <li>Model manufacturer and name</li>
                    <li>If new firmware:
                        <ul>
                            <li>What has been updated in the firmware</li>
                            <li>Date of next firmware update</li>
                            <li>Who is responsible for deploying firmware update</li>
                        </ul>
                    </li>
                    <li>If new hardware:
                        <ul>
                            <li>Model support for OCPP 1.6J and Secure WebSocket (both required for certification)</li>
                            <li>Model connectivity (WiFi/SIM, hub satellite, WebSocket connection configuration)</li>
                            <li>Model mount type (pedestal, pole, wall)</li>
                            <li>Model charging information (power level, connector types, max current, max power, max voltage, concurrent charging support, etc.)</li>
                            <li>Model feature support (smart charging, freevend mode, throttling, daisy-chaining)</li>
                            <li>Payment feature support (credit card reader, RFID, NFC)</li>
                            <li>CTEP/NTEP certification support</li>
                            <li>Frequency of firmware updates</li>
                        </ul>
                    </li>
                </ul>
                <p>If a new hardware certification is being requested, you will also need to upload following documents:</p>
                <ul>
                    <li>A filled-out fault code template detailing possible fault codes sent by the model and their
                        corresponding severity level, source, and appropriate response.</li>
                    <li>Installation and usage manuals for the model</li>
                    <li>Data and spec sheets for the model</li>
                    <li>Third-party certifications for the model</li>
                </ul>
                <p>Lastly, you will need an access code. To request an access code, send an email to <a href="mailto:contact@evconnect.com">contact@evconnect.com</a>.</p>
            </div>
            <div className="flex">
                <PrimaryButton href="/request/new">Next</PrimaryButton>
            </div>
        </div>
    );
}