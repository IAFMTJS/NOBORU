export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isIosDevice(): boolean {
  if (!isBrowser()) return false;
  return (
    /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
    (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1)
  );
}

export function isStandalonePwa(): boolean {
  if (!isBrowser()) return false;

  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export function isIosSafariBrowser(): boolean {
  if (!isBrowser() || !isIosDevice()) return false;
  const ua = window.navigator.userAgent;
  return /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
}
