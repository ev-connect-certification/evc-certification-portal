import Button from "./Button";
import React from "react";
import {supabase} from "../lib/supabaseClient";

export default function DownloadButton({bucketName, fileKey, filePath}: {bucketName: string, fileKey: string, filePath: string}) {
    async function downloadFile() {
        console.log(filePath + fileKey);

        const {data, error} = await supabase
            .storage
            .from(bucketName)
            .download(filePath + fileKey);

        if (error) return console.log(error);

        if (data) {
            const url = window.URL.createObjectURL(data);
            window.location.href = url;
        }
    }

    return (
        <Button
            className="underline text-sm"
            onClick={downloadFile}
        >{fileKey} (click to download)</Button>
    );
}