export interface ModelObj {
    id: number,
    manufacturerId: number,
    name: string,
    connectors: ConnectorType[],
    isCreditCard: boolean,
    cardBrand?: string,
    paymentFeatures?: paymentFeaturesOpts[],
    powerLevel: powerLevelOpts,
    mountType: mountTypeOpts,
    isConcurrent?: boolean,
    certificationSupport: certificationSupportOpts[],
    featureSupport: featureSupportOpts[],
    fileKeys: string[],
    isWifi?: boolean,
    isSIM?: boolean,
    isHubSatellite: boolean,
    isWSSSingle: boolean,
    updateFrequency?: string,
}

export type certificationSupportOpts = "ctep" | "ntep";
export type paymentFeaturesOpts = "nfc" | "chip" | "swipe";
export type featureSupportOpts = "rfid" | "smart" | "freevend" | "throttling" | "ota" | "daisy";
export type teamOpts = "manufacturer" | "sales" | "other";
export type powerLevelOpts = "Level 2" | "Level 3";
export type mountTypeOpts = "Pedestal" | "Wall" | "Pole";
export type modelConnectivityOpts = "wifi" | "sim" | "both";
export type connectorTypeFormatOpts = "cable" | "socket";
export type connectorTypePowerTypeOpts = "DC" | "AC_1_PHASE" | "AC_3_PHASE";
export type connectorTypeOpts = "SAE" | "SAE_COMBO" | "CHADEMO" | "CCS" | "CCS2" | "MENNEKES" | "MENNEKES_COMBO" | "SCAME_SOCKET" | "SCAME_CONNECTOR" | "TESLA_R" | "TESLA_S";
export const connectorTypes = ["SAE", "SAE_COMBO", "CHADEMO", "CCS", "CCS2", "MENNEKES", "MENNEKES_COMBO", "SCAME_SOCKET", "SCAME_CONNECTOR", "TESLA_R", "TESLA_S"];
export type urgencyLevelOpts = "high" | "medium" | "low";

export interface ConnectorType {
    type: connectorTypeOpts,
    format: connectorTypeFormatOpts,
    powerType: connectorTypePowerTypeOpts,
    maxPower: number,
    maxVoltage: number,
    maxCurrent: number,
};

export interface PublicRequestObj {
    id: number,
    isHardware: boolean,
    requesterName: string,
    requesterEmail: string,
    requesterTeam: teamOpts,
    manufacturerId: number,
    firmwareVersion: string,
    tier: number, // 1-5
    requestDate: string, // date
    firmwareInfo?: string,
    nextUpdate?: string, // date
    isFirmwareResponsibility?: boolean,
    businessValue?: string,
    amountBusiness?: string,
    urgencyLevel?: urgencyLevelOpts,
    isContractSigned?: boolean,
    shipDate?: string, // date
}

export interface CertificationRequestObj extends PublicRequestObj {
    accessCode: string,
}

export type testStatusOpts = "approved" | "scheduled" | "pass" | "fail";

export interface ManufacturerObj {
    id: number,
    name: string,
}

export interface PublicTestObj {
    id: number,
    requestId: number,
    approveDate: string, // date
    testDate: string, // date
    status: testStatusOpts,
    results: {
        test: string,
        tier: number,
        pass: boolean,
        notes?: string,
    }[],
    chargePointId?: string,
    rfidIds?: string,
}

export interface TestObj extends PublicTestObj {
    accessCode: string,
}