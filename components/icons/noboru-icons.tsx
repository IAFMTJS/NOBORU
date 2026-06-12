import type { ReactElement, SVGProps } from "react";

export type NoboruIconProps = SVGProps<SVGSVGElement>;

const ICON_DEFAULTS = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Base camp — home expedition hub */
export function NoboruHomeIcon(props: NoboruIconProps) {
  return (
    <svg {...ICON_DEFAULTS} {...props}>
      <path d="M4 20h16" />
      <path d="M6 20V11l6-7 6 7v9" />
      <path d="M9 20v-5h6v5" />
      <path d="M12 4v2" />
    </svg>
  );
}

/** Trail ascent — learning path */
export function NoboruLearnIcon(props: NoboruIconProps) {
  return (
    <svg {...ICON_DEFAULTS} {...props}>
      <path d="M4 19c3-6 5-9 8-12 3 3 5 6 8 12" />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15" cy="16" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Training loop — spaced repetition */
export function NoboruReviewIcon(props: NoboruIconProps) {
  return (
    <svg {...ICON_DEFAULTS} {...props}>
      <path d="M12 6v-2" />
      <path d="M12 20v-2" />
      <path d="M6 12H4" />
      <path d="M20 12h-2" />
      <rect x="8" y="8" width="8" height="8" rx="1.5" />
      <path d="M16 4.5a7 7 0 0 1 2.8 11.2" />
      <path d="M8 19.5a7 7 0 0 1-2.8-11.2" />
    </svg>
  );
}

/** Trials — educational challenges */
export function NoboruGamesIcon(props: NoboruIconProps) {
  return (
    <svg {...ICON_DEFAULTS} {...props}>
      <path d="M5 9h14v10H5z" />
      <path d="M8 9V6a4 4 0 0 1 8 0v3" />
      <path d="M12 13v3" />
      <path d="M10.5 14.5h3" />
    </svg>
  );
}

/** Compass — explore hub */
export function NoboruExploreIcon(props: NoboruIconProps) {
  return (
    <svg {...ICON_DEFAULTS} {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v2" />
      <path d="M12 18v2" />
      <path d="M4 12h2" />
      <path d="M18 12h2" />
      <path d="M12 8l2.5 4.5-4.5 1.5 2-6z" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Fellow climbers — community */
export function NoboruCommunityIcon(props: NoboruIconProps) {
  return (
    <svg {...ICON_DEFAULTS} {...props}>
      <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M16 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
      <path d="M4 20v-1a4 4 0 0 1 4-4h0" />
      <path d="M14 20v-1a3 3 0 0 1 3-3h1" />
      <path d="M12 4l1 2 2 .3-1.5 1.4.4 2.1-2-1.1-2 1.1.4-2.1L9 6.3 11 6z" />
    </svg>
  );
}

/** Climber identity — profile */
export function NoboruProfileIcon(props: NoboruIconProps) {
  return (
    <svg {...ICON_DEFAULTS} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20v-1a7 7 0 0 1 14 0v1" />
      <path d="M16 4.5l1.5 1.2L16 7" />
    </svg>
  );
}

export type NoboruIconComponent = (props: NoboruIconProps) => ReactElement;
