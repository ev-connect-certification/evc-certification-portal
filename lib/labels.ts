import {teamOpts} from "./types";

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