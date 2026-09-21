#!/usr/bin/env node
/**
 * Septembro Amarelo — Renderização Profissional via Remotion
 * 1080×1920 @ 30fps | Design System completo
 * 
 * Uso:
 *   npx remotion render src/Composition.tsx SeptemAmarelo video_separelo.mp4 --props '{"voicePath":null}'
 *   npx remotion preview src/Composition.tsx SeptemAmarelo
 */

const { registerRoot } = require('remotion');
const { SeptemAmareloComposition } = require('./video-engine/src/Composition');

registerRoot(SeptemAmareloComposition);
