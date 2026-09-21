import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const W = 1080;
const H = 1920;
const FPS = 30;
const DURATION = 30;
const TOTAL_FRAMES = DURATION * FPS; // 900

const YELLOW_PRIMARY = "#FFCF00";
const YELLOW_DEEP = "#E6B800";
const TEXT_DARK = "#2D2D2D";
const TEXT_SOFT = "#5A5A5A";
const WHITE = "#FFFFFF";

const SCENE_DURATIONS = [5, 7, 6, 5, 5, 2]; // em segundos
const TOTAL_SEQ = SCENE_DURATIONS.reduce((a, b) => a + b, 0);

const FRAMES_DIR = "/tmp/frames_separelo";
fs.mkdirSync(FRAMES_DIR, { recursive: true });

// --- Tinta de ruído para grain ---

function drawGrain(ctx, w, h, intensity = 0.10) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity * 255;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);
}

// --- Helper: opacity por frame ---

function easedOpacity(frame: number, startFrame: number, endFrame: number, mode: "in" | "out" = "in"): number {
  if (frame < startFrame) return 0;
  if (frame > endFrame) return mode === "in" ? 1 : 0;
  const t = (frame - startFrame) / (endFrame - startFrame);
  // ease-out
  const eased = 1 - Math.pow(1 - t, 3);
  return mode === "in" ? eased : 1 - eased;
}

// --- Cena 01: Abertura ---

function renderScene01(ctx: CanvasRenderingContext2D, frame: number) {
  const sceneStart = 0;
  const sceneEnd = SCENE_DURATIONS[0] * FPS; // 150

  // Fundo amarelo
  ctx.fillStyle = YELLOW_PRIMARY;
  ctx.fillRect(0, 0, W, H);

  // Grain
  drawGrain(ctx, W, H, 0.12);

  // Título - fade in 0.5s → 2.5s
  const titleOpacity = easedOpacity(frame, sceneStart + 0.5 * FPS, sceneStart + 2.5 * FPS, "in");

  if (titleOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = titleOpacity;
    ctx.fillStyle = TEXT_DARK;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const titleY = H * 0.18;
    const fontSize = 72;
    ctx.font = `700 ${fontSize}px system-ui, sans-serif`;
    ctx.fillText("SETEMBRO AMARELO", W / 2, titleY);

    ctx.restore();
  }

  // Tagline - fade in 2.0s → 4.0s
  const tagOpacity = easedOpacity(frame, sceneStart + 2.0 * FPS, sceneStart + 4.0 * FPS, "in");

  if (tagOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = tagOpacity;
    ctx.fillStyle = TEXT_SOFT;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const tagY = H * 0.78;
    ctx.font = `400 34px system-ui, sans-serif`;
    ctx.fillText("Escutar é estar presente", W / 2, tagY);

    ctx.restore();
  }
}

// --- Cena 02: Dados SC ---

function renderScene02(ctx: CanvasRenderingContext2D, frame: number) {
  const sceneStart = SCENE_DURATIONS[0] * FPS; // 150
  const sceneEnd = sceneStart + SCENE_DURATIONS[1] * FPS; // 150 + 210 = 360

  ctx.fillStyle = YELLOW_PRIMARY;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.10);

  // Fade in da cena
  const sceneFade = easedOpacity(frame, sceneStart, sceneStart + 0.5 * FPS, "in");
  ctx.save();
  ctx.globalAlpha = sceneFade;

  // Título "Santa Catarina" - 0.5s → 2.0s
  const titleOpacity = easedOpacity(frame, sceneStart + 0.5 * FPS, sceneStart + 2.0 * FPS, "in");
  if (titleOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = titleOpacity;
    ctx.fillStyle = TEXT_DARK;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `600 42px system-ui, sans-serif`;
    ctx.fillText("Santa Catarina", W / 2, H * 0.08);
    ctx.restore();
  }

  // Número count-up: 642 → 1034 em 3.0s (frame 0.8 → 3.8 do início da cena)
  const countStart = sceneStart + 0.8 * FPS;
  const countEnd = sceneStart + 3.8 * FPS;
  const countDuration = countEnd - countStart;
  const countFrame = Math.max(0, frame - countStart);
  const countProgress = Math.min(1, countFrame / countDuration);
  const currentVal = Math.round(642 + (1034 - 642) * countProgress);

  const numOpacity = easedOpacity(frame, sceneStart + 0.8 * FPS, sceneStart + 4.0 * FPS, "in");
  if (numOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = numOpacity;
    ctx.fillStyle = TEXT_DARK;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const numY = H * 0.38;
    ctx.font = `800 110px system-ui, sans-serif`;
    ctx.fillText(String(currentVal), W / 2, numY);

    ctx.font = `400 24px system-ui, sans-serif`;
    ctx.fillStyle = TEXT_SOFT;
    ctx.fillText("óbitos em 2025", W / 2, numY + 120);

    ctx.restore();
  }

  // Subtext - 2.5s → 4.0s
  const subOpacity = easedOpacity(frame, sceneStart + 2.5 * FPS, sceneStart + 4.0 * FPS, "in");
  if (subOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = subOpacity;
    ctx.fillStyle = TEXT_SOFT;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `400 24px system-ui, sans-serif`;
    ctx.fillText("9.280 mortes nos últimos 11 anos", W / 2, H * 0.58);
    ctx.restore();
  }

  // +61% - lado direito, 1.0s → 2.5s
  const pctOpacity = easedOpacity(frame, sceneStart + 1.0 * FPS, sceneStart + 2.5 * FPS, "in");
  if (pctOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = pctOpacity;
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillStyle = TEXT_DARK;
    ctx.font = `700 40px system-ui, sans-serif`;
    ctx.fillText("+61%", W - W * 0.08, H * 0.38);
    ctx.fillStyle = TEXT_SOFT;
    ctx.font = `400 18px system-ui, sans-serif`;
    ctx.fillText("vs 2015 (642)", W - W * 0.08, H * 0.38 + 48);
    ctx.restore();
  }

  ctx.restore();
}

