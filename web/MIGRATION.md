# MDT page migration

All changes are confined to `web`; `web-backup`, Lua callbacks, database schemas, and permission configuration remain unchanged.

## Page coverage

| Section | Workspace and retained workflows |
| --- | --- |
| Home | Shift briefing, on-duty officers/callsigns/units, notices and publishing, warrants, BOLO detail lookup, recent activity, linked records, dispatch watch |
| Profiles | Paginated search, identity, wanted status, configured information cards, image updates, narrative notes, related reports/incidents |
| Incidents | Search/filter/sort, creation, narrative editing, officer/person links, evidence URLs and game camera, charge counts, reductions, warrants and recommended expiration, guilty/processed disposition |
| Reports | Searchable index, creation, narrative editor, citizen/officer linking and removal, evidence URLs and game camera |
| Vehicles | Plate/model lookup, registration/owner details, image, observations, notes, issuing/clearing BOLOs and expiration |
| Dispatch | Call queue and emergency filter, selectable live map, three legacy tile layers, waypoint/respond/detach, unit creation/membership/leave |
| Roster | Search and qualification filtering, callsigns, ranks, specialist roles, permission-gated hiring and dismissal |
| Charges | Category/severity/search, offense criteria and penalties, permission-gated creation/editing/deletion |

The mini-dispatch overlay and incoming-call notifications also remain available independently of the main MDT. Tabs retain their individual navigation history; command search opens real destinations in new tabs.

## Boundaries and compatibility

- Feature `api/` modules own NUI callback names and payload construction; feature `ui/` modules own presentation and interaction. Existing `typings/` remain the domain contract. Type-only imports and the equivalent `CriminalProfile` alias do not change fields.
- React Query manages record fetching and shared record caches. Zustand retains runtime configuration, identity, charges, dispatch state, and existing browser fixtures.
- `features/mdt/model/useRuntimeEvents.ts` registers one set of central runtime subscriptions, regardless of the number of tabs. Camera completion is associated with the original record, not whichever tab happens to be active.
- Preserve the legacy payload details: scalar report/incident IDs; vehicle `{ plate }`; `citizenId` for rank/profile image versus `citizenid` elsewhere; string player IDs for unit membership; `leaveUnit` with `{ data: 1 }`; and the existing `hideMiniDisptach` spelling.
- Mutations surface explicit server rejection. Requests have a timeout and HTTP error handling. If incident creation returns an ID but subsequent writes fail, retrying the same form reuses that ID and checks saved evidence before adding it again. This is not a replacement for server-side transactions/idempotency when a response itself is lost.
- Shared fields, panels, focus-trapped dialogs, confirmation dialogs, empty/error states, and responsive container layouts live under `features/mdt`. Hidden tabs are inert. Dialog portals hide when the MDT closes, including during camera capture.
- Routes and the command palette are loaded on demand. Production output still goes to `web/build`, as expected by the existing resource manifest.

## Verification

From `web`, using the existing pnpm 8 lockfile/toolchain:

```sh
pnpm install --frozen-lockfile
pnpm exec tsc -b --force
pnpm exec eslint .
pnpm test
pnpm build
pnpm dev
```

`tests/contracts.test.mjs` tests the actual adapters/runtime handlers with mocked external boundaries: transport encoding, legacy payloads, server rejection, creation recovery, penalty calculations, camera routing, runtime initialization/call deduplication, and domain-model parity against the backup.

Browser QA covered desktop, tablet, and 390px layouts; all section navigation; report creation/linking; vehicle observation saving; roster rank updates; incident disposition persistence; confirmation cancellation; dispatch response; and command navigation/new tabs. Preview writes are local fixtures, not server persistence. Hiring and camera capture explicitly require the game runtime.

## Connected-game acceptance checks

- Open/close the MDT with actual initialization/configuration and officer identity. Check both permitted and restricted ranks.
- Save and reopen each record after a server round trip, including interrupted requests and invalid/deleted records.
- Capture/cancel evidence photos, switch tabs, and confirm the result belongs to its original incident/report.
- Verify calls, unit changes, officer coordinates, keybound mini-dispatch, notifications, GPS, and game focus release.
- Verify map imagery availability and coordinates in the target FiveM/CEF version. Tile imagery uses the same external Rockstar service as the backup.
- Initialization retains the supplied locale dictionary and translates navigation labels; newly written workspace copy is English. A full translation pass is separate from data/model compatibility.

No connected FiveM server was available during local verification; these game-dependent checks must be completed there before release.
