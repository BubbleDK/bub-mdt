import type { RosterOfficer } from "../../../typings";
import { fetchNui } from "../../../utils/fetchNui";
import { isEnvBrowser } from "../../../utils/misc";
import useRosterStore from "../../../stores/roster/roster";
import { mutate } from "../../mdt/api/request";

export const RANKS = [
    "Cadet",
    "Probationary Trooper",
    "Trooper",
    "Senior Trooper",
    "Master Trooper",
    "Corporal",
    "Sergeant",
    "Lieutenant",
    "Captain",
    "Assistant Chief",
    "Chief",
];
export const ROLES = ["apu", "air", "mc", "k9", "fto"] as const;
function updatePreview(citizenid: string, patch: Partial<RosterOfficer>) {
    if (isEnvBrowser())
        useRosterStore
            .getState()
            .setRosterOfficers((officers) =>
                officers.map((officer) =>
                    officer.citizenid === citizenid ? { ...officer, ...patch } : officer
                )
            );
}
export const rosterApi = {
    async list(): Promise<RosterOfficer[]> {
        return isEnvBrowser()
            ? useRosterStore.getState().rosterOfficers
            : fetchNui<RosterOfficer[]>("fetchRoster");
    },
    async hire(citizenid: string, callsign: string) {
        if (isEnvBrowser())
            throw new Error("Hiring requires a connected game server to verify the citizen ID.");
        await mutate("hireOfficer", { citizenid, callsign, lastActive: Date.now() });
    },
    async fire(citizenid: string) {
        await mutate("fireOfficer", citizenid);
        if (isEnvBrowser())
            useRosterStore
                .getState()
                .setRosterOfficers((officers) =>
                    officers.filter((officer) => officer.citizenid !== citizenid)
                );
    },
    async callsign(citizenid: string, callsign: string) {
        await mutate("setOfficerCallSign", { citizenid, callsign });
        updatePreview(citizenid, { callsign });
    },
    async rank(citizenId: string, grade: number) {
        await mutate("setOfficerRank", { citizenId, grade });
        updatePreview(citizenId, { title: RANKS[grade] });
    },
    async roles(citizenid: string, roles: Pick<RosterOfficer, (typeof ROLES)[number]>) {
        await mutate("setOfficerRoles", { citizenid, roles });
        updatePreview(citizenid, roles);
    },
};
