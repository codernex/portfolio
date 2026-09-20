"use client";

import { useOSStore } from "./os-store";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function getVolumeGain(ctx: AudioContext): GainNode | null {
  const { soundEnabled, audioVolume } = useOSStore.getState();
  if (!soundEnabled || audioVolume <= 0) return null;

  const gainNode = ctx.createGain();
  const normalizedVolume = (audioVolume / 100) * 0.15; // pleasant ceiling
  gainNode.gain.setValueAtTime(normalizedVolume, ctx.currentTime);
  gainNode.connect(ctx.destination);
  return gainNode;
}

/** Subtle retro blip for UI button clicks */
export function playUiClick(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const masterGain = getVolumeGain(ctx);
    if (!masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.7, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
}

/** Ascending sci-fi sweep when opening a window or app */
export function playWindowOpen(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const masterGain = getVolumeGain(ctx);
    if (!masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch {}
}

/** Descending tone when closing a window */
export function playWindowClose(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const masterGain = getVolumeGain(ctx);
    if (!masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch {}
}

/** Crystal collection chime in CyberRunner 3D */
export function playCrystalCollect(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const masterGain = getVolumeGain(ctx);
    if (!masterGain) return;

    const now = ctx.currentTime;
    [1046.5, 1318.5, 1567.98].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.03);

      gain.gain.setValueAtTime(0.6, now + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.12);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + 0.12);
    });
  } catch {}
}

/** Thruster boost sound in CyberRunner 3D */
export function playBoostSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const masterGain = getVolumeGain(ctx);
    if (!masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {}
}

/** Impact / collision thump */
export function playCrashSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const masterGain = getVolumeGain(ctx);
    if (!masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.8, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {}
}

/** Game over fanfare */
export function playGameOverSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const masterGain = getVolumeGain(ctx);
    if (!masterGain) return;

    const notes = [587.33, 554.37, 523.25, 466.16];
    const now = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.5, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.15);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.15);
    });
  } catch {}
}
