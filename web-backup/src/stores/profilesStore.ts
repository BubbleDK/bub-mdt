import { create } from "zustand";
import { isEnvBrowser } from "../utils/misc";
import { fetchNui } from "../utils/fetchNui";
import { CustomProfileData, PartialProfileData, Profile } from "../typings";
import { useDebouncedValue } from "../utils/useDebouncedValue";
import { useInfiniteQuery } from "@tanstack/react-query";

export type Playerdata = {
	citizenid: string;
	firstname: string;
	lastname: string;
	birthdate: string;
	phone: string;
	fingerprint?: string;
	drivers_license: { hasLicense: boolean; points: number };
	jobs: { job: string; gradeLabel: string }[];
	apartments: string[];
	notes: string;
	image: string;
};

const DEBUG_PROFILES: PartialProfileData[] = [];

for (let i = 0; i < 25; i++) {
	DEBUG_PROFILES[i] = {
		firstname: "Firstname",
		lastname: `Lastname ${i + 1}`,
		dob: Date.now(),
		citizenid: i.toString(),
	};
}

export const DEBUG_PROFILE: Profile = {
	firstname: "John",
	lastname: "Doe",
	citizenid: "BUB193Z4A",
	dob: Date.now(),
	phoneNumber: "123456789",
	notes: "<p></p>",
	vehicles: [
		"Sultan Custom (88ZOH526)",
		"Sultan Custom (07NCV529)",
		"Sultan Custom (07NCV545)",
		"Sultan Custom (07NCV521)",
	],
	relatedReports: [
		{
			title: "Report title",
			id: 1,
			author: "Some One",
			date: "13/03/2023",
		},
		{
			title: "Report title",
			id: 2,
			author: "Some One",
			date: "13/03/2023",
		},
		{
			title: "Report title",
			id: 3,
			author: "Some One",
			date: "13/03/2023",
		},
		{
			title: "Report title",
			id: 4,
			author: "Some One",
			date: "13/03/2023",
		},
	],
	relatedIncidents: [
		{
			title: "Incident 1",
			author: "Someone nice",
			date: "13/03/2023",
			id: 1,
		},
	],
};

const DEBUG_PROFILECARDS: CustomProfileData[] = [
	{ id: "vehicles", title: "Vehicles", icon: "car" },
];

const getProfiles = async (
	page: number,
	search?: string
): Promise<{ hasMore: boolean; profiles: PartialProfileData[] }> => {
	if (isEnvBrowser()) {
		return {
			hasMore: true,
			profiles: DEBUG_PROFILES.slice((page - 1) * 10, page * 10),
		};
	}
	return await fetchNui<{ hasMore: boolean; profiles: PartialProfileData[] }>(
		"getProfiles",
		{ page, search },
		{ data: { hasMore: false, profiles: [] } }
	);
};

export function useProfilesQuery(value: string) {
	const { debouncedValue, isDebouncing } = useDebouncedValue(value);

	const queryInfo = useInfiniteQuery({
		queryKey: ["profiles", debouncedValue],
		queryFn: async ({ queryKey, pageParam = 1 }) => {
			return await getProfiles(pageParam, queryKey[1]);
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => {
			if (!lastPage.hasMore) return;
			return pages.length + 1;
		},
	});

	return { ...queryInfo, isDebouncing };
}

type ProfilesStore = {
	selectedProfile: Profile | null;
	profileCards: CustomProfileData[];
	isProfileWanted: boolean;
	getProfiles: () => Promise<{ profiles: PartialProfileData[] }>;
	setSelectedProfile: (profile: Profile | null) => void;
	setProfileCards: (cards: CustomProfileData[]) => void;
	setIsProfileWanted: (isWanted: boolean) => void;
};

const useProfilesStore = create<ProfilesStore>((set) => ({
	profileCards: [],
	selectedProfile: null,
	isProfileWanted: false,
	getProfiles: async (): Promise<{ profiles: PartialProfileData[] }> => {
		if (isEnvBrowser()) {
			return { profiles: DEBUG_PROFILES };
		}

		return await fetchNui<{ profiles: PartialProfileData[] }>("getAllProfiles");
	},
	setSelectedProfile: (profile: Profile | null) => {
		if (isEnvBrowser())
			set({ selectedProfile: DEBUG_PROFILE, profileCards: DEBUG_PROFILECARDS });

		set({ selectedProfile: profile });
	},
	setProfileCards: (cards: CustomProfileData[]) => set({ profileCards: cards }),
	setIsProfileWanted: (isWanted: boolean) => {
		set({ isProfileWanted: isWanted });
	},
}));

export default useProfilesStore;
