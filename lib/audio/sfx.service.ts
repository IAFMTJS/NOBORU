type SfxName = "tap" | "success" | "error" | "reward" | "chest_open";

const SFX_PATHS: Record<SfxName, string> = {
  tap: "/audio/sfx/tap.mp3",
  success: "/audio/sfx/success.mp3",
  error: "/audio/sfx/error.mp3",
  reward: "/audio/sfx/reward.mp3",
  chest_open: "/audio/sfx/chest_open.mp3",
};

class SfxService {
  private cache = new Map<SfxName, HTMLAudioElement>();
  private enabled = true;

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private getAudio(name: SfxName): HTMLAudioElement | null {
    if (typeof window === "undefined") return null;

    let audio = this.cache.get(name);
    if (!audio) {
      audio = new Audio(SFX_PATHS[name]);
      audio.volume = 0.4;
      this.cache.set(name, audio);
    }
    return audio;
  }

  play(name: SfxName): void {
    if (!this.enabled || typeof window === "undefined") return;

    const audio = this.getAudio(name);
    if (!audio) return;

    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Autoplay blocked — silent fail
    });
  }
}

export const sfxService = new SfxService();
