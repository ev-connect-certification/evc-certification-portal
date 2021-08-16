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

export default function TestPage({requestObj, testObj}: {requestObj: CertificationRequestObj & {models: {name: string}} & {manufacturers: {name: string}} & {tests: TestObj[]}, testObj: TestObj}) {
    const {user} = Auth.useUser();
    const [scheduleOpen, setScheduleOpen] = useState<boolean>(false);

    function onSchedule() {

    }

    const thisIndex = requestObj.tests
        .sort((a, b) => +new Date(b.approveDate) - +new Date(a.approveDate))
        .findIndex(d => d.id === testObj.id);

    return (
        <div className="max-w-5xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <BackLink href={`/request/${requestObj.id}`}>Back to request</BackLink>
            <H1 className="mb-6">Test #{thisIndex + 1}</H1>
            {testObj.status === "approved" && (
                <DarkSection className="text-gray-1 flex items-center">
                    This test has been approved and is ready to be scheduled.
                    <PrimaryButton containerClassName="ml-auto" onClick={() => setScheduleOpen(true)}>Schedule</PrimaryButton>
                </DarkSection>
            )}
            <H2>Test information</H2>
            <ThreeColText text={{
                "Model": `${requestObj.manufacturers.name} ${requestObj.models.name} @ ${requestObj.firmwareVersion}`,
                "Requester": `${requestObj.requesterName} (${requestObj.requesterEmail})`,
                "Test information": `Tier ${requestObj.tier} for new ${requestObj.isHardware ? "hardware" : "software"}`
            }} className="my-6"/>
            <ThreeColText text={{
                "Approval date": format(new Date(testObj.approveDate), "MMMM d, yyyy"),
                "Test date": testObj.testDate
                    ? format(new Date(testObj.testDate), "MMMM d, yyyy")
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
                    "Charge Point ID": <Input/>,
                    "RFID IDs": <Input/>,
                    "Time": <Input type="datetime-local"/>,
                }} className="my-6"/>
                <div className="flex">
                    <PrimaryButton onClick={onSchedule}>Schedule</PrimaryButton>
                    <SecondaryButton onClick={() => setScheduleOpen(false)} containerClassName="ml-2">Cancel</SecondaryButton>
                </div>
            </Modal>
            <hr className="my-12 text-gray-1"/>
            <H2>Testing pre-requisites</H2>
            <ThreeColText text={{
                "Charge Point ID": "-",
                "RFID IDs": "-",
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