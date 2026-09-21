#!/usr/bin/env node

/**
 * Septembro Amarelo - Render Script
 * Renderiza vídeo 1080x1920 usando Remotion
 * GitHub Actions: instala deps, renderiza, faz upload do artefato
 */

const { createCanvas } = require('canvas');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const W = 1080;
const H = 1920;
const FPS = 30;
const DURATION = 30;
const TOTAL_FRAMES = DURATION * FPS;

const FRAMES_DIR = '/tmp/frames_septembro';
const OUTPUT = path.join(__dirname, 'video_separelo.mp4');
const AUDIO_FILE = path.join(__dirname, 'audio', 'narracao_30s.mp3');

// Cores
const YELLOW_PRIMARY = '#FFCF00';
const YELLOW_DEEP = '#E6B800';
const TEXT_DARK = '#2D2D2D';
const TEXT_SOFT = '#5A5A5A';
const WHITE = '#FFFFFF';

// Durações das cenas (em segundos)
const SCENE_DURATIONS = [5, 7, 6, 5, 5, 2];

function drawGrain(ctx, w, h, intensity = 0.10) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity * 255;
    data[i]     = Math.max(0, Math.min(255, data[i]     + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);
}

function easedOpacity(frame, startFrame, endFrame, mode = 'in') {
  if (frame < startFrame) return 0;
  if (frame > endFrame) return mode === 'in' ? 1 : 0;
  const t = (frame - startFrame) / (endFrame - startFrame);
  const eased = 1 - Math.pow(1 - t, 3);
  return mode === 'in' ? eased : 1 - eased;
}

// Scene 01: Abertura
function renderScene01(ctx, frame, sceneStart) {
  const sceneEnd = sceneStart + SCENE_DURATIONS[0] * FPS;
  
  ctx.fillStyle = YELLOW_PRIMARY;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.12);
  
  const mainTitleOpacity = easedOpacity(frame, sceneStart + 0.5 * FPS, sceneStart + 2.5 * FPS, 'in');
  if (mainTitleOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = mainTitleOpacity;
    ctx.fillStyle = TEXT_DARK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '700 96px system-ui, sans-serif';
    ctx.fillText('SETEMBRO AMARELO', W / 2, H * 0.18);
    ctx.restore();
  }
  
  const subtitleOpacity = easedOpacity(frame, sceneStart + 2.0 * FPS, sceneStart + 4.0 * FPS, 'in');
  if (subtitleOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = subtitleOpacity;
    ctx.fillStyle = TEXT_SOFT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '400 32px system-ui, sans-serif';
    ctx.fillText('Escutar é estar presente', W / 2, H * 0.78);
    ctx.restore();
  }
}

// Scene 02: Dados SC
function renderScene02(ctx, frame, sceneStart) {
  const sceneEnd = sceneStart + SCENE_DURATIONS[1] * FPS;
  
  ctx.fillStyle = YELLOW_PRIMARY;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.10);
  
  const sceneFade = easedOpacity(frame, sceneStart, sceneStart + 0.5 * FPS, 'in');
  ctx.save();
  ctx.globalAlpha = sceneFade;
  
  const titleOpacity = easedOpacity(frame, sceneStart + 0.5 * FPS, sceneStart + 2.0 * FPS, 'in');
  if (titleOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = titleOpacity;
    ctx.fillStyle = TEXT_DARK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '600 48px system-ui, sans-serif';
    ctx.fillText('Santa Catarina', W / 2, H * 0.08);
    ctx.restore();
  }
  
  const countStart = sceneStart + 0.8 * FPS;
  const countEnd = sceneStart + 3.8 * FPS;
  const countDuration = countEnd - countStart;
  const countFrame = Math.max(0, frame - countStart);
  const countProgress = Math.min(1, countFrame / countDuration);
  const currentVal = Math.round(642 + (1034 - 642) * countProgress);
  
  const numOpacity = easedOpacity(frame, sceneStart + 0.8 * FPS, sceneStart + 4.0 * FPS, 'in');
  if (numOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = numOpacity;
    ctx.fillStyle = TEXT_DARK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '800 120px system-ui, sans-serif';
    ctx.fillText(String(currentVal), W / 2, H * 0.38);
    ctx.font = '400 24px system-ui, sans-serif';
    ctx.fillStyle = TEXT_SOFT;
    ctx.fillText('óbitos em 2025', W / 2, H * 0.38 + 130);
    ctx.restore();
  }
  
  const subOpacity = easedOpacity(frame, sceneStart + 2.5 * FPS, sceneStart + 4.0 * FPS, 'in');
  if (subOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = subOpacity;
    ctx.fillStyle = TEXT_SOFT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '400 24px system-ui, sans-serif';
    ctx.fillText('9.280 mortes nos últimos 11 anos', W / 2, H * 0.58);
    ctx.restore();
  }
  
  const pctOpacity = easedOpacity(frame, sceneStart + 1.0 * FPS, sceneStart + 2.5 * FPS, 'in');
  if (pctOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = pctOpacity;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillStyle = TEXT_DARK;
    ctx.font = '700 48px system-ui, sans-serif';
    ctx.fillText('+61%', W - W * 0.1, H * 0.38);
    ctx.fillStyle = TEXT_SOFT;
    ctx.font = '400 20px system-ui, sans-serif';
    ctx.fillText('vs 2015 (642)', W - W * 0.1, H * 0.38 + 54);
    ctx.restore();
  }
  
  ctx.restore();
}

