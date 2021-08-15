import PrimaryButton from "../components/PrimaryButton";
import SEO from "../components/SEO";
import H1 from "../components/H1";
import DarkSection from "../components/DarkSection";
import Label from "../components/Label";
import Select from "../components/Select";
import {supabase} from "../lib/supabaseClient";
import {ManufacturerObj, ModelObj} from "../lib/types";
import {useEffect, useState} from "react";
import {getSelectStateProps} from "../lib/statePropUtils";

export default function Home() {
    const [manufacturers, setManufacturers] = useState<ManufacturerObj[]>([]);
    const [models, setModels] = useState<ModelObj[]>([]);
    const [modelId, setModelId] = useState<number>(0);
    const [manufacturerId, setManufacturerId] = useState<number | null>(null);

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
                        <option value={0}>None</option>
                        {models.filter(d => d.manufacturerId === manufacturerId).map(d => (
                            <option value={d.id} key={`model-option-${d.id}`}>{d.name}</option>
                        ))}
                    </Select>
                    <PrimaryButton className="row-start-2" onClick={() => null}>Search</PrimaryButton>
                </div>
            </DarkSection>
        </div>
    );
}