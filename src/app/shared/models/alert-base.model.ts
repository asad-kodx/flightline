import { AlertState } from "./types/alert-state";
import { AlertType } from "./types/alert-type";

export interface AlertBase {
    id: number;
    title?: string;
    description?: string;
    serialNumber?: string;
    state?: AlertState;
    type?: AlertType;
    controlId?: number;
    created?: Date;
    cleared?: Date;
}