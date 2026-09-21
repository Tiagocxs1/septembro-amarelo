import { renderVideo, serveComposition } from "remotion";
import { SeptemAmareloComposition } from "./src/index.ts";
import { SeptemAmarelo } from "./src/Composition.tsx";

const OUTPUT = "/home/tiago/septembro-amarelo/video_separelo.mp4";
const AUDIO = "/home/tiago/septembro-amarelo/audio/narracao_26s.mp3";

async function main() {
  console.log("=== Septembro Amarelo — Renderização ===\n");

  // Render using the Remotion API
  const result = await renderVideo({
    composition: SeptemAmarelo,
   serveUrl: await serveComposition(SeptemAmareloComposition),
    outputLocation: OUTPUT,
    codec: "libx264",
    audio: {
      enabled: true,
      audioLayout: {
        audioTrack: {
          streams: [
            {
              streamIndex: 0,
              sampleRate: 48000,
              channelLayout: "mono",
            },
          ],
        },
      },
      ffmpegLocation: "/usr/bin/ffmpeg",
    },
    frames: {
      ffmpegLocation: "/usr/bin/ffmpeg",
    },
  });

  console.log("\n=== Renderização concluída ===");
  console.log("Vídeo:", OUTPUT);
}

main().catch(console.error);
