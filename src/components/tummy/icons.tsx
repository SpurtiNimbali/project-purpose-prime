import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function Base({ children, ...p }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={24}
      height={24}
      {...p}
    >
      {children}
    </svg>
  );
}

export const IconHome = (p: P) => (
  <Base {...p}>
    <path d="M3.5 10.5 12 4l8.5 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-3.5V14h-7v6.5H5A1.5 1.5 0 0 1 3.5 19z" />
  </Base>
);

export const IconBook = (p: P) => (
  <Base {...p}>
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2.5 2.5 0 0 1 2 1 2.5 2.5 0 0 1 2-1h4.5A1.5 1.5 0 0 1 20 5.5V17a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 0 0-2 1.5 2 2 0 0 0-2-1.5H5.5A1.5 1.5 0 0 1 4 17z" />
    <path d="M12 5v14" />
  </Base>
);

export const IconChart = (p: P) => (
  <Base {...p}>
    <path d="M4 20h16" />
    <path d="M7 20v-6M12 20V7M17 20v-9" />
  </Base>
);

export const IconUser = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c.7-3.6 3.5-5.5 7-5.5s6.3 1.9 7 5.5" />
  </Base>
);

export const IconMic = (p: P) => (
  <Base {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
  </Base>
);

export const IconArrowLeft = (p: P) => (
  <Base {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Base>
);

export const IconArrowRight = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);

export const IconCheck = (p: P) => (
  <Base {...p}>
    <path d="M4.5 12.5 9.5 17.5 19.5 6.5" strokeWidth={2.4} />
  </Base>
);

export const IconClock = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Base>
);

export const IconMoon = (p: P) => (
  <Base {...p}>
    <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2" />
  </Base>
);

export const IconDroplet = (p: P) => (
  <Base {...p}>
    <path d="M12 3.5c3.2 3.6 5.5 6.3 5.5 9.1A5.5 5.5 0 0 1 6.5 12.6C6.5 9.8 8.8 7.1 12 3.5z" />
  </Base>
);

export const IconBowl = (p: P) => (
  <Base {...p}>
    <path d="M3.5 11h17a8.5 8.5 0 0 1-8.5 8 8.5 8.5 0 0 1-8.5-8z" />
    <path d="M9 7.5c0-1 1-1.4 1-2.5M13.5 7.5c0-1 1-1.4 1-2.5" />
  </Base>
);

export const IconToilet = (p: P) => (
  <Base {...p}>
    <path d="M6 4v7M6 11h12a6 6 0 0 1-3.4 5.4L14 20h-4l-.6-3.6A6 6 0 0 1 6 11z" />
    <path d="M6 7h4" />
  </Base>
);

export const IconRun = (p: P) => (
  <Base {...p}>
    <circle cx="15" cy="4.8" r="2" />
    <path d="M8 20l2.6-4.4L8.5 13l.8-4.2L13 7l2.5 3 3 1" />
    <path d="M10.6 15.6 14 17l1.5 3" />
    <path d="M9.3 8.8 6 10" />
  </Base>
);

export const IconPhone = (p: P) => (
  <Base {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M10.5 5.5h3" />
  </Base>
);

export const IconAlert = (p: P) => (
  <Base {...p}>
    <path d="M12 4.5 21 19.5H3z" />
    <path d="M12 10v4M12 17h.01" />
  </Base>
);

export const IconShield = (p: P) => (
  <Base {...p}>
    <path d="M12 3.5 19 6v6c0 4.2-2.8 7.2-7 8.5-4.2-1.3-7-4.3-7-8.5V6z" />
    <path d="M9 12.2l2.1 2.1L15.2 10" />
  </Base>
);

export const IconPlay = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M10.5 9.2 15 12l-4.5 2.8z" />
  </Base>
);

export const IconCamera = (p: P) => (
  <Base {...p}>
    <path d="M3.5 8.5h3l1.5-2.5h8L17.5 8.5h3v10h-17z" />
    <circle cx="12" cy="13" r="3.2" />
  </Base>
);

