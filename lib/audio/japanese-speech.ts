import { isIosDevice } from "@/lib/audio/device-capabilities";

const JAPANESE_VOICE_NAME_PATTERN =
  /kyoko|otoya|nanami|maiori|sakura|com\.apple\.(vocal|ttsbundle)\.ja-JP/i;

let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null;

export function selectJapaneseVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) return undefined;

  const ranked = [
    ...voices.filter(
      (voice) =>
        voice.lang === "ja-JP" && JAPANESE_VOICE_NAME_PATTERN.test(voice.name),
    ),
    ...voices.filter((voice) => voice.lang === "ja-JP"),
    ...voices.filter((voice) => voice.lang.startsWith("ja")),
  ];

  return ranked[0];
}

export function preloadJapaneseSpeechVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return Promise.resolve([]);
  }

  if (!voicesReady) {
    voicesReady = new Promise((resolve) => {
      const synth = window.speechSynthesis;

      const resolveVoices = () => {
        resolve(synth.getVoices());
      };

      const tryCollect = () => {
        const voices = synth.getVoices();
        if (voices.length > 0) {
          resolve(voices);
          return true;
        }
        return false;
      };

      if (tryCollect()) return;

      const handleVoicesChanged = () => {
        if (tryCollect()) {
          synth.removeEventListener("voiceschanged", handleVoicesChanged);
        }
      };

      synth.addEventListener("voiceschanged", handleVoicesChanged);

      window.setTimeout(() => {
        synth.removeEventListener("voiceschanged", handleVoicesChanged);
        resolveVoices();
      }, isIosDevice() ? 750 : 300);
    });
  }

  return voicesReady;
}

export function isJapaneseSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export async function speakJapanese(text: string): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  if (!isJapaneseSpeechSupported()) {
    throw new Error("Speech synthesis is unavailable");
  }

  const synth = window.speechSynthesis;
  const voices = await preloadJapaneseSpeechVoices();
  const voice = selectJapaneseVoice(voices);

  return new Promise((resolve, reject) => {
    synth.cancel();

    if (synth.paused) {
      synth.resume();
    }

    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.lang = "ja-JP";
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = 0.95;

    let keepAliveId: number | null = null;

    const cleanup = () => {
      if (keepAliveId !== null) {
        window.clearInterval(keepAliveId);
        keepAliveId = null;
      }
    };

    utterance.onstart = () => {
      if (isIosDevice() && trimmed.length > 40) {
        keepAliveId = window.setInterval(() => {
          if (!synth.speaking) {
            cleanup();
            return;
          }
          synth.pause();
          synth.resume();
        }, 8000);
      }
    };

    utterance.onend = () => {
      cleanup();
      resolve();
    };

    utterance.onerror = (event) => {
      cleanup();
      reject(new Error(event.error ?? "speech-synthesis-failed"));
    };

    synth.speak(utterance);
  });
}
