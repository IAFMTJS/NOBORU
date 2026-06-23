const SPLASH_LINKS = [
  {
    href: "/icons/splash/splash_iphone-se_dark_v1.png",
    media:
      "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    href: "/icons/splash/splash_iphone-15_dark_v1.png",
    media:
      "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    href: "/icons/splash/splash_iphone-15-pro-max_dark_v1.png",
    media:
      "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
] as const;

export function PwaSplashLinks() {
  return (
    <>
      {SPLASH_LINKS.map((link) => (
        <link
          key={link.href}
          rel="apple-touch-startup-image"
          href={link.href}
          media={link.media}
        />
      ))}
    </>
  );
}