// --- Cena 03: Gênero ---

function renderScene03(ctx: CanvasRenderingContext2D, frame: number) {
  const sceneStart = (SCENE_DURATIONS[0] + SCENE_DURATIONS[1]) * FPS; // 360
  const sceneEnd = sceneStart + SCENE_DURATIONS[2] * FPS; // 360 + 180 = 540

  ctx.fillStyle = YELLOW_PRIMARY;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.08);

  const sceneFade = easedOpacity(frame, sceneStart, sceneStart + 0.5 * FPS, "in");
  ctx.save();
  ctx.globalAlpha = sceneFade;

  // "Homens" - esquerda, fade in 0.5s → 1.8s
  const hOpacity = easedOpacity(frame, sceneStart + 0.5 * FPS, sceneStart + 1.8 * FPS, "in");
  if (hOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = hOpacity;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = TEXT_DARK;
    ctx.font = `800 56px system-ui, sans-serif`;
    ctx.fillText("Homens", W * 0.12, H * 0.28);
    ctx.font = `700 44px system-ui, sans-serif`;
    ctx.fillText("76–78%", W * 0.12, H * 0.28 + 70);
    ctx.font = `400 20px system-ui, sans-serif`;
    ctx.fillStyle = TEXT_SOFT;
    ctx.fillText("dos óbitos", W * 0.12, H * 0.28 + 122);
    ctx.restore();
  }

  // "Mulheres" - direita, fade in 1.0s → 2.3s
  const mOpacity = easedOpacity(frame, sceneStart + 1.0 * FPS, sceneStart + 2.3 * FPS, "in");
  if (mOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = mOpacity;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = TEXT_SOFT;
    ctx.font = `400 30px system-ui, sans-serif`;
    ctx.fillText("Mulheres", W * 0.88, H * 0.38);
    ctx.font = `400 24px system-ui, sans-serif`;
    ctx.fillText("22–24% dos óbitos", W * 0.88, H * 0.38 + 42);
    ctx.restore();
  }

  // Callout - centro, 2.5s → 4.0s
  const cOpacity = easedOpacity(frame, sceneStart + 2.5 * FPS, sceneStart + 4.0 * FPS, "in");
  if (cOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = cOpacity;
    ctx.fillStyle = TEXT_SOFT;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `400 22px system-ui, sans-serif`;
    const calloutY = H * 0.88;
    const maxWidth = W * 0.8;
    const text = "Mas as mulheres registram mais tentativas — cerca de 65% dos casos notificados";
    // Wrap text
    const words = text.split(" ");
    let line = "";
    let lines: string[] = [];
    for (const word of words) {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);

    lines.forEach((l, i) => {
      ctx.fillText(l, W / 2, calloutY + i * 28);
    });
    ctx.restore();
  }

  ctx.restore();
}

// --- Cena 04: Mensagem ---

