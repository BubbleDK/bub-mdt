import type { Announcement, Officer } from "../../../typings";
import useOfficerStore from "../../../stores/officersStore";
import useAnnouncementStore from "../../../stores/announcementStore";
import useBoloStore, { type Bolo } from "../../../stores/bolosStore";
import useWarrantStore, { type Warrant } from "../../../stores/warrantStore";
import useRecentActivityStore, {
    type RecentActivityType,
} from "../../../stores/recentActivityStore";
import { fetchNui } from "../../../utils/fetchNui";
import { mutate } from "../../mdt/api/request";
import { isEnvBrowser } from "../../../utils/misc";
import usePersonalDataStore from "../../../stores/personalDataStore";

const previewNotices: Announcement[] = [];

export const dashboardApi = {
    async officers(): Promise<Officer[]> {
        const response = await fetchNui<Officer[]>("getActiveOfficers", undefined, {
            data: useOfficerStore.getState().activeOfficers,
        });
        const officers = Object.values(response);
        useOfficerStore.setState({ activeOfficers: officers });
        return officers;
    },
    async announcements(): Promise<Announcement[]> {
        await useAnnouncementStore.getState().fetchAnnouncements();
        return [...previewNotices, ...useAnnouncementStore.getState().announcements];
    },
    bolos: () => fetchNui<Bolo[]>("getBolos", undefined, { data: useBoloStore.getState().bolos }),
    async bolo(plate: string): Promise<Bolo> {
        const result = await fetchNui<Bolo | undefined>(
            "getBolo",
            { plate },
            {
                data: useBoloStore.getState().bolos.find((item) => item.plate === plate),
            }
        );
        if (!result) throw new Error("This lookout is no longer available.");
        return result;
    },
    warrants: () =>
        fetchNui<Warrant[]>("getWarrants", undefined, {
            data: useWarrantStore.getState().warrants,
        }),
    activity: () =>
        fetchNui<RecentActivityType[]>("getRecentActivity", undefined, {
            data: useRecentActivityStore.getState().recentActivity,
        }),
    async announce(contents: string) {
        await mutate("createAnnouncement", { contents });
        if (isEnvBrowser()) {
            const person = usePersonalDataStore.getState().personalData;
            previewNotices.unshift({
                id: Date.now(),
                contents,
                createdAt: Date.now(),
                firstname: person.firstname,
                lastname: person.lastname,
                citizenid: person.citizenid,
                callsign: person.callSign,
                position: [0, 0, 0],
                playerId: 0,
            });
        }
    },
};
