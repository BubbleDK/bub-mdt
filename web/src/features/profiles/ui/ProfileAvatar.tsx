import { useState } from "react";
import { getInitials } from "../lib/profileFormatters";

interface ProfileAvatarProps {
    firstname: string;
    lastname: string;
    image?: string;
    size?: "sm" | "lg";
}

export function ProfileAvatar({
    firstname,
    lastname,
    image,
    size = "sm",
}: ProfileAvatarProps) {
    const [imageFailed, setImageFailed] = useState(false);
    const dimensions = size === "lg" ? "h-28 w-24 text-2xl" : "h-12 w-12 text-sm";

    if (image && !imageFailed) {
        return (
            <img
                src={image}
                alt={`${firstname} ${lastname}`}
                onError={() => setImageFailed(true)}
                className={`${dimensions} shrink-0 rounded-xl object-cover ring-1 ring-white/10`}
            />
        );
    }

    return (
        <div
            className={`${dimensions} flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/25 to-cyan-400/10 font-semibold text-blue-100 ring-1 ring-blue-400/20`}
        >
            {getInitials(firstname, lastname)}
        </div>
    );
}
