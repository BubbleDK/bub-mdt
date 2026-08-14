import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = ({
    label,
    error,
    value,
    onFocus,
    onBlur,
    className = "",
    ...rest
}: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    const showLabelAsFloating = isFocused || (value != null && value !== "");

    return (
        <motion.div
            className="relative w-full"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <motion.label
                initial={false}
                animate={{
                    top: showLabelAsFloating ? "0.15rem" : "50%",
                    left: "0.75rem",
                    fontSize: showLabelAsFloating ? "0.75rem" : "1rem",
                    translateY: showLabelAsFloating ? "0%" : "-50%",
                    color: error
                        ? "#f87171"
                        : isFocused
                        ? "#ffffff"
                        : "#9ca3af",
                }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 pointer-events-none"
            >
                {label}
            </motion.label>

            <input
                className={`w-full px-3 pt-5 pb-2 text-white bg-transparent border rounded-lg outline-none border-gray-600 focus:border-white transition-all duration-200 ${className}`}
                value={value}
                onFocus={(e) => {
                    setIsFocused(true);
                    onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    onBlur?.(e);
                }}
                {...rest}
            />

            <AnimatePresence>
                {error && (
                    <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-red-400 mt-1 ml-1 absolute -bottom-5"
                    >
                        {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
