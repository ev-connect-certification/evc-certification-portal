import Label from "./Label";
import TextArea from "./TextArea";
import Input from "./Input";
import Radio from "./Radio";
import React, {Dispatch, SetStateAction} from "react";

export default function NewFirmware({
    firmwareInfo,
    setFirmwareInfo,
    nextUpdate,
    setNextUpdate,
    isFirmwareResponsibility,
    setIsFirmwareResponsibility,
                                    }: {
    firmwareInfo: string,
    setFirmwareInfo: Dispatch<SetStateAction<string>>,
    nextUpdate: string,
    setNextUpdate: Dispatch<SetStateAction<string>>,
    isFirmwareResponsibility: boolean,
    setIsFirmwareResponsibility: Dispatch<SetStateAction<boolean>>,
}) {
    return (
        <>
            <Label className="mb-2">What has been updated in the firmware?</Label>
            <TextArea
                value={firmwareInfo}
                onChange={e => setFirmwareInfo((e.target as HTMLInputElement).value)}
            />
            <Label className="mt-6 mb-2">When is the next firmware update?</Label>
            <Input
                type="date"
                value={nextUpdate}
                onChange={e => setNextUpdate((e.target as HTMLInputElement).value)}
            />
            <Label className="mt-6 mb-2">Will you be responsible for doing all over-the-air firmware updates?</Label>
            <div className="grid grid-cols-2">
                <Radio
                    id="ota-res-yes"
                    label="Yes"
                    name="ota-responsibility"
                    checked={isFirmwareResponsibility}
                    onChange={e => setIsFirmwareResponsibility((e.target as HTMLInputElement).checked)}
                />
                <Radio
                    id="ota-res-no"
                    label="No"
                    name="ota-responsibility"
                    checked={!isFirmwareResponsibility}
                    onChange={e => setIsFirmwareResponsibility(!(e.target as HTMLInputElement).checked)}
                />
            </div>
        </>
    );
}