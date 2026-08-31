import type { PartialProfileData, Profile } from "../../../typings";
import { fetchNui } from "../../../utils/fetchNui";
import { isEnvBrowser } from "../../../utils/misc";
import { mutate } from "../../mdt/api/request";
import {
    browserProfiles,
    createBrowserProfile,
    isBrowserProfileWanted,
} from "../mocks/profileFixtures";

const PAGE_SIZE = 10;
const previewEdits = new Map<string, Partial<Profile>>();

export interface ProfilesPageData {
    hasMore: boolean;
    profiles: PartialProfileData[];
}

export async function fetchProfiles(page: number, search: string): Promise<ProfilesPageData> {
    if (!isEnvBrowser()) {
        return fetchNui<ProfilesPageData>("getProfiles", { page, search });
    }

    const query = search.trim().toLowerCase();
    const matches = browserProfiles.filter((profile) =>
        `${profile.firstname} ${profile.lastname} ${profile.citizenid}`
            .toLowerCase()
            .includes(query)
    );
    const offset = (page - 1) * PAGE_SIZE;

    return {
        profiles: matches.slice(offset, offset + PAGE_SIZE),
        hasMore: offset + PAGE_SIZE < matches.length,
    };
}

export async function fetchProfile(
    citizenid: string,
    summary?: PartialProfileData
): Promise<Profile> {
    if (isEnvBrowser())
        return { ...createBrowserProfile(citizenid, summary), ...previewEdits.get(citizenid) };
    return fetchNui<Profile>("getProfile", citizenid);
}

export async function fetchWantedStatus(citizenid: string): Promise<boolean> {
    return fetchNui<boolean>("isProfileWanted", citizenid, {
        data: isBrowserProfileWanted(citizenid),
        delay: 120,
    });
}

export async function saveProfileNotes(citizenid: string, notes: string): Promise<void> {
    await mutate("saveProfileNotes", { citizenid, notes });
    if (isEnvBrowser()) previewEdits.set(citizenid, { ...previewEdits.get(citizenid), notes });
}

export async function saveProfileImage(citizenId: string, image: string) {
    await mutate("updateProfileImage", { citizenId, image });
    if (isEnvBrowser()) previewEdits.set(citizenId, { ...previewEdits.get(citizenId), image });
}
