import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Evidence, Officer, PartialProfileData } from "../../../typings";
import { fetchIncidentOfficers } from "../../incidents/api/incidentsApi";
import { fetchProfiles } from "../../profiles/api/profilesApi";
import { useDebouncedValue } from "../../../utils/useDebouncedValue";
import { Dialog, Empty, Field, SearchField, Status } from "../../mdt/ui/Workspace";
import { useAction } from "../../mdt/model/useAction";

export function ReportForm({
    onClose,
    onSubmit,
}: {
    onClose: () => void;
    onSubmit: (title: string) => Promise<void>;
}) {
    const [title, setTitle] = useState("");
    const action = useAction();
    return (
        <Dialog title="Create report" onClose={onClose}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    void action.run(() => onSubmit(title.trim()));
                }}
            >
                <Field label="Report title">
                    <input
                        required
                        maxLength={150}
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="A concise, descriptive title"
                    />
                </Field>
                <Status error={action.error} />
                <button className="primary" disabled={action.pending || !title.trim()}>
                    Create report
                </button>
            </form>
        </Dialog>
    );
}
export function PeoplePicker({
    kind,
    onClose,
    onSelect,
}: {
    kind: "Officer" | "Citizen";
    onClose: () => void;
    onSelect: (person: Officer | PartialProfileData) => Promise<void>;
}) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const { debouncedValue } = useDebouncedValue(search, 500);
    const action = useAction();
    const people = useQuery({
        queryKey: ["report-people", kind, debouncedValue, page],
        queryFn: async () =>
            kind === "Officer"
                ? {
                      profiles: (await fetchIncidentOfficers()).filter((item) =>
                          `${item.firstname} ${item.lastname} ${item.callsign}`
                              .toLowerCase()
                              .includes(debouncedValue.toLowerCase())
                      ),
                      hasMore: false,
                  }
                : fetchProfiles(page, debouncedValue),
    });
    return (
        <Dialog title={`Link ${kind.toLowerCase()}`} onClose={onClose}>
            <SearchField
                value={search}
                onChange={(value) => {
                    setPage(1);
                    setSearch(value);
                }}
                placeholder="Search people"
            />
            <Status pending={people.isPending} error={action.error || people.error?.message} />
            {people.data?.profiles.map((person) => (
                <button
                    style={{ display: "block", width: "100%", marginBottom: 8 }}
                    key={person.citizenid}
                    disabled={action.pending}
                    onClick={() => action.run(() => onSelect(person))}
                >
                    {person.firstname} {person.lastname} · {person.citizenid}
                </button>
            ))}
            {people.data?.profiles.length === 0 && <Empty>No people found.</Empty>}
            <div className="workspace-row">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Previous
                </button>
                <button disabled={!people.data?.hasMore} onClick={() => setPage(page + 1)}>
                    Next
                </button>
            </div>
        </Dialog>
    );
}
export function EvidenceForm({
    onClose,
    onSubmit,
    onCapture,
}: {
    onClose: () => void;
    onSubmit: (item: Evidence) => Promise<void>;
    onCapture: (label: string) => Promise<void>;
}) {
    const [label, setLabel] = useState("");
    const [image, setImage] = useState("");
    const action = useAction();
    return (
        <Dialog title="Register evidence" onClose={onClose}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    void action.run(() => onSubmit({ label: label.trim(), image }));
                }}
            >
                <Field label="Evidence label">
                    <input
                        required
                        value={label}
                        onChange={(event) => setLabel(event.target.value)}
                    />
                </Field>
                <Field label="Image URL">
                    <input
                        type="url"
                        pattern="https?://.*"
                        required
                        value={image}
                        onChange={(event) => setImage(event.target.value)}
                    />
                </Field>
                <Status error={action.error} />
                <div className="workspace-row">
                    <button className="primary" disabled={action.pending || !label.trim()}>
                        Attach image
                    </button>
                    <button
                        type="button"
                        disabled={action.pending || !label.trim()}
                        onClick={() => action.run(() => onCapture(label.trim()))}
                    >
                        Take in-game photo
                    </button>
                </div>
            </form>
        </Dialog>
    );
}
