import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { build } from "esbuild";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);

async function load(entry, mocks = {}, realTransport = false) {
    const requests = [];
    const handlers = new Map();
    const data = new Map();
    let response = true;
    const result = await build({
        stdin: { contents: entry, resolveDir: root },
        bundle: true,
        write: false,
        platform: "node",
        format: "cjs",
        plugins: [
            {
                name: "test-boundaries",
                setup(builder) {
                    builder.onResolve({ filter: /(?:fetchNui|useNuiEvent)$/ }, (args) =>
                        realTransport && args.path.endsWith("fetchNui")
                            ? undefined
                            : { path: args.path.split("/").at(-1), namespace: "test" }
                    );
                    builder.onResolve({ filter: /^@tanstack\/react-query$/ }, () => ({
                        path: "query",
                        namespace: "test",
                    }));
                    builder.onLoad({ filter: /.*/, namespace: "test" }, (args) => ({
                        contents:
                            args.path === "fetchNui"
                                ? "export const fetchNui = (...args) => globalThis.request(...args)"
                                : args.path === "useNuiEvent"
                                  ? "export const useNuiEvent = (name, handler) => globalThis.handlers.set(name, handler)"
                                  : "export const useQueryClient = () => globalThis.cache; export const useInfiniteQuery = () => { throw new Error('Unexpected query hook in contract test'); }",
                    }));
                },
            },
        ],
    });
    const module = { exports: {} };
    const context = {
        module,
        exports: module.exports,
        require,
        console,
        setTimeout,
        clearTimeout,
        process: { env: { NODE_ENV: "test" } },
        window: { invokeNative: true },
        ...mocks,
        handlers,
        cache: {
            setQueryData(key, update) {
                const id = JSON.stringify(key);
                data.set(id, typeof update === "function" ? update(data.get(id)) : update);
            },
        },
        request: async (event, payload) => {
            requests.push({ event, payload });
            return typeof response === "function" ? response(event, payload) : response;
        },
    };
    vm.runInNewContext(result.outputFiles[0].text, context);
    return {
        api: module.exports,
        requests,
        handlers,
        data,
        respond(value) {
            response = value;
        },
    };
}
const plain = (value) => JSON.parse(JSON.stringify(value));

test("NUI transport posts to the resource using the unchanged JSON body", async () => {
    const sent = [];
    const { api } = await load(
        'export { fetchNui } from "./src/utils/fetchNui"',
        {
            AbortController,
            window: {
                invokeNative: true,
                GetParentResourceName: () => "bub-mdt",
                setTimeout,
                clearTimeout,
            },
            fetch: async (url, options) => {
                sent.push({ url, options });
                return { ok: true, json: async () => ({ id: 8 }) };
            },
        },
        true
    );
    assert.deepEqual(await api.fetchNui("getVehicle", { plate: "ABC" }), { id: 8 });
    assert.equal(sent[0].url, "https://bub-mdt/getVehicle");
    assert.equal(sent[0].options.method, "post");
    assert.equal(sent[0].options.body, '{"plate":"ABC"}');
});

test("transport errors and unconfigured browser previews fail promptly", async () => {
    const native = await load(
        'export { fetchNui } from "./src/utils/fetchNui"',
        {
            AbortController,
            window: { invokeNative: true, setTimeout, clearTimeout },
            fetch: async () => ({ ok: false, status: 503 }),
        },
        true
    );
    await assert.rejects(native.api.fetchNui("getReports"), /503/);
    const preview = await load(
        'export { fetchNui } from "./src/utils/fetchNui"',
        { window: {} },
        true
    );
    await assert.rejects(preview.api.fetchNui("unsupported"), /No browser preview/);
});

test("camera completion updates only the originally requested record", async () => {
    const { api, handlers, data } = await load(
        'export { useRuntimeEvents } from "./src/features/mdt/model/useRuntimeEvents.ts"; export { takeEvidencePicture } from "./src/features/mdt/api/camera.ts";'
    );
    api.useRuntimeEvents();
    data.set('["report",7]', {
        id: 7,
        title: "First",
        officersInvolved: [],
        citizensInvolved: [],
        evidence: [],
    });
    data.set('["report",8]', {
        id: 8,
        title: "Other tab",
        officersInvolved: [],
        citizensInvolved: [],
        evidence: [],
    });
    await api.takeEvidencePicture(7, "Photo", "report");
    handlers.get("updateReportEvidence")({
        imageLabel: "Photo",
        imageURL: "https://example.com/photo.jpg",
    });
    assert.equal(data.get('["report",7]').evidence.length, 1);
    assert.equal(data.get('["report",8]').evidence.length, 0);
    handlers.get("updateReportEvidence")({
        imageLabel: "Photo",
        imageURL: "https://example.com/photo.jpg",
    });
    assert.equal(data.get('["report",7]').evidence.length, 1);
});

