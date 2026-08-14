type Widget = {
    x: number;
    y: number;
    w: number;
    h: number;
};

export function isOverlapping(a: Widget, b: Widget) {
    return !(
        a.x + a.w <= b.x ||
        b.x + b.w <= a.x ||
        a.y + a.h <= b.y ||
        b.y + b.h <= a.y
    );
}

export const findNextAvailablePosition = (
    widgets: Widget[],
    cols: number,
    rows: number,
    w: number,
    h: number,
    cellW: number,
    cellH: number,
    gap: number
) => {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * (cellW + gap);
            const y = row * (cellH + gap);
            const candidate: Widget = { x, y, w: w, h: h };

            const collision = widgets.some((existing) =>
                isOverlapping(candidate, existing)
            );

            if (!collision) return { x, y };
        }
    }
    return { x: 0, y: 0 }; // fallback
};
