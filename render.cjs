// Septembro Amarelo — Renderização com design proper
// 1080×1920, 30fps, 30s, tipografia e layout refinados

const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// --- Dimensões ---
const W = 1080;
const H = 1920;
const FPS = 30;
const DURATION = 30;
const TOTAL_FRAMES = DURATION * FPS;

// --- Paleta ---
const YELLOW = "#FFCF00";
const YELLOW_DEEP = "#E6B800";
const INK = "#2D2D2D";
const INK_SOFT = "#5A5A5A";

// --- Grid ---
const MARGIN = 64;

// --- Cenas ---
const SCENE_DURATIONS = [5, 7, 6, 5, 5, 2];

// --- Frames ---
const FRAMES_DIR = "/tmp/frames_separelo_v3";
fs.mkdirSync(FRAMES_DIR, { recursive: true });

// --- Font helpers ---
function font(ctx, size, weight = 400) {
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
}

function textWidth(ctx, text) {
  return ctx.measureText(text).width;
}

// --- Grain ---
function drawGrain(ctx, w, h, intensity = 0.10) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity * 255;
    data[i]     = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);
}

// --- Easing ---
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const easeInCubic = t => t * t * t;

// Opacity de fade de cena
function sceneFade(frame, sceneStart, duration) {
  const local = frame - sceneStart * FPS;
  if (local < 0) return 0;
  if (local > duration * FPS) return 1;
  return easeOutCubic(local / (duration * FPS));
}

// Opacity de elemento dentro da cena
function elemOp(frame, sceneStart, fadeStart, fadeEnd) {
  const s = sceneStart * FPS;
  const start = s + fadeStart * FPS;
  const end = s + fadeEnd * FPS;
  const local = frame - start;
  if (frame < start) return 0;
  if (frame > end) return 1;
  return easeOutCubic(local / ((fadeEnd - fadeStart) * FPS));
}

// --- Texto com letter-spacing para caixa alta ---
function drawSpacedText(ctx, text, x, y, size, weight, color, letterSpacing = 0) {
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  if (letterSpacing > 0) {
    const totalWidth = textWidth(ctx, text) + letterSpacing * (text.length - 1);
    const startX = x - totalWidth / 2;
    let cx = startX;
    for (const char of text) {
      ctx.fillText(char, cx, y);
      cx += textWidth(ctx, char) + letterSpacing;
    }
  } else {
    ctx.fillText(text, x, y);
  }
}

// --- Word wrap para texto ---
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (textWidth(ctx, test) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// --- Cena 01: Abertura ---
function renderScene01(ctx, frame) {
  ctx.fillStyle = YELLOW;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.10);

  const fade = sceneFade(frame, 0, 0.5);
  ctx.save();
  ctx.globalAlpha = fade;

  // Título "SETEMBRO AMARELO" — display, com letter-spacing
  const titleOp = elemOp(frame, 0, 0.3, 2.0);
  if (titleOp > 0) {
    ctx.save();
    ctx.globalAlpha = titleOp;
    const y = H * 0.15;
    drawSpacedText(ctx, "SETEMBRO AMARELO", W / 2, y, 96, 800, INK, 6);
    ctx.restore();
  }

  // Tagline
  const tagOp = elemOp(frame, 0, 1.5, 3.5);
  if (tagOp > 0) {
    ctx.save();
    ctx.globalAlpha = tagOp;
    font(ctx, 32, 400);
    ctx.fillStyle = INK_SOFT;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Escutar é estar presente", W / 2, H * 0.78);
    ctx.restore();
  }

  ctx.restore();
}