// Scene 03: Gênero
function renderScene03(ctx, frame, sceneStart) {
  const sceneEnd = sceneStart + SCENE_DURATIONS[2] * FPS;
  
  ctx.fillStyle = YELLOW_PRIMARY;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.08);
  
  const sceneFade = easedOpacity(frame, sceneStart, sceneStart + 0.5 * FPS, 'in');
  ctx.save();
  ctx.globalAlpha = sceneFade;
  
  const menOpacity = easedOpacity(frame, sceneStart + 0.5 * FPS, sceneStart + 1.8 * FPS, 'in');
  if (menOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = menOpacity;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = TEXT_DARK;
    ctx.font = '800 64px system-ui, sans-serif';
    ctx.fillText('Homens', W * 0.15, H * 0.28);
    ctx.font = '700 52px system-ui, sans-serif';
    ctx.fillText('76–78%', W * 0.15, H * 0.28 + 70);
    ctx.font = '400 22px system-ui, sans-serif';
    ctx.fillStyle = TEXT_SOFT;
    ctx.fillText('dos óbitos', W * 0.15, H * 0.28 + 128);
    ctx.restore();
  }
  
  const womenOpacity = easedOpacity(frame, sceneStart + 1.0 * FPS, sceneStart + 2.3 * FPS, 'in');
  if (womenOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = womenOpacity;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = TEXT_SOFT;
    ctx.font = '400 36px system-ui, sans-serif';
    ctx.fillText('Mulheres', W * 0.85, H * 0.28);
    ctx.font = '400 28px system-ui, sans-serif';
    ctx.fillText('22–24% dos óbitos', W * 0.85, H * 0.28 + 44);
    ctx.restore();
  }
  
  const calloutOpacity = easedOpacity(frame, sceneStart + 2.5 * FPS, sceneStart + 4.0 * FPS, 'in');
  if (calloutOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = calloutOpacity;
    ctx.fillStyle = TEXT_SOFT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '400 22px system-ui, sans-serif';
    const calloutY = H * 0.88;
    const maxWidth = W * 0.75;
    const text = 'Mas as mulheres registram mais tentativas — cerca de 65% dos casos notificados';
    const words = text.split(' ');
    let line = '';
    let lines = [];
    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    lines.forEach((l, i) => ctx.fillText(l, W / 2, calloutY + i * 28));
    ctx.restore();
  }
  
  ctx.restore();
}

