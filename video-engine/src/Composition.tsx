import {
  Composition,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  interpolate,
  Spring,
  Easing,
} from "remotion";

const YELLOW_PRIMARY = "#FFCF00";
const YELLOW_DEEP = "#E6B800";
const TEXT_DARK = "#2D2D2D";
const TEXT_SOFT = "#5A5A5A";
const WHITE = "#FFFFFF";

const fps = 30;

// --- Utilidades ---

function grainOverlay({ intensity }: { intensity: number }) {
  return (
    <AbsoluteFill
      style={{
       opacity: intensity,
        background: "transparent",
        mixBlendMode: "multiply" as const,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="none">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.4"/>
      </svg>
    </AbsoluteFill>
  );
}

function fadeIn(delay: number, duration: number) {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const opacity = interpolate(
    frame,
    [delay * fps, (delay + duration) * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );
  return opacity;
}

// --- Cena 01: Abertura ---

function Scene01({ delay = 0 }: { delay?: number }) {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  const titleOpacity = interpolate(
    frame,
    [0.5 * fps, 2.5 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  const taglineOpacity = interpolate(
    frame,
    [2.0 * fps, 4.0 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: YELLOW_PRIMARY,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <grainOverlay intensity={0.12} />
      <div style={{
        position: "absolute",
        top: "18%",
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: titleOpacity,
      }}>
        <h1 style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 72,
          fontWeight: 700,
          color: TEXT_DARK,
          margin: 0,
          letterSpacing: "-0.02em",
        }}>
          SETEMBRO AMARELO
        </h1>
      </div>
      <div style={{
        position: "absolute",
        bottom: "22%",
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: taglineOpacity,
      }}>
        <p style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 34,
          fontWeight: 400,
          color: TEXT_SOFT,
          margin: 0,
        }}>
          Escutar é estar presente
        </p>
      </div>
    </AbsoluteFill>
  );
}

// --- Cena 02: Dados SC ---

function Scene02({ delay = 0 }: { delay?: number }) {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  const sceneFade = interpolate(
    frame,
    [0, 0.5 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  const titleOpacity = interpolate(
    frame,
    [0.5 * fps, 2.0 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  const numberOpacity = interpolate(
    frame,
    [0.8 * fps, 4.0 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  // Count-up: 642 → 1034 em 3 segundos
  const countupStart = 0.8;
  const countupEnd = 3.8;
  const currentFrameInCountup = Math.max(0, frame - countupStart * fps);
  const durationFrames = (countupEnd - countupStart) * fps;
  const progress = Math.min(1, currentFrameInCountup / durationFrames);
  const currentValue = Math.round(642 + (1034 - 642) * progress);

  const subOpacity = interpolate(
    frame,
    [2.5 * fps, 4.0 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  const percentOpacity = interpolate(
    frame,
    [1.0 * fps, 2.5 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: YELLOW_PRIMARY,
        opacity: sceneFade,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <grainOverlay intensity={0.10} />
      <div style={{
        position: "absolute",
        top: "8%",
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: titleOpacity,
      }}>
        <h2 style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 42,
          fontWeight: 600,
          color: TEXT_DARK,
          margin: 0,
        }}>
          Santa Catarina
        </h2>
      </div>
      <div style={{
        position: "absolute",
        top: "38%",
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: numberOpacity,
      }}>
        <span style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 110,
          fontWeight: 800,
          color: TEXT_DARK,
          lineHeight: 1,
        }}>
          {currentValue}
        </span>
        <br />
        <span style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 24,
          fontWeight: 400,
          color: TEXT_SOFT,
          marginTop: 8,
        }}>
          óbitos em 2025
        </span>
      </div>
      <div style={{
        position: "absolute",
        top: "58%",
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: subOpacity,
      }}>
        <p style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 24,
          fontWeight: 400,
          color: TEXT_SOFT,
          margin: 0,
        }}>
          9.280 mortes nos últimos 11 anos
        </p>
      </div>
      <div style={{
        position: "absolute",
        top: "38%",
        right: "8%",
        textAlign: "right",
        opacity: percentOpacity,
      }}>
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 40,
          fontWeight: 700,
          color: TEXT_DARK,
        }}>
          +61%
        </div>
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 18,
          fontWeight: 400,
          color: TEXT_SOFT,
          marginTop: 4,
        }}>
          vs 2015 (642)
        </div>
      </div>
    </AbsoluteFill>
  );
}

// --- Cena 03: Gênero ---

