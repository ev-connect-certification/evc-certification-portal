import {GetServerSideProps} from "next";
import {supabaseAdmin} from "../../lib/supabaseAdmin";
import {CertificationRequestObj, ManufacturerObj, ModelObj} from "../../lib/types";
import SEO from "../../components/SEO";
import LinkWrapper from "../../components/LinkWrapper";
import {FiArrowLeft} from "react-icons/fi";
import H1 from "../../components/H1";

export default function RequestPage({requestObj}: {requestObj: CertificationRequestObj & {models: ModelObj[]} & {manufacturers: ManufacturerObj[]}}) {
    return (
        <div className="max-w-3xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <H1 className="mb-4">Request: {requestObj.manufacturers.name} {requestObj.models.name} @ {requestObj.firmwareVersion}</H1>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const {id} = params;

    if (!id || isNaN(Number(id))) return {notFound: true};

    const {data, error} = await supabaseAdmin
        .from<CertificationRequestObj>("requests")
        .select("*, models (*), manufacturers (*)")
        .eq("id", +id);

    console.log(data, error);

    if (error) return {notFound: true};

    if (!(data && data.length)) return {notFound: true};

    return {props: {requestObj: data[0]}};
}