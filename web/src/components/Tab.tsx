import * as React from "react";
import { motion, Reorder } from "framer-motion";
import { CloseIcon } from "./icons/CloseIcon";

interface Props {
    item: { id: string; label: string };
    isSelected: boolean;
    onClick: () => void;
    onRemove: () => void;
}

export const Tab = ({ item, onClick, onRemove, isSelected }: Props) => {
    return (
        <Reorder.Item
            value={item}
            id={item.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{
                opacity: 1,
                color: isSelected ? "blue" : "white",
                y: 0,
                transition: { duration: 0.15 },
            }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
            whileDrag={{ color: "blue" }}
            className={"flex gap-2 rounded-md items-center h-full"}
            onPointerDown={onClick}
        >
            <motion.span
                layout="position"
                style={{ color: isSelected ? "blue" : "white" }}
            >{`${item.label}`}</motion.span>
            <motion.div layout className="rounded-md">
                <motion.button
                    onPointerDown={(event) => {
                        event.stopPropagation();
                        onRemove();
                    }}
                    initial={false}
                    animate={{
                        color: isSelected ? "blue" : "white",
                    }}
                >
                    <CloseIcon />
                </motion.button>
            </motion.div>
        </Reorder.Item>
    );
};
