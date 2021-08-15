import SEO from "../../components/SEO";
import H1 from "../../components/H1";

export default function RequestSuccess({}: {}) {
    return (
        <div className="max-w-3xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <H1 className="mb-4">Certification successfully requested</H1>
            <p className="text-sm text-gray-1 my-2">An EV Connect team member will let you know when we are ready to proceed with certification.</p>
            <p className="text-sm text-gray-1 mt-2">If there is missing or invalid information in your request, you may be asked to re-submit the request.</p>
        </div>
    );
}