import { RemoteSettingsInputType } from "./types/remote-setting-input-type";
import { RemoteSettingCommandType } from "./types/remote-settings-command-type";
import { EntityType } from "./types/entity-type";

export interface Condition {
    dependentId: number;
    enabled_if?: string;
    visible_if?: string;
    value: any;
}

export interface Option {
    id: number;
    placement: number;
    label: string;
    inputType: RemoteSettingsInputType;
    value: any;
    step: any;
    borderColor: string;
    enabled:boolean;
    valueOptions: any[];
    minValue: any;
    maxValue: any;
    unit: string;
    roundOff: number;
    revertAfter: number;
    conditions: Condition[];
}

export interface Settings {
    entitySettings: SettingItem[];
    alarmSettings: SettingItem[];
}

export interface SettingItem {
    settingId: number;
    secondarySettingId: number;
    header: string;
    placement: number;
    editable: boolean;
    options: Option[];
    cssClass: string;
    expandCollapseIcon: string;
    isSettingExpanded: boolean;
    moduleId?: string;
}


export interface RemoteSettings {
    controlSerialNumber: number;
    entityId: string;
    timeStamp: string;
    userId: string;
    requestId: string;
    pin: string;
    connectionId: string;
    entityName: string;
    remoteSettingCommandType: RemoteSettingCommandType;
    entityType: EntityType;
    settings: Settings;
}