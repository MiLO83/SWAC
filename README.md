# SWAC — Spherical Window Acoustic Computer

**OpenAI ChatGPT / Miles Cameron Johnston**

> **HELLO → NOD → ACK → LEARN → TEACH.** Start with a language both devices understand, discover what else they can do, and teach useful capabilities without assuming identical hardware.

**Live Workers site:** https://swac.robohouse.workers.dev/  
**Source:** https://github.com/MiLO83/SWAC

## The big idea

A computer with speech recognition can explain a *small part* of speech to a ColecoVision in terms that an 8-bit computer could implement. The student doesn't need a modern language model: it needs a bounded representation, an interpreter, sufficient hardware to receive the lesson, and a way to test what it learned.

SWAC distinguishes three layers:

1. **Transport discovery:** How can we communicate? Acoustic, local network, or permissioned internet.
2. **Protocol learning:** Which framing, modulation, and speeds can both ends support?
3. **Capability teaching:** What new *behavior* can the student learn in its own computational vocabulary?

The third layer is the experiment: **teach the capability, not merely translate each command forever.**

## Try the site

- **Spherical memory:** Drag to rotate a visualization of 256 × 256 bytes (65,536 cells) with separate validity flags. Seed, clear, and export memory.
- **Acoustic hardware tests:** Play four sine tones (900, 1200, 1500, 1800 Hz), test microphone levels, and detect the strongest FSK tone. These tests do **not** decode data packets.
- **APL v0.4:** Export and import validated `SWAC-APL/1` capability JSON, select a compatible 4-FSK mode, and remember peers locally. This is **manual copy/paste**, not over-the-air negotiation.
- **Teaching lab v0.5:** Choose **HELLO**, **START**, **LEFT**, **RIGHT**, or **STOP**, press **Teach selected word**, then test a recognized-text phrase. Inspect the generated `SWAC-LESSON/1` JSON, or import a validated lesson. Lessons persist in the browser's local storage.
- **Transport policy simulator:** Evaluate acoustic, local WebRTC, and internet WebRTC *candidates*. Metered internet is blocked by default. **No network negotiation or data usage occurs from this simulator.**

### What the ColecoVision demo actually teaches

The demo represents each keyword as a small **semantic feature → permitted action** mapping. For example, a teacher that recognizes `LEFT` can express a directional feature and the intended `PRESS LEFT` action in a constrained JSON document. The student simulator stores this vocabulary and uses it on subsequent recognized-text input.

**This is not ColecoVision-native speech recognition yet.** The web page simulates a student; no ColecoVision Z80 machine code is executed. A real console would need an input/communications interface and a small recognition pipeline or hardware-assisted front end. The original ColecoVision's Z80A CPU and approximately 1 KB of RAM make a tiny keyword recognizer or external coprocessor more plausible than a modern speech model.

### Safe teaching contract

`SWAC-LESSON/1` currently accepts only a predefined set of five word/feature/action combinations for a simulated target (`colecovision-z80-demo`). Unknown commands and unsupported lessons are rejected. Lessons are **data, never executable JavaScript or untrusted machine code**. A future real-hardware interpreter should validate resource limits, command permissions, and signatures where appropriate.

## Discovery and the Shop-Vac Rule

SWAC should try known, previously successful protocols first, but preserve an immutable bootstrap. A robust **HELLO / NOD / ACK** exchange should include a random challenge, message framing, error detection, timeout/retry, and peer authentication when trust matters. Merely receiving plausible bytes is not proof of a compatible or trusted peer.

After contact, devices can advertise other transports. **A transport is only a candidate until both peers can actually establish and test it.** Browser limitations mean Wi-Fi discovery, Bluetooth, and cellular paths require platform-specific permissions, adapters, WebRTC signaling, or a relay. Internet reachability is not guaranteed.

**Shop-Vac Rule:** A refrigerator and vacuum cleaner must not silently consume someone's mobile data. Default to local/free links; require explicit consent and budgets for metered links. The current site demonstrates this policy without performing connections.

## Roadmap

| Milestone | State |
| --- | --- |
| 256 × 256 spherical byte window | Working prototype |
| Speaker/microphone hardware test | Implemented; hardware-dependent |
| Four-tone FSK frequency detection | Experimental |
| APL capability JSON exchange and local peer storage | Implemented, manual |
| Simulated bounded capability teaching and persistence | Implemented |
| Metered-transport policy demonstration | Implemented, simulation |
| Framed acoustic HELLO/NOD/ACK with CRC and retries | Not implemented |
| Real acoustic lesson transfer and protocol scanning | Not implemented |
| WebRTC signaling, link testing, automatic failover | Not implemented |
| ColecoVision cartridge/adapter and onboard recognition | Not implemented |

**Throughput honesty:** An earlier 4-FSK design proposed 2,400 symbols/s = 4,800 *raw* bits/s, but that speed has not been implemented or measured. The manual APL profiles currently describe 5 or 10 symbols/s; neither profile constitutes a tested packet link.

## Repository and deployment

- `public/index.html` — static site and interactive UI.
- `public/apl.js` — constrained APL profiles and local peer store.
- `public/teaching.js` — constrained capability lessons, simulated student, and metered policy demo.
- `wrangler.jsonc` — Cloudflare Workers static assets from `./public`.
- `index.html` at repository root — earlier standalone prototype, **not** the currently served page.

Cloudflare Workers Builds can deploy `main` with **`npx wrangler deploy`**, using the repository root and `wrangler.jsonc`. If Git integration is enabled, pushes trigger a new build. The actual deployment must be checked in Cloudflare; a GitHub commit alone does not prove it is live.

Cloudflare Pages is a separate hosting option. If configured, its static output directory should be `public`, not the repository root. The existing known public address is the **Workers** URL above, not a `pages.dev` domain.

## Security principles

Keep a safe, known bootstrap. Validate size, schema, ranges, and resource budgets before accepting lessons or peer capability claims. Never auto-execute received code. Do not grant hardware control, metered network access, or data-sharing permissions merely because a device says HELLO. Prefer measured compatibility over advertised performance.

---

*Imagine a computer teaching a 1982 game console what a word means — one tiny, testable lesson at a time.* 🎮
