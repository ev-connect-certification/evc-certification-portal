import SEO from "../components/SEO";
import H1 from "../components/H1";
import React, {useState} from "react";
import {GetServerSideProps} from "next";
import {supabase} from "../lib/supabaseClient";
import {ssrRedirect} from "../lib/apiResponses";
import Label from "../components/Label";
import PrimaryButton from "../components/PrimaryButton";
import Input from "../components/Input";
import ThreeCol from "../components/ThreeCol";
import {useToasts} from "react-toast-notifications";
import {getInputStateProps} from "../lib/statePropUtils";

export default function Admin() {
    const {addToast} = useToasts();
    const [manufacturerName, setManufacturerName] = useState<string>("");
    const [addManufacturerLoading, setAddManufacturerLoading] = useState<boolean>(false);

    async function onAddManufacturer() {
        setAddManufacturerLoading(true);

        const {data, error} = await supabase.from("manufacturers")
            .insert([{name: manufacturerName}]);

        setAddManufacturerLoading(false);

        if (error) addToast(error.message, {appearance: "error", autoDismiss: true});
        else {
            addToast("Manufacturer successfully added", {appearance: "success", autoDismiss: true});
            setManufacturerName("");
        }
    }

    return (
        <div className="max-w-3xl mx-auto my-4 p-6 bg-white rounded border shadow-sm mt-20">
            <SEO/>
            <H1>Admin management portal</H1>
            <div className="flex items-end w-full">
                <div className="flex-grow-1 w-full">
                    <Label className="mt-6 mb-2">Add manufacturer</Label>
                    <Input {...getInputStateProps(manufacturerName, setManufacturerName)}/>
                </div>
                <PrimaryButton
                    onClick={onAddManufacturer}
                    className="mt-2 ml-2"
                    isLoading={addManufacturerLoading}
                >Add</PrimaryButton>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
    const {user, error} = await supabase.auth.api.getUserByCookie(req);

    if (!user) return ssrRedirect("/auth/signin");

    return {props: {}};
}