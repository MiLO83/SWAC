# SWAC — Spherical Window Acoustic Computer

**OpenAI ChatGPT / Miles Cameron Johnston**

> **DISCOVER → DESCRIBE → ASK → ANSWER → VERIFY → LEARN.** Any device can request help from another device and receive an answer expressed in a representation it can actually use.

**Live Workers site:** https://swac.robohouse.workers.dev/  
**Source:** https://github.com/MiLO83/SWAC

## The big idea

**SWAC is hardware-agnostic.** A simple computer, sensor, microcontroller, game console, or browser can ask a more capable peer for help. The responder adapts its answer to the requester's capabilities: native machine code, structured instructions, or ordinary data. ColecoVision is just one illustrative target, not a platform requirement. The requester does not need speech recognition or an AI model.

SWAC distinguishes three layers:

1. **Transport discovery:** How can we communicate? Acoustic, local network, or permissioned internet.
2. **Protocol learning:** Which framing, modulation, and speeds can both ends support?
3. **Native-language assistance (NLA):** What answer can the responder generate for the requester's instruction set, data formats, memory budget, and available hardware?

The third layer is the experiment: **the responder speaks the requester's native computational language**. Sometimes that means writing software; other times the best answer is data or a bounded command sequence.

## Try the site

- **Spherical memory:** Drag to rotate a visualization of 256 × 256 bytes (65,536 cells) with separate validity flags. Seed, clear, and export memory.
- **Acoustic hardware tests:** Play four sine tones (900, 1200, 1500, 1800 Hz), test microphone levels, and detect the strongest FSK tone. These tests do **not** decode data packets.
- **APL v0.4:** Export and import validated `SWAC-APL/1` capability JSON, select a compatible 4-FSK mode, and remember peers locally. This is **manual copy/paste**, not over-the-air negotiation.
- **NLA v0.6 (new):** Select Z80, AVR, or browser examples and issue one of three predefined questions. The local demonstrator produces a target-specific answer, checks its template and size, and remembers a short request history. **No external peer, dynamic AI generation, or physical hardware is involved.**\n- **Code generation lab v0.5:** Choose a demonstration command and generate a **real six-byte Z80 subroutine**. Inspect the assembly and machine bytes inside `SWAC-Z80/1` JSON. A separate program would need to interpret the command ID. This browser does not execute the bytes or connect to a console.
- **Transport policy simulator:** Evaluate acoustic, local WebRTC, and internet WebRTC *candidates*. Metered internet is blocked by default. **No network negotiation or data usage occurs from this simulator.**

### Native-language request/answer format\n\nThe v0.6 browser lab creates `SWAC-DESCRIBE/1`, `SWAC-ASK/1`, and `SWAC-ANSWER/1` JSON documents. The device description includes its architecture, available capabilities, reply format, and memory budget. Requests name a task; responses contain a target-specific payload. The local verifier accepts only exact known templates. The simulated `LEARN` step records request history, not new executable protocols.\n\nThe three example targets intentionally differ: Z80 returns six-byte machine-code examples, AVR returns structured adapter steps, and browsers receive JSON data. **There is no universal requirement to receive executable code.** Real implementations will need device discovery, trustworthy hardware descriptions, protocol framing, transport, and safe loading or interpretation.\n\n### What the ColecoVision demonstration actually generates

For the sample **HELLO** operation, SWAC generates this Z80 subroutine:

```asm
LD A, 1
LD (0x7000), A
RET
```

**Machine bytes:** `3E 01 32 00 70 C9`. The byte at `0x7000` is a command identifier, not an operating-system service or a display routine. A separately installed receiving program must interpret it. Other demo commands use identifiers 2–5.

This is **actual Z80 machine code**, but it is only a tiny illustrative building block. The site generates and validates a restricted set of templates; it does **not** transmit, install, or execute programs on real ColecoVision hardware. Hardware deployment needs a cartridge, loader, or suitable adapter, an agreed memory contract, and an explicit execution authorization step.

The ColecoVision does **not** need speech recognition. The teacher might use voice recognition internally, but the student receives instructions in its own native CPU language.

### Safe code-generation contract

`SWAC-Z80/1` currently describes one of five exact, bounded machine-code templates. Imported examples must match a supported template; arbitrary received machine code is not accepted or executed. Future generated binaries should be checked for target compatibility, memory safety, allowed I/O operations, bounded execution, and authenticated origin before hardware deployment.

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
| Bounded Z80 machine-code generation and local persistence | Implemented; not executed |\n| Hardware-agnostic NLA request/answer demo for Z80, AVR, browser | Implemented; offline templates |
| Metered-transport policy demonstration | Implemented, simulation |
| Framed acoustic HELLO/NOD/ACK with CRC and retries | Not implemented |
| Real acoustic lesson transfer and protocol scanning | Not implemented |
| WebRTC signaling, link testing, automatic failover | Not implemented |
| ColecoVision cartridge/loader and hardware execution | Not implemented |

**Throughput honesty:** An earlier 4-FSK design proposed 2,400 symbols/s = 4,800 *raw* bits/s, but that speed has not been implemented or measured. The manual APL profiles currently describe 5 or 10 symbols/s; neither profile constitutes a tested packet link.

## Repository and deployment

- `public/index.html` — static site and interactive UI.
- `public/apl.js` — constrained APL profiles and local peer store.
- `public/teaching.js` — bounded Z80 code generator, saved templates, and metered policy demo.\n- `public/nla.js` — target profiles, bounded request/answer examples, local verification and request history.
- `wrangler.jsonc` — Cloudflare Workers static assets from `./public`.
- `index.html` at repository root — earlier standalone prototype, **not** the currently served page.

Cloudflare Workers Builds can deploy `main` with **`npx wrangler deploy`**, using the repository root and `wrangler.jsonc`. If Git integration is enabled, pushes trigger a new build. The actual deployment must be checked in Cloudflare; a GitHub commit alone does not prove it is live.

Cloudflare Pages is a separate hosting option. If configured, its static output directory should be `public`, not the repository root. The existing known public address is the **Workers** URL above, not a `pages.dev` domain.

## Security principles

Keep a safe, known bootstrap. Validate size, schema, ranges, and resource budgets before accepting lessons or peer capability claims. Never auto-execute received code. Do not grant hardware control, metered network access, or data-sharing permissions merely because a device says HELLO. Prefer measured compatibility over advertised performance.

---

*Every device can ask. Every answer should fit the device that asked.* 🎮
