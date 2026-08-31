import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Call } from "../../../typings";
import useOfficerStore from "../../../stores/officersStore";
import { gameToMap } from "../../../utils/gameToMap";

export function DispatchMap({
    calls,
    selected,
    onSelect,
}: {
    calls: Call[];
    selected?: Call;
    onSelect: (id: number) => void;
}) {
    const container = useRef<HTMLDivElement>(null);
    const map = useRef<L.Map | null>(null);
    const [layer, setLayer] = useState("game");
    const [tileError, setTileError] = useState(false);
    const officers = useOfficerStore((state) => state.activeOfficers);
    useEffect(() => {
        if (!container.current) return;
        const instance = L.map(container.current, {
            crs: L.CRS.Simple,
            minZoom: 2,
            maxZoom: 7,
            maxBounds: [
                [0, 128],
                [-192, 0],
            ],
            attributionControl: false,
        }).setView([-119.43, 58.84], 3);
        map.current = instance;
        const observer = new ResizeObserver(() => instance.invalidateSize());
        observer.observe(container.current);
        return () => {
            observer.disconnect();
            instance.remove();
            map.current = null;
        };
    }, []);
    useEffect(() => {
        if (!map.current) return;
        setTileError(false);
        const tiles = L.tileLayer(
            `https://s.rsg.sc/sc/images/games/GTAV/map/${layer}/{z}/{x}/{y}.jpg`,
            {
                minZoom: 2,
                maxZoom: 7,
                bounds: [
                    [0, 128],
                    [-192, 0],
                ],
            }
        );
        tiles.on("tileerror", () => setTileError(true));
        tiles.addTo(map.current);
        return () => {
            tiles.remove();
        };
    }, [layer]);
    useEffect(() => {
        if (!map.current) return;
        const markers = L.layerGroup().addTo(map.current);
        calls.forEach((call) => {
            const label = document.createElement("span");
            label.textContent = `${call.code} · ${call.offense}`;
            L.circleMarker(gameToMap(call.coords[1], call.coords[0]), {
                radius: selected?.id === call.id ? 12 : 8,
                color: call.isEmergency ? "#fb7185" : "#fbbf24",
                fillOpacity: 0.8,
            })
                .bindTooltip(label)
                .on("click", () => onSelect(call.id))
                .addTo(markers);
        });
        officers.forEach((officer) => {
            const label = document.createElement("span");
            label.textContent = `${officer.callsign} · ${officer.firstname} ${officer.lastname}`;
            L.circleMarker(gameToMap(officer.position[1], officer.position[0]), {
                radius: 6,
                color: "#67e8f9",
                fillOpacity: 0.9,
            })
                .bindTooltip(label)
                .addTo(markers);
        });
        return () => {
            markers.remove();
        };
    }, [calls, officers, selected?.id, onSelect]);
    useEffect(() => {
        if (selected) map.current?.panTo(gameToMap(selected.coords[1], selected.coords[0]));
    }, [selected]);
    return (
        <>
            <div className="workspace-row" style={{ marginBottom: 12 }}>
                {["game", "render", "print"].map((value) => (
                    <button
                        key={value}
                        aria-pressed={value === layer}
                        onClick={() => setLayer(value)}
                    >
                        {value === "game" ? "Street" : value === "render" ? "Satellite" : "Atlas"}
                    </button>
                ))}
                <span className="muted">Cyan: officers · Amber/red: calls</span>
            </div>
            <div ref={container} className="dispatch-map" aria-label="Live dispatch map" />
            {tileError && (
                <p className="muted" role="status">
                    Map imagery is unavailable. Calls and officer positions remain available.
                </p>
            )}
        </>
    );
}
