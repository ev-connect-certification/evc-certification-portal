import {teamOpts, testStatusOpts} from "./types";
import React from "react";

export const getTeam = (key: teamOpts) => ({
    other: "Other",
    sales: "EVC Sales",
    manufacturer: "Hardware Partner",
}[key]);

export const getTier = (key: number) => ({
    1: "Tier 1: Basic OCPP support",
    2: "Tier 2: previous tiers, and RFID support",
    3: "Tier 3: previous tiers, and Smart charging, freevend, credit card, hub satellite support",
    4: "Tier 4: previous tiers, and ISO 15118 support",
    5: "Tier 5: previous tiers, and Vehicle to Grid (V2G) support",
}[key]);

export const TestStatus = ({status}: {status: testStatusOpts}) => (
    <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full ${{
            approved: "border-2 border-yellow-300",
            scheduled: "bg-yellow-300",
            pass: "bg-green-500",
            fail: "bg-red-500",
        }[status]} mr-3`}/>
        <span>{{
            approved: "Awaiting scheduling",
            scheduled: "Scheduled",
            pass: "Pass",
            fail: "Fail",
        }[status]}</span>
    </div>
);