const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const W = 1080;
const H = 1920;
const FPS = 30;
const DURATION = 30;
const TOTAL_FRAMES = DURATION * FPS;

const YELLOW_PRIMARY = "#FFCF00";
const YELLOW_DEEP = "#E6B800";
const TEXT_DARK = "#2D2D2D";
const TEXT_SOFT = "#5A5A5A";

const SCENE_DURATIONS = [5, 7, 6, 5, 5, 2];
const FRAMES_DIR = "/tmp/frames_separelo_v2";
fs.mkdirSync(FRAMES_DIR, { recursive: true });

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

function easedOpacity(frame, startFrame, endFrame, mode = "in") {
  if (frame < startFrame) return 0;
  if (frame > endFrame) return mode === "in" ? 1 : 0;
  const t = (frame - startFrame) / (endFrame - startFrame);
  const eased = 1 - Math.pow(1 - t, 3);
  return mode === "in" ? eased : 1 - eased;
}

function renderAll(ctx, frame) {
  // Determinar cena ativa
  let acc = 0;
  let activeIdx = 0;
  for (let i = 0; i < SCENE_DURATIONS.length; i++) {
    if (frame < (acc + SCENE_DURATIONS[i]) * FPS) { activeIdx = i; break; }
    acc += SCENE_DURATIONS[i];
  }

  // Cena 01: Abertura
  if (activeIdx === 0) {
    ctx.fillStyle = YELLOW_PRIMARY;
    ctx.fillRect(0, 0, W, H);
    drawGrain(ctx, W, H, 0.12);
    const sceneStart = 0;
    const titleOp = easedOpacity(frame, sceneStart + 0.5*FPS, sceneStart + 2.5*FPS, "in");
    if (titleOp > 0) {
      ctx.save(); ctx.globalAlpha = titleOp;
      ctx.fillStyle = TEXT_DARK; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.font = "700 72px system-ui, sans-serif";
      ctx.fillText("SETEMBRO AMARELO", W/2, H*0.18);
      ctx.restore();
    }
    const tagOp = easedOpacity(frame, sceneStart + 2.0*FPS, sceneStart + 4.0*FPS, "in");
    if (tagOp > 0) {
      ctx.save(); ctx.globalAlpha = tagOp;
      ctx.fillStyle = TEXT_SOFT; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.font = "400 34px system-ui, sans-serif";
      ctx.fillText("Escutar é estar presente", W/2, H*0.78);
      ctx.restore();
    }
    return;
  }

  // Cena 02: Dados SC
  if (activeIdx === 1) {
    const s = SCENE_DURATIONS[0] * FPS;
    ctx.fillStyle = YELLOW_PRIMARY;
    ctx.fillRect(0, 0, W, H);
    drawGrain(ctx, W, H, 0.10);
    const fade = easedOpacity(frame, s, s + 0.5*FPS, "in");
    ctx.save(); ctx.globalAlpha = fade;
    const tOp = easedOpacity(frame, s + 0.5*FPS, s + 2.0*FPS, "in");
    if (tOp > 0) {
      ctx.save(); ctx.globalAlpha = tOp;
      ctx.fillStyle = TEXT_DARK; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.font = "600 42px system-ui, sans-serif";
      ctx.fillText("Santa Catarina", W/2, H*0.08);
      ctx.restore();
    }
    const cStart = s + 0.8*FPS, cEnd = s + 3.8*FPS;
    const cProg = Math.min(1, Math.max(0, frame - cStart) / (cEnd - cStart));
    const val = Math.round(642 + (1034-642)*cProg);
    const nOp = easedOpacity(frame, s + 0.8*FPS, s + 4.0*FPS, "in");
    if (nOp > 0) {
      ctx.save(); ctx.globalAlpha = nOp;
      ctx.fillStyle = TEXT_DARK; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.font = "800 110px system-ui, sans-serif";
      ctx.fillText(String(val), W/2, H*0.38);
      ctx.font = "400 24px system-ui, sans-serif";
      ctx.fillStyle = TEXT_SOFT;
      ctx.fillText("óbitos em 2025", W/2, H*0.38 + 120);
      ctx.restore();
    }
    const subOp = easedOpacity(frame, s + 2.5*FPS, s + 4.0*FPS, "in");
    if (subOp > 0) {
      ctx.save(); ctx.globalAlpha = subOp;
      ctx.fillStyle = TEXT_SOFT; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.font = "400 24px system-ui, sans-serif";
      ctx.fillText("9.280 mortes nos últimos 11 anos", W/2, H*0.58);
      ctx.restore();
    }
    const pOp = easedOpacity(frame, s + 1.0*FPS, s + 2.5*FPS, "in");
    if (pOp > 0) {
      ctx.save(); ctx.globalAlpha = pOp;
      ctx.textAlign = "right"; ctx.textBaseline = "top";
      ctx.fillStyle = TEXT_DARK; ctx.font = "700 40px system-ui, sans-serif";
      ctx.fillText("+61%", W - W*0.08, H*0.38);
      ctx.fillStyle = TEXT_SOFT; ctx.font = "400 18px system-ui, sans-serif";
      ctx.fillText("vs 2015 (642)", W - W*0.08, H*0.38 + 48);
      ctx.restore();
    }
    ctx.restore();
    return;
  }

  // Cena 03: Gênero
  if (activeIdx === 2) {
    const s = (SCENE_DURATIONS[0]+SCENE_DURATIONS[1]) * FPS;
    ctx.fillStyle = YELLOW_PRIMARY;
    ctx.fillRect(0, 0, W, H);
    drawGrain(ctx, W, H, 0.08);
    const fade = easedOpacity(frame, s, s + 0.5*FPS, "in");
    ctx.save(); ctx.globalAlpha = fade;
    const hOp = easedOpacity(frame, s + 0.5*FPS, s + 1.8*FPS, "in");
    if (hOp > 0) {
      ctx.save(); ctx.globalAlpha = hOp;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillStyle = TEXT_DARK; ctx.font = "800 56px system-ui, sans-serif";
      ctx.fillText("Homens", W*0.12, H*0.28);
      ctx.font = "700 44px system-ui, sans-serif";
      ctx.fillText("76–78%", W*0.12, H*0.28+70);
      ctx.fillStyle = TEXT_SOFT; ctx.font = "400 20px system-ui, sans-serif";
      ctx.fillText("dos óbitos", W*0.12, H*0.28+122);
      ctx.restore();
    }
    const mOp = easedOpacity(frame, s + 1.0*FPS, s + 2.3*FPS, "in");
    if (mOp > 0) {
      ctx.save(); ctx.globalAlpha = mOp;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillStyle = TEXT_SOFT; ctx.font = "400 30px system-ui, sans-serif";
      ctx.fillText("Mulheres", W*0.88, H*0.38);
      ctx.font = "400 24px system-ui, sans-serif";
      ctx.fillText("22–24% dos óbitos", W*0.88, H*0.38+42);
      ctx.restore();
    }
    const cOp = easedOpacity(frame, s + 2.5*FPS, s + 4.0*FPS, "in");
    if (cOp > 0) {
      ctx.save(); ctx.globalAlpha = cOp;
      ctx.fillStyle = TEXT_SOFT; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.font = "400 22px system-ui, sans-serif";
      const y0 = H*0.88;
      const txt = "Mas as mulheres registram mais tentativas — cerca de 65% dos casos notificados";
      const words = txt.split(" ");
      let line = "", lines = [];
      for (const w of words) {
        const test = line ? line+" "+w : w;
        if (ctx.measureText(test).width > W*0.8 && line) { lines.push(line); line = w; }
        else line = test;
      }
      if (line) lines.push(line);
      lines.forEach((l,i) => ctx.fillText(l, W/2, y0+i*28));
      ctx.restore();
    }
    ctx.restore();
    return;
  }

  // Cena 04: Mensagem
  if (activeIdx === 3) {
    const s = (SCENE_DURATIONS[0]+SCENE_DURATIONS[1]+SCENE_DURATIONS[2]) * FPS;
    ctx.fillStyle = YELLOW_DEEP;
    ctx.fillRect(0, 0, W, H);
    drawGrain(ctx, W, H, 0.10);
    const fade = easedOpacity(frame, s, s + 0.5*FPS, "in");
    ctx.save(); ctx.globalAlpha = fade;
    const words = ["Escutar","é","estar","presente."];
    const wd = 0.8;
    const idx = Math.min(words.length-1, Math.floor((frame-s)/(wd*FPS)));
    const prog = (frame - s - idx*wd*FPS) / (wd*FPS);
    const wOp = Math.min(1, prog*2);
    if (wOp > 0 && idx >= 0) {
      ctx.save(); ctx.globalAlpha = wOp;
      ctx.fillStyle = TEXT_DARK; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.font = "600 68px system-ui, sans-serif";
      ctx.fillText(words.slice(0, idx+1).join(" "), W/2, H*0.10);
      ctx.restore();
    }
    ctx.restore();
    return;
  }

  // Cena 05: Recursos
  if (activeIdx === 4) {
    const s = (SCENE_DURATIONS[0]+SCENE_DURATIONS[1]+SCENE_DURATIONS[2]+SCENE_DURATIONS[3]) * FPS;
    ctx.fillStyle = YELLOW_PRIMARY;
    ctx.fillRect(0, 0, W, H);
    drawGrain(ctx, W, H, 0.10);
    const fade = easedOpacity(frame, s, s + 0.5*FPS, "in");
    ctx.save(); ctx.globalAlpha = fade;
    const tOp = easedOpacity(frame, s + 0.2*FPS, s + 1.2*FPS, "in");
    if (tOp > 0) {
      ctx.save(); ctx.globalAlpha = tOp;
      ctx.fillStyle = TEXT_DARK; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.font = "600 36px system-ui, sans-serif";
      ctx.fillText("Florianópolis", W/2, H*0.06);
      ctx.restore();
    }
    const cStart = s + 0.5*FPS, cEnd = s + 1.5*FPS;
    const cT = Math.max(0, Math.min(1, (frame-cStart)/(cEnd-cStart)));
    const bounce = 1 - Math.pow(1-cT,3) + Math.sin(cT*Math.PI*3)*0.02*Math.max(0,1-cT);
    const cOp = cT;
    if (cOp > 0 && frame >= cStart) {
      ctx.save(); ctx.globalAlpha = cOp;
      const cw=480, ch=160, cx=(W-cw)/2, cy=H*0.40;
      ctx.translate(W/2, cy+ch/2);
      ctx.scale(bounce, bounce);
      ctx.translate(-W/2, -(cy+ch/2));
      ctx.strokeStyle = TEXT_DARK; ctx.lineWidth = 2;
      ctx.strokeRect(cx, cy, cw, ch);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(cx, cy, cw, ch);
      ctx.fillStyle = TEXT_SOFT; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.font = "400 28px system-ui, sans-serif";
      ctx.fillText("CVV — Centro de Valorização da Vida", W/2, cy+12);
      ctx.fillStyle = TEXT_DARK; ctx.font = "700 52px system-ui, sans-serif";
      ctx.fillText("Ligue 188", W/2, cy+44);
      ctx.fillStyle = TEXT_SOFT; ctx.font = "400 18px system-ui, sans-serif";
      ctx.fillText("Gratuito · 24 horas", W/2, cy+104);
      ctx.restore();
    }
    const uOp = easedOpacity(frame, s + 1.2*FPS, s + 2.5*FPS, "in");
    if (uOp > 0) {
      ctx.save(); ctx.globalAlpha = uOp;
      ctx.fillStyle = TEXT_SOFT; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.font = "400 24px system-ui, sans-serif";
      ctx.fillText("UBS e CAPS — atendimento pelo SUS", W/2, H*0.65);
      ctx.restore();
    }
    const iOp = easedOpacity(frame, s + 2.0*FPS, s + 3.5*FPS, "in");
    if (iOp > 0) {
      ctx.save(); ctx.globalAlpha = iOp;
      ctx.fillStyle = TEXT_SOFT; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.font = "400 20px system-ui, sans-serif";
      ctx.fillText("APAE Florianópolis · Unimed Grande Floripa", W/2, H*0.74);
      ctx.restore();
    }
    ctx.restore();
    return;
  }

  // Cena 06: Fechamento
  if (activeIdx === 5) {
    const s = (SCENE_DURATIONS[0]+SCENE_DURATIONS[1]+SCENE_DURATIONS[2]+SCENE_DURATIONS[3]+SCENE_DURATIONS[4]) * FPS;
    ctx.fillStyle = YELLOW_PRIMARY;
    ctx.fillRect(0, 0, W, H);
    drawGrain(ctx, W, H, 0.12);
    const fade = easedOpacity(frame, s, s + 0.5*FPS, "in");
    ctx.save(); ctx.globalAlpha = fade;
    const tOp = easedOpacity(frame, s + 0.3*FPS, s + 1.3*FPS, "in");
    if (tOp > 0) {
      ctx.save(); ctx.globalAlpha = tOp;
      ctx.fillStyle = TEXT_DARK; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.font = "500 36px system-ui, sans-serif";
      ctx.fillText("#SetembroAmareloSC", W/2, H*0.32);
      ctx.restore();
    }
    const bOp = easedOpacity(frame, s + 0.5*FPS, s + 1.5*FPS, "in");
    if (bOp > 0) {
      ctx.save(); ctx.globalAlpha = bOp;
      const by=H*0.80, bw=340, bh=44, bx=(W-bw)/2;
      ctx.strokeStyle = TEXT_DARK; ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);
      ctx.fillStyle = TEXT_DARK; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.font = "600 28px system-ui, sans-serif";
      ctx.fillText("CVV 188 — Ligue agora", W/2, by+6);
      ctx.restore();
    }
    ctx.restore();
    return;
  }
}

