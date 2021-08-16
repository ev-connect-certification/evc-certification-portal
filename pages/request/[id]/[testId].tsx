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
import {getInputStateProps, getSelectStateProps, getTextAreaStateProps} from "../../../lib/statePropUtils";
import Label from "../../../components/Label";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import Select from "../../../components/Select";
import TextArea from "../../../components/TextArea";
import {supabase} from "../../../lib/supabaseClient";

export default function TestPage(props: {requestObj: CertificationRequestObj & {models: {name: string}} & {manufacturers: {name: string}} & {tests: TestObj[]}, testObj: TestObj}) {
    const {user} = Auth.useUser();
    const {addToast} = useToasts();
    const [testObj, setTestObj] = useState<TestObj>(props.testObj);

    // scheduling states
    const [scheduleOpen, setScheduleOpen] = useState<boolean>(false);
    const [chargePointId, setChargePointId] = useState<string>("");
    const [rfidIds, setRfidIds] = useState<string>("");
    const [scheduleTime, setScheduleTime] = useState<string>("");
    const [accessCode, setAccessCode] = useState<string>("");
    const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);

    // test results
    const [resultsOpen, setResultsOpen] = useState<boolean>(false);
    const [results, setResults] = useState<{test: string, notes: string, pass: boolean, tier: number}[]>([]);
    const [resultsLoading, setResultsLoading] = useState<boolean>(false);

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

    async function onSubmitResults() {
        setResultsLoading(true);

        const {data, error} = await supabase.from<TestObj>("tests")
            .update({
                results: results,
                status: testsPassed ? "pass" : "fail",
            })
            .eq("id", testObj.id);

        setResultsLoading(false);

        if (error) addToast(error.message, {appearance: "error", autoDismiss: true});

        if (!(data && data.length)) addToast("Failed to update test", {appearance: "error", autoDismiss: true});

        setTestObj(data[0]);

        setResultsOpen(false);

        addToast("Submitted test results", {appearance: "success", autoDismiss: true});
    }

    const canSubmitTest = !!results.length && results.every(d => d.test);
    const testsPassed = results.every(d => d.pass);

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
                        This test has been approved and is ready to be scheduled. {user && <span>Share this link and the access code <code className="bg-gray-1 p-1 rounded text-white">{testObj.accessCode}</code> with others to allow them to schedule the test.</span>}
                    </p>
                    <PrimaryButton containerClassName="mt-4" onClick={() => setScheduleOpen(true)}>Schedule</PrimaryButton>
                </DarkSection>
            )}
            {testObj.status === "scheduled" && (
                <DarkSection>
                    <p className="text-sm text-gray-1">
                        This certification is scheduled to be conducted on {format(new Date(testObj.testDate), "MMMM d, yyyy 'at' h:mm a")}.
                        Use this link to {user ? "submit" : "see"} test results once tests are completed.
                    </p>
                    {user && (
                        <PrimaryButton containerClassName="mt-4" onClick={() => setResultsOpen(true)}>Submit results</PrimaryButton>
                    )}
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
            <H2 className="mb-4">Results</H2>
            {testObj.results ? (
                <>
                    <div className="flex items-center h-12">
                        <div className="w-64"><Label>Test</Label></div>
                        <div className="w-32"><Label>Tier</Label></div>
                        <div className="w-32"><Label>Result</Label></div>
                        <div className="w-32"><Label>Notes</Label></div>
                    </div>
                    <hr className="text-gray-1"/>
                    {testObj.results.map(result => (
                        <div className="flex items-center h-12">
                            <div className="w-64 flex-shrink-0"><span>{result.test}</span></div>
                            <div className="w-32 text-gray-1 flex-shrink-0"><span>Tier {result.tier}</span></div>
                            <div className="w-32 flex-shrink-0">
                                <TestStatus status={result.pass ? "pass" : "fail"}/>
                            </div>
                            <div className="flex-grow-1">
                                <p className="text-gray-1">{result.notes}</p>
                            </div>
                        </div>
                    ))}
                </>
            ) : user ? (
                <>
                    <PrimaryButton onClick={() => setResultsOpen(true)}>Submit results</PrimaryButton>
                </>
            ) : (
                <p className="text-gray-1">An EV Connect team member will upload results here once tests are conducted.</p>
            )}
            <Modal isOpen={resultsOpen} setIsOpen={setResultsOpen} wide={true}>
                <div className="mb-6 flex items-center">
                    <H2>Submit test results ({results.length})</H2>
                    <PrimaryButton containerClassName="ml-auto" onClick={() => {
                        setResults([...results, {test: "", notes: "", pass: true, tier: 1}]);
                    }}>Add test</PrimaryButton>
                </div>
                <div style={{maxHeight: "calc(100vh - 200px)"}} className="overflow-y-auto">
                    {!results.length && (
                        <p className="text-gray-1">Press "Add test" above to add test results.</p>
                    )}
                    {results.map((result, i) => (
                        <DarkSection
                            key={`result-${i}`}
                            className={(i === 0 ? "mt-0" : "") + " " + (i === results.length - 1 ? "mb-0" : "")}
                        >
                            <ThreeColText text={{
                                Name: <Input {...getInputStateProps(result.test, (d: string) => {
                                    let newResults = [...results];
                                    newResults[i].test = d;
                                    setResults(newResults);
                                })}/>,
                                Result: <Select {...getSelectStateProps(result.pass ? "Pass" : "Fail", (d: string) => {
                                    let newResults = [...results];
                                    newResults[i].pass = d === "Pass";
                                    setResults(newResults);
                                })}>
                                    <option value="Pass">Pass</option>
                                    <option value="Fail">Fail</option>
                                </Select>,
                                Tier: <Select {...getSelectStateProps(result.tier.toString(), (d: string) => {
                                    let newResults = [...results];
                                    newResults[i].tier = +d;
                                    setResults(newResults);
                                })}>
                                    <option value="1">Tier 1</option>
                                    <option value="2">Tier 2</option>
                                    <option value="3">Tier 3</option>
                                    <option value="4">Tier 4</option>
                                    <option value="5">Tier 5</option>
                                </Select>,
                            }} className="mb-6"/>
                            <Label className="mb-2">Notes</Label>
                            <TextArea {...getTextAreaStateProps(result.notes, (d: string) => {
                                let newResults = [...results];
                                newResults[i].notes = d;
                                setResults(newResults);
                            })}/>
                            <SecondaryButton onClick={() => {
                                let newResults = [...results];
                                newResults.splice(i, 1);
                                setResults(newResults);
                            }} containerClassName="mt-4">Delete test</SecondaryButton>
                        </DarkSection>
                    ))}
                </div>
                <div className="flex items-center mt-6">
                    <PrimaryButton onClick={onSubmitResults} isLoading={resultsLoading} disabled={!canSubmitTest}>Submit</PrimaryButton>
                    <SecondaryButton onClick={() => setResultsOpen(false)} containerClassName="ml-2">Cancel</SecondaryButton>
                </div>
            </Modal>
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