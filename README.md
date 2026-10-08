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
- **4-FSK v1.0 (experimental):** A new acoustic packet modem sends and listens for short messages (up to 12 UTF-8 bytes) using four tones at 900/1200/1500/1800 Hz, 5 symbols/s, a fixed preamble and sync, and CRC-16/CCITT-FALSE. The **Packet self-test** validates encoding/decoding and corruption rejection without audio. Two-device microphone decoding and synchronization have not yet been verified. No automatic ACK/retransmission yet.
- **WebRTC v0.8:** Manual offer/answer signaling for direct peer-to-peer browser data channels, with capability descriptions, HELLO/NOD/ACK challenge echo, text messages, delivery receipts and three-attempt timeouts. Works best on the same local network; no STUN/TURN service is configured. Connections are not authenticated, and network costs are not automatically detected. 
- **Morse v0.9 discovery gate:** A receiver starts in bootstrap listening mode. Full Morse messaging is **locked until it acoustically decodes the literal phrase `MORSE CODE`**. A separate button transmits that phrase in Morse. A local no-audio self-test does **not** unlock it. After activation, the browser accepts `SW MESSAGE CRC16` frames and enables its message-send control. The 750 Hz / 120 ms detector is experimental and hardware-dependent. The phrase is a discovery signal, **not authentication**.
- **APL v0.4:** Export and import validated `SWAC-APL/1` capability JSON, select a compatible 4-FSK or Morse mode, and remember peers locally. This is **manual copy/paste**, not over-the-air negotiation.
- **NLA v0.6 (new):** Select Z80, AVR, or browser examples and issue one of three predefined questions. The local demonstrator produces a target-specific answer, checks its template and size, and remembers a short request history. **No external peer, dynamic AI generation, or physical hardware is involved.**
- **Code generation lab v0.5:** Choose a demonstration command and generate a **real six-byte Z80 subroutine**. Inspect the assembly and machine bytes inside `SWAC-Z80/1` JSON. A separate program would need to interpret the command ID. This browser does not execute the bytes or connect to a console.
- **Transport policy simulator:** Evaluate acoustic, local WebRTC, and internet WebRTC *candidates*. Metered internet is blocked by default. **No network negotiation or data usage occurs from this simulator.**

### Native-language request/answer format

The v0.6 browser lab creates `SWAC-DESCRIBE/1`, `SWAC-ASK/1`, and `SWAC-ANSWER/1` JSON documents. The device description includes its architecture, available capabilities, reply format, and memory budget. Requests name a task; responses contain a target-specific payload. The local verifier accepts only exact known templates. The simulated `LEARN` step records request history, not new executable protocols.

The three example targets intentionally differ: Z80 returns six-byte machine-code examples, AVR returns structured adapter steps, and browsers receive JSON data. **There is no universal requirement to receive executable code.** Real implementations will need device discovery, trustworthy hardware descriptions, protocol framing, transport, and safe loading or interpretation.

### What the ColecoVision demonstration actually generates

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

