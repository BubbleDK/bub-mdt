import {
    BadgeCheck,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CarFront,
    ClipboardList,
    Fingerprint,
    IdCard,
    Phone,
} from "lucide-react";
import type { ReactNode } from "react";
import type { CustomProfileData, Profile } from "../../../../typings";
import { formatDate } from "../../lib/profileFormatters";
import { EmptyProfileData, ProfilePanel } from "./ProfilePanel";

export const DEFAULT_PROFILE_CARDS: CustomProfileData[] = [
    { id: "licenses", title: "Licenses", icon: "certificate" },
    { id: "vehicles", title: "Vehicles", icon: "car" },
    { id: "jobs", title: "Jobs", icon: "briefcase" },
    { id: "properties", title: "Properties", icon: "building-skyscraper" },
];

export function ProfileInformation({
    profile,
    cards,
}: {
    profile: Profile;
    cards: CustomProfileData[];
}) {
    return (
        <div className="flex h-full flex-col gap-5">
            <ProfilePanel
                title="Personal information"
                icon={<IdCard />}
                delay={0.14}
            >
                <div className="grid grid-cols-2 gap-3">
                    <InformationField icon={<IdCard />} label="Citizen ID" value={profile.citizenid} mono />
                    <InformationField icon={<CalendarDays />} label="Date of birth" value={formatDate(profile.dob)} />
                    <InformationField icon={<Phone />} label="Phone number" value={profile.phoneNumber || "Not registered"} />
                    <InformationField icon={<Fingerprint />} label="Fingerprint" value={profile.fingerprint || "Not registered"} mono />
                </div>
            </ProfilePanel>

            <ProfilePanel
                title="Additional information"
                icon={<CarFront />}
                delay={0.18}
                className="flex-1"
            >
                <div className="grid grid-cols-2 gap-4">
                    {cards.map((card) => (
                        <ProfileDataGroup
                            key={card.id}
                            card={card}
                            values={getCardValues(profile, card.id)}
                        />
                    ))}
                </div>
            </ProfilePanel>
        </div>
    );
}

function InformationField({
    icon,
    label,
    value,
    mono = false,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-[#202222] px-2.5 py-2">
            <div className="mb-0.5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-neutral-600 [&_svg]:h-3.5 [&_svg]:w-3.5">
                {icon} {label}
            </div>
            <p className={`truncate text-sm text-neutral-200 ${mono ? "font-mono" : ""}`} title={value}>
                {value}
            </p>
        </div>
    );
}

function ProfileDataGroup({
    card,
    values,
}: {
    card: CustomProfileData;
    values: string[];
}) {
    return (
        <div className="flex h-[122px] min-w-0 flex-col">
            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:text-blue-400">
                    {getProfileCardIcon(card.id)}
                    {card.title}
                </div>
                <span className="text-[11px] text-neutral-600">{values.length}</span>
            </div>
            {values.length ? (
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2">
                    <div className="flex flex-wrap gap-2">
                        {values.map((value) => (
                            <span
                                key={value}
                                className="rounded-lg border border-white/[0.08] bg-white/[0.045] px-2.5 py-2 text-xs text-neutral-300"
                            >
                                {value}
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex min-h-0 flex-1 items-center [&>p]:w-full">
                    <EmptyProfileData>
                        No {card.title.toLowerCase()} registered
                    </EmptyProfileData>
                </div>
            )}
        </div>
    );
}

function getCardValues(profile: Profile, cardId: string): string[] {
    const value = profile[cardId];
    return Array.isArray(value) ? (value as string[]) : [];
}

function getProfileCardIcon(id: string): ReactNode {
    switch (id) {
        case "licenses": return <BadgeCheck />;
        case "vehicles": return <CarFront />;
        case "jobs": return <BriefcaseBusiness />;
        case "properties": return <Building2 />;
        default: return <ClipboardList />;
    }
}
