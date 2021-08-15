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
            <p className="text-sm text-gray-1 my-4">Information about requesting certification</p>
            <div className="flex">
                <PrimaryButton href="/request/new">Next</PrimaryButton>
            </div>
        </div>
    );
}