// --- Cena 02: Dados SC ---
function renderScene02(ctx, frame) {
  const s = 5;
  ctx.fillStyle = YELLOW;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.08);

  const fade = sceneFade(frame, s, 0.5);
  ctx.save();
  ctx.globalAlpha = fade;

  // Título
  const titleOp = elemOp(frame, s, 0.3, 1.5);
  if (titleOp > 0) {
    ctx.save();
    ctx.globalAlpha = titleOp;
    font(ctx, 48, 600);
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Santa Catarina", W / 2, H * 0.08);
    ctx.restore();
  }

  // Count-up
  const countStart = 0.8;
  const countEnd = 3.5;
  const countProgress = Math.max(0, Math.min(1,
    (frame - (s + countStart) * FPS) / ((countEnd - countStart) * FPS)
  ));
  const val = Math.round(642 + (1034 - 642) * countProgress);

  const numOp = elemOp(frame, s, 0.8, 3.5);
  if (numOp > 0) {
    ctx.save();
    ctx.globalAlpha = numOp;

    font(ctx, 120, 800);
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(String(val), W / 2, H * 0.35);

    font(ctx, 28, 400);
    ctx.fillStyle = INK_SOFT;
    ctx.fillText("óbitos em 2025", W / 2, H * 0.35 + 130);

    ctx.restore();
  }

  // Subtext
  const subOp = elemOp(frame, s, 2.5, 4.0);
  if (subOp > 0) {
    ctx.save();
    ctx.globalAlpha = subOp;
    font(ctx, 24, 400);
    ctx.fillStyle = INK_SOFT;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("9.280 mortes nos últimos 11 anos", W / 2, H * 0.55);
    ctx.restore();
  }

  // +61%
  const pctOp = elemOp(frame, s, 1.0, 2.5);
  if (pctOp > 0) {
    ctx.save();
    ctx.globalAlpha = pctOp;
    ctx.textAlign = "right";
    ctx.textBaseline = "top";

    font(ctx, 40, 700);
    ctx.fillStyle = INK;
    ctx.fillText("+61%", W - MARGIN, H * 0.35);

    font(ctx, 20, 400);
    ctx.fillStyle = INK_SOFT;
    ctx.fillText("vs 2015 (642)", W - MARGIN, H * 0.35 + 50);

    ctx.restore();
  }

  ctx.restore();
}

// --- Cena 03: Gênero ---
function renderScene03(ctx, frame) {
  const s = 12;
  ctx.fillStyle = YELLOW;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.08);

  const fade = sceneFade(frame, s, 0.5);
  ctx.save();
  ctx.globalAlpha = fade;

  // Homens (esquerda)
  const hOp = elemOp(frame, s, 0.3, 1.5);
  if (hOp > 0) {
    ctx.save();
    ctx.globalAlpha = hOp;
    const x = W * 0.15;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    font(ctx, 56, 800);
    ctx.fillStyle = INK;
    ctx.fillText("Homens", x, H * 0.25);

    font(ctx, 44, 700);
    ctx.fillStyle = INK;
    ctx.fillText("76–78%", x, H * 0.25 + 65);

    font(ctx, 22, 400);
    ctx.fillStyle = INK_SOFT;
    ctx.fillText("dos óbitos", x, H * 0.25 + 115);

    ctx.restore();
  }

  // Mulheres (direita)
  const mOp = elemOp(frame, s, 0.8, 2.0);
  if (mOp > 0) {
    ctx.save();
    ctx.globalAlpha = mOp;
    const x = W * 0.85;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    font(ctx, 56, 800);
    ctx.fillStyle = INK_SOFT;
    ctx.fillText("Mulheres", x, H * 0.25);

    font(ctx, 44, 700);
    ctx.fillStyle = INK_SOFT;
    ctx.fillText("22–24%", x, H * 0.25 + 65);

    font(ctx, 22, 400);
    ctx.fillStyle = INK_SOFT;
    ctx.fillText("dos óbitos", x, H * 0.25 + 115);

    ctx.restore();
  }

  // Callout
  const cOp = elemOp(frame, s, 2.5, 4.0);
  if (cOp > 0) {
    ctx.save();
    ctx.globalAlpha = cOp;
    const text = "Mas as mulheres registram mais tentativas — cerca de 65% dos casos notificados";
    const maxWidth = W * 0.75;
    const lines = wrapText(ctx, text, maxWidth);
    const y0 = H * 0.85;
    const lineHeight = 30;

    font(ctx, 22, 400);
    ctx.fillStyle = INK_SOFT;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    lines.forEach((l, i) => ctx.fillText(l, W / 2, y0 + i * lineHeight));

    ctx.restore();
  }

  ctx.restore();
}

