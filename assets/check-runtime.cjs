// Compatibility baseline checked against OpenClaw docs on 2026-10-13 (OpenClaw 2026.10.2; Node 26 recommended).
// A new OpenClaw release requires a new classroom compatibility check.
const version = process.argv[2] || process.versions.node;
const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(version);
const supported = match && ((+match[1] === 24 && +match[2] >= 16) || (+match[1] === 26 && +match[2] >= 1));
if (!supported) {
  console.error(`Node.js ${version} 不在課堂支援範圍；請安裝 Node 24.16+（24.x）或 26.1+（26.x），重開終端機。`);
  process.exitCode = 1;
} else {
  console.log(`✓ Node.js ${version} 符合課堂要求。`);
}
