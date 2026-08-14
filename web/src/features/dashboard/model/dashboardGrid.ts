export const GRID_COLUMNS = 12;
export const GRID_ROWS = 8;
export const GRID_CELL_WIDTH = 128.5;
export const GRID_CELL_HEIGHT = 104.5;
export const DASHBOARD_SIZE = { width: 1546, height: 839 } as const;

export interface WidgetLayout {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

function overlaps(a: WidgetLayout, b: WidgetLayout): boolean {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

export function moveWidget(
    widgets: WidgetLayout[],
    id: string,
    deltaX: number,
    deltaY: number
): WidgetLayout[] {
    const widget = widgets.find((item) => item.id === id);
    if (!widget) return widgets;

    const x = Math.min(
        Math.max(0, widget.x + Math.round(deltaX / GRID_CELL_WIDTH)),
        GRID_COLUMNS - widget.w
    );
    const y = Math.min(
        Math.max(0, widget.y + Math.round(deltaY / GRID_CELL_HEIGHT)),
        GRID_ROWS - widget.h
    );
    if (x === widget.x && y === widget.y) return widgets;

    const nextWidget = { ...widget, x, y };
    if (widgets.some((item) => item.id !== id && overlaps(nextWidget, item))) {
        return widgets;
    }

    return widgets.map((item) => (item.id === id ? nextWidget : item));
}

export function resizeWidget(
    widgets: WidgetLayout[],
    id: string,
    width: number,
    height: number
): WidgetLayout[] {
    const widget = widgets.find((item) => item.id === id);
    if (!widget) return widgets;

    const w = Math.min(
        Math.max(1, Math.round(width / GRID_CELL_WIDTH)),
        GRID_COLUMNS - widget.x
    );
    const h = Math.min(
        Math.max(1, Math.round(height / GRID_CELL_HEIGHT)),
        GRID_ROWS - widget.y
    );
    if (w === widget.w && h === widget.h) return widgets;

    const nextWidget = { ...widget, w, h };
    if (widgets.some((item) => item.id !== id && overlaps(nextWidget, item))) {
        return widgets;
    }

    return widgets.map((item) => (item.id === id ? nextWidget : item));
}