function renderScene04(ctx: CanvasRenderingContext2D, frame: number) {
  const sceneStart = (SCENE_DURATIONS[0] + SCENE_DURATIONS[1] + SCENE_DURATIONS[2]) * FPS; // 540
  const sceneEnd = sceneStart + SCENE_DURATIONS[3] * FPS; // 540 + 150 = 690

  ctx.fillStyle = YELLOW_DEEP;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.10);

  const sceneFade = easedOpacity(frame, sceneStart, sceneStart + 0.5 * FPS, "in");
  ctx.save();
  ctx.globalAlpha = sceneFade;

  // Word-by-word: Escutar → é → estar → presente.
  const words = ["Escutar", "é", "estar", "presente."];
  const wordDuration = 0.8; // segundos por palavra
  const currentWordIndex = Math.min(words.length - 1, Math.floor((frame - sceneStart) / (wordDuration * FPS)));
  const wordProgress = (frame - sceneStart - currentWordIndex * wordDuration * FPS) / (wordDuration * FPS);

  // Fade in da palavra atual
  const wordOpacity = Math.min(1, wordProgress * 2);
  if (wordOpacity > 0 && currentWordIndex >= 0) {
    ctx.save();
    ctx.globalAlpha = wordOpacity;
    ctx.fillStyle = TEXT_DARK;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `600 68px system-ui, sans-serif`;
    ctx.fillText(words.slice(0, currentWordIndex + 1).join(" "), W / 2, H * 0.10);
    ctx.restore();
  }

  ctx.restore();
}

// --- Cena 05: Recursos ---

function renderScene05(ctx: CanvasRenderingContext2D, frame: number) {
  const sceneStart = (SCENE_DURATIONS[0] + SCENE_DURATIONS[1] + SCENE_DURATIONS[2] + SCENE_DURATIONS[3]) * FPS; // 690
  const sceneEnd = sceneStart + SCENE_DURATIONS[4] * FPS; // 690 + 150 = 840

  ctx.fillStyle = YELLOW_PRIMARY;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.10);

  const sceneFade = easedOpacity(frame, sceneStart, sceneStart + 0.5 * FPS, "in");
  ctx.save();
  ctx.globalAlpha = sceneFade;

  // "Florianópolis" - topo, 0.2s → 1.2s
  const titleOpacity = easedOpacity(frame, sceneStart + 0.2 * FPS, sceneStart + 1.2 * FPS, "in");
  if (titleOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = titleOpacity;
    ctx.fillStyle = TEXT_DARK;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `600 36px system-ui, sans-serif`;
    ctx.fillText("Florianópolis", W / 2, H * 0.06);
    ctx.restore();
  }

  // CVV card - bounce scale com easing
  const cardStart = sceneStart + 0.5 * FPS;
  const cardEnd = sceneStart + 1.5 * FPS;
  const cardT = Math.max(0, Math.min(1, (frame - cardStart) / (cardEnd - cardStart)));
  // Ease-out com overshoot simulado
  const bounceScale = 1 - Math.pow(1 - cardT, 3) + Math.sin(cardT * Math.PI * 3) * 0.02 * Math.max(0, 1 - cardT);
  const cardOpacity = cardT;

  if (cardOpacity > 0 && frame >= cardStart) {
    ctx.save();
    ctx.globalAlpha = cardOpacity;
    const cardW = 480;
    const cardH = 160;
    const cardX = (W - cardW) / 2;
    const cardY = H * 0.40;

    ctx.translate(W / 2, cardY + cardH / 2);
    ctx.scale(bounceScale, bounceScale);
    ctx.translate(-W / 2, -(cardY + cardH / 2));

    // Card border
    ctx.strokeStyle = TEXT_DARK;
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    // Card bg
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(cardX, cardY, cardW, cardH);

    // CVV text
    ctx.fillStyle = TEXT_SOFT;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `400 28px system-ui, sans-serif`;
    ctx.fillText("CVV — Centro de Valorização da Vida", W / 2, cardY + 12);

    ctx.fillStyle = TEXT_DARK;
    ctx.font = `700 52px system-ui, sans-serif`;
    ctx.fillText("Ligue 188", W / 2, cardY + 44);

    ctx.fillStyle = TEXT_SOFT;
    ctx.font = `400 18px system-ui, sans-serif`;
    ctx.fillText("Gratuito · 24 horas", W / 2, cardY + 104);

    ctx.restore();
  }

  // UBS/CAPS - 1.2s → 2.5s
  const ubsOpacity = easedOpacity(frame, sceneStart + 1.2 * FPS, sceneStart + 2.5 * FPS, "in");
  if (ubsOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = ubsOpacity;
    ctx.fillStyle = TEXT_SOFT;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `400 24px system-ui, sans-serif`;
    ctx.fillText("UBS e CAPS — atendimento pelo SUS", W / 2, H * 0.65);
    ctx.restore();
  }

  // Instituições - 2.0s → 3.5s
  const instOpacity = easedOpacity(frame, sceneStart + 2.0 * FPS, sceneStart + 3.5 * FPS, "in");
  if (instOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = instOpacity;
    ctx.fillStyle = TEXT_SOFT;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `400 20px system-ui, sans-serif`;
    ctx.fillText("APAE Florianópolis · Unimed Grande Floripa", W / 2, H * 0.74);
    ctx.restore();
  }

  ctx.restore();
}

// --- Cena 06: Fechamento ---

