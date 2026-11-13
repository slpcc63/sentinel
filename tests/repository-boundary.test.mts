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
