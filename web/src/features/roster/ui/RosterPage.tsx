import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { RosterOfficer } from "../../../typings";
import usePersonalDataStore from "../../../stores/personalDataStore";
import { hasPermission } from "../../../helpers/hasPermission";
import { RANKS, ROLES, rosterApi } from "../api/rosterApi";
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
import { useConfirmation } from "../../mdt/model/useConfirmation";
import { dateLabel } from "../../mdt/lib/dateLabel";

type Editor = { kind: "callsign" | "rank" | "roles"; officer: RosterOfficer } | { kind: "hire" };
export default function Roster() {
    const confirm = useConfirmation();
    const personalData = usePersonalDataStore((state) => state.personalData);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [editor, setEditor] = useState<Editor | null>(null);
    const action = useAction();
    const cache = useQueryClient();
    const roster = useQuery({ queryKey: ["roster"], queryFn: rosterApi.list });
    const officers = roster.data ?? [];
    const filtered = officers.filter(
        (item) =>
            `${item.firstname} ${item.lastname} ${item.callsign} ${item.title}`
                .toLowerCase()
                .includes(search.toLowerCase()) &&
            (!role || item[role as (typeof ROLES)[number]])
    );
    return (
        <Workspace
            eyebrow="Department / Personnel"
            title="People behind the badge"
            description="Find your colleagues, review specialist qualifications and manage the department roster."
            actions={
                hasPermission(personalData, "hire_officer") && (
                    <button className="primary" onClick={() => setEditor({ kind: "hire" })}>
                        Hire officer
                    </button>
                )
            }
        >
            <div className="workspace-stats">
                <Stat label="Department personnel" value={officers.length} />
                <Stat
                    label="Field training officers"
                    value={officers.filter((item) => item.fto).length}
                />
                <Stat label="Air qualified" value={officers.filter((item) => item.air).length} />
                <Stat label="K9 qualified" value={officers.filter((item) => item.k9).length} />
            </div>
            <Status pending={action.pending} error={roster.error?.message || action.error} />
            <Panel
                title="Department directory"
                actions={<button onClick={() => roster.refetch()}>Refresh roster</button>}
            >
                <SearchField
                    value={search}
                    onChange={setSearch}
                    placeholder="Search name, callsign or rank"
                />
                <div className="workspace-row" style={{ marginBottom: 20 }}>
                    <button aria-pressed={!role} onClick={() => setRole("")}>
                        All personnel
                    </button>
                    {ROLES.map((value) => (
                        <button
                            key={value}
                            aria-pressed={role === value}
                            onClick={() => setRole(role === value ? "" : value)}
                        >
                            {value.toUpperCase()}
                        </button>
                    ))}
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table className="workspace-table">
                        <thead>
                            <tr>
                                <th>Officer</th>
                                <th>Callsign / Rank</th>
                                <th>Qualifications</th>
                                <th>Last active</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roster.isPending && (
                                <tr>
                                    <td colSpan={5}>
                                        <Status pending />
                                    </td>
                                </tr>
                            )}
                            {filtered.map((officer) => (
                                <tr key={officer.citizenid}>
                                    <td>
                                        <strong>
                                            {officer.firstname} {officer.lastname}
                                        </strong>
                                        <p className="muted">{officer.citizenid}</p>
                                    </td>
                                    <td>
                                        <span className="workspace-badge">{officer.callsign}</span>
                                        <p style={{ marginTop: 6 }}>{officer.title}</p>
                                    </td>
                                    <td>
                                        <div className="workspace-row">
                                            {ROLES.filter((value) => officer[value]).map(
                                                (value) => (
                                                    <span
                                                        key={value}
                                                        className="workspace-badge good"
                                                    >
                                                        {value}
                                                    </span>
                                                )
                                            )}
                                            {!ROLES.some((value) => officer[value]) && (
                                                <span className="muted">None recorded</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="muted">{dateLabel(officer.lastActive)}</td>
                                    <td>
                                        <div className="workspace-row">
                                            <button
                                                onClick={() =>
                                                    setEditor({ kind: "callsign", officer })
                                                }
                                            >
                                                Callsign
                                            </button>
                                            {hasPermission(personalData, "set_officer_rank") && (
                                                <button
                                                    onClick={() =>
                                                        setEditor({ kind: "rank", officer })
                                                    }
                                                >
                                                    Rank
                                                </button>
                                            )}
                                            {hasPermission(personalData, "set_officer_roles") && (
                                                <button
                                                    onClick={() =>
                                                        setEditor({ kind: "roles", officer })
                                                    }
                                                >
                                                    Roles
                                                </button>
                                            )}
                                            {hasPermission(personalData, "fire_officer") && (
                                                <button
                                                    className="danger"
                                                    disabled={action.pending}
                                                    onClick={async () => {
                                                        if (
                                                            await confirm(
                                                                `Remove ${officer.firstname} ${officer.lastname} from the department?`
                                                            )
                                                        )
                                                            void action.run(async () => {
                                                                await rosterApi.fire(
                                                                    officer.citizenid
                                                                );
                                                                cache.setQueryData(
                                                                    ["roster"],
                                                                    officers.filter(
                                                                        (item) =>
                                                                            item.citizenid !==
                                                                            officer.citizenid
                                                                    )
                                                                );
                                                            });
                                                    }}
                                                >
                                                    Dismiss
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!filtered.length && !roster.isPending && (
                    <Empty>No officers match your search.</Empty>
                )}
            </Panel>
            {editor && (
                <RosterEditor
                    editor={editor}
                    onClose={() => setEditor(null)}
                    onUpdated={async (updated) => {
                        if (updated)
                            cache.setQueryData(
                                ["roster"],
                                officers.map((item) =>
                                    item.citizenid === updated.citizenid ? updated : item
                                )
                            );
                        else await roster.refetch();
                        setEditor(null);
                    }}
                />
            )}
        </Workspace>
    );
}
function RosterEditor({
    editor,
    onClose,
    onUpdated,
}: {
    editor: Editor;
    onClose: () => void;
    onUpdated: (officer?: RosterOfficer) => Promise<void>;
}) {
    const officer = "officer" in editor ? editor.officer : undefined;
    const [citizenid, setCitizenid] = useState("");
    const [callsign, setCallsign] = useState(String(officer?.callsign ?? ""));
    const [rank, setRank] = useState("");
    const [roles, setRoles] = useState<Pick<RosterOfficer, (typeof ROLES)[number]>>({
        apu: officer?.apu ?? false,
        air: officer?.air ?? false,
        mc: officer?.mc ?? false,
        k9: officer?.k9 ?? false,
        fto: officer?.fto ?? false,
    });
    const action = useAction();
    return (
        <Dialog
            title={
                editor.kind === "hire"
                    ? "Hire officer"
                    : `Update ${editor.kind} · ${officer?.firstname} ${officer?.lastname}`
            }
            onClose={onClose}
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    void action.run(async () => {
                        if (editor.kind === "hire") {
                            await rosterApi.hire(citizenid.trim(), callsign.trim());
                            await onUpdated();
                        } else if (officer) {
                            if (editor.kind === "callsign") {
                                await rosterApi.callsign(officer.citizenid, callsign.trim());
                                await onUpdated({ ...officer, callsign: callsign.trim() });
                            } else if (editor.kind === "rank") {
                                await rosterApi.rank(officer.citizenid, Number(rank));
                                await onUpdated({ ...officer, title: RANKS[Number(rank)] });
                            } else {
                                await rosterApi.roles(officer.citizenid, roles);
                                await onUpdated({ ...officer, ...roles });
                            }
                        }
                    });
                }}
            >
                {editor.kind === "hire" && (
                    <Field label="Citizen ID">
                        <input
                            required
                            value={citizenid}
                            onChange={(event) => setCitizenid(event.target.value)}
                        />
                    </Field>
                )}
                {(editor.kind === "hire" || editor.kind === "callsign") && (
                    <Field label="Callsign">
                        <input
                            required
                            value={callsign}
                            onChange={(event) => setCallsign(event.target.value)}
                        />
                    </Field>
                )}
                {editor.kind === "rank" && (
                    <Field label="Rank">
                        <select
                            required
                            value={rank}
                            onChange={(event) => setRank(event.target.value)}
                        >
                            <option value="">Choose rank</option>
                            {RANKS.map((value, index) => (
                                <option key={value} value={index}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </Field>
                )}
                {editor.kind === "roles" &&
                    ROLES.map((value) => (
                        <label className="workspace-row" key={value} style={{ marginBottom: 16 }}>
                            <input
                                type="checkbox"
                                checked={roles[value]}
                                onChange={(event) =>
                                    setRoles({ ...roles, [value]: event.target.checked })
                                }
                            />
                            {value.toUpperCase()}
                        </label>
                    ))}
                <Status error={action.error} />
                <button className="primary" disabled={action.pending}>
                    Save changes
                </button>
            </form>
        </Dialog>
    );
}
