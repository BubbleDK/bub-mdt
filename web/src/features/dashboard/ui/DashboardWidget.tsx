import { useDraggable } from "@dnd-kit/core";
import { Rnd } from "react-rnd";
import { GRID_CELL_HEIGHT, GRID_CELL_WIDTH } from "../model/dashboardGrid";
import { memo } from "react";

interface Props {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    onResize: (id: string, width: number, height: number) => void;
    containerSize: { width: number; height: number };
}

export const DashboardWidget = memo(
    ({ id, x, y, w, h, onResize }: Props) => {
        const { attributes, listeners, setNodeRef, transform } = useDraggable({
            id,
        });

        const translateX = transform?.x ?? 0;
        const translateY = transform?.y ?? 0;

        const pixelX = x * GRID_CELL_WIDTH;
        const pixelY = y * GRID_CELL_HEIGHT;
        const width = w * GRID_CELL_WIDTH;
        const height = h * GRID_CELL_HEIGHT;

        return (
            <Rnd
                size={{ width, height }}
                position={{ x: pixelX, y: pixelY }}
                onResizeStop={(_event, _direction, ref) => {
                    onResize(id, ref.offsetWidth, ref.offsetHeight);
                }}
                bounds="parent"
                enableResizing={{ bottomRight: true }}
                disableDragging
                className="absolute"
            >
                <div
                    ref={setNodeRef}
                    {...listeners}
                    {...attributes}
                    className="w-full h-full bg-white rounded-md p-2 cursor-move"
                    style={{
                        transform: `translate(${translateX}px, ${translateY}px)`,
                    }}
                >
                    <p className="text-sm font-medium">
                        Widget {id.slice(0, 4)}
                    </p>
                </div>
            </Rnd>
        );
    }
);
