import {GetServerSideProps} from "next";
import {
    CertificationRequestObj,
    ManufacturerObj,
    ModelObj,
    PublicRequestObj,
    PublicTestObj,
    TestObj
} from "../../../lib/types";
import SEO from "../../../components/SEO";
import LinkWrapper from "../../../components/LinkWrapper";
import H1 from "../../../components/H1";
import H2 from "../../../components/H2";
import ThreeCol from "../../../components/ThreeCol";
import Label from "../../../components/Label";
import {getTeam, getTier, TestStatus} from "../../../lib/labels";
import React, {useEffect, useState} from "react";
import DarkSection from "../../../components/DarkSection";
import AnchorLink from "react-anchor-link-smooth-scroll";
import {Auth} from "@supabase/ui";
import {format} from "date-fns";
import PrimaryButton from "../../../components/PrimaryButton";
import Modal from "../../../components/Modal";
import SecondaryButton from "../../../components/SecondaryButton";
import {supabase} from "../../../lib/supabaseClient";
import {generate} from "generate-password";
import {useToasts} from "react-toast-notifications";
import {ssr404} from "../../../lib/apiResponses";
import BackLink from "../../../components/BackLink";
import ThreeColText from "../../../components/ThreeColText";
import ModelSection from "../../../components/ModelSection";

