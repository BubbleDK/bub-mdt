import { useCallback, useRef, useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import { DraggableResizableWidget } from "../../../../components/DraggableResizableWidget";

export const GRID_COLUMNS = 12;
export const GRID_ROWS = 8;

export const GRID_CELL_WIDTH = 128.5;
export const GRID_CELL_HEIGHT = 104.5;
const CONTAINER_SIZE = { width: 1546, height: 839 } as const;

export interface Widget {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export default function Dashboard() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [widgets, setWidgets] = useState<Widget[]>(() => [
        { id: uuidv4(), x: 0, y: 0, w: 2, h: 2 },
        { id: uuidv4(), x: 2, y: 0, w: 3, h: 2 },
    ]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, delta } = event;
        const id = String(active.id);
        setWidgets((current) => {
            const widget = current.find((item) => item.id === id);
            if (!widget) return current;

            const newX = Math.min(
                Math.max(0, widget.x + Math.round(delta.x / GRID_CELL_WIDTH)),
                GRID_COLUMNS - widget.w
            );
            const newY = Math.min(
                Math.max(0, widget.y + Math.round(delta.y / GRID_CELL_HEIGHT)),
                GRID_ROWS - widget.h
            );
            if (newX === widget.x && newY === widget.y) return current;

            const collided = current.some(
                (item) =>
                    item.id !== id &&
                    newX < item.x + item.w &&
                    newX + widget.w > item.x &&
                    newY < item.y + item.h &&
                    newY + widget.h > item.y
            );
            return collided
                ? current
                : current.map((item) =>
                      item.id === id ? { ...item, x: newX, y: newY } : item
                  );
        });
    }, []);

    const handleResize = useCallback((id: string, width: number, height: number) => {
        const gridW = Math.max(1, Math.round(width / GRID_CELL_WIDTH));
        const gridH = Math.max(1, Math.round(height / GRID_CELL_HEIGHT));

        setWidgets((current) => {
            const widget = current.find((item) => item.id === id);
            if (!widget) return current;
            const finalW = Math.min(gridW, GRID_COLUMNS - widget.x);
            const finalH = Math.min(gridH, GRID_ROWS - widget.y);
            if (finalW === widget.w && finalH === widget.h) return current;

            const collided = current.some(
                (item) =>
                    item.id !== id &&
                    widget.x < item.x + item.w &&
                    widget.x + finalW > item.x &&
                    widget.y < item.y + item.h &&
                    widget.y + finalH > item.y
            );
            return collided
                ? current
                : current.map((item) =>
                      item.id === id ? { ...item, w: finalW, h: finalH } : item
                  );
        });
    }, []);

    return (
        <div ref={containerRef} className="w-[1546px] h-[839px] relative">
            <DndContext onDragEnd={handleDragEnd}>
                {widgets.map((widget) => (
                    <DraggableResizableWidget
                        key={widget.id}
                        id={widget.id}
                        x={widget.x}
                        y={widget.y}
                        w={widget.w}
                        h={widget.h}
                        onResize={handleResize}
                        containerSize={CONTAINER_SIZE}
                    />
                ))}
            </DndContext>
        </div>
    );
}
