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
}

export type certificationSupportOpts = "ctep" | "ntep";
export type paymentFeaturesOpts = "nfc" | "chip" | "swipe";
export type featureSupportOpts = "rfid" | "smart" | "freevend" | "throttling" | "ota" | "daisy";
export type teamOpts = "manufacturer" | "sales" | "other";
export type powerLevelOpts = "Level 2" | "Level 3";
export type mountTypeOpts = "Pedestal" | "Wall" | "Pole";
export type modelConnectivityOpts = "WiFi" | "SIM" | "Both";
export type connectorTypeFormatOpts = "cable" | "socket";
export type connectorTypePowerTypeOpts = "DC" | "AC_1_PHASE" | "AC_3_PHASE";
export type connectorTypeOpts = "SAE" | "SAE_COMBO" | "CHADEMO" | "CCS" | "CCS2" | "MENNEKES" | "MENNEKES_COMBO" | "SCAME_SOCKET" | "SCAME_CONNECTOR" | "TESLA_R" | "TESLA_S";
export const connectorTypes = ["SAE", "SAE_COMBO", "CHADEMO", "CCS", "CCS2", "MENNEKES", "MENNEKES_COMBO", "SCAME_SOCKET", "SCAME_CONNECTOR", "TESLA_R", "TESLA_S"];

export interface ConnectorType {
    type: connectorTypeOpts,
    format: connectorTypeFormatOpts,
    powerType: connectorTypePowerTypeOpts,
    maxPower: number,
    maxVoltage: number,
    maxCurrent: number,
};

export interface CertificationRequestObj {
    id: number,
    isHardware: boolean,
    requesterName: string,
    requesterEmail: string,
    requesterTeam: teamOpts,
    manufacturerId: number,
    modelId: number,
    firmwareVersion: string,
    tier: number, // 1-5
    requestDate: string, // date
    firmwareInfo?: string,
    nextUpdate?: string, // date
    isFirmwareResponsibility?: boolean,
    // wip
}

export interface CertificationTestObj {
    status: certificationTestStatusOpts,
    // wip
}

export type certificationTestStatusOpts = "pending" | "success" | "failed";

export interface ManufacturerObj {
    id: number,
    name: string,
}