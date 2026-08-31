import { motion } from "framer-motion";
import { MapPin, ShieldAlert } from "lucide-react";
import type { Profile } from "../../../../typings";
import { formatDate } from "../../lib/profileFormatters";
import { ProfileAvatar } from "../ProfileAvatar";

export function ProfileHero({
    profile,
    isWanted,
    onEditImage,
}: {
    profile: Profile;
    isWanted: boolean;
    onEditImage: () => void;
}) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.28 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#292d31] to-[#242627] p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.14)]"
        >
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/[0.08] blur-3xl" />
            <div className="relative flex items-center gap-4">
                <button
                    onClick={onEditImage}
                    title="Update profile image"
                    aria-label="Update profile image"
                    className="shrink-0 rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                    <ProfileAvatar key={profile.image} {...profile} size="lg" />
                </button>
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                            Active record
                        </span>
                        {isWanted && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-1.5 rounded-full border border-red-400/25 bg-red-400/[0.1] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-red-300"
                            >
                                <ShieldAlert className="h-3 w-3" /> Wanted
                            </motion.span>
                        )}
                    </div>
                    <h1 className="break-words text-2xl font-semibold tracking-tight text-white">
                        {profile.firstname} {profile.lastname}
                    </h1>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-400">
                        <MapPin className="h-4 w-4 text-neutral-500" />
                        Los Santos resident
                        <span className="text-neutral-700">/</span>
                        Born {formatDate(profile.dob)}
                    </p>
                </div>
            </div>
        </motion.section>
    );
}
