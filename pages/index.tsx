import PrimaryButton from "../components/PrimaryButton";
import SEO from "../components/SEO";

export default function Home() {
    return (
        <div className="max-w-3xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <h1 className="text-2xl font-bold">Look up model</h1>
            <div className="p-4 bg-gray-3 border border-gray-2 my-6">
                <div className="grid gap-x-4 gap-y-2" style={{gridTemplateColumns: "1fr 1fr minmax(0, auto)"}}>
                    <p className="row-start-1 text-gray-1 font-bold">Manufacturer</p>
                    <select className="h-7 border rounded w-full border border-gray-2 shadow-inner px-1 col-start-1 row-start-2">
                        <option value="test">test</option>
                        <option value="test2">test2</option>
                    </select>
                    <p className="row-start-1 text-gray-1 font-bold">Model (leave blank to see all models)</p>
                    <select className="h-7 border rounded w-full border border-gray-2 shadow-inner px-1 col-start-2 row-start-2">
                        <option value="test">test</option>
                        <option value="test2">test2</option>
                    </select>
                    <PrimaryButton className="col-start-3 row-start-2" onClick={() => null}>Search</PrimaryButton>
                </div>
            </div>
        </div>
    );
}