import { motion } from "framer-motion";
import { ArrowLeft, LoaderCircle, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useProfilesStore from "../../../stores/profilesStore";
import type { PartialProfileData } from "../../../typings";
import { plainTextNotes } from "../lib/profileFormatters";
import { useProfile } from "../model/useProfiles";
import { ProfileHero } from "./detail/ProfileHero";
import {
    DEFAULT_PROFILE_CARDS,
    ProfileInformation,
} from "./detail/ProfileInformation";
import { ProfileNotesPanel } from "./detail/ProfileNotesPanel";
import { RelatedRecordsPanel } from "./detail/RelatedRecordsPanel";

interface ProfileLocationState {
    profile?: PartialProfileData;
}

export function ProfileDetailPage() {
    const { citizenId = "" } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const configuredCards = useProfilesStore((state) => state.profileCards);
    const summary = (location.state as ProfileLocationState | null)?.profile;
    const { profileQuery, wantedQuery, notesMutation } = useProfile(
        citizenId,
        summary
    );
    const [notes, setNotes] = useState("");
    const profile = profileQuery.data;

    useEffect(() => {
        if (profile) setNotes(plainTextNotes(profile.notes));
    }, [profile]);

    if (profileQuery.isLoading) return <ProfileLoadingState />;
    if (!profile) {
        return <ProfileErrorState onBack={() => navigate("/profiles")} />;
    }

    const profileCards = configuredCards.length
        ? configuredCards
        : DEFAULT_PROFILE_CARDS;

    const updateNotes = (value: string) => {
        if (notesMutation.isSuccess || notesMutation.isError) {
            notesMutation.reset();
        }
        setNotes(value);
    };

    return (
        <motion.main
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 18 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="h-full overflow-y-auto bg-transparent"
        >
            <ProfileToolbar
                citizenId={profile.citizenid}
                onBack={() => navigate(-1)}
            />

            <div className="p-6">
                <ProfileHero
                    profile={profile}
                    isWanted={wantedQuery.data === true}
                />

                <div className="mt-5 grid grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] items-stretch gap-5">
                    <ProfileNotesPanel
                        notes={notes}
                        onChange={updateNotes}
                        onSave={() => notesMutation.mutate(notes)}
                        isSaving={notesMutation.isPending}
                        isSaved={notesMutation.isSuccess}
                        hasError={notesMutation.isError}
                    />
                    <ProfileInformation profile={profile} cards={profileCards} />
                </div>

                <RelatedRecordsPanel
                    reports={profile.relatedReports ?? []}
                    incidents={profile.relatedIncidents ?? []}
                    onOpenReports={() => navigate("/reports")}
                    onOpenIncidents={() => navigate("/incidents")}
                />
            </div>
        </motion.main>
    );
}

function ProfileToolbar({
    citizenId,
    onBack,
}: {
    citizenId: string;
    onBack: () => void;
}) {
    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.07] bg-brand-dark/90 px-6 backdrop-blur-xl">
            <button
                type="button"
                onClick={onBack}
                className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-neutral-400 transition hover:bg-white/[0.05] hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
                Back to profiles
            </button>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>Citizen record</span>
                <span className="rounded-md border border-white/[0.09] bg-white/[0.045] px-2 py-1 font-mono text-neutral-300">
                    {citizenId}
                </span>
            </div>
        </header>
    );
}

function ProfileLoadingState() {
    return (
        <div className="flex h-full items-center justify-center" role="status">
            <LoaderCircle className="h-6 w-6 animate-spin text-blue-400" />
            <span className="sr-only">Loading profile</span>
        </div>
    );
}

function ProfileErrorState({ onBack }: { onBack: () => void }) {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center">
            <UserRound className="mb-3 h-8 w-8 text-neutral-600" />
            <h1 className="font-semibold text-white">Profile unavailable</h1>
            <button
                type="button"
                onClick={onBack}
                className="mt-3 text-sm text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
                Return to profiles
            </button>
        </div>
    );
}