1. Open the [SWAC site](https://swac.robohouse.workers.dev/) on two devices and find **SWAC v0.9 — Morse acoustic discovery gate**.
2. On device B press **Start Morse receiver** and grant microphone access. It should say `MORSE LOCKED`.
3. On device A press **Transmit MORSE CODE activation**. This is the only allowed Morse transmission before activation. Wait for device B to say `MORSE ACTIVE` after it hears the full phrase.
4. To send messages **from B**, its Send Morse audio button should now be enabled. For device A to receive and send ordinary Morse messages, start its receiver and have B transmit the activation phrase back. Each receiver unlocks independently.
5. Set a short message and press **Send Morse audio** on an unlocked sender. An unlocked listener should show the `SW ... CRC16` frame with `CRC PASS` when successfully decoded.
6. **Self-test (no audio)** checks encoding/decoding and CRC only; it must **not** unlock Morse. Restarting a receiver locks it again. Keep screens active and use moderate volume and a quiet room.

The activation gate is a **capability-discovery convention**, not a security boundary: anyone nearby could transmit the phrase. It does not verify peer identity or authorize remote commands. The self-test validates text encoding and CRC logic, **not** actual acoustic reception. No audio packet executes received code. Morse is a fallback candidate, not a claim that every device has a microphone or speaker.

## Test the 4-FSK packet modem

1. Open SWAC and find **SWAC v1.0 — 4-FSK packet modem**.
2. Leave `HELLO` in the message box and press **Packet self-test**. Expect `PASS` for round-trip and corruption rejection.
3. On a second device in a quiet room, press **Listen for packets** and grant microphone access.
4. On the first device press **Send 4-FSK packet**. The approximately 16-second transmission should finish; the listener should display `CRC PASS — HELLO` if acoustic synchronization succeeds.
5. If it fails, keep screens awake, move devices closer, and adjust volume. The receiver has fixed timing, no retransmission, no robust clock recovery, and no tested throughput guarantee.

**Wire format:** 12 preamble symbols alternating 900 and 1800 Hz; 8 fixed sync symbols; one length byte; 12 payload bytes zero-padded; two CRC bytes. Each byte uses four 2-bit tone symbols, most significant first. CRC covers the length and padded payload. Nominal raw symbol bit rate is 10 bit/s, not application throughput. No remote program execution.

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
| Bounded 4-FSK packet transmitter, receiver, CRC and offline self-test | Implemented; real-device reception unverified |
| Morse transmitter, tone-selective receiver, CRC frame and self-test | Implemented; hardware testing needed |
| Receive acoustic MORSE CODE to unlock Morse messaging | Implemented; hardware testing needed |
| Morse advertised in APL capability profiles | Implemented |
| WebRTC direct data channel with manual signaling | Implemented; requires two-device testing |
| WebRTC HELLO/NOD/ACK and bounded text receipt retries | Implemented; not identity-authenticated |
| APL capability JSON exchange and local peer storage | Implemented, manual |
| Bounded Z80 machine-code generation and local persistence | Implemented; not executed |
| Hardware-agnostic NLA request/answer demo for Z80, AVR, browser | Implemented; offline templates |
| Metered-transport policy demonstration | Implemented, simulation |
| Automated **acoustic** HELLO/NOD/ACK, ACK/retry and recovery | Not implemented |
| Robust acoustic lesson transfer, retransmission and protocol scanning | Not implemented |
| Hosted WebRTC signaling, STUN/TURN and automatic transport failover | Not implemented |
| ColecoVision cartridge/loader and hardware execution | Not implemented |

**Throughput honesty:** An earlier 4-FSK design proposed 2,400 symbols/s = 4,800 *raw* bits/s, but that speed has not been implemented or measured. The manual APL profiles currently describe 5 or 10 symbols/s; neither profile constitutes a tested packet link.

## Repository and deployment

- `public/index.html` — static site and interactive UI.
- `public/apl.js` — constrained APL profiles (Morse and FSK) and local peer store.
- `public/morse.js` — audible Morse frames, microphone decoder and CRC self-test.
- `public/fsk-packets.js` — bounded 4-FSK frame codec, audio sender, experimental receiver and corruption self-test.
- `public/webrtc.js` — manual signaling, direct data channel, HELLO/NOD/ACK, text receipts and retry logic.
- `public/teaching.js` — bounded Z80 code generator, saved templates, and metered policy demo.
- `public/nla.js` — target profiles, bounded request/answer examples, local verification and request history.
- `wrangler.jsonc` — Cloudflare Workers static assets from `./public`.
- `index.html` at repository root — earlier standalone prototype, **not** the currently served page.

Cloudflare Workers Builds can deploy `main` with **`npx wrangler deploy`**, using the repository root and `wrangler.jsonc`. If Git integration is enabled, pushes trigger a new build. The actual deployment must be checked in Cloudflare; a GitHub commit alone does not prove it is live.

Cloudflare Pages is a separate hosting option. If configured, its static output directory should be `public`, not the repository root. The existing known public address is the **Workers** URL above, not a `pages.dev` domain.

## Remaining engineering milestones (also shown on the site)

- Calibrate the existing tone-selective Morse detector and timing on real phones and PCs; add noise rejection, activation timeouts and a reliable reset.
- Verify and improve the new framed 4-FSK modem on actual phones/PCs, add symbol-clock recovery, CRC-based ACK/retransmission and throughput measurements.
- Implement automatic acoustic handshake with turn-taking, randomized backoff and protocol fallback.
- Add authenticated peer identities and safe, permissioned native-code transfer and target-side validation.
- Add hosted signaling and optional TURN relay with explicit network budgets and consent; integrate measured transport switching.
- Write target-specific adapters for hardware without browsers, microphones or network stacks.

These are **not completed** by the browser demos. They require hardware, testing, infrastructure and/or a native adapter.

## Protocol activation versus trust

Receiving `MORSE CODE` in Morse is a deliberate protocol activation gate. It must never be mistaken for authentication: another device or an audio recording can reproduce it. No executable code, hardware control, metered network access, or confidential data sharing may be authorized by the phrase. A verified peer identity and explicit user consent remain separate future requirements.

## Security principles

Keep a safe, known bootstrap. Validate size, schema, ranges, and resource budgets before accepting lessons or peer capability claims. Never auto-execute received code. Do not grant hardware control, metered network access, or data-sharing permissions merely because a device says HELLO. Prefer measured compatibility over advertised performance.

---

*Every device can ask. Every answer should fit the device that asked.* 🎮
