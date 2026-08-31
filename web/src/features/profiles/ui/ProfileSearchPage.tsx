import { AnimatePresence, motion } from "framer-motion";
import { Search, Users, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PartialProfileData } from "../../../typings";
import { useProfileSearch } from "../model/useProfiles";
import { ProfileSearchCard } from "./ProfileSearchCard";

const listAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.035 } },
};

export function ProfileSearchPage() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const {
        profiles,
        isLoading,
        isFetching,
        isDebouncing,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isError,
        refetch,
    } = useProfileSearch(search);
    const isSearching = isDebouncing || (isFetching && !isFetchingNextPage);

    const openProfile = (profile: PartialProfileData) => {
        navigate(profile.citizenid, { state: { profile } });
    };

    return (
        <motion.main
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex h-full flex-col overflow-hidden bg-transparent"
        >
            <header className="border-b border-white/[0.07] px-7 pb-6 pt-7">
                <div className="mb-6 flex flex-wrap gap-3 items-end justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                            <Users className="h-4 w-4" />
                            Citizen database
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            Profiles
                        </h1>
                        <p className="mt-1 text-sm text-neutral-400">
                            Search and review citizen records across Los Santos.
                        </p>
                    </div>
                    <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-neutral-400">
                        {profiles.length} records loaded
                    </div>
                </div>

                <div className="relative max-w-2xl">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <label htmlFor="profile-search" className="sr-only">
                        Search profiles
                    </label>
                    <input
                        id="profile-search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by name or citizen ID..."
                        autoComplete="off"
                        className="h-12 w-full rounded-xl border border-white/[0.09] bg-[#252727] pl-11 pr-11 text-sm text-white shadow-sm outline-none transition placeholder:text-neutral-500 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
                    />
                    <AnimatePresence>
                        {search && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-neutral-500 transition hover:bg-white/[0.06] hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                    {isSearching && (
                        <div className="absolute -bottom-px left-3 right-3 h-px overflow-hidden">
                            <motion.div
                                className="h-full w-1/3 bg-blue-400"
                                animate={{ x: ["-100%", "400%"] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    )}
                </div>
            </header>

            <section className="min-h-0 flex-1 overflow-y-auto px-7 py-5">
                {isLoading ? (
                    <ProfileListSkeleton />
                ) : isError ? (
                    <ProfileSearchError onRetry={() => refetch()} />
                ) : profiles.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                        <div className="mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                            <Search className="h-7 w-7 text-neutral-500" />
                        </div>
                        <h2 className="font-medium text-white">No matching profiles</h2>
                        <p className="mt-1 text-sm text-neutral-500">
                            Try another name or citizen ID.
                        </p>
                    </div>
                ) : (
                    <motion.div
                        key={search}
                        variants={listAnimation}
                        initial="hidden"
                        animate="visible"
                        className="profile-search-grid grid grid-cols-2 gap-3"
                    >
                        {profiles.map((profile) => (
                            <ProfileSearchCard
                                key={profile.citizenid}
                                profile={profile}
                                onSelect={() => openProfile(profile)}
                            />
                        ))}
                    </motion.div>
                )}

                {hasNextPage && (
                    <button
                        type="button"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="mx-auto mt-5 block rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-neutral-300 transition hover:bg-white/[0.07] disabled:opacity-50"
                    >
                        {isFetchingNextPage ? "Loading records..." : "Load more profiles"}
                    </button>
                )}
            </section>
        </motion.main>
    );
}

function ProfileSearchError({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center" role="alert">
            <div className="mb-4 rounded-2xl border border-red-400/15 bg-red-400/[0.06] p-4">
                <Users className="h-7 w-7 text-red-300" />
            </div>
            <h2 className="font-medium text-white">Profiles could not be loaded</h2>
            <p className="mt-1 text-sm text-neutral-500">Check the connection and try again.</p>
            <button
                type="button"
                onClick={onRetry}
                className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
                Try again
            </button>
        </div>
    );
}

function ProfileListSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }, (_, index) => (
                <div
                    key={index}
                    className="flex animate-pulse items-center gap-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4"
                >
                    <div className="h-12 w-12 rounded-xl bg-white/[0.06]" />
                    <div className="flex-1 space-y-2.5">
                        <div className="h-3 w-1/3 rounded bg-white/[0.07]" />
                        <div className="h-2.5 w-2/3 rounded bg-white/[0.04]" />
                    </div>
                </div>
            ))}
        </div>
    );
}
