#!/usr/bin/env python3
"""
Gera narração para Septembro Amarelo — 30s exatos, sincronizada com cenas.
Voz: pt-BR-FranciscaNeural
"""

import asyncio
import edge_tts
import subprocess
import os

# Textos otimizados para duração realista com FranciscaNeural
# (ritmo mais devagar que Inacio)
CENAS = [
    (0, 5,  "Setembro Amarelo. Conversar sobre saúde mental."),
    (5, 7,  "Santa Catarina: mil e trinta e quatro óbitos em vinte e cinco. Nove mil em onze anos."),
    (12, 6, "Homens: sete e oito por cento dos óbitos. As mulheres, mais tentativas: sessenta e cinco por cento."),
    (18, 5, "Escutar... é... estar... presente."),
    (23, 5, "CVV: um oitenta e oito. Gratuito, vinte e quatro horas. UBS e CAPS ajudam."),
    (28, 2, "Setembro Amarelo. CVV um oitenta e oito."),
]

OUTPUT_DIR = "/home/tiago/septembro-amarelo/audio"
NARRACAO_FILE = os.path.join(OUTPUT_DIR, "narracao_30s.mp3")
VOICE = "pt-BR-FranciscaNeural"


async def generate_scene(text: str, output_path: str):
    comm = edge_tts.Communicate(text, VOICE)
    await comm.save(output_path)
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", output_path],
        capture_output=True, text=True
    )
    return float(result.stdout.strip())


def concat_mp3(files: list[str], output: str):
    with open("/tmp/concat_narration.txt", "w") as f:
        for fp in files:
            f.write(f"file '{fp}'\n")
    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0",
         "-i", "/tmp/concat_narration.txt", "-c", "copy", output],
        check=True, capture_output=True
    )


def adjust_duration(input_file: str, target: float, output_file: str):
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", input_file],
        capture_output=True, text=True
    )
    current = float(result.stdout.strip())
    rate = current / target  # >1 acelera, <1 desacelera
    print(f"  Ajuste: {current:.2f}s → {target}s (atempo={rate:.4f}x)")
    subprocess.run(
        ["ffmpeg", "-y", "-i", input_file,
         "-filter:a", f"atempo={rate}",
         "-acodec", "libmp3lame", "-q:a", "2",
         output_file],
        check=True, capture_output=True
    )


async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("=== Narração Septembro Amarelo ===")
    print(f"Voz: {VOICE}\n")

    scene_files = []
    total = 0

    for i, (start, dur, text) in enumerate(CENAS):
        out = os.path.join(OUTPUT_DIR, f"scene_new_{i+1:02d}.mp3")
        print(f"Cena {i+1} (t={start}s, {dur}s): {text}")
        real = await generate_scene(text, out)
        print(f"  → {real:.2f}s\n")
        scene_files.append(out)
        total += real

    print(f"Total: {total:.2f}s (alvo: 30.00s)")

    print("\nConcatenando...")
    concat_mp3(scene_files, NARRACAO_FILE)

    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", NARRACAO_FILE],
        capture_output=True, text=True
    )
    current = float(result.stdout.strip())
    print(f"Após concat: {current:.2f}s")

    if abs(current - 30.0) > 0.3:
        print(f"\nAjustando para 30s...")
        tmp = NARRACAO_FILE + ".tmp.mp3"
        adjust_duration(NARRACAO_FILE, 30.0, tmp)
        os.replace(tmp, NARRACAO_FILE)

    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", NARRACAO_FILE],
        capture_output=True, text=True
    )
    print(f"\n✅ {float(result.stdout.strip()):.2f}s → {NARRACAO_FILE}")


if __name__ == "__main__":
    asyncio.run(main())
