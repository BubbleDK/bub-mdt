import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const result = await build({
    stdin: {
        contents: `
            import { createElement } from "react";
            import { renderToStaticMarkup } from "react-dom/server";
            import { ReportIndex } from "./src/features/reports/ui/ReportIndex";
            import { VehicleRegistry } from "./src/features/vehicles/ui/VehicleRegistry";
            export const report = (loading) => renderToStaticMarkup(createElement(ReportIndex, {
                reports: [], loading, pending: loading, onOpen() {}
            }));
            export const vehicle = (loading) => renderToStaticMarkup(createElement(VehicleRegistry, {
                vehicles: [], loading, onOpen() {}
            }));
        `,
        resolveDir: fileURLToPath(new URL("../", import.meta.url)),
    },
    bundle: true,
    jsx: "automatic",
    packages: "external",
    write: false,
    platform: "node",
    format: "cjs",
});
const module = { exports: {} };
new Function("require", "module", "exports", "window", result.outputFiles[0].text)(
    createRequire(import.meta.url),
    module,
    module.exports,
    { invokeNative: true }
);

test("report search and sorting stay visible while only the archive loads", () => {
    const html = module.exports.report(true);
    assert.match(html, /Search title, author or report ID/);
    assert.match(html, /Sort reports/);
    assert.match(html, /aria-label="Report archive" aria-busy="true"/);
    assert.match(html, /role="status"/);
    assert.doesNotMatch(html, /The archive is empty/);
    assert.match(module.exports.report(false), /The archive is empty/);
});

test("vehicle lookup stays visible while only registrations load", () => {
    const html = module.exports.vehicle(true);
    assert.match(html, /Search plate or model/);
    assert.match(html, /vehicle-registry-grid" aria-busy="true"/);
    assert.match(html, /role="status"/);
    assert.doesNotMatch(html, /No vehicles are registered/);
    assert.match(module.exports.vehicle(false), /No vehicles are registered/);
});
