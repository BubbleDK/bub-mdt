import { useState } from "react";
import type { Charge } from "../../../typings";
import useChargeStore from "../../../stores/chargesStore";
import usePersonalDataStore from "../../../stores/personalDataStore";
import { hasPermission } from "../../../helpers/hasPermission";
import { chargesApi } from "../api/chargesApi";
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

export default function Charges() {
    const confirm = useConfirmation();
    const { charges, setCharges } = useChargeStore();
    const personalData = usePersonalDataStore((state) => state.personalData);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [editing, setEditing] = useState<{ charge?: Charge; category: string } | null>(null);
    const action = useAction();
    const all = Object.values(charges).flat();
    const groups = Object.entries(charges)
        .filter(([name]) => !category || name === category)
        .map(
            ([name, items]) =>
                [
                    name,
                    items.filter(
                        (item) =>
                            (!type || item.type === type) &&
                            `${item.label} ${item.description}`
                                .toLowerCase()
                                .includes(search.toLowerCase())
                    ),
                ] as const
        )
        .filter(([, items]) => items.length);
    return (
        <Workspace
            eyebrow="Reference / Penal code"
            title="Charge library"
            description="Find the right offense, understand the criteria and review sentencing at a glance."
            actions={
                hasPermission(personalData, "create_charge") && (
                    <button
                        className="primary"
                        onClick={() =>
                            setEditing({ category: category || Object.keys(charges)[0] || "" })
                        }
                    >
                        Create charge
                    </button>
                )
            }
        >
            <div className="workspace-stats">
                <Stat label="Defined offenses" value={all.length} />
                {["infraction", "misdemeanor", "felony"].map((value) => (
                    <Stat
                        key={value}
                        label={value}
                        value={all.filter((item) => item.type === value).length}
                    />
                ))}
            </div>
            <div className="workspace-split">
                <Panel title="Narrow your search">
                    <SearchField
                        value={search}
                        onChange={setSearch}
                        placeholder="Search offenses or descriptions"
                    />
                    <Field label="Severity">
                        <select value={type} onChange={(event) => setType(event.target.value)}>
                            <option value="">All severities</option>
                            {["infraction", "misdemeanor", "felony"].map((value) => (
                                <option key={value}>{value}</option>
                            ))}
                        </select>
                    </Field>
                    <button
                        className="record"
                        aria-pressed={!category}
                        onClick={() => setCategory("")}
                    >
                        All categories
                    </button>
                    {Object.entries(charges).map(([name, items]) => (
                        <button
                            className="record"
                            key={name}
                            aria-pressed={category === name}
                            onClick={() => setCategory(name)}
                        >
                            {name}
                            <small>{items.length} offenses</small>
                        </button>
                    ))}
                </Panel>
                <div className="workspace-stack">
                    <Status error={action.error} />
                    {groups.map(([name, items]) => (
                        <Panel key={name} title={name}>
                            <div className="workspace-stack">
                                {items.map((charge) => (
                                    <article
                                        key={charge.label}
                                        style={{
                                            borderBottom: "1px solid #ffffff10",
                                            paddingBottom: 20,
                                        }}
                                    >
                                        <div
                                            className="workspace-row"
                                            style={{ justifyContent: "space-between" }}
                                        >
                                            <h3 style={{ fontSize: 17, fontWeight: 600 }}>
                                                {charge.label}
                                            </h3>
                                            <span
                                                className={`workspace-badge ${charge.type === "felony" ? "alert" : ""}`}
                                            >
                                                {charge.type}
                                            </span>
                                        </div>
                                        <p className="muted" style={{ margin: "12px 0" }}>
                                            {charge.description}
                                        </p>
                                        <div className="workspace-row">
                                            <span className="workspace-badge">
                                                Fine · ${charge.fine.toLocaleString()}
                                            </span>
                                            <span className="workspace-badge">
                                                Custody · {charge.time} months
                                            </span>
                                            <span className="workspace-badge">
                                                Points · {charge.points}
                                            </span>
                                            {hasPermission(personalData, "edit_charge") && (
                                                <button
                                                    onClick={() =>
                                                        setEditing({ charge, category: name })
                                                    }
                                                >
                                                    Edit penalties
                                                </button>
                                            )}
                                            {hasPermission(personalData, "delete_charge") && (
                                                <button
                                                    className="danger"
                                                    disabled={action.pending}
                                                    onClick={async () => {
                                                        if (
                                                            await confirm(
                                                                `Delete “${charge.label}” from the charge library?`
                                                            )
                                                        )
                                                            void action.run(async () => {
                                                                await chargesApi.remove(
                                                                    charge.label
                                                                );
                                                                setCharges((previous) =>
                                                                    Object.fromEntries(
                                                                        Object.entries(
                                                                            previous
                                                                        ).map(([key, entries]) => [
                                                                            key,
                                                                            entries.filter(
                                                                                (item) =>
                                                                                    item.label !==
                                                                                    charge.label
                                                                            ),
                                                                        ])
                                                                    )
                                                                );
                                                            });
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </Panel>
                    ))}
                    {!groups.length && <Empty>No offenses match these filters.</Empty>}
                </div>
            </div>
            {editing && (
                <ChargeForm
                    initial={editing.charge}
                    category={editing.category}
                    onClose={() => setEditing(null)}
                    onSave={async (charge, group) => {
                        if (editing.charge) await chargesApi.edit(charge);
                        else {
                            if (all.some((item) => item.label === charge.label))
                                throw new Error("A charge with this label already exists.");
                            await chargesApi.create(charge, group);
                        }
                        setCharges((previous) => ({
                            ...previous,
                            [group]: editing.charge
                                ? previous[group].map((item) =>
                                      item.label === charge.label ? charge : item
                                  )
                                : [...(previous[group] ?? []), charge],
                        }));
                        setEditing(null);
                    }}
                />
            )}
        </Workspace>
    );
}
function ChargeForm({
    initial,
    category,
    onClose,
    onSave,
}: {
    initial?: Charge;
    category: string;
    onClose: () => void;
    onSave: (charge: Charge, category: string) => Promise<void>;
}) {
    const [charge, setCharge] = useState<Charge>(
        initial ?? { label: "", description: "", type: "infraction", time: 0, fine: 0, points: 0 }
    );
    const [group, setGroup] = useState(category);
    const action = useAction();
    return (
        <Dialog title={initial ? "Edit sentencing" : "Create charge"} onClose={onClose}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    void action.run(() =>
                        onSave({ ...charge, label: charge.label.trim() }, group.trim())
                    );
                }}
            >
                {!initial && (
                    <>
                        <Field label="Category">
                            <input
                                required
                                value={group}
                                onChange={(event) => setGroup(event.target.value)}
                            />
                        </Field>
                        <Field label="Offense label">
                            <input
                                required
                                value={charge.label}
                                onChange={(event) =>
                                    setCharge({ ...charge, label: event.target.value })
                                }
                            />
                        </Field>
                        <Field label="Description">
                            <textarea
                                required
                                value={charge.description}
                                onChange={(event) =>
                                    setCharge({ ...charge, description: event.target.value })
                                }
                            />
                        </Field>
                        <Field label="Severity">
                            <select
                                value={charge.type}
                                onChange={(event) =>
                                    setCharge({
                                        ...charge,
                                        type: event.target.value as Charge["type"],
                                    })
                                }
                            >
                                {["infraction", "misdemeanor", "felony"].map((type) => (
                                    <option key={type}>{type}</option>
                                ))}
                            </select>
                        </Field>
                    </>
                )}
                {(["fine", "time", "points"] as const).map((key) => (
                    <Field
                        key={key}
                        label={
                            key === "time"
                                ? "Custody (months)"
                                : key === "fine"
                                  ? "Fine ($)"
                                  : "License points"
                        }
                    >
                        <input
                            type="number"
                            min={0}
                            step={1}
                            required
                            value={charge[key]}
                            onChange={(event) =>
                                setCharge({ ...charge, [key]: event.target.valueAsNumber })
                            }
                        />
                    </Field>
                ))}
                <Status error={action.error} />
                <button
                    className="primary"
                    disabled={action.pending || !charge.label.trim() || !group.trim()}
                >
                    Save charge
                </button>
            </form>
        </Dialog>
    );
}
