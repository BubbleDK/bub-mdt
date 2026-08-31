import { lazy, Suspense, useEffect, useState } from "react";
const Rnd = lazy(() => import("react-rnd").then((module) => ({ default: module.Rnd })));
import { useNuiEvent } from "../../../hooks/useNuiEvent";
import { useCallsStore } from "../../../stores/dispatch/calls";
import useConfigStore from "../../../stores/configStore";
import type { Call } from "../../../typings";
import { fetchNui } from "../../../utils/fetchNui";
import { dispatchApi } from "../api/dispatchApi";
import { Status } from "../../mdt/ui/Workspace";
import { useAction } from "../../mdt/model/useAction";

export function DispatchOverlay() {
    const calls = useCallsStore((state) => state.calls);
    const enabled = useConfigStore((state) => state.config.isDispatchEnabled);
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState<number>();
    const [key, setKey] = useState("G");
    const [notifications, setNotifications] = useState<{ id: number; expires: number }[]>([]);
    const action = useAction();
    const selected = calls.find((call) => call.id === current) ?? calls[0];
    const move = (direction: number) => {
        const index = calls.findIndex((call) => call.id === selected?.id);
        setCurrent(calls[Math.max(0, Math.min(calls.length - 1, index + direction))]?.id);
    };
    useNuiEvent("showMiniDispatch", (data: { currentRespondKey: string }) => {
        setKey(data.currentRespondKey);
        setVisible(true);
    });
    useNuiEvent("hideMiniDispatch", () => setVisible(false));
    useNuiEvent("handleLeftArrowPress", () => {
        if (visible) move(-1);
    });
    useNuiEvent("handleRightArrowPress", () => {
        if (visible) move(1);
    });
    useNuiEvent("respondToCall", (data: { currentRespondKey: string }) => {
        setKey(data.currentRespondKey);
        if (selected)
            void action.run(async () => {
                await dispatchApi.waypoint(selected.coords);
                await dispatchApi.respond(selected.id, false);
            });
    });
    useNuiEvent("addCall", (call: Call) => {
        setCurrent(call.id);
        setNotifications((previous) => [
            { id: call.id, expires: Date.now() + (call.isEmergency ? 13000 : 10000) },
            ...previous.filter((item) => item.id !== call.id),
        ]);
    });
    useEffect(() => {
        const timer = window.setInterval(
            () =>
                setNotifications((previous) =>
                    previous.filter((item) => item.expires > Date.now())
                ),
            1000
        );
        return () => window.clearInterval(timer);
    }, []);
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (
                visible &&
                event.key.toLowerCase() === "i" &&
                !(
                    event.target instanceof HTMLInputElement ||
                    event.target instanceof HTMLTextAreaElement ||
                    (event.target instanceof HTMLElement && event.target.isContentEditable)
                )
            )
                void fetchNui("hideMiniDisptach", undefined, { data: true })
                    .then(() => setVisible(false))
                    .catch(console.error);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [visible]);
    if (!enabled) return null;
    return (
        <>
            <aside
                aria-label="Dispatch notifications"
                aria-live="polite"
                style={{
                    position: "fixed",
                    right: 16,
                    top: 16,
                    width: "min(360px,90vw)",
                    zIndex: 80,
                    pointerEvents: "none",
                }}
            >
                {notifications.slice(0, 3).map((notification) => {
                    const call = calls.find((item) => item.id === notification.id);
                    return call ? (
                        <article
                            key={call.id}
                            style={{
                                background: "#19222fee",
                                color: "#e2e8f0",
                                borderLeft: `3px solid ${call.isEmergency ? "#fb7185" : "#67e8f9"}`,
                                borderRadius: 10,
                                marginBottom: 10,
                                padding: 18,
                            }}
                        >
                            <span className={`workspace-badge ${call.isEmergency ? "alert" : ""}`}>
                                {call.code}
                            </span>
                            <h2>{call.offense}</h2>
                            <p className="muted">{call.location}</p>
                            {call.info?.map((info, index) => (
                                <p className="muted" key={index}>
                                    {info.label}
                                </p>
                            ))}
                            <p className="muted">
                                {call.units.map((unit) => unit.name).join(" · ")}
                            </p>
                        </article>
                    ) : null;
                })}
            </aside>
            {visible && (
                <Suspense fallback={null}>
                    <Rnd
                        default={{ x: 24, y: 120, width: 340, height: "auto" }}
                        bounds="window"
                        enableResizing={false}
                        dragHandleClassName="dispatch-drag-handle"
                        style={{ zIndex: 100 }}
                    >
                        <section
                            className="workspace-panel"
                            style={{ background: "#19222ff5", color: "#e2e8f0" }}
                        >
                            <header className="dispatch-drag-handle" style={{ cursor: "move" }}>
                                <h2>Field dispatch</h2>
                                <span className="workspace-badge">{calls.length} calls</span>
                            </header>
                            <div className="panel-body">
                                {selected ? (
                                    <>
                                        <span className="workspace-badge">{selected.code}</span>
                                        <h3>{selected.offense}</h3>
                                        <p className="muted">{selected.location}</p>
                                        <p className="muted">
                                            {selected.units.length} responding units · Press {key}{" "}
                                            to respond
                                        </p>
                                    </>
                                ) : (
                                    <p>No active calls</p>
                                )}
                                <Status error={action.error} />
                                <div className="workspace-row" style={{ marginTop: 12 }}>
                                    <button aria-label="Previous call" onClick={() => move(-1)}>
                                        ←
                                    </button>
                                    <button aria-label="Next call" onClick={() => move(1)}>
                                        →
                                    </button>
                                    <button
                                        disabled={!selected || action.pending}
                                        onClick={() =>
                                            selected &&
                                            action.run(() =>
                                                dispatchApi.respond(selected.id, false)
                                            )
                                        }
                                    >
                                        Respond
                                    </button>
                                    <button
                                        onClick={() =>
                                            action.run(async () => {
                                                await fetchNui("hideMiniDisptach", undefined, {
                                                    data: true,
                                                });
                                                setVisible(false);
                                            })
                                        }
                                    >
                                        Hide
                                    </button>
                                </div>
                            </div>
                        </section>
                    </Rnd>
                </Suspense>
            )}
        </>
    );
}
