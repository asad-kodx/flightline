export enum FusionFeatureFlag {
    None = 0,
    Base = 0x01,
    OnlineStatus = 0x02,
    Snapshots = 0x04,
    Reports = 0x08,
    LocalVnc = 0x10,
    FullUpdate = 0x20,
    RemoteSettings = 0x40,
    FertigationSystem = 0x80,
    GenericRemoteControl = 0x100,
    CurrentVersion = Base | OnlineStatus | Snapshots | Reports | LocalVnc |
                     FullUpdate | RemoteSettings | FertigationSystem | GenericRemoteControl
}