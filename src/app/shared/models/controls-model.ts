import { SoftwareType } from "./types/software-type";

export interface Control {
    appOnline?: boolean;
    authorizationToken?: string;
    bootDevice?: number;
    bridgeOnline?: boolean;
    controlId?: number;
    created?: Date;
    devices?: any;
    isFavorite?: boolean;
    lastUpdated?: Date;
    latitude?: string;
    longitude?: string;
    name?: string;
    status?: number;
    fusionStatus: number;
    fusionFeatureVersion?: number;
    rooms?: any;
    sensors?: any;
    serialNumber?: number;
    siteId: number;
    updateStatus?: number;
    version?: string;
    alarmCount?: number;
    lastMqttPing: Date;
    lastHttpPing: Date;
    softwareType: SoftwareType

    // value fields
    lengthUnits: string;
    pressureUnits: string;
    temperatureUnits: string;
    volumeRateUnits: string;
    volumeUnits: string;
    massUnits: string;
}
