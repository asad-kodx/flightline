import { RemoteSettingCommandType } from "./types/remote-settings-command-type";

    export interface Setting {
        settingId: number;
        id: number;
        secondarySettingId: number;
        oldValue: any;
        value: any;    
        moduleId?: string;
    }