// Renderizar
console.log(`=== Septembro Amarelo — ${TOTAL_FRAMES} frames (${W}×${H}, ${FPS}fps, ${DURATION}s) ===`);
const START = Date.now();

for (let f = 0; f < TOTAL_FRAMES; f++) {
  if (f % 150 === 0) {
    const elapsed = (Date.now()-START)/1000;
    const remaining = TOTAL_FRAMES - f;
    const rate = f / Math.max(1, Date.now()-START) * 1000;
    const eta = (remaining / rate).toFixed(1);
    process.stdout.write(`\rFrame ${f+1}/${TOTAL_FRAMES} | ${elapsed.toFixed(1)}s | ETA ${eta}s`);
  }
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "alphabetic";
  renderAll(ctx, f);
  fs.writeFileSync(path.join(FRAMES_DIR, `frame-${f+1}.png`), canvas.toBuffer("image/png"));
}

console.log(`\n✓ ${TOTAL_FRAMES} frames em ${FRAMES_DIR}\n`);

// Codificar
const BASE = process.cwd();
const OUTPUT = path.join(BASE, "video_separelo.mp4");
const AUDIO = path.join(BASE, "audio", "narracao_26s.mp3");

console.log("Codificando com ffmpeg...");
try {
  execSync(
    `ffmpeg -y -framerate ${FPS} -i ${FRAMES_DIR}/frame-%d.png -i ${AUDIO} ` +
    `-c:v libx264 -pix_fmt yuv420p -crf 20 -preset medium -c:a aac -b:a 192k -shortest ${OUTPUT}`,
    { stdio: "inherit", timeout: 300000 }
  );
  console.log(`\n✓ Vídeo: ${OUTPUT}\n`);
  console.log("Detalhes:");
  execSync(`ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1:nokey=1 ${OUTPUT}`, { stdio: "inherit" });
} catch(e) {
  console.error("Erro:", e.message);
  process.exit(1);
}
