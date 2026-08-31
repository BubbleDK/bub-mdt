import dayjs from "dayjs";
import type { Criminal, SelectedCharge } from "../../../typings";
import { fetchNui } from "../../../utils/fetchNui";
import { isEnvBrowser } from "../../../utils/misc";
import { createBrowserIncident, setBrowserIncident } from "../mocks/incidentFixtures";
import { mutate } from "../../mdt/api/request";

export function calculatePenalty(charges: SelectedCharge[]): Criminal["penalty"] {
    return charges.reduce(
        (total, charge) => ({
            ...total,
            time: total.time + charge.time * charge.count,
            fine: total.fine + charge.fine * charge.count,
            points: total.points + charge.points * charge.count,
        }),
        { time: 0, fine: 0, points: 0, reduction: null } as Criminal["penalty"]
    );
}
export function reducedPenalty(value: number, reduction: number | null) {
    return Math.round(value * (1 - (reduction ?? 0) / 100));
}
export const criminalsApi = {
    recommendedExpiry: (charges: SelectedCharge[]) =>
        fetchNui<number>("getRecommendedWarrantExpiry", charges, {
            data: Date.now() + 72 * 3600000,
        }),
    async save(id: number, criminal: Criminal) {
        await mutate("saveCriminal", {
            id,
            criminal: {
                ...criminal,
                warrantExpiry: criminal.warrantExpiry
                    ? dayjs(criminal.warrantExpiry).format("YYYY-MM-DD HH:mm:ss")
                    : null,
            },
        });
        if (isEnvBrowser()) {
            const incident = createBrowserIncident(id);
            setBrowserIncident({
                ...incident,
                criminals: incident.criminals.map((item) =>
                    item.citizenid === criminal.citizenid ? criminal : item
                ),
            });
        }
    },
};
