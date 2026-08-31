import { useState } from "react";
import dayjs from "dayjs";
import type { Charge, Criminal, SelectedCharge } from "../../../../typings";
import useChargeStore from "../../../../stores/chargesStore";
import { Dialog, Empty, Field, SearchField, Status } from "../../../mdt/ui/Workspace";
import { useAction } from "../../../mdt/model/useAction";
import { calculatePenalty, criminalsApi, reducedPenalty } from "../../api/criminalsApi";

export function CriminalEditor({
    criminal,
    incidentId,
    onClose,
    onSaved,
}: {
    criminal: Criminal;
    incidentId: number;
    onClose: () => void;
    onSaved: (criminal: Criminal) => void;
}) {
    const [draft, setDraft] = useState(criminal);
    const [search, setSearch] = useState("");
    const action = useAction();
    const charges = useChargeStore((state) => state.charges);
    const changeCharges = (selected: SelectedCharge[]) =>
        setDraft((previous) => ({
            ...previous,
            charges: selected,
            penalty: { ...calculatePenalty(selected), reduction: previous.penalty.reduction },
        }));
    const add = (charge: Charge) => {
        const existing = draft.charges.find((item) => item.label === charge.label);
        changeCharges(
            existing
                ? draft.charges.map((item) =>
                      item.label === charge.label ? { ...item, count: item.count + 1 } : item
                  )
                : [...draft.charges, { ...charge, count: 1 }]
        );
    };
    return (
        <Dialog
            title={`Disposition · ${criminal.firstname} ${criminal.lastname}`}
            onClose={onClose}
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    void action.run(async () => {
                        await criminalsApi.save(incidentId, draft);
                        onSaved(draft);
                    });
                }}
            >
                <p className="eyebrow" style={{ marginBottom: 12 }}>
                    Charges and sentencing
                </p>
                {draft.charges.map((item) => (
                    <div className="workspace-row" key={item.label} style={{ marginBottom: 10 }}>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        <input
                            aria-label={`Count for ${item.label}`}
                            type="number"
                            min={1}
                            step={1}
                            required
                            value={item.count}
                            style={{ width: 60, background: "#151c25", padding: 8 }}
                            onChange={(event) =>
                                changeCharges(
                                    draft.charges.map((charge) =>
                                        charge.label === item.label
                                            ? { ...charge, count: event.target.valueAsNumber }
                                            : charge
                                    )
                                )
                            }
                        />
                        <button
                            type="button"
                            aria-label={`Remove charge ${item.label}`}
                            onClick={() =>
                                changeCharges(
                                    draft.charges.filter((charge) => charge.label !== item.label)
                                )
                            }
                        >
                            Remove
                        </button>
                    </div>
                ))}
                {!draft.charges.length && <p className="muted">No charges selected.</p>}
                <SearchField
                    value={search}
                    onChange={setSearch}
                    placeholder="Find a charge to add"
                />
                <div style={{ maxHeight: 180, overflow: "auto", marginBottom: 20 }}>
                    {Object.entries(charges).map(([category, items]) => (
                        <div key={category}>
                            {items
                                .filter((item) =>
                                    `${item.label} ${item.description}`
                                        .toLowerCase()
                                        .includes(search.toLowerCase())
                                )
                                .map((item) => (
                                    <button
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            textAlign: "left",
                                            marginBottom: 6,
                                        }}
                                        key={item.label}
                                        type="button"
                                        onClick={() => add(item)}
                                    >
                                        + {item.label}{" "}
                                        <span className="muted">
                                            · ${item.fine} / {item.time} mo.
                                        </span>
                                    </button>
                                ))}
                        </div>
                    ))}
                    {!Object.keys(charges).length && <Empty>The charge library is empty.</Empty>}
                </div>
                <label className="workspace-row" style={{ marginBottom: 16 }}>
                    <input
                        type="checkbox"
                        checked={draft.issueWarrant}
                        onChange={(event) =>
                            setDraft({ ...draft, issueWarrant: event.target.checked })
                        }
                    />
                    Issue warrant
                </label>
                {draft.issueWarrant ? (
                    <>
                        <Field label="Warrant expiration">
                            <input
                                type="datetime-local"
                                required
                                min={dayjs().format("YYYY-MM-DDTHH:mm")}
                                value={
                                    draft.warrantExpiry
                                        ? dayjs(draft.warrantExpiry).format("YYYY-MM-DDTHH:mm")
                                        : ""
                                }
                                onChange={(event) =>
                                    setDraft({ ...draft, warrantExpiry: event.target.value })
                                }
                            />
                        </Field>
                        <button
                            type="button"
                            disabled={action.pending}
                            onClick={() =>
                                action.run(async () => {
                                    const expiry = await criminalsApi.recommendedExpiry(
                                        draft.charges
                                    );
                                    setDraft({ ...draft, warrantExpiry: new Date(expiry) });
                                })
                            }
                        >
                            Use recommended expiration
                        </button>
                    </>
                ) : (
                    <>
                        <Field label="Sentence reduction">
                            <select
                                value={draft.penalty.reduction ?? ""}
                                onChange={(event) =>
                                    setDraft({
                                        ...draft,
                                        penalty: {
                                            ...draft.penalty,
                                            reduction: event.target.value
                                                ? Number(event.target.value)
                                                : null,
                                        },
                                    })
                                }
                            >
                                <option value="">No reduction</option>
                                {[25, 50, 75, 80, 90].map((value) => (
                                    <option key={value} value={value}>
                                        {value}% reduction
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <div className="workspace-row" style={{ marginBottom: 16 }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={draft.pleadedGuilty}
                                    onChange={(event) =>
                                        setDraft({ ...draft, pleadedGuilty: event.target.checked })
                                    }
                                />{" "}
                                Pleaded guilty
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={draft.processed}
                                    onChange={(event) =>
                                        setDraft({ ...draft, processed: event.target.checked })
                                    }
                                />{" "}
                                Processed
                            </label>
                        </div>
                    </>
                )}
                <p className="muted" style={{ margin: "16px 0" }}>
                    Sentence: {reducedPenalty(draft.penalty.time, draft.penalty.reduction)} months ·
                    Fine: $
                    {reducedPenalty(draft.penalty.fine, draft.penalty.reduction).toLocaleString()} ·
                    Points: {draft.penalty.points}
                </p>
                <Status error={action.error} />
                <button className="primary" disabled={action.pending}>
                    Save disposition
                </button>
            </form>
        </Dialog>
    );
}
