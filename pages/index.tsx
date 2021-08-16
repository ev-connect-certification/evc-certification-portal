import PrimaryButton from "../components/PrimaryButton";
import SEO from "../components/SEO";
import H1 from "../components/H1";
import DarkSection from "../components/DarkSection";
import Label from "../components/Label";
import Select from "../components/Select";
import {supabase} from "../lib/supabaseClient";
import {ManufacturerObj, ModelObj, PublicRequestObj, testStatusOpts} from "../lib/types";
import React, {useEffect, useState} from "react";
import {getSelectStateProps} from "../lib/statePropUtils";
import {useRouter} from "next/router";
import {useToasts} from "react-toast-notifications";
import LinkWrapper from "../components/LinkWrapper";

export default function Home() {
    const router = useRouter();
    const {addToast} = useToasts();
    const [manufacturers, setManufacturers] = useState<ManufacturerObj[]>([]);
    const [models, setModels] = useState<ModelObj[]>([]);
    const [modelId, setModelId] = useState<number>(0);
    const [manufacturerId, setManufacturerId] = useState<number | null>(null);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<(ModelObj &
        {publicRequests: (PublicRequestObj &
            {publicTests: {testDate: string, approveDate: string, status: testStatusOpts}[]}
        )[]}
    )[]>([]);

    async function onSearch() {
        setSearchLoading(true);

        let request = supabase.from("models")
            .select("*, publicRequests (*, publicTests (testDate, approveDate, status))")
            .eq("manufacturerId", manufacturerId);

        if (modelId) request = request.eq("id", modelId);

        const {data, error} = await request;

        setSearchLoading(false);

        if (error) return addToast(error.message, {appearance: "error", autoDismiss: true});

        setSearchResults(data);
    }

    useEffect(() => {
        (async () => {
            const {data: ManufacturerData, error: ManufacturerError} = await supabase
                .from<ManufacturerObj>("manufacturers")
                .select("*");

            if (ManufacturerData && ManufacturerData.length) setManufacturers(ManufacturerData);

            setManufacturerId(ManufacturerData[0].id);

            const {data: ModelData, error: ModelError} = await supabase
                .from<ModelObj>("models")
                .select("*");

            if (ModelData && ModelData.length) setModels(ModelData);
        })();
    }, []);

    useEffect(() => {
        if (router.query.newsignin) addToast("Successfully signed in", {appearance: "success", autoDismiss: true});
    }, [router.query]);

    return (
        <div className="max-w-3xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <H1>Look up model</H1>
            <DarkSection>
                <div className="grid gap-x-4 gap-y-2 grid-flow-col" style={{gridTemplateColumns: "1fr 1fr minmax(0, auto)", gridTemplateRows: "repeat(2, max-content)"}}>
                    <Label>Manufacturer</Label>
                    <Select {...getSelectStateProps(manufacturerId ? manufacturerId.toString() : "", d => {
                        setModelId(0);
                        setManufacturerId(+d);
                    })}>
                        {manufacturers.map(d => (
                            <option value={d.id} key={`manufacturer-option-${d.id}`}>{d.name}</option>
                        ))}
                    </Select>
                    <Label>Model (leave blank to see all models)</Label>
                    <Select {...getSelectStateProps(modelId.toString(), d => setModelId(+d))}>
                        <option value={0}>All</option>
                        {models.filter(d => d.manufacturerId === manufacturerId).map(d => (
                            <option value={d.id} key={`model-option-${d.id}`}>{d.name}</option>
                        ))}
                    </Select>
                    <PrimaryButton containerClassName="row-start-2" onClick={onSearch} isLoading={searchLoading}>Search</PrimaryButton>
                </div>
            </DarkSection>
            {!!searchResults.length && (
                <div className="flex items-center h-12">
                    <div className="w-1/2"><Label>Model name</Label></div>
                    <div className="w-1/2"><Label>Certified firmware versions (click for more info)</Label></div>
                </div>
            )}
            {searchResults.map(result => {
                const processedRequests = result.publicRequests.map(request => ({
                    id: request.id,
                    version: request.firmwareVersion,
                    pass: request.publicTests && request.publicTests.length && request.publicTests.sort((
                        a,
                        b
                    ) => +new Date(b.approveDate) - +new Date(a.approveDate))[0].status === "pass",
                }));

                return (
                    <div key={result.id} className="flex items-center h-12">
                        <div className="w-1/2 text-sm"><span>{result.name}</span></div>
                        <div className="w-1/2 text-sm text-gray-1">
                            {processedRequests
                                .map((d, i) => (
                                    <React.Fragment key={`request-link-${d.id}`}>
                                        {i !== 0 && (
                                            <span>, </span>
                                        )}
                                        <LinkWrapper href={`/request/${d.id}`}>
                                            {d.version + (d.pass ? "" : ` (requested)`)}
                                        </LinkWrapper>
                                    </React.Fragment>
                                ))
                            }
                        </div>
                    </div>
                )
            })}
            <DarkSection className="mb-0 flex items-center">
                <p className="text-sm text-gray-1">If the model you're looking for isn't listed here, that means we haven't certified it. To request a certification, click "Request Certification".</p>
                <PrimaryButton containerClassName="flex-shrink-0 ml-2" href="/request/info">Request certification</PrimaryButton>
            </DarkSection>
        </div>
    );
}