import type { Incident, PartialIncidentData, SelectedCharge } from "../../../typings";

const now = Date.now();
const day = 86_400_000;

export const browserIncidentSummaries: PartialIncidentData[] = [
    { id: 1048, title: "Armed robbery — Vespucci Boulevard", author: "Sgt. E. Atkinson", date: now - day * 0.4 },
    { id: 1047, title: "Vehicle pursuit — Alta Street", author: "Ofc. J. Gray", date: now - day * 1.2 },
    { id: 1046, title: "Burglary at Digital Den", author: "Det. C. Graham", date: now - day * 2.1 },
    { id: 1045, title: "Possession with intent", author: "Ofc. M. Turner", date: now - day * 3.7 },
    { id: 1044, title: "Traffic collision — Del Perro", author: "Ofc. A. Hayes", date: now - day * 5.2 },
    { id: 1043, title: "Shots fired — Strawberry Ave", author: "Sgt. E. Atkinson", date: now - day * 6.8 },
    { id: 1042, title: "Grand theft auto investigation", author: "Det. C. Graham", date: now - day * 9.1 },
    { id: 1041, title: "Public disturbance — Legion Square", author: "Ofc. J. Gray", date: now - day * 12.3 },
];

const browserIncidentOverrides = new Map<number, Incident>();

export function setBrowserIncident(incident: Incident) {
    browserIncidentOverrides.set(incident.id, incident);
}

const robberyCharge: SelectedCharge = {
    label: "Armed robbery",
    type: "felony",
    description: "Taking property through force while armed.",
    time: 25,
    fine: 8500,
    points: 0,
    count: 1,
};

export function createBrowserIncident(id: number): Incident {
    const override = browserIncidentOverrides.get(id);
    if (override) return override;
    const summary = browserIncidentSummaries.find((item) => item.id === id) ?? browserIncidentSummaries[0];
    return {
        id: summary.id,
        title: summary.title,
        description: "<p>Units responded following multiple emergency calls. Officers secured the scene, interviewed witnesses, and collected available surveillance footage.</p><p>The primary subject was detained without further incident. This case remains open pending evidence review and follow-up interviews.</p>",
        officersInvolved: [
            { firstname: "Edward", lastname: "Atkinson", callsign: 125, citizenid: "PD-125", playerId: 1, position: [0, 0, 0] },
            { firstname: "Jacob", lastname: "Gray", callsign: 273, citizenid: "PD-273", playerId: 2, position: [0, 0, 0] },
            { firstname: "Callum", lastname: "Graham", callsign: 188, citizenid: "PD-188", playerId: 3, position: [0, 0, 0] },
        ],
        evidence: [
            { label: "CCTV still — east entrance", image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=70" },
        ],
        criminals: [
            {
                firstname: "Archie", lastname: "Moss", dob: new Date("1995-04-18").getTime(), citizenid: "LS-48291",
                charges: [robberyCharge], issueWarrant: false, pleadedGuilty: false, processed: false,
                penalty: { time: 25, fine: 8500, reduction: null, points: 0 },
            },
        ],
    };
}