export default function RequestPage({requestObj}: {requestObj: PublicRequestObj & {models: ModelObj[]} & {manufacturers: ManufacturerObj}}) {
    const {user} = Auth.useUser();
    const {addToast} = useToasts();
    const [approveOpen, setApproveOpen] = useState<boolean>(false);
    const [approveLoading, setApproveLoading] = useState<boolean>(false);
    const [testsIter, setTestsIter] = useState<number>(0);
    const [tests, setTests] = useState<PublicTestObj[] | null>(null);
    const [fullRequest, setFullRequest] = useState<CertificationRequestObj | null>(null);

    async function onApprove() {
        setApproveLoading(true);

        const {data, error} = await supabase.from<TestObj>("tests")
            .insert([
                {
                    accessCode: generate({length: 6, numbers: true}),
                    requestId: requestObj.id,
                    status: "approved",
                }
            ]);

        setApproveLoading(false);

        if (error) return addToast(error, {appearance: "error", autoDismiss: true});

        setApproveOpen(false);
        setTestsIter(testsIter + 1);
        addToast("Request approved", {appearance: "success", autoDismiss: true});
    }

    useEffect(() => {
        (async () => {
            const {data, error} = await supabase.from<PublicTestObj>("publicTests")
                .select("*")
                .eq("requestId", requestObj.id);

            if (error) return addToast(error.message, {appearance: "error", autoDismiss: true});

            setTests(data);
        })();
    }, [testsIter]);
    
    useEffect(() => {
        if (user) {
            (async () => {
                const {data, error} = await supabase.from<CertificationRequestObj>("requests")
                    .select("*")
                    .eq("id", requestObj.id);

                if (error) return addToast(error.message, {appearance: "error", autoDismiss: true});

                if (data && data.length) setFullRequest(data[0]);
            })();
        }
    }, [user]);

    const approveDate = tests
        && !!tests.length
        && tests.sort((a, b) => +new Date(b.approveDate) - +new Date(a.approveDate))[0].approveDate;

    return (
        <div className="max-w-5xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            {user && (
                <BackLink href="/request/all">All requests</BackLink>
            )}
            <H1 className="mb-4">Request: {requestObj.manufacturers.name} {requestObj.models.map(d => d.name).join(", ")} @ {requestObj.firmwareVersion}</H1>
            <DarkSection>
                <p className="text-gray-1 text-sm">
                    {user
                        ? "Share the link of this page with anyone who needs to see the status of this request."
                        : "Keep track of the link of this page. It's how you'll be able see the status of your request. If you are the requester, you will also be emailed if there are any updates."
                    }
                </p>
            </DarkSection>
            <div className="flex items-stretch mt-6">
                <div className="w-64 border-r pr-6 mr-6">
                    <div className="sticky top-16">
                        {(() => {
                            let initOptions = ["timeline", "requesterInfo", "requestDetails", "modelInfo"];
                            if (requestObj.requesterTeam === "sales" && user && fullRequest) initOptions.splice(3, 0, "salesInfo");
                            return initOptions;
                        })().map(d => (
                            <p className="text-sm mb-3 text-gray-1">
                                <AnchorLink href={`#${d}`} offset={56}>{{
                                    timeline: "Timeline and results",
                                    requesterInfo: "Requester info",
                                    requestDetails: "Request details",
                                    modelInfo: "Model info",
                                    salesInfo: "Sales info",
                                }[d]}</AnchorLink>
                            </p>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <H2 id="timeline">Timeline and results</H2>
                    <div className="flex items-center h-12">
                        <div className="w-40"><Label>Type</Label></div>
                        <div className="w-40"><Label>Date</Label></div>
                        <div className="w-40"><Label>Status</Label></div>
                    </div>
                    <hr className="text-gray-1"/>
                    {tests && tests.map(test => (
                        <LinkWrapper href={`/request/${requestObj.id}/${test.id}`} key={test.id} className="flex items-center h-12">
                            <div className="w-40"><span>Certification testing</span></div>
                            <div className="w-40 text-gray-1"><span>{test.testDate ? format(new Date(test.testDate), "MMMM d, yyyy") : "-"}</span></div>
                            <div className="w-48 text-gray-1 flex items-center">
                                <TestStatus status={test.status}/>
                            </div>
                            <SecondaryButton containerClassName="ml-auto" href={`/request/${requestObj.id}/${test.id}`}>View details</SecondaryButton>
                        </LinkWrapper>
                    ))}
                    <div className="flex items-center h-12">
                        <div className="w-40"><span>Initial request</span></div>
                        <div className="w-40 text-gray-1"><span>{format(new Date(requestObj.requestDate), "MMMM d, yyyy")}</span></div>
                        <div className="w-48 text-gray-1 flex items-center">
                            <div className={`w-2 h-2 rounded-full ${approveDate ? "bg-green-500" : "bg-yellow-300"} mr-3`}/>
                            <span>{approveDate ? `Approved on ${format(new Date(approveDate), "MMMM d, yyyy")}` : "Awaiting approval"}</span>
                        </div>
                        {user && !approveDate && (
                            <PrimaryButton containerClassName="ml-auto" onClick={() => setApproveOpen(true)}>Approve for scheduling</PrimaryButton>
                        )}
                    </div>
                    <Modal isOpen={approveOpen} setIsOpen={setApproveOpen}>
                        <H2 className="mb-4">Approve request for scheduling</H2>
                        <p className="text-sm my-4 text-gray-1">If you approve this request, the requester will be able to schedule a time for certification testing using a provided link and access code.</p>
                        <div className="flex items-center">
                            <PrimaryButton onClick={onApprove}>Approve</PrimaryButton>
                            <SecondaryButton onClick={() => setApproveOpen(false)} className="ml-2">Cancel</SecondaryButton>
                        </div>
                    </Modal>
                    <hr className="my-12 text-gray-1"/>
                    <H2 id="requesterInfo">Requester information</H2>
                    <ThreeColText text={{
                        Name: requestObj.requesterName,
                        Email: requestObj.requesterEmail,
                        Team: getTeam(requestObj.requesterTeam),
                    }} className="my-6"/>
                    <hr className="my-12 text-gray-1"/>
                    <H2 id="requestDetails">Request details</H2>
                    <ThreeCol className="my-6">
                        <Label>Manufacturer</Label>
                        <p className="text-sm">{requestObj.manufacturers.name}</p>
                        <Label>Models ({requestObj.models.length})</Label>
                        <p className="text-sm col-span-2">
                            {requestObj.models.map(d => d.name).join(", ")}
                        </p>
                    </ThreeCol>
                    <ThreeColText text={{
                        Type: requestObj.isHardware ? "New hardware" : "New software",
                        "Firmware Version": requestObj.firmwareVersion,
                        "Certification Tier": getTier(requestObj.tier),
                    }} className="my-6"/>
                    {!requestObj.isHardware && (
                        <>
                            <hr className="my-6 text-gray-1"/>
                            <Label className="mb-2">What's new in this firmware version?</Label>
                            <p className="text-sm">{requestObj.firmwareInfo}</p>
                            <ThreeCol className="my-6">
                                <Label>When is the next firmware update?</Label>
                                <p className="text-sm">{requestObj.nextUpdate}</p>
                                <Label className="col-span-2">Will you be responsible for doing all over-the-air firmware updates?</Label>
                                <p className="text-sm">{requestObj.isFirmwareResponsibility ? "Yes" : "No"}</p>
                            </ThreeCol>
                        </>
                    )}
                    {requestObj.requesterTeam === "sales" && user && fullRequest && (
                        <>
                            <hr className="my-12 text-gray-1"/>
                            <H2 id="salesInfo">Sales information</H2>
                            <DarkSection>
                                <p className="text-sm text-gray-1">This information is only visible to logged-in admins.</p>
                            </DarkSection>
                            <ThreeColText text={{
                                "PO and contract signed": fullRequest.isContractSigned ? "Yes" : "No",
                                "Planned unit ship date": fullRequest.shipDate ? format(new Date(fullRequest.shipDate), "MMMM d, yyyy") : "-",
                            }} className="mt-6"/>
                            <ThreeColText text={{
                                "Business value": fullRequest.businessValue,
                                "Amount of business": fullRequest.amountBusiness,
                                "Urgency level": fullRequest.urgencyLevel.substr(0, 1).toUpperCase() + fullRequest.urgencyLevel.substr(1),
                            }} className="mt-6"/>
                        </>
                    )}
                    <hr className="my-12 text-gray-1"/>
                    <H2 id="modelInfo">Model information</H2>
                    {requestObj.models.map(model => <ModelSection model={model} key={model.id}/>)}
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const {id} = params;

    if (!id || isNaN(Number(id))) return ssr404;

    const {data, error} = await supabase
        .from<CertificationRequestObj>("publicRequests")
        .select("*, models (*), manufacturers (*)")
        .eq("id", +id);

    if (error) return ssr404;

    if (!(data && data.length)) return ssr404;

    return {props: {requestObj: data[0]}};
}