import type { Criminal, CriminalProfile, Evidence, Incident, Officer, PartialIncidentData } from "../../../typings";
import { fetchNui } from "../../../utils/fetchNui";
import { isEnvBrowser } from "../../../utils/misc";
import { browserIncidentSummaries, createBrowserIncident, setBrowserIncident } from "../mocks/incidentFixtures";

export async function fetchIncidents(): Promise<PartialIncidentData[]> {
    if (isEnvBrowser()) return browserIncidentSummaries;
    const response = await fetchNui<{ incidents: PartialIncidentData[] }>("getIncidents");
    return response.incidents.map((incident) => ({
        ...incident,
        date: typeof incident.date === "number"
            ? incident.date
            : new Date(incident.date).getTime(),
    }));
}

export async function fetchIncident(id: number): Promise<Incident> {
    if (isEnvBrowser()) return createBrowserIncident(id);
    return fetchNui<Incident>("getIncident", id);
}

export async function createIncident(title: string, contents: string, evidence: Evidence[]): Promise<number> {
    const id = isEnvBrowser()
        ? Math.max(...browserIncidentSummaries.map((incident) => incident.id)) + 1
        : await fetchNui<number>("createIncident", title);

    if (isEnvBrowser()) {
        browserIncidentSummaries.unshift({ id, title, author: "Current officer", date: Date.now() });
        setBrowserIncident({ id, title, description: contents, evidence, criminals: [], officersInvolved: [] });
    } else {
        await fetchNui("saveIncidentContents", { incidentId: id, contents });
        await Promise.all(evidence.map((item) => fetchNui("addEvidence", { id, evidence: item })));
    }
    return id;
}

export async function saveIncidentNarrative(id: number, contents: string): Promise<void> {
    if (isEnvBrowser()) {
        const current = createBrowserIncident(id);
        setBrowserIncident({ ...current, description: contents });
        return;
    }
    await fetchNui("saveIncidentContents", { incidentId: id, contents });
}

export async function addIncidentEvidence(id: number, evidence: Evidence): Promise<void> {
    if (isEnvBrowser()) {
        const current = createBrowserIncident(id);
        setBrowserIncident({ ...current, evidence: [...current.evidence, evidence] });
        return;
    }
    await fetchNui("addEvidence", { id, evidence });
}

export async function removeIncidentEvidence(id: number, evidence: Evidence): Promise<void> {
    if (isEnvBrowser()) {
        const current = createBrowserIncident(id);
        setBrowserIncident({ ...current, evidence: current.evidence.filter((item) => item.label !== evidence.label || item.image !== evidence.image) });
        return;
    }
    await fetchNui("removeEvidence", { id, label: evidence.label, image: evidence.image });
}

const browserOfficers: Officer[] = [
    { firstname: "Maya", lastname: "Turner", callsign: "2-L-14", citizenid: "PD-214", playerId: 4, position: [0, 0, 0] },
    { firstname: "Amelia", lastname: "Hayes", callsign: "3-A-21", citizenid: "PD-321", playerId: 5, position: [0, 0, 0] },
    { firstname: "Jacob", lastname: "Gray", callsign: 273, citizenid: "PD-273", playerId: 2, position: [0, 0, 0] },
];

const browserPersons: CriminalProfile[] = [
    { firstname: "John", lastname: "Doe", dob: new Date("1991-06-12").getTime(), citizenid: "LS-12345" },
    { firstname: "Jane", lastname: "Smith", dob: new Date("1997-10-03").getTime(), citizenid: "LS-67890" },
    { firstname: "David", lastname: "Williams", dob: new Date("1988-02-25").getTime(), citizenid: "LS-13579" },
];

export async function fetchIncidentOfficers(): Promise<Officer[]> {
    if (isEnvBrowser()) return browserOfficers;
    return fetchNui<Officer[]>("getOfficers");
}

export async function searchIncidentPersons(search: string): Promise<CriminalProfile[]> {
    if (isEnvBrowser()) {
        const needle = search.trim().toLowerCase();
        return browserPersons.filter((person) => `${person.firstname} ${person.lastname} ${person.citizenid}`.toLowerCase().includes(needle));
    }
    return fetchNui<CriminalProfile[]>("getCriminalProfiles", search);
}

export async function addIncidentOfficer(id: number, officer: Officer): Promise<void> {
    if (isEnvBrowser()) {
        const current = createBrowserIncident(id);
        setBrowserIncident({ ...current, officersInvolved: [...current.officersInvolved, officer] });
        return;
    }
    await fetchNui("addOfficer", { id, citizenid: officer.citizenid });
}

export async function removeIncidentOfficer(id: number, citizenid: string): Promise<void> {
    if (isEnvBrowser()) {
        const current = createBrowserIncident(id);
        setBrowserIncident({ ...current, officersInvolved: current.officersInvolved.filter((officer) => officer.citizenid !== citizenid) });
        return;
    }
    await fetchNui("removeOfficer", { id, citizenid });
}

export async function addIncidentPerson(id: number, person: CriminalProfile): Promise<Criminal> {
    const criminal: Criminal = { ...person, charges: [], issueWarrant: false, pleadedGuilty: false, processed: false, penalty: { time: 0, fine: 0, reduction: null, points: 0 } };
    if (isEnvBrowser()) {
        const current = createBrowserIncident(id);
        setBrowserIncident({ ...current, criminals: [...current.criminals, criminal] });
    } else {
        await fetchNui("addCriminal", { id, criminalId: person.citizenid });
    }
    return criminal;
}

export async function removeIncidentPerson(id: number, citizenid: string): Promise<void> {
    if (isEnvBrowser()) {
        const current = createBrowserIncident(id);
        setBrowserIncident({ ...current, criminals: current.criminals.filter((person) => person.citizenid !== citizenid) });
        return;
    }
    await fetchNui("removeCriminal", { id, criminalId: citizenid });
}
