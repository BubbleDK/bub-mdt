import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Officer, PartialProfileData, Report } from "../../../typings";
import { RichTextEditor } from "../../../components/RichTextEditor";
import { reportsApi } from "../api/reportsApi";
import { EvidenceForm, PeoplePicker, ReportForm } from "./ReportForms";
import { Empty, Panel, Status, Workspace } from "../../mdt/ui/Workspace";
import { ArrowLeft, FilePlus2, Unlink } from "lucide-react";
import { ReportIndex } from "./ReportIndex";
import "./reports.css";
import "../../mdt/ui/recordMotion.css";
import { useAction } from "../../mdt/model/useAction";
import { useConfirmation } from "../../mdt/model/useConfirmation";
import { dateLabel } from "../../mdt/lib/dateLabel";

export default function ReportsPage() {
    const confirm = useConfirmation();
    const [params, setParams] = useSearchParams();
    const cache = useQueryClient();
    const [selection, setSelection] = useState<{ id: number; title: string } | null>(() =>
        params.has("id")
            ? { id: Number(params.get("id")), title: `Report #${params.get("id")}` }
            : null
    );
    const detail = useQuery({
        queryKey: ["report", selection?.id],
        queryFn: () => reportsApi.get(selection!.id, selection!.title),
        enabled: !!selection,
    });
    const report = detail.data;
    const setReport = (next: Report) => {
        cache.setQueryData(["report", next.id], next);
        setSelection({ id: next.id, title: next.title });
    };
    const [dialog, setDialog] = useState<"create" | "Officer" | "Citizen" | "evidence" | null>(
        null
    );
    const action = useAction();
    const list = useQuery({ queryKey: ["reports"], queryFn: reportsApi.list });
    const update = (next: Report) => {
        reportsApi.remember(next);
        setReport(next);
    };
    const open = (id: number, title: string) =>
        action.run(async () => {
            setReport(await reportsApi.get(id, title));
        });
    const summary = list.data?.find((item) => item.id === report?.id);
    return (
        <Workspace
            className="reports-workspace"
            scrollKey={report?.id ?? "archive"}
            eyebrow={report ? `Reports / File ${report.id}` : "Records / Written accounts"}
            title={report ? report.title : "Report archive"}
            description={
                report
                    ? summary
                        ? `${summary.author} · ${dateLabel(summary.date)}`
                        : `Report #${report.id} · Narrative, people and supporting evidence`
                    : "Clear accounts. Connected people. A record you can return to."
            }
            actions={
                <>
                    {selection && (
                        <button
                            onClick={() => {
                                setSelection(null);
                                setParams({});
                            }}
                        >
                            <ArrowLeft size={15} />
                            All reports
                        </button>
                    )}
                    <button className="primary" onClick={() => setDialog("create")}>
                        <FilePlus2 size={15} />
                        New report
                    </button>
                </>
            }
        >
            <Status
                pending={action.pending || detail.isFetching}
                error={action.error || list.error?.message || detail.error?.message}
            />
            {params.get("id") && !report && (
                <button
                    onClick={() => open(Number(params.get("id")), `Report #${params.get("id")}`)}
                >
                    Open linked report #{params.get("id")}
                </button>
            )}
            <div>
                {report ? (
                    <div className="report-dossier">
                        <div className="report-document-column">
                            <section className="report-document" aria-label="Report narrative">
                                <header className="report-document-heading">
                                    <div>
                                        <span className="report-kicker">01 / Written account</span>
                                        <h2>Narrative</h2>
                                    </div>
                                    <span>#{report.id}</span>
                                </header>
                                <p className="report-document-hint">
                                    Record what happened, what was observed and the actions taken.
                                    Save your changes when the account is ready.
                                </p>
                                <RichTextEditor
                                    key={report.id}
                                    content={report.description}
                                    height={400}
                                    placeholder="Record a clear, factual account…"
                                    onSave={async (contents) => {
                                        await reportsApi.save(report.id, contents);
                                        update({ ...report, description: contents });
                                    }}
                                />
                            </section>
                            <section className="report-evidence-register">
                                <header>
                                    <div>
                                        <span className="report-kicker">
                                            02 / Supporting material
                                        </span>
                                        <h2>Evidence register · {report.evidence.length}</h2>
                                    </div>
                                    <button onClick={() => setDialog("evidence")}>
                                        Add evidence
                                    </button>
                                </header>
                                <div className="evidence-grid">
                                    {report.evidence.map((item, index) => (
                                        <article key={`${item.image}-${index}`}>
                                            <a href={item.image} target="_blank" rel="noreferrer">
                                                <img
                                                    src={item.image}
                                                    alt={item.label}
                                                    loading="lazy"
                                                />
                                            </a>
                                            <p>{item.label}</p>
                                            <button
                                                className="danger"
                                                aria-label={`Remove evidence ${item.label}`}
                                                disabled={action.pending}
                                                onClick={async () => {
                                                    if (
                                                        await confirm(
                                                            `Remove evidence “${item.label}”?`
                                                        )
                                                    )
                                                        void action.run(async () => {
                                                            await reportsApi.evidence(
                                                                report.id,
                                                                item,
                                                                true
                                                            );
                                                            update({
                                                                ...report,
                                                                evidence: report.evidence.filter(
                                                                    (_, i) => i !== index
                                                                ),
                                                            });
                                                        });
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </article>
                                    ))}
                                </div>
                                {!report.evidence.length && (
                                    <Empty>
                                        No supporting material yet. Attach an image or capture
                                        evidence in the field.
                                    </Empty>
                                )}
                            </section>
                        </div>
                        <aside className="report-context-column" aria-label="People and references">
                            <div className="report-context-summary">
                                <div>
                                    <strong>{report.officersInvolved.length}</strong>
                                    <span>Officers</span>
                                </div>
                                <div>
                                    <strong>{report.citizensInvolved.length}</strong>
                                    <span>Citizens</span>
                                </div>
                                <div>
                                    <strong>{report.evidence.length}</strong>
                                    <span>Evidence</span>
                                </div>
                            </div>
                            {(["Officer", "Citizen"] as const).map((kind) => (
                                <Panel
                                    key={kind}
                                    title={
                                        kind === "Officer"
                                            ? "Officers involved"
                                            : "Citizens involved"
                                    }
                                    actions={
                                        <button onClick={() => setDialog(kind)}>
                                            Add {kind.toLowerCase()}
                                        </button>
                                    }
                                >
                                    {(kind === "Officer"
                                        ? report.officersInvolved
                                        : report.citizensInvolved
                                    ).map((person) => (
                                        <PersonRow
                                            key={person.citizenid}
                                            person={person}
                                            disabled={action.pending}
                                            remove={() =>
                                                action.run(async () => {
                                                    await reportsApi.person(
                                                        report.id,
                                                        person.citizenid,
                                                        kind,
                                                        true
                                                    );
                                                    update({
                                                        ...report,
                                                        [kind === "Officer"
                                                            ? "officersInvolved"
                                                            : "citizensInvolved"]: (kind ===
                                                        "Officer"
                                                            ? report.officersInvolved
                                                            : report.citizensInvolved
                                                        ).filter(
                                                            (item) =>
                                                                item.citizenid !== person.citizenid
                                                        ),
                                                    });
                                                })
                                            }
                                        />
                                    ))}
                                    {!(
                                        kind === "Officer"
                                            ? report.officersInvolved
                                            : report.citizensInvolved
                                    ).length && <Empty>No {kind.toLowerCase()} linked yet.</Empty>}
                                </Panel>
                            ))}
                        </aside>
                    </div>
                ) : null}
                <div hidden={!!report}>
                    <ReportIndex
                        reports={list.data ?? []}
                        pending={action.pending || list.isPending}
                        loading={list.isPending}
                        onOpen={open}
                    />
                </div>
            </div>
            {dialog === "create" && (
                <ReportForm
                    onClose={() => setDialog(null)}
                    onSubmit={async (title) => {
                        const created = await reportsApi.create(title);
                        update(created);
                        await list.refetch();
                        setDialog(null);
                    }}
                />
            )}
            {(dialog === "Officer" || dialog === "Citizen") && report && (
                <PeoplePicker
                    kind={dialog}
                    onClose={() => setDialog(null)}
                    onSelect={async (person) => {
                        const key = dialog === "Officer" ? "officersInvolved" : "citizensInvolved";
                        if (report[key].some((item) => item.citizenid === person.citizenid))
                            throw new Error("This person is already linked.");
                        await reportsApi.person(report.id, person.citizenid, dialog);
                        update(
                            dialog === "Officer"
                                ? {
                                      ...report,
                                      officersInvolved: [
                                          ...report.officersInvolved,
                                          person as Officer,
                                      ],
                                  }
                                : {
                                      ...report,
                                      citizensInvolved: [
                                          ...report.citizensInvolved,
                                          person as PartialProfileData,
                                      ],
                                  }
                        );
                        setDialog(null);
                    }}
                />
            )}
            {dialog === "evidence" && report && (
                <EvidenceForm
                    onClose={() => setDialog(null)}
                    onSubmit={async (item) => {
                        if (
                            report.evidence.some(
                                (evidence) =>
                                    evidence.label === item.label && evidence.image === item.image
                            )
                        )
                            throw new Error("This evidence is already attached.");
                        await reportsApi.evidence(report.id, item);
                        update({ ...report, evidence: [...report.evidence, item] });
                        setDialog(null);
                    }}
                    onCapture={async (label) => {
                        await reportsApi.picture(report.id, label);
                        setDialog(null);
                    }}
                />
            )}
        </Workspace>
    );
}
function PersonRow({
    person,
    remove,
    disabled,
}: {
    person: Officer | PartialProfileData;
    remove: () => void;
    disabled: boolean;
}) {
    const navigate = useNavigate();
    return (
        <div className="report-person">
            <button
                className="report-person-link"
                onClick={() => navigate(`/profiles/${person.citizenid}`)}
            >
                <span className="report-person-avatar">
                    {person.firstname[0]}
                    {person.lastname[0]}
                </span>
                <span>
                    <strong>
                        {person.firstname} {person.lastname}
                    </strong>
                    <small>
                        {"callsign" in person ? `Callsign ${person.callsign}` : person.citizenid}
                    </small>
                </span>
            </button>
            <button
                aria-label={`Unlink ${person.firstname} ${person.lastname}`}
                disabled={disabled}
                onClick={remove}
                className="report-person-unlink"
                title="Unlink from this report"
            >
                <Unlink size={14} />
            </button>
        </div>
    );
}
