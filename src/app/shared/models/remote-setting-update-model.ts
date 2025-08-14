import { RemoteSettingCommandType } from "./types/remote-settings-command-type";

    export class Setting {
        settingId: number = 0;
        id: number = 0;
        secondarySettingId: number = 0;
        oldValue: any;
        value: any;    
        moduleId?: string;
    }