test("report callback names and payloads retain the legacy contract", async () => {
    const {
        api: { reportsApi },
        requests,
        respond,
    } = await load('export { reportsApi } from "./src/features/reports/api/reportsApi.ts"');
    respond(71);
    const report = await reportsApi.create("Witness account");
    assert.equal(report.id, 71);
    await reportsApi.get(71, "Witness account");
    await reportsApi.save(71, "<p>Narrative</p>");
    await reportsApi.person(71, "CIT-1", "Citizen");
    await reportsApi.person(71, "OFF-1", "Officer", true);
    await reportsApi.evidence(71, { label: "Photo", image: "https://example.com/photo.jpg" });
    await reportsApi.evidence(71, { label: "Photo", image: "https://example.com/photo.jpg" }, true);
    assert.deepEqual(plain(requests), [
        { event: "createReport", payload: "Witness account" },
        { event: "getReport", payload: 71 },
        { event: "saveReportContents", payload: { reportId: 71, contents: "<p>Narrative</p>" } },
        { event: "addReportCitizen", payload: { id: 71, citizenid: "CIT-1" } },
        { event: "removeReportOfficer", payload: { id: 71, citizenid: "OFF-1" } },
        {
            event: "addReportEvidence",
            payload: {
                id: 71,
                evidence: { label: "Photo", image: "https://example.com/photo.jpg" },
            },
        },
        {
            event: "removeReportEvidence",
            payload: { id: 71, label: "Photo", image: "https://example.com/photo.jpg" },
        },
    ]);
});

test("vehicle lookup preserves plate objects and conditional BOLO expiration fetch", async () => {
    const {
        api: { vehiclesApi },
        requests,
        respond,
    } = await load('export { vehiclesApi } from "./src/features/vehicles/api/vehiclesApi.ts"');
    respond((event) => (event === "isVehicleBOLO" ? false : { plate: "TEST" }));
    await vehiclesApi.get("TEST");
    assert.deepEqual(
        requests.map((item) => item.event),
        ["getVehicle", "isVehicleBOLO"]
    );
    respond((event) =>
        event === "isVehicleBOLO"
            ? true
            : event === "getBOLOExpirationDate"
              ? "2026-09-01"
              : { plate: "TEST" }
    );
    assert.equal((await vehiclesApi.get("TEST")).expires, "2026-09-01");
    await vehiclesApi.notes("TEST", "notes");
    await vehiclesApi.information("TEST", ["Blue spoiler"]);
    await vehiclesApi.createBolo("TEST", "Investigation", "2026-09-01 12:00:00");
    await vehiclesApi.deleteBolo("TEST");
    assert.deepEqual(plain(requests.at(-2)), {
        event: "createBOLO",
        payload: { plate: "TEST", reason: "Investigation", expirationDate: "2026-09-01 12:00:00" },
    });
    assert.deepEqual(plain(requests.at(-1)), { event: "deleteBOLO", payload: { plate: "TEST" } });
});

test("roster and dispatch preserve unusual ID casing, scalar payloads and player ID strings", async () => {
    const {
        api: { rosterApi, dispatchApi },
        requests,
        respond,
    } = await load(
        'export { rosterApi } from "./src/features/roster/api/rosterApi.ts"; export { dispatchApi } from "./src/features/dispatch/api/dispatchApi.ts"'
    );
    respond((event) => (event === "createUnit" ? { id: 2, name: "Unit 2" } : true));
    await rosterApi.rank("C1", 4);
    await rosterApi.callsign("C1", "2A-03");
    await rosterApi.fire("C1");
    await dispatchApi.create("heli");
    await dispatchApi.respond(4, false);
    await dispatchApi.respond(4, true);
    await dispatchApi.members(2, ["14", "22"]);
    await dispatchApi.waypoint([12, 34]);
    assert.deepEqual(plain(requests), [
        { event: "setOfficerRank", payload: { citizenId: "C1", grade: 4 } },
        { event: "setOfficerCallSign", payload: { citizenid: "C1", callsign: "2A-03" } },
        { event: "fireOfficer", payload: "C1" },
        { event: "createUnit", payload: "heli" },
        { event: "respondToCall", payload: 4 },
        { event: "detachFromCall", payload: 4 },
        { event: "setUnitOfficers", payload: { id: 2, officers: ["14", "22"] } },
        { event: "setWaypoint", payload: [12, 34] },
    ]);
});

