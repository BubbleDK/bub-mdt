import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type { PartialProfileData } from "../../../typings";
import { useDebouncedValue } from "../../../utils/useDebouncedValue";
import {
    fetchProfile,
    fetchProfiles,
    fetchWantedStatus,
    saveProfileNotes,
} from "../api/profilesApi";

export function useProfileSearch(search: string) {
    const { debouncedValue, isDebouncing } = useDebouncedValue(search);
    const query = useInfiniteQuery({
        queryKey: ["profiles", debouncedValue],
        queryFn: ({ pageParam }) => fetchProfiles(pageParam, debouncedValue),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) =>
            lastPage.hasMore ? pages.length + 1 : undefined,
    });

    return {
        ...query,
        isDebouncing,
        profiles: query.data?.pages.flatMap((page) => page.profiles) ?? [],
    };
}

export function useProfile(
    citizenid: string,
    summary?: PartialProfileData
) {
    const profileQuery = useQuery({
        queryKey: ["profile", citizenid],
        queryFn: () => fetchProfile(citizenid, summary),
    });
    const wantedQuery = useQuery({
        queryKey: ["profile-wanted", citizenid],
        queryFn: () => fetchWantedStatus(citizenid),
    });
    const notesMutation = useMutation({
        mutationFn: (notes: string) => saveProfileNotes(citizenid, notes),
    });

    return { profileQuery, wantedQuery, notesMutation };
}