// Scene 04: Mensagem
function renderScene04(ctx, frame, sceneStart) {
  const sceneEnd = sceneStart + SCENE_DURATIONS[3] * FPS;
  
  ctx.fillStyle = YELLOW_DEEP;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.10);
  
  const sceneFade = easedOpacity(frame, sceneStart, sceneStart + 0.5 * FPS, 'in');
  ctx.save();
  ctx.globalAlpha = sceneFade;
  
  const words = ['Escutar', 'é', 'estar', 'presente.'];
  const wordDuration = 0.7;
  const currentWordIndex = Math.min(words.length - 1, Math.floor((frame - sceneStart) / (wordDuration * FPS)));
  const wordProgress = (frame - sceneStart - currentWordIndex * wordDuration * FPS) / (wordDuration * FPS);
  const wordOpacity = Math.min(1, wordProgress * 2);
  
  if (wordOpacity > 0 && currentWordIndex >= 0) {
    ctx.save();
    ctx.globalAlpha = wordOpacity;
    ctx.fillStyle = TEXT_DARK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '600 80px system-ui, sans-serif';
    ctx.fillText(words.slice(0, currentWordIndex + 1).join(' '), W / 2, H * 0.10);
    ctx.restore();
  }
  
  ctx.restore();
}

// Scene 05: Recursos
function renderScene05(ctx, frame, sceneStart) {
  const sceneEnd = sceneStart + SCENE_DURATIONS[4] * FPS;
  
  ctx.fillStyle = YELLOW_PRIMARY;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.10);
  
  const sceneFade = easedOpacity(frame, sceneStart, sceneStart + 0.5 * FPS, 'in');
  ctx.save();
  ctx.globalAlpha = sceneFade;
  
  const titleOpacity = easedOpacity(frame, sceneStart + 0.2 * FPS, sceneStart + 1.2 * FPS, 'in');
  if (titleOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = titleOpacity;
    ctx.fillStyle = TEXT_DARK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '600 40px system-ui, sans-serif';
    ctx.fillText('Florianópolis', W / 2, H * 0.06);
    ctx.restore();
  }
  
  const cardStart = sceneStart + 0.5 * FPS;
  const cardEnd = sceneStart + 1.5 * FPS;
  const cardT = Math.max(0, Math.min(1, (frame - cardStart) / (cardEnd - cardStart)));
  const bounceScale = 1 - Math.pow(1 - cardT, 3) + Math.sin(cardT * Math.PI * 3) * 0.02 * Math.max(0, 1 - cardT);
  const cardOpacity = cardT;
  
  if (cardOpacity > 0 && frame >= cardStart) {
    ctx.save();
    ctx.globalAlpha = cardOpacity;
    const cardW = 500;
    const cardH = 170;
    const cardX = (W - cardW) / 2;
    const cardY = H * 0.38;
    
    ctx.translate(W / 2, cardY + cardH / 2);
    ctx.scale(bounceScale, bounceScale);
    ctx.translate(-W / 2, -(cardY + cardH / 2));
    
    ctx.strokeStyle = TEXT_DARK;
    ctx.lineWidth = 3;
    ctx.strokeRect(cardX, cardY, cardW, cardH);
    ctx.fillStyle = 'rgba(255,255,255,0.30)';
    ctx.fillRect(cardX, cardY, cardW, cardH);
    
    ctx.fillStyle = TEXT_SOFT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '400 28px system-ui, sans-serif';
    ctx.fillText('CVV — Centro de Valorização da Vida', W / 2, cardY + 14);
    ctx.fillStyle = TEXT_DARK;
    ctx.font = '700 60px system-ui, sans-serif';
    ctx.fillText('Ligue 188', W / 2, cardY + 48);
    ctx.fillStyle = TEXT_SOFT;
    ctx.font = '400 20px system-ui, sans-serif';
    ctx.fillText('Gratuito · 24 horas', W / 2, cardY + 114);
    ctx.restore();
  }
  
  const ubsOpacity = easedOpacity(frame, sceneStart + 1.2 * FPS, sceneStart + 2.5 * FPS, 'in');
  if (ubsOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = ubsOpacity;
    ctx.fillStyle = TEXT_SOFT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '400 26px system-ui, sans-serif';
    ctx.fillText('UBS e CAPS — atendimento pelo SUS', W / 2, H * 0.65);
    ctx.restore();
  }
  
  const instOpacity = easedOpacity(frame, sceneStart + 2.0 * FPS, sceneStart + 3.5 * FPS, 'in');
  if (instOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = instOpacity;
    ctx.fillStyle = TEXT_SOFT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '400 22px system-ui, sans-serif';
    ctx.fillText('APAE Florianópolis · Unimed Grande Floripa', W / 2, H * 0.74);
    ctx.restore();
  }
  
  ctx.restore();
}

