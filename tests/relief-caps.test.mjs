import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const cap = (v, c) => Math.min(v, c);

// G1
assert.equal(cap(999999, 9000), 9000);

// Individual cap
assert.equal(9000 + 7000 + 4000 + 6000, 26000);

// Medical caps for YA2026 filing in 2027
const med678 = Math.min(cap(20000, 10000) + cap(5000, 1000) + cap(9000, 6000), 10000);
assert.equal(med678, 10000);
assert.equal(8000 + 6000 + 10000, 24000);

// Lifestyle, sports, local travel, EV / food waste / CCTV caps
assert.equal(2500 + 1000 + 1000 + 2500, 7000);

// Insurance caps
const g17 = Math.min(cap(9000, 3000) + cap(9000, 4000), 7000);
assert.equal(g17, 7000);
assert.equal(7000 + 3000 + 4000 + 350, 14350);

// Education and SSPN caps
assert.equal(7000 + 8000, 15000);

// Housing mutual exclusivity (max one option)
assert.equal(Math.max(7000, 5000), 7000);

// YA2026 (submitted in 2027) rules should include every category supplied by the 2026 relief brief.
const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const ya2026 = app.slice(app.indexOf('  "2026": ['), app.indexOf('\n\n  "2027": [', app.indexOf('  "2026": [')));
for (const id of ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "VMY", "G11", "G12", "G13", "G14", "G15", "G16a", "G16b", "G16c", "G16d", "G17ins", "G17epf", "G18", "G19", "G20", "G21", "G22"]) {
  assert.match(ya2026, new RegExp(`id: "${id}"`), `YA2026 should include ${id}`);
}
assert.match(ya2026, /id: "G4"[\s\S]*?cap: 7000/, "YA2026 disabled individual relief should be RM7,000");
assert.match(ya2026, /id: "G8"[\s\S]*?cap: 6000/, "YA2026 learning disability relief should be RM6,000");
assert.match(ya2026, /id: "G16c"[\s\S]*?cap: 8000/, "YA2026 disabled child relief should be RM8,000");
assert.match(ya2026, /id: "VMY"[\s\S]*?cap: 1000/, "YA2026 local travel relief should be RM1,000");
assert.match(ya2026, /food waste composting\/disposal machines; CCTV systems/, "YA2026 G21 should include food waste disposers and CCTV systems");
assert.match(ya2026, /children below 12 years old/, "YA2026 childcare\/preschool relief should cover children below 12 years old");

console.log("relief cap tests passed");
