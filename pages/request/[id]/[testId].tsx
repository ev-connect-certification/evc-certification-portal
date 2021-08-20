import {GetServerSideProps} from "next";
import {supabaseAdmin} from "../../../lib/supabaseAdmin";
import {CertificationRequestObj, PublicRequestObj, PublicTestObj, TestObj} from "../../../lib/types";
import {ssr404} from "../../../lib/apiResponses";
import SEO from "../../../components/SEO";
import H1 from "../../../components/H1";
import BackLink from "../../../components/BackLink";
import ThreeColText from "../../../components/ThreeColText";
import {format} from "date-fns";
import {TestStatus} from "../../../lib/labels";
import H2 from "../../../components/H2";
import PrimaryButton from "../../../components/PrimaryButton";
import {useEffect, useRef, useState} from "react";
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
import {useRouter} from "next/router";
import LinkWrapper from "../../../components/LinkWrapper";
import DownloadButton from "../../../components/DownloadButton";
import Checkbox from "../../../components/Checkbox";

export default function TestPage(props: {requestObj: CertificationRequestObj & {models: {name: string}[]} & {manufacturers: {name: string}} & {publicTests: PublicTestObj[]}, testObj: PublicTestObj}) {
    const {user} = Auth.useUser();
    const {addToast} = useToasts();
    const router = useRouter();
    const [testObj, setTestObj] = useState<PublicTestObj>(props.testObj);
    const [oldAccessCode, setOldAccessCode] = useState<string>("");

    // scheduling states
    const [scheduleOpen, setScheduleOpen] = useState<boolean>(false);
    const [accessCode, setAccessCode] = useState<string>("");
    const [isConfigured, setIsConfigured] = useState<boolean>(false);

    // test results
    const [resultsOpen, setResultsOpen] = useState<boolean>(false);
    const [results, setResults] = useState<{test: string, notes: string, pass: boolean, tier: number}[]>([]);
    const [resultsLoading, setResultsLoading] = useState<boolean>(false);
    const [fileUploadIter, setFileUploadIter] = useState<number>(0);
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const [configFileKey, setConfigFileKey] = useState<string>("");

    // re-schedule new test
    const [reScheduleOpen, setReScheduleOpen] = useState<boolean>(false);
    const [isFixed, setIsFixed] = useState<boolean>(false);
    const [reScheduleLoading, setReScheduleLoading] = useState<boolean>(false);

    const requestObj = props.requestObj;

    async function onSchedule() {
        const {data, error} = await supabase
            .from("publicTests")
            .select("*")
            .eq("id", testObj.id);

        if (error) return addToast(error.message, {appearance: "error", autoDismiss: true});

        if (!(data && data.length)) return addToast("Error updating test", {appearance: "error", autoDismiss: true});

        if (data[0].status !== "scheduled") addToast("Failed to schedule, please try again", {appearance: "error", autoDismiss: true});

        setTestObj(data[0]);

        setScheduleOpen(false);
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

        if (testsPassed) {
            try {
                const formData = new FormData();

                formData.append("config", fileUploadRef.current.files[0]);

                const res = await axios.post(`/api/uploadTestFile?testId=${testObj.id}`, formData);
            } catch (e) {
                console.log(e);
            }
        }

        setTestObj(data[0]);

        setResultsOpen(false);

        addToast("Submitted test results", {appearance: "success", autoDismiss: true});
    }

    function onReSchedule() {
        setReScheduleLoading(true);

        axios.post("/api/scheduleTest", {
            newTest: true,
            requestId: requestObj.id,
            chargePointId: testObj.chargePointId,
            rfidIds: testObj.rfidIds,
            accessCode: accessCode,
        }).then(res => {
            addToast("Re-test created. Please schedule a time.", {appearance: "success", autoDismiss: true});
            setReScheduleLoading(false);
            setReScheduleOpen(false);
            router.push(`/request/${requestObj.id}/${res.data.id}`);
        }).catch(e => {
            addToast(e.message, {appearance: "error", autoDismiss: true});
            setReScheduleLoading(false);
        });
    }

    const testsPassed = results.every(d => d.pass);
    const canSubmitTest = !!results.length && results.every(d => d.test) && (!testsPassed || (fileUploadRef.current && fileUploadRef.current.files[0]));

    const thisIndex = requestObj.publicTests
        .sort((a, b) => +new Date(a.approveDate) - +new Date(b.approveDate))
        .findIndex(d => d.id === testObj.id);

    const latestTest = requestObj.publicTests.sort((a, b) => +new Date(b.approveDate) - +new Date(a.approveDate))[0];
    const isLaterTest = latestTest.id !== testObj.id;

    useEffect(() => {
        (async () => {
            if (user) {
                const {data, error} = await supabase.from("tests")
                    .select("accessCode")
                    .eq("id", testObj.id);

                if (error) return addToast(error.message, {appearance: "error", autoDismiss: true});

                if (!(data && data.length)) return addToast("Failed to fetch access code", {appearance: "error", autoDismiss: true});

                setOldAccessCode(data[0].accessCode);
            }
        })()
    }, [testObj]);

    useEffect(() => {
        if (user) {
            (async () => {
                const {data: configData, error: configError} = await supabase
                    .storage
                    .from("test-files")
                    .list(`${testObj.id}`);

                if (configError) console.log(configError);

                if (configData && configData.length) setConfigFileKey(configData[0].name);
            })();
        }
    }, [user]);

    return (
        <div className="max-w-5xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <BackLink href={`/request/${requestObj.id}`}>Back to request</BackLink>
            <H1 className="mb-6">Test #{thisIndex + 1}</H1>
            {user && testObj.status === "pass" && (
                <DarkSection>
                    <p className="text-sm text-gray-1">Share this link with others to let them see the status of this test.</p>
                </DarkSection>
            )}
            {testObj.status === "approved" && (
                <DarkSection>
                    <p className="text-sm text-gray-1">
                        This test has been approved and is ready to be scheduled. {user && <span>Share this link and the access code <code className="bg-gray-1 p-1 rounded text-white">{oldAccessCode}</code> with others to allow them to schedule the test.</span>}
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
            {testObj.status === "fail" && (
                <DarkSection>
                    <p className="text-sm text-gray-1">
                        This test failed.
                        {isLaterTest
                            ? <span> A re-test was requested on <LinkWrapper className="underline" href={`/request/${requestObj.id}/${latestTest.id}`}>{format(new Date(latestTest.approveDate), "MMMM d, yyyy 'at' h:mm a")}</LinkWrapper>.</span>
                            : user
                                ? <span> The hardware partner must fix their hardware or software and schedule another test. Share this link and the access code <code className="bg-gray-1 p-1 rounded text-white">{oldAccessCode}</code> to allow them to do so.</span>
                                : " If you are the hardware partner, please fix your hardware or software and schedule another test using the access code emailed to you."
                        }
                    </p>
                    {isLaterTest ? (
                        <SecondaryButton href={`/request/${requestObj.id}/${latestTest.id}`} containerClassName="mt-4">See details</SecondaryButton>
                    ) : (
                        <PrimaryButton onClick={() => setReScheduleOpen(true)} containerClassName="mt-4">Schedule re-test</PrimaryButton>
                    )}
                </DarkSection>
            )}
            <Modal isOpen={reScheduleOpen} setIsOpen={setReScheduleOpen}>
                <H2 className="mb-4">Schedule re-test</H2>
                <p className="text-sm text-gray-1">Once you have fixed all issues related to the previous failing test, please request a new test to complete certification.</p>
                <Checkbox
                    id="isFixed"
                    label="All issues that caused the previous test to fail have been fixed"
                    className="my-2"
                    checked={isFixed}
                    // @ts-ignore
                    onChange={e => setIsFixed(e.target.checked)}
                />
                {isFixed ? (
                    <>
                        <Label>Access code</Label>
                        <Input {...getInputStateProps(accessCode, setAccessCode)}/>
                        <PrimaryButton onClick={onReSchedule} disabled={!accessCode} className="mt-6">Schedule</PrimaryButton>
                    </>
                ) : (
                    <p className="text-red-500">Fixes must be made before a re-test is scheduled.</p>
                )}
            </Modal>
            <H2>Test information</H2>
            <ThreeColText text={{
                "Models": `${requestObj.manufacturers.name} ${requestObj.models.map(d => d.name).join(", ")} @ ${requestObj.firmwareVersion}`,
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
                <div className="overflow-y-auto" style={{maxHeight: "calc(100vh - 200px)"}}>
                    <p className="text-sm text-gray-1 my-4">
                        Before scheduling certification, make sure that your testing unit is properly configured according to the OCPP 1.6J Certification Pre-Requisites.
                    </p>
                    <Checkbox
                        id="isConfigured"
                        label="My unit is properly configured according to the OCPP 1.6J Certification Pre-Requisites"
                        className="my-2"
                        checked={isConfigured}
                        // @ts-ignore
                        onChange={e => setIsConfigured(e.target.checked)}
                    />
                    {isConfigured ? (
                        <>
                            <div className="prose text-sm text-gray-1 mt-4">
                                <p>
                                    Once your unit is properly configured, select a testing time through the Calendly form below, filling in the following information:
                                </p>
                                <ul>
                                    <li>Charge Point ID: manufacturer-configured Charge Point ID of the test unit</li>
                                    <li>RFID IDs: the IDs of two RFID tags used for testing</li>
                                    <li>Test ID: the ID of this test is <code>{testObj.id}</code></li>
                                </ul>
                            </div>
                            <iframe src={`https://calendly.com/bwebsterev/certification-appointment?a1=${testObj.chargePointId || ""}&a2=${testObj.rfidIds || ""}&a3=${testObj.id}`} frameBorder="0" className="w-full -my-8" style={{height: 1280}}/>
                            <div className="flex">
                                <PrimaryButton
                                    onClick={onSchedule}
                                >Done</PrimaryButton>
                                <SecondaryButton onClick={() => setScheduleOpen(false)} containerClassName="ml-2">Cancel</SecondaryButton>
                            </div>
                        </>
                    ) : (
                        <p className="text-red-500">Proper configuration is required for certification to continue</p>
                    )}
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
                <div style={{maxHeight: "calc(100vh - 400px)"}} className="overflow-y-auto">
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
                <DarkSection>
                    {testsPassed ? (
                        <>
                            <p className="text-gray-1 mb-4">All tests are passing, so this model/firmware and configuration will be marked as certified. The requester can view this status using the link of this page.</p>
                            <Label>Upload configuration CSV</Label>
                            <p className="text-gray-1 mb-2">Please upload a CSV of certified configuration parameters below.</p>
                            <input type="file" ref={fileUploadRef} onChange={() => setFileUploadIter(fileUploadIter + 1)}/>
                        </>
                    ) : (
                        <p className="text-gray-1">This test will be marked as failing and a re-test will need to be scheduled once errors are fixed. The requester can schedule the re-test using the provided link and access code.</p>
                    )}
                </DarkSection>
                <div className="flex items-center mt-6">
                    <PrimaryButton onClick={onSubmitResults} isLoading={resultsLoading} disabled={!canSubmitTest}>Submit</PrimaryButton>
                    <SecondaryButton onClick={() => setResultsOpen(false)} containerClassName="ml-2">Cancel</SecondaryButton>
                </div>
            </Modal>
            <hr className="my-12 text-gray-1"/>
            {configFileKey && (
                <>
                    <H2>Configuration file</H2>
                    <p className="text-sm text-gray-1 my-4">The certified configuration file from testing is below.</p>
                    <DownloadButton bucketName="test-files" fileKey={configFileKey} filePath={`${testObj.id}/`}/>
                </>
            )}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const {id, testId} = params;

    if (!id || isNaN(Number(id)) || !testId || isNaN(Number(testId))) return ssr404;

    const {data, error} = await supabase
        .from<PublicRequestObj>("publicRequests")
        .select("*, models (name), manufacturers (name), publicTests (*)")
        .eq("id", +id);

    if (error) return ssr404;

    if (!(data && data.length)) return ssr404;

    const {data: testData, error: testError} = await supabase
        .from<PublicTestObj>("publicTests")
        .select("*")
        .eq("id", +testId);

    if (testError) return ssr404;

    if (!(testData && testData.length)) return ssr404;

    return {props: {requestObj: data[0], testObj: testData[0], key: testData[0].id}};
}