// Scene 06: Fechamento
function renderScene06(ctx, frame, sceneStart) {
  const sceneEnd = sceneStart + SCENE_DURATIONS[5] * FPS;
  
  ctx.fillStyle = YELLOW_PRIMARY;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.12);
  
  const sceneFade = easedOpacity(frame, sceneStart, sceneStart + 0.5 * FPS, 'in');
  ctx.save();
  ctx.globalAlpha = sceneFade;
  
  const tagOpacity = easedOpacity(frame, sceneStart + 0.3 * FPS, sceneStart + 1.3 * FPS, 'in');
  if (tagOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = tagOpacity;
    ctx.fillStyle = TEXT_DARK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '500 42px system-ui, sans-serif';
    ctx.fillText('#SetembroAmareloSC', W / 2, H * 0.32);
    ctx.restore();
  }
  
  const bannerOpacity = easedOpacity(frame, sceneStart + 0.5 * FPS, sceneStart + 1.5 * FPS, 'in');
  if (bannerOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = bannerOpacity;
    const bannerY = H * 0.80;
    const bannerH = 50;
    const bannerW = 360;
    const bannerX = (W - bannerW) / 2;
    
    ctx.strokeStyle = TEXT_DARK;
    ctx.lineWidth = 3;
    ctx.strokeRect(bannerX, bannerY, bannerW, bannerH);
    
    ctx.fillStyle = TEXT_DARK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '600 32px system-ui, sans-serif';
    ctx.fillText('CVV 188 — Ligue agora', W / 2, bannerY + 8);
    ctx.restore();
  }
  
  ctx.restore();
}

// Main render function
function renderFrame(frame) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'alphabetic';
  
  let accumulated = 0;
  let activeSceneIdx = 0;
  for (let i = 0; i < SCENE_DURATIONS.length; i++) {
    if (frame < (accumulated + SCENE_DURATIONS[i]) * FPS) {
      activeSceneIdx = i;
      break;
    }
    accumulated += SCENE_DURATIONS[i];
  }
  
  const sceneStart = accumulated;
  
  switch (activeSceneIdx) {
    case 0: renderScene01(ctx, frame, sceneStart); break;
    case 1: renderScene02(ctx, frame, sceneStart); break;
    case 2: renderScene03(ctx, frame, sceneStart); break;
    case 3: renderScene04(ctx, frame, sceneStart); break;
    case 4: renderScene05(ctx, frame, sceneStart); break;
    case 5: renderScene06(ctx, frame, sceneStart); break;
  }
  
  const outPath = path.join(FRAMES_DIR, `frame-${frame + 1}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buffer);
}

// Render all frames
console.log(`=== Septembro Amarelo — Renderização de ${TOTAL_FRAMES} frames ===`);
console.log(`Resolução: ${W}×${H} | FPS: ${FPS} | Duração: ${DURATION}s\n`);

const START = Date.now();

for (let f = 0; f < TOTAL_FRAMES; f++) {
  if (f % 100 === 0) {
    const elapsed = ((Date.now() - START) / 1000).toFixed(1);
    const remaining = TOTAL_FRAMES - f;
    const rate = f / Math.max(1, Date.now() - START) * 1000;
    const eta = (remaining / rate).toFixed(1);
    process.stdout.write(`\rFrame ${f + 1}/${TOTAL_FRAMES} | ${elapsed}s elapsed | ETA ${eta}s...`);
  }
  renderFrame(f);
}

console.log(`\n✓ Todos os ${TOTAL_FRAMES} frames renderizados em ${FRAMES_DIR}\n`);

// Encode video with ffmpeg
console.log('Codificando vídeo com ffmpeg + áudio...\n');

try {
  execSync(
    `ffmpeg -y -framerate ${FPS} -i ${FRAMES_DIR}/frame-%d.png -i "${AUDIO_FILE}" ` +
    `-c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -c:a aac -b:a 192k -shortest -y "${OUTPUT}"`,
    { stdio: 'inherit', timeout: 300000 }
  );
  console.log(`\n✓ Vídeo finalizado: ${OUTPUT}\n`);
  
  execSync(`ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1:nokey=1 "${OUTPUT}"`, { stdio: 'inherit' });
  console.log('\n');
} catch (err) {
  console.error('Erro na codificação:', err.message);
  process.exit(1);
}
