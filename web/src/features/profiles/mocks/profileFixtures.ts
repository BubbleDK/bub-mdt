import type { PartialProfileData, Profile } from "../../../typings";

const names = [
    ["Olivia", "Bennett"], ["Marcus", "Reed"], ["Elena", "Vasquez"],
    ["Darius", "Cole"], ["Maya", "Brooks"], ["Noah", "Morgan"],
    ["Camila", "Torres"], ["Ethan", "Hayes"], ["Sofia", "Rivera"],
    ["Andre", "Price"], ["Naomi", "Foster"], ["Julian", "Stone"],
    ["Iris", "Santos"], ["Malik", "Grant"], ["Nora", "Wells"],
    ["Adrian", "Cross"], ["Layla", "Diaz"], ["Theo", "Wright"],
    ["Amara", "Hughes"], ["Jonas", "Meyer"], ["Selena", "Park"],
    ["Miles", "Holland"], ["Kiara", "James"], ["Roman", "Navarro"],
    ["Aaliyah", "King"],
] as const;

const vehicleSets = [
    [
        "Sultan Custom (88ZOH526)", "Bati 801 (07NCV529)",
        "Obey Tailgater S (46KDJ219)", "Nagasaki Carbon RS (08WPT442)",
        "Gallivanter Baller ST (72MQL305)", "Vapid Dominator ASP (91LXM640)",
        "Karin Futo GTX (31HNR884)", "Bravado Buffalo STX (55VCE117)",
    ],
    ["Buffalo STX (46KDJ219)"],
    ["Elegy Retro Custom (18FTR903)", "Rebla GTS (52KPY118)"],
    [],
    ["Dominator ASP (91LXM640)", "Faggio Sport (33QRE712)"],
];

const notes = [
    "Contacted during a routine traffic stop on Vespucci Boulevard. Cooperative throughout the interaction. Driver information verified without incident.",
    "Listed as a witness in an ongoing property investigation. Prefers contact by phone after 18:00. No officer safety concerns recorded.",
    "Previous warning issued for excessive vehicle noise near Legion Square. Vehicle documentation was valid at the time of contact.",
    "No active field notes. Identity confirmed during a community outreach event in Davis.",
    "Known employee at Downtown Cab Co. Frequently operates company vehicles during overnight shifts.",
];

const jobs = [
    "Downtown Cab Co. (Senior Driver)",
    "Pillbox Medical Center (Paramedic)",
    "Los Santos Customs (Mechanic)",
    "Bean Machine (Shift Manager)",
    "Unemployed (Civilian)",
];

export const browserProfiles: PartialProfileData[] = names.map(
    ([firstname, lastname], index) => ({
        firstname,
        lastname,
        citizenid: `LS-${String(48102 + index * 137).padStart(6, "0")}`,
        dob: new Date(1984 + (index % 17), (index * 3) % 12, 3 + index).getTime(),
    })
);

export function createBrowserProfile(
    citizenid: string,
    summary?: PartialProfileData
): Profile {
    const profileIndex = Math.max(
        0,
        browserProfiles.findIndex((profile) => profile.citizenid === citizenid)
    );
    const source = summary ?? browserProfiles[profileIndex] ?? browserProfiles[0];
    const fixtureIndex = profileIndex % vehicleSets.length;
    const reportId = 1100 + profileIndex * 10;

    return {
        ...source,
        citizenid,
        phoneNumber: `(555) ${String(210 + profileIndex).padStart(3, "0")}-${String(1840 + profileIndex * 73).slice(-4)}`,
        fingerprint: `LSFP-${citizenid.replace(/\W/g, "").slice(-7).toUpperCase()}`,
        notes: notes[fixtureIndex],
        vehicles: vehicleSets[fixtureIndex],
        licenses: profileIndex % 4 === 0 ? ["driver (2 points)", "weapon"] : ["driver (0 points)"],
        jobs: [jobs[fixtureIndex]],
        properties:
            profileIndex % 3 === 0
                ? ["Alta Street Apartment 3B (apartment)"]
                : profileIndex % 3 === 1
                  ? ["Mirror Park House 12 (house)"]
                  : [],
        relatedReports: createReports(reportId),
        relatedIncidents: createIncidents(profileIndex),
    };
}

export function isBrowserProfileWanted(citizenid: string): boolean {
    const index = browserProfiles.findIndex(
        (profile) => profile.citizenid === citizenid
    );
    return index > 0 && index % 9 === 0;
}

function createReports(firstId: number): NonNullable<Profile["relatedReports"]> {
    return [
        { title: "Routine traffic stop - Vespucci Boulevard", id: firstId, author: "Officer M. Carter", date: "08/08/2026" },
        { title: "Citizen witness statement", id: firstId + 1, author: "Detective R. Brooks", date: "21/07/2026" },
        { title: "Vehicle documentation check", id: firstId + 2, author: "Officer S. Kim", date: "04/06/2026" },
        { title: "Noise complaint follow-up", id: firstId + 3, author: "Officer J. Alvarez", date: "19/03/2026" },
    ];
}

function createIncidents(index: number): NonNullable<Profile["relatedIncidents"]> {
    if (index === 0) {
        return [
            { title: "Downtown property dispute", author: "Officer A. Morgan", date: "12/05/2026", id: 300 },
            { title: "Vespucci traffic collision", author: "Officer M. Carter", date: "29/04/2026", id: 301 },
            { title: "Vehicle noise complaint", author: "Officer J. Alvarez", date: "16/03/2026", id: 302 },
            { title: "Witness - convenience store robbery", author: "Detective R. Brooks", date: "08/02/2026", id: 303 },
            { title: "Illegal parking investigation", author: "Officer S. Kim", date: "22/01/2026", id: 304 },
            { title: "Residential alarm response", author: "Officer D. Foster", date: "05/12/2025", id: 305 },
        ];
    }
    if (index % 3 === 2) return [];

    return [{
        title: index % 2 === 0 ? "Downtown property dispute" : "Vespucci traffic collision",
        author: "Officer A. Morgan",
        date: "12/05/2026",
        id: 300 + index,
    }];
}