test("server rejection is surfaced instead of reported as success", async () => {
    const {
        api: { chargesApi },
        respond,
    } = await load('export { chargesApi } from "./src/features/charges/api/chargesApi.ts"');
    respond(false);
    await assert.rejects(chargesApi.remove("Speeding"), /declined/);
    respond(0);
    await assert.rejects(chargesApi.remove("Speeding"), /declined/);
});

test("dashboard preserves the separate BOLO detail lookup and active officer fetch", async () => {
    const {
        api: { dashboardApi },
        requests,
        respond,
    } = await load('export { dashboardApi } from "./src/features/dashboard/api/dashboardApi.ts"');
    respond((event) =>
        event === "getActiveOfficers"
            ? { 8: { citizenid: "OFF-8" } }
            : { plate: "TEST", reason: "Investigation", expiresAt: "2026-09-02" }
    );
    assert.equal((await dashboardApi.officers())[0].citizenid, "OFF-8");
    assert.equal((await dashboardApi.bolo("TEST")).reason, "Investigation");
    await dashboardApi.announce("Shift briefing");
    assert.deepEqual(plain(requests), [
        { event: "getActiveOfficers" },
        { event: "getBolo", payload: { plate: "TEST" } },
        { event: "createAnnouncement", payload: { contents: "Shift briefing" } },
    ]);
});

test("profile and incident mutations keep their original identifier casing and nesting", async () => {
    const { api, requests } = await load(
        'export * from "./src/features/profiles/api/profilesApi.ts"; export * from "./src/features/incidents/api/incidentsApi.ts"'
    );
    await api.saveProfileNotes("C1", "notes");
    await api.saveProfileImage("C1", "https://example.com/profile.jpg");
    await api.saveIncidentNarrative(8, "narrative");
    await api.addIncidentOfficer(8, { citizenid: "O1" });
    await api.removeIncidentPerson(8, "C1");
    await api.addIncidentEvidence(8, { label: "Photo", image: "https://example.com/evidence.jpg" });
    assert.deepEqual(plain(requests), [
        { event: "saveProfileNotes", payload: { citizenid: "C1", notes: "notes" } },
        {
            event: "updateProfileImage",
            payload: { citizenId: "C1", image: "https://example.com/profile.jpg" },
        },
        { event: "saveIncidentContents", payload: { incidentId: 8, contents: "narrative" } },
        { event: "addOfficer", payload: { id: 8, citizenid: "O1" } },
        { event: "removeCriminal", payload: { id: 8, criminalId: "C1" } },
        {
            event: "addEvidence",
            payload: {
                id: 8,
                evidence: { label: "Photo", image: "https://example.com/evidence.jpg" },
            },
        },
    ]);
});

test("rejected creation never proceeds with a false or zero record ID", async () => {
    const { api, requests, respond } = await load(
        'export { reportsApi } from "./src/features/reports/api/reportsApi.ts"; export { createIncident } from "./src/features/incidents/api/incidentsApi.ts"; export { dispatchApi } from "./src/features/dispatch/api/dispatchApi.ts"'
    );
    respond(0);
    await assert.rejects(api.reportsApi.create("Test"), /could not/);
    await assert.rejects(api.createIncident("Test", "", []), /did not create/);
    respond(false);
    await assert.rejects(api.dispatchApi.create("car"), /could not/);
    assert.deepEqual(
        requests.map((request) => request.event),
        ["createReport", "createIncident", "createUnit"]
    );
});

