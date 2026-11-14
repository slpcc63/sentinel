import vm from "node:vm";
import ts from "typescript";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");

test("Sentinel repository excludes Cadence application runtime", () => {
  for (const path of [
    "products/calendar-sync",
    "lib/square-calendar-sink.ts",
    "lib/square-calendar-sink-delivery.ts",
    "app/app/calendar-sink",
    "app/api/calendar"
  ]) assert.equal(existsSync(resolve(root, path)), false, path);
});

test("Sentinel package exposes only Sentinel build commands", () => {
  const manifest = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
  assert.equal(manifest.name, "@slpcc63/sentinel");
  assert.match(manifest.scripts.build, /products\/time-card-manager/);
  assert.doesNotMatch(JSON.stringify(manifest.scripts), /products\/calendar-sync/);
});


test("Square adapter contains only this product's required capabilities", () => {
  const source = readFileSync(resolve(root, "lib/square.ts"), "utf8");
  assert.doesNotMatch(source, /\blistSquareJobs\b/);
  assert.doesNotMatch(source, /\bSquareJob\b/);
  assert.match(source, /export async function searchSquareScheduledShifts/);
  assert.match(source, /const supportedPluginId: SquarePluginId = "square-time-card-manager"/);
  assert.match(source, /assertSupportedPlugin\(pluginId\)/);
});


test("Square adapter rejects the other product before reading configuration", () => {
  const source = readFileSync(resolve(root, "lib/square.ts"), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022
  }}).outputText;
  const exports: Record<string, (...args: any[]) => any> = {};
  const configurationReads: string[] = [];
  vm.runInNewContext(compiled, { exports, require: (name: string) => {
    if (name === "@/lib/square-product-config") return {
      getSquareProductEnvironmentValue: (id: string) => { configurationReads.push(id); return ""; },
      getSquareProductRedirectUri: (id: string) => { configurationReads.push(id); return ""; }
    };
    return {};
  }});
  for (const name of ["getSquareScopes", "getSquareAppId", "getSquareAppSecret", "getSquareRedirectUri"]) {
    assert.throws(() => exports[name]("square-calendar-sink"), /Unsupported Square product/);
  }
  assert.deepEqual(configurationReads, []);
  const scopes = Array.from(exports.getSquareScopes("square-time-card-manager"));
  assert.equal(scopes.includes("TIMECARDS_WRITE"), true);
  assert.deepEqual(configurationReads, ["square-time-card-manager"]);
});
