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
- **WebRTC v0.8:** Manual offer/answer signaling for direct peer-to-peer browser data channels, with capability descriptions, HELLO/NOD/ACK challenge echo, text messages, delivery receipts and three-attempt timeouts. Works best on the same local network; no STUN/TURN service is configured. Connections are not authenticated, and network costs are not automatically detected. 
- **Morse v0.7:** Press **Self-test** to verify a text → Morse → text round trip and CRC without audio. On two devices, start the Morse receiver on one, then transmit a message on the other. The receiver uses microphone amplitude and fixed timing; room noise, speaker level and browser scheduling may affect decoding. The wire frame is `SW MESSAGE CRC16`, encoded in ITU-style Morse at 750 Hz, 120 ms dots. This is a testable experimental audio path, not yet a verified peer-to-peer connection or automatic handshake.
- **APL v0.4:** Export and import validated `SWAC-APL/1` capability JSON, select a compatible 4-FSK or Morse mode, and remember peers locally. This is **manual copy/paste**, not over-the-air negotiation.
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

## How to test Morse tonight

1. Open the [SWAC site](https://swac.robohouse.workers.dev/) on a device and find **SWAC v0.7 — Morse acoustic protocol**.
2. Leave `HELLO` in the message box. Press **Self-test (no audio)**. Expect `CRC PASS`.
3. Open the same page on a **second device** and press **Start Morse receiver**; allow microphone permission. Keep the devices a short distance apart, with moderate speaker volume.
4. On the first device press **Send Morse audio** and wait for it to finish. The receiving device should show the decoded frame and `CRC PASS` if audio detection succeeds.
5. If the receiver misses symbols, reduce background noise, adjust speaker volume, and keep both screens active. Browser power-saving and echo suppression may interfere. This experimental decoder has not been verified on your devices.

The self-test validates text encoding and CRC logic, **not** actual acoustic reception. No audio packet executes received code. Morse is a fallback candidate, not a claim that every device has a microphone or speaker.

## Test direct browser-to-browser communication

1. Open SWAC on two devices connected to the **same Wi-Fi network**. Find **v0.8 — Direct peer connection**.
2. On device A, press **Create offer** and copy its *My signaling text* into device B's *Other device's signaling text*.
3. On B, press **Create answer** and copy B's *My signaling text* back into A's *Other device's signaling text*.
4. On A, press **Accept answer**. Wait for both pages to show an open data channel. Then press **Send HELLO** and **Send text**.
5. Watch the log for NOD challenge verification, ACK and delivery receipts. A local connection does not establish identity or permission to execute code.

The browsers gather local ICE candidates for up to eight seconds. There is no hosted signaling service or public STUN/TURN relay, so internet-wide connections often fail. Signaling requires manual copying; WebRTC data is encrypted in transit, but this prototype does **not authenticate peer identity**. Do not exchange sensitive information. Avoid metered connections unless you have explicitly chosen to pay for the data. 

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
| Morse tone transmitter, microphone decoder, CRC frame and self-test | Implemented; hardware testing needed |
| Morse advertised in APL capability profiles | Implemented |
| WebRTC direct data channel with manual signaling | Implemented; requires two-device testing |
| WebRTC HELLO/NOD/ACK and bounded text receipt retries | Implemented; not identity-authenticated |
| APL capability JSON exchange and local peer storage | Implemented, manual |
| Bounded Z80 machine-code generation and local persistence | Implemented; not executed |\n| Hardware-agnostic NLA request/answer demo for Z80, AVR, browser | Implemented; offline templates |
| Metered-transport policy demonstration | Implemented, simulation |
| Automated **acoustic** HELLO/NOD/ACK, ACK/retry and recovery | Not implemented |
| Real acoustic lesson transfer and protocol scanning | Not implemented |
| Hosted WebRTC signaling, STUN/TURN and automatic transport failover | Not implemented |
| ColecoVision cartridge/loader and hardware execution | Not implemented |

**Throughput honesty:** An earlier 4-FSK design proposed 2,400 symbols/s = 4,800 *raw* bits/s, but that speed has not been implemented or measured. The manual APL profiles currently describe 5 or 10 symbols/s; neither profile constitutes a tested packet link.

## Repository and deployment

- `public/index.html` — static site and interactive UI.
- `public/apl.js` — constrained APL profiles (Morse and FSK) and local peer store.
- `public/morse.js` — audible Morse frames, microphone decoder and CRC self-test.
- `public/webrtc.js` — manual signaling, direct data channel, HELLO/NOD/ACK, text receipts and retry logic.
- `public/teaching.js` — bounded Z80 code generator, saved templates, and metered policy demo.\n- `public/nla.js` — target profiles, bounded request/answer examples, local verification and request history.
- `wrangler.jsonc` — Cloudflare Workers static assets from `./public`.
- `index.html` at repository root — earlier standalone prototype, **not** the currently served page.

Cloudflare Workers Builds can deploy `main` with **`npx wrangler deploy`**, using the repository root and `wrangler.jsonc`. If Git integration is enabled, pushes trigger a new build. The actual deployment must be checked in Cloudflare; a GitHub commit alone does not prove it is live.

Cloudflare Pages is a separate hosting option. If configured, its static output directory should be `public`, not the repository root. The existing known public address is the **Workers** URL above, not a `pages.dev` domain.

## Remaining engineering milestones

- Replace amplitude-only Morse detection with tone-selective detection and calibrated timing; test on actual phones and PCs.
- Build and test a framed 4-FSK modem with symbol synchronization, CRC, retransmission and throughput measurements.
- Implement automatic acoustic handshake with turn-taking, randomized backoff and protocol fallback.
- Add authenticated peer identities and safe, permissioned native-code transfer and target-side validation.
- Add hosted signaling and optional TURN relay with explicit network budgets and consent; integrate measured transport switching.
- Write target-specific adapters for hardware without browsers, microphones or network stacks.

These are **not completed** by the browser demos. They require hardware, testing, infrastructure and/or a native adapter.

## Security principles

Keep a safe, known bootstrap. Validate size, schema, ranges, and resource budgets before accepting lessons or peer capability claims. Never auto-execute received code. Do not grant hardware control, metered network access, or data-sharing permissions merely because a device says HELLO. Prefer measured compatibility over advertised performance.

---

*Every device can ask. Every answer should fit the device that asked.* 🎮
