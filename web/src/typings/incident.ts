import type { SelectedCharge } from "./charges";
import type { PartialProfileData } from "./profile";
import type { Officer } from "./officer";

export interface Criminal extends CriminalProfile {
    charges: SelectedCharge[];
    issueWarrant: boolean;
    pleadedGuilty: boolean;
    processed: boolean;
    warrantExpiry?: Date | string | null;
    penalty: {
        time: number;
        fine: number;
        reduction: number | null;
        points: number;
    };
}

export type Evidence = {
    label: string;
    image: string;
};

export interface Incident {
    title: string;
    id: number;
    description?: string;
    officersInvolved: Officer[];
    evidence: Evidence[];
    criminals: Criminal[];
}

export interface PartialIncidentData {
    title: string;
    author: string;
    date: number;
    id: number;
}

export type CriminalProfile = PartialProfileData;