function Scene03({ delay = 0 }: { delay?: number }) {
  const frame = useCurrentFrame();

  const sceneFade = interpolate(
    frame,
    [0, 0.5 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  const homensOpacity = interpolate(
    frame,
    [0.5 * fps, 1.8 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  const mulheresOpacity = interpolate(
    frame,
    [1.0 * fps, 2.3 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  const calloutOpacity = interpolate(
    frame,
    [2.5 * fps, 4.0 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: YELLOW_PRIMARY,
        opacity: sceneFade,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row" as const,
      }}
    >
      <grainOverlay intensity={0.08} />
      <div style={{
        position: "absolute",
        left: "12%",
        top: "28%",
        textAlign: "center",
        opacity: homensOpacity,
      }}>
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 56,
          fontWeight: 800,
          color: TEXT_DARK,
        }}>
          Homens
        </div>
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 44,
          fontWeight: 700,
          color: TEXT_DARK,
          marginTop: 8,
        }}>
          76–78%
        </div>
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 20,
          fontWeight: 400,
          color: TEXT_SOFT,
          marginTop: 4,
        }}>
          dos óbitos
        </div>
      </div>
      <div style={{
        position: "absolute",
        right: "12%",
        top: "38%",
        textAlign: "center",
        opacity: mulheresOpacity,
      }}>
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 30,
          fontWeight: 400,
          color: TEXT_SOFT,
        }}>
          Mulheres
        </div>
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 24,
          fontWeight: 400,
          color: TEXT_SOFT,
          marginTop: 6,
        }}>
          22–24% dos óbitos
        </div>
      </div>
      <div style={{
        position: "absolute",
        bottom: "12%",
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: calloutOpacity,
      }}>
        <p style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 22,
          fontWeight: 400,
          color: TEXT_SOFT,
          margin: 0,
          maxWidth: "80%",
          lineHeight: 1.5,
        }}>
          Mas as mulheres registram mais tentativas — cerca de 65% dos casos notificados
        </p>
      </div>
    </AbsoluteFill>
  );
}

// --- Cena 04: Mensagem ---

