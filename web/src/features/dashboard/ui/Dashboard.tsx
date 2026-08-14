import { useCallback, useRef, useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import { DashboardWidget } from "./DashboardWidget";
import {
    DASHBOARD_SIZE,
    moveWidget,
    resizeWidget,
    type WidgetLayout,
} from "../model/dashboardGrid";

export default function Dashboard() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [widgets, setWidgets] = useState<WidgetLayout[]>(() => [
        { id: uuidv4(), x: 0, y: 0, w: 2, h: 2 },
        { id: uuidv4(), x: 2, y: 0, w: 3, h: 2 },
    ]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        setWidgets((widgets) =>
            moveWidget(
                widgets,
                String(event.active.id),
                event.delta.x,
                event.delta.y
            )
        );
    }, []);

    const handleResize = useCallback((id: string, width: number, height: number) => {
        setWidgets((widgets) => resizeWidget(widgets, id, width, height));
    }, []);

    return (
        <div ref={containerRef} className="w-[1546px] h-[839px] relative">
            <DndContext onDragEnd={handleDragEnd}>
                {widgets.map((widget) => (
                    <DashboardWidget
                        key={widget.id}
                        id={widget.id}
                        x={widget.x}
                        y={widget.y}
                        w={widget.w}
                        h={widget.h}
                        onResize={handleResize}
                        containerSize={DASHBOARD_SIZE}
                    />
                ))}
            </DndContext>
        </div>
    );
}