// --- Cena 04: Mensagem ---
function renderScene04(ctx, frame) {
  const s = 18;
  ctx.fillStyle = YELLOW_DEEP;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.08);

  const fade = sceneFade(frame, s, 0.5);
  ctx.save();
  ctx.globalAlpha = fade;

  const words = ["Escutar", "é", "estar", "presente."];
  const wordDuration = 0.7;
  const frameInScene = frame - s * FPS;
  const currentWordIdx = Math.min(words.length - 1,
    Math.floor(frameInScene / (wordDuration * FPS)));
  const progressInWord = (frameInScene - currentWordIdx * wordDuration * FPS) / (wordDuration * FPS);
  const wordOp = Math.min(1, progressInWord * 3);

  if (wordOp > 0 && currentWordIdx >= 0) {
    ctx.save();
    ctx.globalAlpha = wordOp;
    font(ctx, 80, 700);
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(words.slice(0, currentWordIdx + 1).join(" "), W / 2, H * 0.12);
    ctx.restore();
  }

  ctx.restore();
}

// --- Cena 05: Recursos ---
function renderScene05(ctx, frame) {
  const s = 23;
  ctx.fillStyle = YELLOW;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.08);

  const fade = sceneFade(frame, s, 0.5);
  ctx.save();
  ctx.globalAlpha = fade;

  // Cidade
  const cityOp = elemOp(frame, s, 0.2, 1.0);
  if (cityOp > 0) {
    ctx.save();
    ctx.globalAlpha = cityOp;
    font(ctx, 36, 600);
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Florianópolis", W / 2, H * 0.06);
    ctx.restore();
  }

  // CVV Card com bounce
  const cardStart = 0.5;
  const cardEnd = 1.5;
  const cardT = Math.max(0, Math.min(1,
    (frame - (s + cardStart) * FPS) / ((cardEnd - cardStart) * FPS)
  ));
  const bounce = 1 - Math.pow(1 - cardT, 3) + Math.sin(cardT * Math.PI * 3) * 0.03 * Math.max(0, 1 - cardT);
  const cardOp = cardT;

  if (cardOp > 0 && frame >= (s + cardStart) * FPS) {
    ctx.save();
    ctx.globalAlpha = cardOp;

    const cw = 520, ch = 180;
    const cx = (W - cw) / 2;
    const cy = H * 0.38;

    ctx.translate(W / 2, cy + ch / 2);
    ctx.scale(bounce, bounce);
    ctx.translate(-W / 2, -(cy + ch / 2));

    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.strokeRect(cx, cy, cw, ch);

    ctx.fillStyle = "rgba(255,255,255,0.30)";
    ctx.fillRect(cx, cy, cw, ch);

    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    font(ctx, 30, 400);
    ctx.fillStyle = INK_SOFT;
    ctx.fillText("CVV — Centro de Valorização da Vida", W / 2, cy + 16);

    font(ctx, 64, 700);
    ctx.fillStyle = INK;
    ctx.fillText("Ligue 188", W / 2, cy + 52);

    font(ctx, 22, 400);
    ctx.fillStyle = INK_SOFT;
    ctx.fillText("Gratuito · 24 horas", W / 2, cy + 120);

    ctx.restore();
  }

  // UBS/CAPS
  const ubsOp = elemOp(frame, s, 1.2, 2.5);
  if (ubsOp > 0) {
    ctx.save();
    ctx.globalAlpha = ubsOp;
    font(ctx, 28, 400);
    ctx.fillStyle = INK_SOFT;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("UBS e CAPS — atendimento pelo SUS", W / 2, H * 0.65);
    ctx.restore();
  }

  // Instituições
  const instOp = elemOp(frame, s, 2.0, 3.5);
  if (instOp > 0) {
    ctx.save();
    ctx.globalAlpha = instOp;
    font(ctx, 22, 400);
    ctx.fillStyle = INK_SOFT;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("APAE Florianópolis · Unimed Grande Floripa", W / 2, H * 0.74);
    ctx.restore();
  }

  ctx.restore();
}