function renderScene06(ctx: CanvasRenderingContext2D, frame: number) {
  const sceneStart = (SCENE_DURATIONS[0] + SCENE_DURATIONS[1] + SCENE_DURATIONS[2] + SCENE_DURATIONS[3] + SCENE_DURATIONS[4]) * FPS; // 840
  const sceneEnd = sceneStart + SCENE_DURATIONS[5] * FPS; // 840 + 60 = 900

  ctx.fillStyle = YELLOW_PRIMARY;
  ctx.fillRect(0, 0, W, H);
  drawGrain(ctx, W, H, 0.12);

  const sceneFade = easedOpacity(frame, sceneStart, sceneStart + 0.5 * FPS, "in");
  ctx.save();
  ctx.globalAlpha = sceneFade;

  // Hashtag - 0.3s → 1.3s
  const tagOpacity = easedOpacity(frame, sceneStart + 0.3 * FPS, sceneStart + 1.3 * FPS, "in");
  if (tagOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = tagOpacity;
    ctx.fillStyle = TEXT_DARK;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `500 36px system-ui, sans-serif`;
    ctx.fillText("#SetembroAmareloSC", W / 2, H * 0.32);
    ctx.restore();
  }

  // CVV banner - 0.5s → 1.5s (com borda)
  const bannerOpacity = easedOpacity(frame, sceneStart + 0.5 * FPS, sceneStart + 1.5 * FPS, "in");
  if (bannerOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = bannerOpacity;
    const bannerY = H * 0.80;
    const bannerH = 44;
    const bannerW = 340;
    const bannerX = (W - bannerW) / 2;

    ctx.strokeStyle = TEXT_DARK;
    ctx.lineWidth = 2;
    ctx.strokeRect(bannerX, bannerY, bannerW, bannerH);

    ctx.fillStyle = TEXT_DARK;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `600 28px system-ui, sans-serif`;
    ctx.fillText("CVV 188 — Ligue agora", W / 2, bannerY + 6);

    ctx.restore();
  }

  ctx.restore();
}

// --- Função principal ---

function renderFrame(frame: number): void {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "alphabetic";

  // Determine qual cena está ativa
  let accumulated = 0;
  let activeSceneIdx = 0;
  for (let i = 0; i < SCENE_DURATIONS.length; i++) {
    if (frame < (accumulated + SCENE_DURATIONS[i]) * FPS) {
      activeSceneIdx = i;
      break;
    }
    accumulated += SCENE_DURATIONS[i];
  }

  // Renderizar cena ativa
  switch (activeSceneIdx) {
    case 0: renderScene01(ctx, frame); break;
    case 1: renderScene02(ctx, frame); break;
    case 2: renderScene03(ctx, frame); break;
    case 3: renderScene04(ctx, frame); break;
    case 4: renderScene05(ctx, frame); break;
    case 5: renderScene06(ctx, frame); break;
  }

  // Salvar frame
  const outPath = path.join(FRAMES_DIR, `frame-${frame + 1}.png`);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outPath, buffer);
}

// --- Renderizar tudo ---

console.log(`=== Septembro Amarelo — Renderização de ${TOTAL_FRAMES} frames ===`);
console.log(`Resolução: ${W}×${H} | FPS: ${FPS} | Duração: ${DURATION}s\n`);

const START = Date.now();

for (let f = 0; f < TOTAL_FRAMES; f++) {
  if (f % 100 === 0) {
    const elapsed = ((Date.now() - START) / 1000).toFixed(1);
    const remaining = TOTAL_FRAMES - f;
    const rate = f / (Date.now() - START) * 1000;
    const eta = (remaining / rate).toFixed(1);
    process.stdout.write(`\rFrame ${f + 1}/${TOTAL_FRAMES} | ${elapsed}s elapsed | ETA ${eta}s...`);
  }
  renderFrame(f);
}

console.log(`\n✓ Todos os ${TOTAL_FRAMES} frames renderizados em ${FRAMES_DIR}\n`);

// --- Codificar vídeo com ffmpeg ---

const OUTPUT = "/home/tiago/septembro-amarelo/video_separelo.mp4";
const AUDIO = "/home/tiago/septembro-amarelo/audio/narracao_26s.mp3";

console.log("Codificando vídeo com ffmpeg + áudio...");

try {
  execSync(
    `ffmpeg -framerate ${FPS} -i ${FRAMES_DIR}/frame-%d.png -i ${AUDIO} ` +
    `-c:v libx264 -pix_fmt yuv420p -crf 20 -preset medium -c:a aac -b:a 192k -shortest -y ${OUTPUT}`,
    { stdio: "inherit", timeout: 300000 }
  );
  console.log(`\n✓ Vídeo finalizado: ${OUTPUT}\n`);
} catch (err) {
  console.error("Erro na codificação:", err);
  process.exit(1);
}
