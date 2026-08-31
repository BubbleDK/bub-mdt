import type { Evidence, PartialReportData, Report } from "../../../typings";
import { fetchNui } from "../../../utils/fetchNui";
import { isEnvBrowser } from "../../../utils/misc";
import useReportListStore from "../../../stores/reports/reportsList";
import { mutate } from "../../mdt/api/request";
import { takeEvidencePicture } from "../../mdt/api/camera";

const previews = new Map<number, Report>();
const createdPreviews: PartialReportData[] = [];
export const reportsApi = {
    async list(): Promise<PartialReportData[]> {
        await useReportListStore.getState().fetchReports();
        return [...createdPreviews, ...useReportListStore.getState().reports];
    },
    async get(id: number, title: string): Promise<Report> {
        if (isEnvBrowser())
            return (
                previews.get(id) ?? {
                    id,
                    title,
                    description: "<p></p>",
                    officersInvolved: [],
                    citizensInvolved: [],
                    evidence: [],
                }
            );
        const report = await fetchNui<Report>("getReport", id);
        if (!report) throw new Error("Report not found.");
        return report;
    },
    async create(title: string): Promise<Report> {
        const id = await fetchNui<number>("createReport", title, { data: Date.now() });
        if (!Number.isInteger(id) || id <= 0) throw new Error("The report could not be created.");
        if (isEnvBrowser())
            createdPreviews.unshift({ id, title, author: "Current officer", date: Date.now() });
        return {
            id,
            title,
            description: "<p></p>",
            officersInvolved: [],
            citizensInvolved: [],
            evidence: [],
        };
    },
    remember(report: Report) {
        if (isEnvBrowser()) previews.set(report.id, report);
    },
    save: (id: number, contents: string) =>
        mutate("saveReportContents", { reportId: id, contents }),
    person: (id: number, citizenid: string, kind: "Officer" | "Citizen", remove = false) =>
        mutate(`${remove ? "remove" : "add"}Report${kind}`, { id, citizenid }),
    evidence: (id: number, evidence: Evidence, remove = false) =>
        mutate(
            remove ? "removeReportEvidence" : "addReportEvidence",
            remove ? { id, ...evidence } : { id, evidence }
        ),
    picture: (id: number, imageLabel: string) => takeEvidencePicture(id, imageLabel, "report"),
};