// --- Cena 06: Fechamento ---
function renderScene06(ctx, frame) {
  const s = 28;
  ctx.fillStyle = YELLOW;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.10);

  const fade = sceneFade(frame, s, 0.4);
  ctx.save();
  ctx.globalAlpha = fade;

  // Hashtag com letter-spacing
  const tagOp = elemOp(frame, s, 0.2, 1.0);
  if (tagOp > 0) {
    ctx.save();
    ctx.globalAlpha = tagOp;
    drawSpacedText(ctx, "#SetembroAmareloSC", W / 2, H * 0.30, 38, 500, INK, 4);
    ctx.restore();
  }

  // CVV banner
  const bannerOp = elemOp(frame, s, 0.4, 1.2);
  if (bannerOp > 0) {
    ctx.save();
    ctx.globalAlpha = bannerOp;

    const by = H * 0.80, bw = 380, bh = 50;
    const bx = (W - bw) / 2;

    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    font(ctx, 28, 600);
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("CVV 188 — Ligue agora", W / 2, by + 8);

    ctx.restore();
  }

  ctx.restore();
}

// --- Renderizar frame ---
function renderFrame(frame) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "alphabetic";

  let acc = 0, activeIdx = 0;
  for (let i = 0; i < SCENE_DURATIONS.length; i++) {
    if (frame < (acc + SCENE_DURATIONS[i]) * FPS) {
      activeIdx = i;
      break;
    }
    acc += SCENE_DURATIONS[i];
  }

  switch (activeIdx) {
    case 0: renderScene01(ctx, frame); break;
    case 1: renderScene02(ctx, frame); break;
    case 2: renderScene03(ctx, frame); break;
    case 3: renderScene04(ctx, frame); break;
    case 4: renderScene05(ctx, frame); break;
    case 5: renderScene06(ctx, frame); break;
  }

  fs.writeFileSync(
    path.join(FRAMES_DIR, `frame-${frame + 1}.png`),
    canvas.toBuffer("image/png")
  );
}

// --- Main ---
console.log(`=== Septembro Amarelo — ${TOTAL_FRAMES} frames (${W}×${H}, ${FPS}fps) ===`);
const START = Date.now();

for (let f = 0; f < TOTAL_FRAMES; f++) {
  if (f % 100 === 0) {
    const elapsed = ((Date.now() - START) / 1000).toFixed(1);
    const remaining = TOTAL_FRAMES - f;
    const rate = f / Math.max(1, Date.now() - START) * 1000;
    const eta = (remaining / rate).toFixed(1);
    process.stdout.write(`\rFrame ${f + 1}/${TOTAL_FRAMES} | ${elapsed}s | ETA ${eta}s`);
  }
  renderFrame(f);
}

console.log(`\n✓ ${TOTAL_FRAMES} frames em ${FRAMES_DIR}\n`);

// --- Codificar ---
const BASE = process.cwd();
const OUTPUT = path.join(BASE, "video_separelo.mp4");
const AUDIO = path.join(BASE, "audio", "narracao_30s.mp3");

console.log("Codificando vídeo com ffmpeg...");
try {
  execSync(
    `ffmpeg -y -framerate ${FPS} -i ${FRAMES_DIR}/frame-%d.png -i "${AUDIO}" ` +
    `-c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -c:a aac -b:a 192k -shortest -y "${OUTPUT}"`,
    { stdio: "inherit", timeout: 300000 }
  );
  console.log(`\n✓ Vídeo: ${OUTPUT}\n`);

  execSync(
    `ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1:nokey=1 "${OUTPUT}"`,
    { stdio: "inherit" }
  );
} catch (err) {
  console.error("Erro:", err.message);
  process.exit(1);
}
