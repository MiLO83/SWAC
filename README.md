# SWAC — Spherical Window Acoustic Computer

**Credits:** OpenAI ChatGPT / Miles Cameron Johnston

An experimental spherical memory and acoustic boot project.

## Architecture

- 256 × 256 byte memory (65,536 cells, values 0–255).
- Separate validity flags (initial prototype uses one byte per flag).
- Interactive spherical viewport over rectangular memory.
- Earlier experimental acoustic design: 4-FSK, 2,400 symbols/sec (4,800 **raw** bps target), CRC-16, staged updates. Real hardware throughput is unverified.
- Planned v0.4: capability negotiation, measured-throughput adaptation, ACK/retry/resume, safe recovery decoder.

## Current status

The initial `index.html` is a **deployable visual/memory prototype**, not the complete earlier v0.3 acoustic application. Microphone/speaker transfer is not yet integrated into this repository.

## Cloudflare Pages

In Cloudflare: Workers & Pages → Create → Pages → Connect to Git → `MiLO83/SWAC`.
Production branch: `main`; framework: None; build command: blank; output directory: `/`.
Choose project name `swac` if available. Cloudflare assigns the actual `*.pages.dev` domain.

## Security

Treat audio-received content as untrusted. Stage and verify payloads before applying them; never auto-execute downloaded HTML/JavaScript.

## Cloudflare Workers deployment

This repository also supports Cloudflare Workers static assets via `wrangler.jsonc`.
The public site is served from `public/`, preventing Git metadata and build artifacts from being uploaded as web assets.
The connected Workers Builds pipeline can deploy new commits on `main` when automatic builds are enabled.
