import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { dashboardApi } from "../api/dashboardApi";
import { useCallsStore } from "../../../stores/dispatch/calls";
import usePersonalDataStore from "../../../stores/personalDataStore";
import useConfigStore from "../../../stores/configStore";
import { hasPermission } from "../../../helpers/hasPermission";
import { Dialog, Empty, Field, Panel, Stat, Status, Workspace } from "../../mdt/ui/Workspace";
import { useAction } from "../../mdt/model/useAction";
import { dateLabel } from "../../mdt/lib/dateLabel";
import useOfficerStore from "../../../stores/officersStore";

export default function Dashboard() {
    const navigate = useNavigate();
    const [compose, setCompose] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [selectedPlate, setSelectedPlate] = useState<string | null>(null);
    const lookout = useQuery({
        queryKey: ["bolo", selectedPlate],
        queryFn: () => dashboardApi.bolo(selectedPlate!),
        enabled: !!selectedPlate,
    });
    const personal = usePersonalDataStore((state) => state.personalData);
    const activeOfficers = useOfficerStore((state) => state.activeOfficers);
    const officers = useQuery({ queryKey: ["active-officers"], queryFn: dashboardApi.officers });
    const dispatchEnabled = useConfigStore((state) => state.config.isDispatchEnabled);
    const announcements = useQuery({
        queryKey: ["announcements"],
        queryFn: dashboardApi.announcements,
    });
    const bolos = useQuery({ queryKey: ["bolos"], queryFn: dashboardApi.bolos });
    const warrants = useQuery({ queryKey: ["warrants"], queryFn: dashboardApi.warrants });
    const activity = useQuery({ queryKey: ["activity"], queryFn: dashboardApi.activity });
    const { calls, fetchCalls } = useCallsStore();
    const dispatch = useQuery({
        queryKey: ["dashboard-calls"],
        queryFn: async () => {
            await fetchCalls();
            return true;
        },
        enabled: dispatchEnabled,
    });
    return (
        <Workspace
            eyebrow="Command / Overview"
            title={`Welcome back, ${personal.firstname || "officer"}.`}
            description="Your shift briefing: department notices, active lookouts and the latest field activity."
            actions={
                <>
                    <button onClick={() => navigate("/profiles")}>Find a citizen</button>
                    <button className="primary" onClick={() => navigate("/incidents/new")}>
                        New incident
                    </button>
                </>
            }
        >
            <div className="workspace-stats">
                <Stat label="Active warrants" value={warrants.data?.length ?? "—"} />
                <Stat label="Vehicle lookouts" value={bolos.data?.length ?? "—"} />
                <Stat label="Department notices" value={announcements.data?.length ?? "—"} />
                {dispatchEnabled && <Stat label="Open dispatch calls" value={calls.length} />}
            </div>
            <div className="workspace-grid">
                <div className="workspace-stack">
                    <Panel title={`On-duty officers · ${activeOfficers.length}`}>
                        <Status pending={officers.isPending} error={officers.error?.message} />
                        <div
                            className="workspace-stack"
                            style={{ maxHeight: 260, overflow: "auto" }}
                        >
                            {activeOfficers.map((officer) => (
                                <div
                                    key={officer.citizenid}
                                    className="workspace-row"
                                    style={{ justifyContent: "space-between" }}
                                >
                                    <div>
                                        <strong>
                                            {officer.firstname} {officer.lastname}
                                        </strong>
                                        <p className="muted">Callsign {officer.callsign}</p>
                                    </div>
                                    <span className="workspace-badge">
                                        {officer.unitId ? `Unit ${officer.unitId}` : "Unassigned"}
                                    </span>
                                </div>
                            ))}
                            {!officers.isPending && !activeOfficers.length && (
                                <Empty>No officers on duty.</Empty>
                            )}
                        </div>
                    </Panel>
                    <Panel
                        title="Department bulletin"
                        actions={
                            <div className="workspace-row">
                                <button onClick={() => setExpanded(!expanded)}>
                                    {expanded ? "Show recent" : "View all"}
                                </button>
                                {hasPermission(personal, "create_announcement") && (
                                    <button onClick={() => setCompose(true)}>Post notice</button>
                                )}
                            </div>
                        }
                    >
                        <Status
                            pending={announcements.isPending}
                            error={announcements.error?.message}
                        />
                        {(expanded ? announcements.data : announcements.data?.slice(0, 3))?.map(
                            (item) => (
                                <article
                                    key={item.id}
                                    style={{
                                        padding: "16px 0",
                                        borderBottom: "1px solid #ffffff10",
                                    }}
                                >
                                    <span className="eyebrow">
                                        {item.firstname} {item.lastname}
                                    </span>
                                    <p
                                        style={{
                                            whiteSpace: "pre-wrap",
                                            margin: "10px 0",
                                            fontSize: 14,
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        {item.contents}
                                    </p>
                                    <p className="muted">{dateLabel(item.createdAt)}</p>
                                </article>
                            )
                        )}
                        {announcements.data?.length === 0 && (
                            <Empty>No announcements posted.</Empty>
                        )}
                    </Panel>
                    <Panel title="Recent activity">
                        <Status pending={activity.isPending} error={activity.error?.message} />
                        {activity.data?.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    borderLeft: "2px solid #6ba5a444",
                                    padding: "4px 0 18px 18px",
                                    marginLeft: 5,
                                }}
                            >
                                <p style={{ fontSize: 13 }}>
                                    {item.firstname} {item.lastname}{" "}
                                    <span className="muted">
                                        {item.type} {item.category}
                                    </span>
                                </p>
                                <p className="muted">{dateLabel(item.date)}</p>
                                {item.type !== "deleted" &&
                                    ["profiles", "incidents", "reports"].includes(
                                        item.category
                                    ) && (
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    item.category === "profiles"
                                                        ? `/profiles/${item.citizenid}`
                                                        : item.category === "reports"
                                                          ? `/reports?id=${item.activityid}`
                                                          : `/incidents/${item.activityid}`
                                                )
                                            }
                                        >
                                            Open record
                                        </button>
                                    )}
                            </div>
                        ))}
                        {activity.data?.length === 0 && <Empty>No recent activity.</Empty>}
                    </Panel>
                </div>
                <div className="workspace-stack">
                    <Panel title="Active warrants">
                        <Status pending={warrants.isPending} error={warrants.error?.message} />
                        {warrants.data?.map((item, index) => (
                            <div
                                key={`${item.citizenid}-${index}`}
                                style={{ padding: "12px 0", borderBottom: "1px solid #ffffff10" }}
                            >
                                <div
                                    className="workspace-row"
                                    style={{ justifyContent: "space-between" }}
                                >
                                    <strong>
                                        {item.firstname} {item.lastname}
                                    </strong>
                                    <span className="workspace-badge alert">Wanted</span>
                                </div>
                                <p className="muted">Expires {dateLabel(item.expiresAt)}</p>
                                <div className="workspace-row" style={{ marginTop: 10 }}>
                                    <button onClick={() => navigate(`/profiles/${item.citizenid}`)}>
                                        Citizen profile
                                    </button>
                                    <button
                                        onClick={() => navigate(`/incidents/${item.incidentid}`)}
                                    >
                                        Incident #{item.incidentid}
                                    </button>
                                </div>
                            </div>
                        ))}
                        {warrants.data?.length === 0 && <Empty>No active warrants.</Empty>}
                    </Panel>
                    <Panel title="Vehicle lookouts">
                        <Status pending={bolos.isPending} error={bolos.error?.message} />
                        {bolos.data?.map((item, index) => (
                            <button
                                key={`${item.plate}-${index}`}
                                className="record"
                                onClick={() => setSelectedPlate(item.plate)}
                            >
                                <strong style={{ fontFamily: "monospace", letterSpacing: ".1em" }}>
                                    {item.plate}
                                </strong>
                                <small>{item.reason}</small>
                                <small>Expires {item.expiresAt} · View alert →</small>
                            </button>
                        ))}
                        {bolos.data?.length === 0 && <Empty>No active vehicle lookouts.</Empty>}
                    </Panel>
                    {dispatchEnabled && (
                        <Panel
                            title="Dispatch watch"
                            actions={
                                <button onClick={() => navigate("/dispatch")}>Open dispatch</button>
                            }
                        >
                            <Status pending={dispatch.isPending} error={dispatch.error?.message} />
                            {calls.slice(0, 4).map((call) => (
                                <button
                                    className="record"
                                    key={call.id}
                                    onClick={() => navigate("/dispatch")}
                                >
                                    <span
                                        className={`workspace-badge ${call.isEmergency ? "alert" : ""}`}
                                    >
                                        {call.code}
                                    </span>
                                    <strong>{call.offense}</strong>
                                    <small>
                                        {call.location} · {call.units.length} responding units
                                    </small>
                                </button>
                            ))}
                            {!calls.length && <Empty>No incoming calls.</Empty>}
                        </Panel>
                    )}
                </div>
            </div>
            {selectedPlate && (
                <Dialog
                    title={`Vehicle lookout · ${selectedPlate}`}
                    onClose={() => setSelectedPlate(null)}
                >
                    <Status pending={lookout.isPending} error={lookout.error?.message} />
                    {lookout.data && (
                        <div className="workspace-stack">
                            <p>{lookout.data.reason}</p>
                            <p className="muted">Expires {lookout.data.expiresAt}</p>
                            <button
                                className="primary"
                                onClick={() =>
                                    navigate(`/vehicles?plate=${encodeURIComponent(selectedPlate)}`)
                                }
                            >
                                Open vehicle record
                            </button>
                        </div>
                    )}
                </Dialog>
            )}
            {compose && (
                <AnnouncementForm
                    onClose={() => setCompose(false)}
                    onSubmit={async (contents) => {
                        await dashboardApi.announce(contents);
                        await announcements.refetch();
                        setCompose(false);
                    }}
                />
            )}
        </Workspace>
    );
}
function AnnouncementForm({
    onClose,
    onSubmit,
}: {
    onClose: () => void;
    onSubmit: (contents: string) => Promise<void>;
}) {
    const [contents, setContents] = useState("");
    const action = useAction();
    return (
        <Dialog title="Post department notice" onClose={onClose}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    void action.run(() => onSubmit(contents.trim()));
                }}
            >
                <Field label="Notice">
                    <textarea
                        required
                        rows={7}
                        value={contents}
                        onChange={(event) => setContents(event.target.value)}
                        placeholder="Share information your department needs for the shift."
                    />
                </Field>
                <Status error={action.error} />
                <button className="primary" disabled={action.pending || !contents.trim()}>
                    Publish notice
                </button>
            </form>
        </Dialog>
    );
}
