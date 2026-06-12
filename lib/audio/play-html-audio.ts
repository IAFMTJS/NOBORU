import { isIosDevice } from "@/lib/audio/device-capabilities";

export function configureHtmlAudioElement(audio: HTMLAudioElement): void {
  audio.setAttribute("playsinline", "");
  audio.setAttribute("webkit-playsinline", "true");
  audio.preload = "auto";
}

export async function playHtmlAudio(audio: HTMLAudioElement): Promise<void> {
  configureHtmlAudioElement(audio);
  audio.currentTime = 0;

  try {
    await audio.play();
  } catch (error) {
    if (isIosDevice() && audio.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      await new Promise<void>((resolve, reject) => {
        const handleReady = () => {
          audio.removeEventListener("canplaythrough", handleReady);
          audio.removeEventListener("error", handleError);
          resolve();
        };
        const handleError = () => {
          audio.removeEventListener("canplaythrough", handleReady);
          audio.removeEventListener("error", handleError);
          reject(new Error("audio-load-failed"));
        };
        audio.addEventListener("canplaythrough", handleReady, { once: true });
        audio.addEventListener("error", handleError, { once: true });
        audio.load();
      });
      await audio.play();
      return;
    }

    throw error;
  }
}