function Scene04({ delay = 0 }: { delay?: number }) {
  const frame = useCurrentFrame();

  const sceneFade = interpolate(
    frame,
    [0, 0.5 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  // Word-by-word reveal
  const words = ["Escutar", "é", "estar", "presente."];
  const wordDuration = 0.8;
  const currentWordIndex = Math.min(
    words.length - 1,
    Math.floor(frame / (wordDuration * fps)),
  );

  const wordOpacity = interpolate(
    frame,
    [currentWordIndex * wordDuration * fps, (currentWordIndex + 0.5) * wordDuration * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: YELLOW_DEEP,
        opacity: sceneFade,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <grainOverlay intensity={0.10} />
      <div style={{
        position: "absolute",
        top: "10%",
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: wordOpacity,
      }}>
        <h2 style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 68,
          fontWeight: 600,
          color: TEXT_DARK,
          margin: 0,
          lineHeight: 1.3,
        }}>
          {words.slice(0, currentWordIndex + 1).join(" ")}
        </h2>
      </div>
    </AbsoluteFill>
  );
}

// --- Cena 05: Recursos ---

function Scene05({ delay = 0 }: { delay?: number }) {
  const frame = useCurrentFrame();

  const sceneFade = interpolate(
    frame,
    [0, 0.5 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  const titleOpacity = interpolate(
    frame,
    [0.2 * fps, 1.2 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  const cvvCardScale = Spring({
    frame,
    from: 0.85,
    to: 1,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const cvvCardOpacity = interpolate(
    frame,
    [0.5 * fps, 1.5 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  const ubsOpacity = interpolate(
    frame,
    [1.2 * fps, 2.5 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  const instituicoesOpacity = interpolate(
    frame,
    [2.0 * fps, 3.5 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: YELLOW_PRIMARY,
        opacity: sceneFade,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <grainOverlay intensity={0.10} />
      <div style={{
        position: "absolute",
        top: "6%",
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: titleOpacity,
        fontSize: 36,
        fontFamily: "system-ui, sans-serif",
        fontWeight: 600,
        color: TEXT_DARK,
      }}>
        Florianópolis
      </div>
      <div style={{
        position: "absolute",
        top: "40%",
        left: "8%",
        right: "8%",
        textAlign: "center",
        transform: `scale(${cvvCardScale})`,
        opacity: cvvCardOpacity,
      }}>
        <div style={{
          border: `2px solid ${TEXT_DARK}`,
          borderRadius: 12,
          padding: "24px 40px",
          background: "rgba(255,255,255,0.25)",
          display: "inline-block",
        }}>
          <div style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 30,
            fontWeight: 400,
            color: TEXT_SOFT,
            marginBottom: 8,
          }}>
            CVV — Centro de Valorização da Vida
          </div>
          <div style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: TEXT_DARK,
          }}>
            Ligue 188
          </div>
          <div style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 20,
            fontWeight: 400,
            color: TEXT_SOFT,
            marginTop: 6,
          }}>
            Gratuito · 24 horas
          </div>
        </div>
      </div>
      <div style={{
        position: "absolute",
        top: "65%",
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: ubsOpacity,
        fontSize: 24,
        fontFamily: "system-ui, sans-serif",
        fontWeight: 400,
        color: TEXT_SOFT,
      }}>
        UBS e CAPS — atendimento pelo SUS
      </div>
      <div style={{
        position: "absolute",
        top: "74%",
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: instituicoesOpacity,
        fontSize: 20,
        fontFamily: "system-ui, sans-serif",
        fontWeight: 400,
        color: TEXT_SOFT,
      }}>
        APAE Florianópolis · Unimed Grande Floripa
      </div>
    </AbsoluteFill>
  );
}

// --- Cena 06: Fechamento ---

function Scene06({ delay = 0 }: { delay?: number }) {
  const frame = useCurrentFrame();

  const sceneFade = interpolate(
    frame,
    [0, 0.5 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  const hashtagOpacity = interpolate(
    frame,
    [0.3 * fps, 1.3 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  const cvvBannerOpacity = interpolate(
    frame,
    [0.5 * fps, 1.5 * fps],
    [0, 1],
    Easing.out(Easing.ease),
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: YELLOW_PRIMARY,
        opacity: sceneFade,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <grainOverlay intensity={0.12} />
      <div style={{
        position: "absolute",
        top: "32%",
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: hashtagOpacity,
        fontSize: 36,
        fontFamily: "system-ui, sans-serif",
        fontWeight: 500,
        color: TEXT_DARK,
      }}>
        #SetembroAmareloSC
      </div>
      <div style={{
        position: "absolute",
        bottom: "20%",
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: cvvBannerOpacity,
        fontSize: 28,
        fontFamily: "system-ui, sans-serif",
        fontWeight: 600,
        color: TEXT_DARK,
        border: `2px solid ${TEXT_DARK}`,
        borderRadius: 8,
        padding: "10px 24px",
        display: "inline-block",
      }}>
        CVV 188 — Ligue agora
      </div>
    </AbsoluteFill>
  );
}

// --- Composição Principal ---

const SCENE_DURATIONS = [5, 7, 6, 5, 5, 2];
const TOTAL_DURATION = SCENE_DURATIONS.reduce((a, b) => a + b, 0);

function SeptemAmarelo() {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  const totalFrames = TOTAL_DURATION * fps;
  const progress = frame / totalFrames;

  // Determina qual cena está ativa
  let accumulated = 0;
  let activeSceneIndex = 0;
  for (let i = 0; i < SCENE_DURATIONS.length; i++) {
    if (frame < (accumulated + SCENE_DURATIONS[i]) * fps) {
      activeSceneIndex = i;
      break;
    }
    accumulated += SCENE_DURATIONS[i];
  }

  const sceneDelay = accumulated;

  const sceneFadeOut = interpolate(
    frame,
    [(accumulated + SCENE_DURATIONS[activeSceneIndex] - 0.4) * fps, (accumulated + SCENE_DURATIONS[activeSceneIndex]) * fps],
    [1, 0],
    Easing.in(Easing.ease),
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: YELLOW_PRIMARY,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ opacity: sceneFadeOut }}>
        {activeSceneIndex === 0 && <Scene01 delay={sceneDelay} />}
        {activeSceneIndex === 1 && <Scene02 delay={sceneDelay} />}
        {activeSceneIndex === 2 && <Scene03 delay={sceneDelay} />}
        {activeSceneIndex === 3 && <Scene04 delay={sceneDelay} />}
        {activeSceneIndex === 4 && <Scene05 delay={sceneDelay} />}
        {activeSceneIndex === 5 && <Scene06 delay={sceneDelay} />}
      </div>
    </AbsoluteFill>
  );
}

export { SeptemAmarelo };
export const SeptemAmareloComposition = () => (
  <Composition
    id="SeptemAmarelo"
    component={SeptemAmarelo}
    durationInFrames={TOTAL_DURATION * fps}
    fps={fps}
    width={1080}
    height={1920}
    name="Setembro Amarelo SC"
  />
);
