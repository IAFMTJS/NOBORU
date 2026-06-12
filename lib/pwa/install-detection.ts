import {
  isIosSafariBrowser,
  isStandalonePwa,
} from "@/lib/audio/device-capabilities";

export function shouldShowIosInstallPrompt(): boolean {
  return isIosSafariBrowser() && !isStandalonePwa();
}

export function shouldShowNativeInstallPrompt(
  hasDeferredPrompt: boolean,
): boolean {
  return hasDeferredPrompt && !isStandalonePwa();
}

export { isStandalonePwa, isIosSafariBrowser };
