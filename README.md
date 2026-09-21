# Septembro Amarelo — Vídeo Informativo

Vídeo informativo sobre saúde mental e prevenção do suicídio em Santa Catarina.

## Especificações

| Parâmetro | Valor |
|-----------|-------|
| Resolução | 1080×1920 (portrait) |
| Duração | 30 segundos |
| FPS | 30 |
| Total de frames | 900 |
| Formato | MP4 (H.264 + AAC) |
| Áudio | narracao_30s.mp3 (24kHz, mono, 64kbps) |

## Cenas (30s total)

| # | Cena | Duração | Conteúdo |
|---|------|---------|----------|
| 01 | Abertura | 5s | Título "SETEMBRO AMARELO" + tagline |
| 02 | Dados SC | 7s | Santa Catarina, 1034 óbitos, +61% |
| 03 | Gênero | 6s | Homens 76-78%, Mulheres 22-24% |
| 04 | Mensagem | 5s | "Escutar é estar presente" |
| 05 | Recursos | 5s | CVV 188, UBS/CAPS, APAE, Unimed |
| 06 | Fechamento | 2s | #SetembroAmareloSC + CVV 188 |

## Como Renderizar

### Localmente

```bash
# Instalar dependências
npm install

# Renderizar (requer ffmpeg instalado)
npm run render
```

O vídeo será salvo como `video_separelo.mp4`.

### Via GitHub Actions

1. Fazer push das alterações no branch `main`
2. O workflow `render.yml` dispara automaticamente
3. O vídeo fica disponível como artefato na action

Ou disparar manualmente:
```bash
gh workflow run render.yml
```

### Pré-requisitos do Sistema

- Node.js >= 20
- npm
- ffmpeg (para codificação do vídeo)
- build-essential, libcairo2-dev, libpango1.0-dev, libjpeg-dev, libgif-dev, librsvg2-dev (para canvas)

## Design System

Veja `design-tokens.js` para os tokens de design utilizados:
- Paleta de cores
- Grid 8pt
- Escala tipográfica modular (ratio 1.25)
- Letter-spacing para caixa alta
- Durações e timing de animações

## Estrutura do Projeto

```
septembro-amarelo/
├── .github/
│   └── workflows/
│       └── render.yml        # GitHub Actions
├── audio/
│   ├── narracao_30s.mp3     # Áudio de narração (30s)
│   ├── narracao_26s.mp3     # Versão anterior
│   └── scene*.mp3           # Áudios por cena (para referência)
├── video-engine/
│   └── src/
│       └── Composition.tsx  # Composição Remotion
├── design-tokens.js          # Tokens de design
├── generate_narration.py     # Script de geração de narração (edge-tts)
├── package.json
├── render.cjs                # Script de renderização (canvas + ffmpeg)
└── render.mjs                # Entry point Remotion
```

## Desenvolvimento

Para modificar o vídeo:

1. **Alterar conteúdo das cenas**: editar `render.cjs` — cada função `renderSceneXX` representa uma cena
2. **Alterar design tokens**: editar `design-tokens.js`
3. **Gerar nova narração**: editar `generate_narration.py` e executar `python3 generate_narration.py`
4. **Alterar timing**: editar `SCENE_DURATIONS` e `TIMING` em `design-tokens.js`

## Licença

Projetos de conscientização sobre saúde mental — uso livre para divulgação.
