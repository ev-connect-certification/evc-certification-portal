import {GetServerSideProps} from "next";
import {supabaseAdmin} from "../../../lib/supabaseAdmin";
import {CertificationRequestObj, TestObj} from "../../../lib/types";
import {ssr404} from "../../../lib/apiResponses";
import SEO from "../../../components/SEO";
import H1 from "../../../components/H1";
import BackLink from "../../../components/BackLink";
import ThreeColText from "../../../components/ThreeColText";
import {format} from "date-fns";
import {TestStatus} from "../../../lib/labels";
import H2 from "../../../components/H2";
import PrimaryButton from "../../../components/PrimaryButton";
import {useState} from "react";
import Modal from "../../../components/Modal";
import SecondaryButton from "../../../components/SecondaryButton";
import DarkSection from "../../../components/DarkSection";
import {Auth} from "@supabase/ui";
import ThreeCol from "../../../components/ThreeCol";
import Input from "../../../components/Input";
import {getInputStateProps} from "../../../lib/statePropUtils";
import Label from "../../../components/Label";
import {useToasts} from "react-toast-notifications";
import axios from "axios";

export default function TestPage(props: {requestObj: CertificationRequestObj & {models: {name: string}} & {manufacturers: {name: string}} & {tests: TestObj[]}, testObj: TestObj}) {
    const {user} = Auth.useUser();
    const {addToast} = useToasts();
    const [testObj, setTestObj] = useState<TestObj>(props.testObj);
    const [scheduleOpen, setScheduleOpen] = useState<boolean>(false);
    const [chargePointId, setChargePointId] = useState<string>("");
    const [rfidIds, setRfidIds] = useState<string>("");
    const [scheduleTime, setScheduleTime] = useState<string>("");
    const [accessCode, setAccessCode] = useState<string>("");
    const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);

    const requestObj = props.requestObj;

    function onSchedule() {
        setScheduleLoading(true);

        axios.post("/api/scheduleTest", {
            testId: testObj.id,
            chargePointId: chargePointId,
            rfidIds: rfidIds,
            accessCode: accessCode,
            scheduleTime: scheduleTime,
        }).then(res => {
            setTestObj(res.data);
            setScheduleOpen(false);
        }).catch(e => {
            addToast(e.message, {appearance: "error", autoDismiss: true});
        }).finally(() => {
            setScheduleLoading(false);
        });
    }

    const thisIndex = requestObj.tests
        .sort((a, b) => +new Date(b.approveDate) - +new Date(a.approveDate))
        .findIndex(d => d.id === testObj.id);

    return (
        <div className="max-w-5xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <BackLink href={`/request/${requestObj.id}`}>Back to request</BackLink>
            <H1 className="mb-6">Test #{thisIndex + 1}</H1>
            {user && (
                <DarkSection>
                    <p className="text-sm text-gray-1">Share this link with others to let them see the status of this test.</p>
                </DarkSection>
            )}
            {testObj.status === "approved" && (
                <DarkSection>
                    <p className="text-sm text-gray-1">
                        This test has been approved and is ready to be scheduled. {user && <span>Share this link and the access code <code className="bg-gray-1 p-1 rounded text-white">${testObj.accessCode}</code> with others to allow them to schedule the test.</span>}
                    </p>
                    <PrimaryButton containerClassName="mt-4" onClick={() => setScheduleOpen(true)}>Schedule</PrimaryButton>
                </DarkSection>
            )}
            <H2>Test information</H2>
            <ThreeColText text={{
                "Model": `${requestObj.manufacturers.name} ${requestObj.models.name} @ ${requestObj.firmwareVersion}`,
                "Requester": `${requestObj.requesterName} (${requestObj.requesterEmail})`,
                "Test information": `Tier ${requestObj.tier} for new ${requestObj.isHardware ? "hardware" : "software"}`
            }} className="my-6"/>
            <ThreeColText text={{
                "Approval date": format(new Date(testObj.approveDate), "MMMM d, yyyy 'at' h:mm a"),
                "Test date": testObj.testDate
                    ? format(new Date(testObj.testDate), "MMMM d, yyyy 'at' h:mm a")
                    : <PrimaryButton onClick={() => setScheduleOpen(true)}>Schedule</PrimaryButton>,
                "Status": <TestStatus status={testObj.status}/>,
            }} className="my-6"/>
            <Modal isOpen={scheduleOpen} setIsOpen={setScheduleOpen} wide={true}>
                <H2 className="mb-4">Schedule certification testing</H2>
                <p className="text-sm text-gray-1 my-4">
                    Before scheduling certification, make sure that your testing unit is properly configured according to the OCPP 1.6J Certification Pre-Requisites.
                </p>
                <p className="text-sm text-gray-1 my-4">
                    Once your unit is properly configured, enter the relevant information and select a testing time below.
                </p>
                <ThreeColText text={{
                    "Charge Point ID": <Input {...getInputStateProps(chargePointId, setChargePointId)}/>,
                    "RFID IDs": <Input {...getInputStateProps(rfidIds, setRfidIds)}/>,
                    "Time": <Input type="datetime-local" {...getInputStateProps(scheduleTime, setScheduleTime)}/>,
                }} className="my-6"/>
                <Label>Access code</Label>
                <p className="mb-2 text-gray-1">Get the access code from your email</p>
                <Input className="mb-6" {...getInputStateProps(accessCode, setAccessCode)}/>
                <div className="flex">
                    <PrimaryButton
                        disabled={!(chargePointId && rfidIds && scheduleTime && accessCode)}
                        onClick={onSchedule}
                        isLoading={scheduleLoading}
                    >Schedule</PrimaryButton>
                    <SecondaryButton onClick={() => setScheduleOpen(false)} containerClassName="ml-2">Cancel</SecondaryButton>
                </div>
            </Modal>
            <hr className="my-12 text-gray-1"/>
            <H2>Testing pre-requisites</H2>
            <ThreeColText text={{
                "Charge Point ID": testObj.chargePointId || "-",
                "RFID IDs": testObj.rfidIds || "-",
            }} className="my-6"/>
            <hr className="my-12 text-gray-1"/>
            <H2>Results</H2>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const {id, testId} = params;

    if (!id || isNaN(Number(id)) || !testId || isNaN(Number(testId))) return ssr404;

    const {data, error} = await supabaseAdmin
        .from<CertificationRequestObj>("requests")
        .select("*, models (name), manufacturers (name), tests (*)")
        .eq("id", +id);

    if (error) return ssr404;

    if (!(data && data.length)) return ssr404;

    const {data: testData, error: testError} = await supabaseAdmin
        .from<TestObj>("tests")
        .select("*")
        .eq("id", +testId);

    if (testError) return ssr404;

    if (!(testData && testData.length)) return ssr404;

    return {props: {requestObj: data[0], testObj: testData[0]}};
}