export const IconSun = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
  </Base>
);

export const IconSunset = (p: P) => (
  <Base {...p}>
    <path d="M4 18h16M7.5 18a4.5 4.5 0 0 1 9 0" />
    <path d="M12 3.5v3M5.2 8.2 7 10M18.8 8.2 17 10" />
  </Base>
);

export const IconWave = (p: P) => (
  <Base {...p}>
    <path d="M3 13c1.5-3 3-3 4.5 0S10.5 16 12 13s3-3 4.5 0 3 3 4.5 0" />
  </Base>
);

export const IconBalloon = (p: P) => (
  <Base {...p}>
    <ellipse cx="12" cy="9.5" rx="5.5" ry="6.5" />
    <path d="M12 16v2.5M10.6 21c0-1.4 2.8-1.4 2.8-2.5" />
  </Base>
);

export const IconBolt = (p: P) => (
  <Base {...p}>
    <path d="M13.5 3 6 13h5l-1 8 8-10.5h-5z" />
  </Base>
);

export const IconSpiral = (p: P) => (
  <Base {...p}>
    <path d="M12 12a2 2 0 1 1 2 2 3.5 3.5 0 0 1-3.5-3.5 5.5 5.5 0 0 1 9.4-3.9" />
    <path d="M12 12a2 2 0 1 0-2-2 3.5 3.5 0 0 0 3.5 3.5 5.5 5.5 0 0 0 3.9-9.4" opacity=".4" />
  </Base>
);

export const IconDizzy = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8 9.5l2 2M10 9.5l-2 2M14 9.5l2 2M16 9.5l-2 2M9 16c1.8-1.4 4.2-1.4 6 0" />
  </Base>
);

export const IconWind = (p: P) => (
  <Base {...p}>
    <path d="M3 9h9a2.5 2.5 0 1 0-2.5-2.5M3 14h13a2.5 2.5 0 1 1-2.5 2.5" />
  </Base>
);

export const IconX = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);

export const IconLock = (p: P) => (
  <Base {...p}>
    <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
  </Base>
);

export const IconSend = (p: P) => (
  <Base {...p}>
    <path d="M4 12 20 5l-7 15-2.2-6z" />
  </Base>
);

export const IconChat = (p: P) => (
  <Base {...p}>
    <path d="M20.5 12.5c0 3.9-3.8 7-8.5 7-1 0-2-.15-2.9-.42L4 20.5l1.5-3.6C4.2 15.7 3.5 14.2 3.5 12.5c0-3.9 3.8-7 8.5-7s8.5 3.1 8.5 7Z" />
  </Base>
);

export const IconPlus = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);

export const IconList = (p: P) => (
  <Base {...p}>
    <path d="M8.5 7h11M8.5 12h11M8.5 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01" />
  </Base>
);

/** Navel with a measured offset to the placement point (right and down). */
export const IconNavelPoint = (p: P) => (
  <Base {...p}>
    <circle cx="8" cy="8" r="2.6" />
    <path d="M8 8v0" />
    <path d="M8 8h8" strokeDasharray="2 2" opacity=".55" />
    <path d="M16 8v7" strokeDasharray="2 2" opacity=".55" />
    <circle cx="16" cy="16" r="3.2" />
    <path d="M16 14.6v2.8" />
  </Base>
);

/** Snowflake — freeze day. */
export const IconSnowflake = (p: P) => (
  <Base {...p}>
    <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
    <path d="M12 6.4 9.9 4.6M12 6.4l2.1-1.8M12 17.6l-2.1 1.8M12 17.6l2.1 1.8" />
    <path d="m6.6 9 .3-2.7M6.6 9 4 9.6M17.4 15l-.3 2.7M17.4 15l2.6-.6" />
    <path d="m17.4 9 2.6.6M17.4 9l-.3-2.7M6.6 15 4 14.4M6.6 15l.3 2.7" />
  </Base>
);
