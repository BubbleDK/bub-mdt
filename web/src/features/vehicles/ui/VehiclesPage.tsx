import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { ArrowLeft, ShieldCheck, ShieldAlert } from "lucide-react";
import { VehicleRegistry } from "./VehicleRegistry";
import { VehicleIdentity } from "./VehicleIdentity";
import "./vehicles.css";
import "../../mdt/ui/recordMotion.css";
import { vehiclesApi } from "../api/vehiclesApi";
import { RichTextEditor } from "../../../components/RichTextEditor";
import { Dialog, Empty, Field, Panel, Status, Workspace } from "../../mdt/ui/Workspace";
import { useAction } from "../../mdt/model/useAction";
import { useConfirmation } from "../../mdt/model/useConfirmation";

export default function Vehicles() {
    const confirm = useConfirmation();
    const [params, setParams] = useSearchParams();
    const plate = params.get("plate") ?? "";
    const [dialog, setDialog] = useState<"image" | "information" | "bolo" | null>(null);
    const action = useAction();
    const cache = useQueryClient();
    const list = useQuery({ queryKey: ["vehicles"], queryFn: vehiclesApi.list });
    const detail = useQuery({
        queryKey: ["vehicle", plate],
        queryFn: () => vehiclesApi.get(plate),
        enabled: !!plate,
    });
    const record = detail.data;
    const vehicle = record?.vehicle;
    const patch = (update: Partial<Awaited<ReturnType<typeof vehiclesApi.get>>>) =>
        cache.setQueryData(["vehicle", plate], { ...record, ...update });
    return (
        <Workspace
            className="vehicles-workspace"
            scrollKey={plate || "registry"}
            eyebrow={plate ? "Vehicle registry / Identification" : "Records / Vehicle registry"}
            title={plate ? "Vehicle record" : "Vehicle registry"}
            description={
                plate
                    ? "Identify the vehicle. Check the alert. Review the field record."
                    : "Registration details and field intelligence, connected by a plate."
            }
            actions={
                plate && (
                    <button onClick={() => setParams({})}>
                        <ArrowLeft size={15} />
                        All vehicles
                    </button>
                )
            }
        >
            <Status
                pending={detail.isFetching || action.pending}
                error={list.error?.message || detail.error?.message || action.error}
            />
            <div hidden={!!plate}>
                <VehicleRegistry
                    vehicles={list.data ?? []}
                    loading={list.isPending}
                    onOpen={(plate) => setParams({ plate })}
                />
            </div>
            {plate &&
                (vehicle && record ? (
                    <>
                        <section
                            className={`vehicle-alert ${record.bolo ? "active" : ""}`}
                            aria-label="Vehicle lookout status"
                        >
                            {record.bolo ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
                            <div>
                                <h2>
                                    {record.bolo
                                        ? "Active BOLO — vehicle wanted"
                                        : "No active BOLO"}
                                </h2>
                                <p>
                                    {record.bolo
                                        ? `Lookout expires ${record.expires}. Review the alert before taking action.`
                                        : "There is no active vehicle lookout on this registration."}
                                </p>
                            </div>
                            {record.bolo ? (
                                <button
                                    className="danger"
                                    disabled={action.pending}
                                    onClick={async () => {
                                        if (await confirm(`Clear BOLO for ${plate}?`))
                                            void action.run(async () => {
                                                await vehiclesApi.deleteBolo(plate);
                                                patch({ bolo: false, expires: "" });
                                                void cache.invalidateQueries({
                                                    queryKey: ["bolos"],
                                                });
                                            });
                                    }}
                                >
                                    Clear alert
                                </button>
                            ) : (
                                <button onClick={() => setDialog("bolo")}>Issue BOLO</button>
                            )}
                        </section>
                        <VehicleIdentity
                            key={`${plate}-${vehicle.image}`}
                            vehicle={vehicle}
                            onImage={() => setDialog("image")}
                        />
                        <div className="vehicle-casework">
                            <Panel title="Investigative notes">
                                <p className="vehicle-notes-hint">
                                    Keep the context behind this vehicle: encounters, identifying
                                    details and information for the next officer.
                                </p>
                                <RichTextEditor
                                    key={plate}
                                    content={vehicle.notes}
                                    height={300}
                                    placeholder="Record relevant vehicle history and observations…"
                                    onSave={async (notes) => {
                                        await vehiclesApi.notes(plate, notes);
                                        patch({ vehicle: { ...vehicle, notes } });
                                    }}
                                />
                            </Panel>
                            <Panel
                                title={`Field observations · ${vehicle.knownInformation.length}`}
                                actions={
                                    <button onClick={() => setDialog("information")}>
                                        Add observation
                                    </button>
                                }
                            >
                                <p className="vehicle-observations-hint">
                                    Quick-reference details recorded by officers. Read alongside the
                                    vehicle's registration.
                                </p>
                                <ol className="vehicle-observations">
                                    {vehicle.knownInformation.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ol>
                                {!vehicle.knownInformation.length && (
                                    <Empty>No field observations recorded yet.</Empty>
                                )}
                            </Panel>
                        </div>
                    </>
                ) : (
                    !detail.isPending && (
                        <Empty>
                            Vehicle record unavailable. Return to the registry and select another
                            registration.
                        </Empty>
                    )
                ))}
            {dialog && vehicle && (
                <VehicleForm
                    kind={dialog}
                    onClose={() => setDialog(null)}
                    onSubmit={async (value, expires) => {
                        if (dialog === "image") {
                            await vehiclesApi.image(plate, value);
                            patch({ vehicle: { ...vehicle, image: value } });
                        } else if (dialog === "information") {
                            const knownInformation = [...vehicle.knownInformation, value];
                            await vehiclesApi.information(plate, knownInformation);
                            patch({ vehicle: { ...vehicle, knownInformation } });
                        } else {
                            const expiration = dayjs(expires).format("YYYY-MM-DD HH:mm:ss");
                            await vehiclesApi.createBolo(plate, value, expiration);
                            patch({ bolo: true, expires: expiration });
                            void cache.invalidateQueries({ queryKey: ["bolos"] });
                        }
                        setDialog(null);
                    }}
                />
            )}
        </Workspace>
    );
}
function VehicleForm({
    kind,
    onClose,
    onSubmit,
}: {
    kind: "image" | "information" | "bolo";
    onClose: () => void;
    onSubmit: (value: string, expires: string) => Promise<void>;
}) {
    const [value, setValue] = useState("");
    const [expires, setExpires] = useState("");
    const action = useAction();
    return (
        <Dialog
            title={
                kind === "bolo"
                    ? "Issue vehicle BOLO"
                    : kind === "image"
                      ? "Vehicle image"
                      : "Add field observation"
            }
            onClose={onClose}
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    void action.run(() => onSubmit(value.trim(), expires));
                }}
            >
                <Field
                    label={
                        kind === "image"
                            ? "Image URL"
                            : kind === "bolo"
                              ? "Reason for alert"
                              : "Known information"
                    }
                >
                    <input
                        type={kind === "image" ? "url" : "text"}
                        pattern={kind === "image" ? "https?://.*" : undefined}
                        required
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                    />
                </Field>
                {kind === "bolo" && (
                    <Field label="Expiration">
                        <input
                            required
                            type="datetime-local"
                            min={dayjs().format("YYYY-MM-DDTHH:mm")}
                            value={expires}
                            onChange={(event) => setExpires(event.target.value)}
                        />
                    </Field>
                )}
                <Status error={action.error} />
                <button className="primary" disabled={action.pending || !value.trim()}>
                    Save
                </button>
            </form>
        </Dialog>
    );
}