test("retrying a partially saved incident reuses its ID and skips already persisted evidence", async () => {
    const { api, requests, respond } = await load(
        'export { createIncident } from "./src/features/incidents/api/incidentsApi.ts"'
    );
    const photo = { label: "Photo", image: "https://example.com/photo.jpg" };
    const progress = {};
    respond((event) => (event === "createIncident" ? 12 : false));
    await assert.rejects(api.createIncident("Test", "Narrative", [photo], progress));
    assert.equal(progress.id, 12);
    respond((event) => (event === "getIncident" ? { id: 12, evidence: [photo] } : true));
    assert.equal(await api.createIncident("Test", "Narrative", [photo], progress), 12);
    assert.deepEqual(
        requests.map((request) => request.event),
        ["createIncident", "saveIncidentContents", "getIncident", "saveIncidentContents"]
    );
});

test("charge counts, reductions and criminal serialization match the original workflow", async () => {
    const { api, requests } = await load(
        'export * from "./src/features/incidents/api/criminalsApi.ts"'
    );
    const charges = [
        {
            label: "Speeding",
            description: "",
            type: "infraction",
            count: 3,
            fine: 250,
            time: 5,
            points: 2,
        },
    ];
    assert.deepEqual(plain(api.calculatePenalty(charges)), {
        time: 15,
        fine: 750,
        points: 6,
        reduction: null,
    });
    assert.equal(api.reducedPenalty(15, 25), 11);
    assert.equal(api.reducedPenalty(750, null), 750);
    const criminal = {
        citizenid: "C1",
        firstname: "Test",
        lastname: "Citizen",
        dob: 0,
        charges,
        penalty: api.calculatePenalty(charges),
        issueWarrant: true,
        pleadedGuilty: false,
        processed: false,
        warrantExpiry: "2026-09-02T12:30",
    };
    await api.criminalsApi.save(5, criminal);
    assert.equal(requests[0].payload.criminal.warrantExpiry, "2026-09-02 12:30:00");
    assert.equal(requests[0].payload.id, 5);
});

test("runtime initializes identity and charges and deduplicates live calls", async () => {
    const { api, handlers } = await load(
        'export { useRuntimeEvents } from "./src/features/mdt/model/useRuntimeEvents.ts"; export { default as personal } from "./src/stores/personalDataStore.ts"; export { default as charges } from "./src/stores/chargesStore.ts"; export { useCallsStore as calls } from "./src/stores/dispatch/calls.ts"; export { default as visibility } from "./src/stores/appVisibilityStore.ts";'
    );
    api.useRuntimeEvents();
    handlers.get("setInitData")({ profileCards: [], charges: { Test: [] } });
    handlers.get("openMDT")({ personalData: { citizenid: "TEST", firstname: "Test", grade: 4 } });
    assert.equal(api.personal.getState().personalData.citizenid, "TEST");
    assert.equal(api.visibility.getState().showApp, true);
    assert.deepEqual(plain(api.charges.getState().charges), { Test: [] });
    handlers.get("addCall")({ id: 5, units: [] });
    handlers.get("addCall")({ id: 5, units: [], offense: "Updated" });
    assert.equal(api.calls.getState().calls.length, 1);
    assert.equal(api.calls.getState().calls[0].offense, "Updated");
    handlers.get("setVisible")({ visible: false });
    assert.equal(api.visibility.getState().showApp, false);
});

test("domain model fields match web-backup, allowing the existing Mantine-free date representation", async () => {
    for (const name of [
        "announcement",
        "charges",
        "character",
        "config",
        "dispatch",
        "incident",
        "officer",
        "profile",
        "report",
        "roster",
        "vehicle",
        "warrant",
    ]) {
        // web already replaced Mantine DateValue with Date|string|null before this migration.
        const normalize = (value) =>
            value
                .replace(/import\s+\{ DateValue \}\s+from\s+"@mantine\/dates";/, "")
                .replaceAll("import type", "import")
                .replace(
                    /interface CriminalProfile extends PartialProfileData\s*\{\s*\}/,
                    "type CriminalProfile = PartialProfileData;"
                )
                .replace(/Date \| string \| null|DateValue/g, "SerializedDate")
                .replace(/\s+/g, " ")
                .trim();
        const current = await readFile(
            new URL(`../src/typings/${name}.ts`, import.meta.url),
            "utf8"
        );
        const legacy = await readFile(
            new URL(`../../web-backup/src/typings/${name}.ts`, import.meta.url),
            "utf8"
        );
        assert.equal(normalize(current), normalize(legacy), name);
    }
});
