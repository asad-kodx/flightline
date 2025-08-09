export interface LiveValueMessage {
    message_type?: string;
    data?: LiveValueData[];
}

export interface LiveValueData {
    key?: string;
    serialNumber?: number;
    cardIndex?: number;
    slotIndex?: number;
    value?: number;
    valueObject?: LiveValueObjectData;
    mode?: number;
    amps?: number;
    sensorType?: number;
}

export interface LiveValueObjectData {
    label?: string;
    value?: any;
}

