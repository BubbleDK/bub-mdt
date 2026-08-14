import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ProfilePanelProps {
    title: string;
    icon: ReactNode;
    delay: number;
    children: ReactNode;
    className?: string;
}

export function ProfilePanel({
    title,
    icon,
    delay,
    children,
    className = "",
}: ProfilePanelProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.28 }}
            className={`rounded-2xl border border-white/[0.08] bg-[#252727] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.12)] ${className}`}
        >
            <div className="mb-4 flex items-center gap-2.5 text-sm font-semibold text-neutral-100 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-blue-400">
                {icon}
                {title}
            </div>
            {children}
        </motion.section>
    );
}

export function EmptyProfileData({ children }: { children: ReactNode }) {
    return (
        <p className="rounded-lg border border-dashed border-white/[0.08] bg-black/[0.08] py-4 text-center text-xs text-neutral-600">
            {children}
        </p>
    );
}
