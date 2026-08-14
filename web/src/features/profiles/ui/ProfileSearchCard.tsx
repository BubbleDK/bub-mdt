import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, IdCard } from "lucide-react";
import type { PartialProfileData } from "../../../typings";
import { formatDate } from "../lib/profileFormatters";
import { ProfileAvatar } from "./ProfileAvatar";

const cardAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

export function ProfileSearchCard({
    profile,
    onSelect,
}: {
    profile: PartialProfileData;
    onSelect: () => void;
}) {
    return (
        <motion.button
            type="button"
            variants={cardAnimation}
            onClick={onSelect}
            className="group flex items-center gap-4 rounded-xl border border-white/[0.075] bg-[#252727] p-4 text-left shadow-[0_8px_22px_rgba(0,0,0,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-[#292d32] hover:shadow-[0_14px_36px_rgba(0,0,0,0.16)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
            <ProfileAvatar {...profile} />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-100">
                    {profile.firstname} {profile.lastname}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(profile.dob)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <IdCard className="h-3.5 w-3.5" />
                        {profile.citizenid}
                    </span>
                </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-neutral-600 transition group-hover:translate-x-1 group-hover:text-blue-400" />
        </motion.button>
    );
}
