import PrimaryButton from "../components/PrimaryButton";
import SEO from "../components/SEO";
import H1 from "../components/H1";
import DarkSection from "../components/DarkSection";
import Label from "../components/Label";
import Select from "../components/Select";

export default function Home() {
    return (
        <div className="max-w-3xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <H1>Look up model</H1>
            <DarkSection>
                <div className="grid gap-x-4 gap-y-2 grid-flow-col" style={{gridTemplateColumns: "1fr 1fr minmax(0, auto)", gridTemplateRows: "repeat(2, max-content)"}}>
                    <Label>Manufacturer</Label>
                    <Select>
                        <option value="test">test</option>
                        <option value="test2">test2</option>
                    </Select>
                    <Label>Model (leave blank to see all models)</Label>
                    <Select>
                        <option value="test">test</option>
                        <option value="test2">test2</option>
                    </Select>
                    <PrimaryButton className="row-start-2" onClick={() => null}>Search</PrimaryButton>
                </div>
            </DarkSection>
        </div>
    );
}