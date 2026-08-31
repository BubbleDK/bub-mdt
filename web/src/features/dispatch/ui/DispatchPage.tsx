import { lazy, Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Unit, UnitType } from "../../../typings";
import { useCallsStore } from "../../../stores/dispatch/calls";
import useUnitStore from "../../../stores/dispatch/units";
import usePersonalDataStore from "../../../stores/personalDataStore";
import useConfigStore from "../../../stores/configStore";
import { dispatchApi } from "../api/dispatchApi";
import {
    Dialog,
    Empty,
    Field,
    Panel,
    SearchField,
    Stat,
    Status,
    Workspace,
} from "../../mdt/ui/Workspace";
import { useAction } from "../../mdt/model/useAction";
import { dateLabel } from "../../mdt/lib/dateLabel";

const DispatchMap = lazy(() =>
    import("./DispatchMap").then((module) => ({ default: module.DispatchMap }))
);

export default function Dispatch() {
    const { calls, fetchCalls } = useCallsStore();
    const { units, fetchUnits } = useUnitStore();
    const { personalData, setPersonalData } = usePersonalDataStore();
    const enabled = useConfigStore((state) => state.config.isDispatchEnabled);
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<number>();
    const [dialog, setDialog] = useState<Unit | "create" | null>(null);
    const [emergencyOnly, setEmergencyOnly] = useState(false);
    const action = useAction();
    const query = useQuery({
        queryKey: ["dispatch-init"],
        queryFn: async () => {
            await Promise.all([fetchCalls(), fetchUnits(), dispatchApi.officers()]);
            return true;
        },
        enabled,
    });
    const sorted = [...calls].sort(
        (a, b) => Number(!!b.isEmergency) - Number(!!a.isEmergency) || b.id - a.id
    );
    const filtered = sorted.filter(
        (call) =>
            (!emergencyOnly || call.isEmergency) &&
            `${call.code} ${call.offense} ${call.location}`
                .toLowerCase()
                .includes(search.toLowerCase())
    );
    const selected = calls.find((call) => call.id === selectedId);
    const attached = selected?.units.some((unit) => unit.id === personalData.unit) ?? false;
    return (
        <Workspace
            eyebrow="Operations / Live dispatch"
            title="Dispatch control"
            description="Prioritize incoming calls and coordinate the units closest to the action."
            actions={
                enabled && (
                    <button
                        disabled={!!personalData.unit}
                        className="primary"
                        onClick={() => setDialog("create")}
                    >
                        {personalData.unit
                            ? `Assigned to unit ${personalData.unit}`
                            : "Create unit"}
                    </button>
                )
            }
        >
            {!enabled ? (
                <Empty>Dispatch is disabled in this department’s configuration.</Empty>
            ) : (
                <>
                    <div className="workspace-stats">
                        <Stat label="Open calls" value={calls.length} />
                        <Stat
                            label="Emergency calls"
                            value={calls.filter((call) => call.isEmergency).length}
                        />
                        <Stat label="Active units" value={units.length} />
                        <Stat
                            label="Officers in units"
                            value={units.reduce((sum, unit) => sum + unit.members.length, 0)}
                        />
                    </div>
                    <Status pending={action.pending} error={query.error?.message || action.error} />
                    <div className="workspace-split">
                        <Panel
                            title="Incoming calls"
                            actions={
                                <button
                                    aria-pressed={emergencyOnly}
                                    onClick={() => setEmergencyOnly(!emergencyOnly)}
                                >
                                    Emergency only
                                </button>
                            }
                        >
                            <SearchField
                                value={search}
                                onChange={setSearch}
                                placeholder="Search calls or locations"
                            />
                            <Status pending={query.isPending} />
                            {filtered.map((call) => (
                                <button
                                    className="record"
                                    key={call.id}
                                    aria-pressed={selectedId === call.id}
                                    onClick={() => setSelectedId(call.id)}
                                >
                                    <span
                                        className={`workspace-badge ${call.isEmergency ? "alert" : ""}`}
                                    >
                                        {call.code}
                                    </span>
                                    <strong style={{ marginTop: 8 }}>{call.offense}</strong>
                                    <small>{call.location}</small>
                                    <small>
                                        {call.units.length} units assigned · {dateLabel(call.time)}
                                    </small>
                                </button>
                            ))}
                            {!filtered.length && !query.isPending && (
                                <Empty>No calls match this view.</Empty>
                            )}
                        </Panel>
                        <div className="workspace-stack">
                            <Panel title="Operational map">
                                <Suspense fallback={<Status pending />}>
                                    <DispatchMap
                                        calls={calls}
                                        selected={selected}
                                        onSelect={setSelectedId}
                                    />
                                </Suspense>
                            </Panel>
                            <Panel
                                title={
                                    selected
                                        ? `${selected.code} · ${selected.offense}`
                                        : "Call details"
                                }
                            >
                                {selected ? (
                                    <>
                                        <p>{selected.location}</p>
                                        <p className="muted">{dateLabel(selected.time)}</p>
                                        <div className="workspace-row" style={{ margin: "15px 0" }}>
                                            {selected.info?.map((info, index) => (
                                                <span className="workspace-badge" key={index}>
                                                    {info.label}
                                                </span>
                                            ))}
                                            {selected.units.map((unit) => (
                                                <span
                                                    className="workspace-badge good"
                                                    key={unit.id}
                                                >
                                                    {unit.name}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="workspace-row">
                                            <button
                                                className="primary"
                                                disabled={action.pending}
                                                onClick={() =>
                                                    action.run(() =>
                                                        dispatchApi.respond(selected.id, attached)
                                                    )
                                                }
                                            >
                                                {attached ? "Detach from call" : "Respond to call"}
                                            </button>
                                            <button
                                                disabled={action.pending}
                                                onClick={() =>
                                                    action.run(() =>
                                                        dispatchApi.waypoint(selected.coords)
                                                    )
                                                }
                                            >
                                                Set GPS waypoint
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <Empty>Select a call in the queue or on the map.</Empty>
                                )}
                            </Panel>
                        </div>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <Panel title="Unit board">
                            <div className="workspace-grid">
                                {units.map((unit) => (
                                    <article
                                        key={unit.id}
                                        className="workspace-panel"
                                        style={{ padding: 20 }}
                                    >
                                        <div
                                            className="workspace-row"
                                            style={{ justifyContent: "space-between" }}
                                        >
                                            <h3>{unit.name}</h3>
                                            <span className="workspace-badge">{unit.type}</span>
                                        </div>
                                        <p className="muted" style={{ margin: "12px 0" }}>
                                            {unit.members
                                                .map(
                                                    (member) =>
                                                        `${member.callsign} · ${member.firstname} ${member.lastname}`
                                                )
                                                .join(" / ") || "No officers assigned"}
                                        </p>
                                        <div className="workspace-row">
                                            <button onClick={() => setDialog(unit)}>
                                                Manage officers
                                            </button>
                                            {personalData.unit === unit.id && (
                                                <button
                                                    className="danger"
                                                    disabled={action.pending}
                                                    onClick={() =>
                                                        action.run(async () => {
                                                            await dispatchApi.leave();
                                                            setPersonalData((previous) => ({
                                                                ...previous,
                                                                unit: undefined,
                                                            }));
                                                        })
                                                    }
                                                >
                                                    Leave unit
                                                </button>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                            {!units.length && <Empty>No units are currently active.</Empty>}
                        </Panel>
                    </div>
                </>
            )}
            {dialog && (
                <UnitForm
                    unit={dialog === "create" ? undefined : dialog}
                    onClose={() => setDialog(null)}
                    onCreate={async (type) => {
                        const unit = await dispatchApi.create(type);
                        if (!unit?.id) throw new Error("Unable to create unit.");
                        setPersonalData((previous) => ({ ...previous, unit: unit.id }));
                        setDialog(null);
                    }}
                />
            )}
        </Workspace>
    );
}
function UnitForm({
    unit,
    onClose,
    onCreate,
}: {
    unit?: Unit;
    onClose: () => void;
    onCreate: (type: UnitType) => Promise<void>;
}) {
    const [type, setType] = useState<UnitType>("car");
    const [members, setMembers] = useState(
        unit?.members.map((member) => String(member.playerId)) ?? []
    );
    const action = useAction();
    const officers = useQuery({
        queryKey: ["active-officers"],
        queryFn: dispatchApi.officers,
        enabled: !!unit,
    });
    return (
        <Dialog title={unit ? `Manage ${unit.name}` : "Create patrol unit"} onClose={onClose}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    void action.run(async () => {
                        if (unit) {
                            await dispatchApi.members(unit.id, members);
                            onClose();
                        } else await onCreate(type);
                    });
                }}
            >
                {unit ? (
                    <>
                        <Status pending={officers.isPending} error={officers.error?.message} />
                        {officers.data?.map((officer) => (
                            <label
                                key={officer.playerId}
                                className="workspace-row"
                                style={{ marginBottom: 16 }}
                            >
                                <input
                                    type="checkbox"
                                    checked={members.includes(String(officer.playerId))}
                                    onChange={(event) =>
                                        setMembers(
                                            event.target.checked
                                                ? [...members, String(officer.playerId)]
                                                : members.filter(
                                                      (id) => id !== String(officer.playerId)
                                                  )
                                        )
                                    }
                                />
                                {officer.callsign} · {officer.firstname} {officer.lastname}
                            </label>
                        ))}
                    </>
                ) : (
                    <Field label="Unit vehicle type">
                        <select
                            value={type}
                            onChange={(event) => setType(event.target.value as UnitType)}
                        >
                            {["car", "motor", "heli", "boat"].map((value) => (
                                <option key={value}>{value}</option>
                            ))}
                        </select>
                    </Field>
                )}
                <Status error={action.error} />
                <button className="primary" disabled={action.pending || (!!unit && !officers.data)}>
                    Confirm unit
                </button>
            </form>
        </Dialog>
    );
}
