import { createFileRoute } from "@tanstack/react-router";
import borbyWave from "@/assets/borby-wave.png";
import borbyMeditate from "@/assets/borby-meditate.png";
import borbySleep from "@/assets/borby-sleep.png";
import borbyHop from "@/assets/borby-hop.png";
import borbyFire from "@/assets/borby-fire.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Borby — Gut sound study app" },
      {
        name: "description",
        content:
          "A warm, calm mobile app for the Stanford gut sound study. One week, four short recordings a day — your phone is the whole device.",
      },
      { property: "og:title", content: "Borby — Gut sound study app" },
      {
        property: "og:description",
        content:
          "Warm, encouraging clinical research app design featuring Borby, the coiled-intestine mascot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ---------- Reusable primitives ---------- */

function StatusBar({ tint = "espresso" }: { tint?: "espresso" | "cream" }) {
  const color = tint === "cream" ? "text-cream" : "text-espresso";
  return (
    <div
      className={`flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-extrabold ${color}`}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <svg width="17" height="10" viewBox="0 0 17 10" fill="none">
          <rect x="0" y="7" width="3" height="3" rx="0.5" fill="currentColor" />
          <rect x="4.5" y="5" width="3" height="5" rx="0.5" fill="currentColor" />
          <rect x="9" y="3" width="3" height="7" rx="0.5" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="10" rx="0.5" fill="currentColor" />
        </svg>
        {/* wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path
            d="M7.5 10.5a1 1 0 100-2 1 1 0 000 2zm-3.6-3.2a5 5 0 017.2 0M1 4.6a9 9 0 0113 0"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="11"
            rx="2.5"
            stroke="currentColor"
            fill="none"
          />
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" />
          <rect x="24" y="4" width="2" height="4" rx="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function HomeIndicator({ tint = "espresso" }: { tint?: "espresso" | "cream" }) {
  const bg = tint === "cream" ? "bg-cream" : "bg-espresso";
  return (
    <div className="flex justify-center pb-2 pt-3">
      <span className={`h-[5px] w-[134px] rounded-full ${bg} opacity-80`} />
    </div>
  );
}

/* Curve that sweeps up into the top block */
function CurveDivider({ fill = "#FFFFFF" }: { fill?: string }) {
  return (
    <svg
      viewBox="0 0 393 90"
      preserveAspectRatio="none"
      className="block w-full"
      style={{ height: 60 }}
    >
      <path d={`M0 90 L0 60 Q 196 -30 393 60 L393 90 Z`} fill={fill} />
    </svg>
  );
}

function PhoneFrame({
  children,
  bg = "bg-cream",
  label,
}: {
  children: React.ReactNode;
  bg?: string;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative rounded-[46px] p-[6px] shadow-[0_30px_60px_-30px_rgba(43,38,32,0.35)]"
        style={{
          background: "#2B2620",
          width: 320,
          height: 692,
        }}
      >
        <div
          className={`relative h-full w-full overflow-hidden rounded-[40px] ${bg}`}
          style={{ isolation: "isolate" }}
        >
          {/* notch / dynamic island */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-[26px] w-[100px] -translate-x-1/2 rounded-full bg-espresso" />
          {children}
        </div>
      </div>
      {label && (
        <span className="text-[12px] font-bold text-taupe">{label}</span>
      )}
    </div>
  );
}

function PillNav({ active = "home" }: { active?: string }) {
  const items = [
    { k: "home", icon: HomeIcon },
    { k: "book", icon: BookIcon },
    { k: "flame", icon: FlameIcon },
    { k: "chart", icon: ChartIcon },
    { k: "profile", icon: null },
  ];
  return (
    <div className="absolute inset-x-4 bottom-8 z-20">
      <div className="flex items-center justify-between rounded-[28px] bg-white px-4 py-2.5 shadow-[0_10px_24px_-14px_rgba(43,38,32,0.25)] border border-hairline">
        {items.map(({ k, icon: Icon }) => {
          const isActive = k === active;
          if (k === "profile") {
            return (
              <div
                key={k}
                className="h-9 w-9 rounded-full overflow-hidden bg-peach flex items-center justify-center"
              >
                <img
                  src={borbyWave}
                  alt=""
                  className="h-8 w-8 object-cover scale-125"
                />
              </div>
            );
          }
          return (
            <div
              key={k}
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                isActive ? "bg-peach text-coral-deep" : "text-taupe"
              }`}
            >
              {Icon && <Icon />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Outline icons (2px stroke, rounded caps) ---------- */
const stroke = {
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" />
      <path d="M8 7h7M8 11h7M8 15h5" />
    </svg>
  );
}
function FlameIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 3s4 4 4 8a4 4 0 11-8 0c0-1 .5-2 1-2.5C10 10 12 8 12 3z" />
      <path d="M12 21a5 5 0 005-5" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
    </svg>
  );
}
function WaveformIcon({ color = "#F7F3EA" }: { color?: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12v0M8 8v8M12 4v16M16 8v8M20 12v0"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} stroke="#DB6A3A">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function ChatIcon({ color = "#DB6A3A" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-4 4v-4H6a2 2 0 01-2-2V6z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ShieldIcon({ color = "#5C7A3D" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- Screens ---------- */

function ScreenSplash() {
  return (
    <PhoneFrame bg="bg-cream" label="A1 · Splash">
      <StatusBar />
      <div className="flex h-full flex-col items-center justify-center pb-16 -mt-4">
        <img src={borbyWave} alt="Borby waving" className="h-56 w-56 object-contain" />
        <h1 className="mt-2 text-[34px] font-black text-espresso tracking-tight">
          Borby
        </h1>
        <p className="mt-2 text-[12px] font-bold text-taupe px-8 text-center">
          Stanford School of Medicine · gut sound study
        </p>
      </div>
      <HomeIndicator />
    </PhoneFrame>
  );
}

function ScreenWelcome() {
  return (
    <PhoneFrame bg="bg-white" label="A2 · Welcome">
      <div className="absolute inset-x-0 top-0 h-[42%] bg-peach">
        <StatusBar />
      </div>
      <div className="relative pt-10">
        <div className="relative flex justify-center pt-6">
          <img
            src={borbyWave}
            alt=""
            className="h-52 w-52 object-contain relative z-10"
          />
        </div>
        <div className="relative -mt-6 z-0">
          <CurveDivider />
        </div>
        <div className="px-6 -mt-2">
          <h1 className="text-[28px] leading-[1.05] font-black text-espresso tracking-tight">
            Let's listen to your gut
          </h1>
          <p className="mt-3 text-[14px] font-semibold text-taupe leading-snug">
            One week. Four short recordings a day. Your phone is the whole device.
          </p>
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-16">
        <button className="w-full rounded-full bg-espresso py-3.5 text-[15px] font-extrabold text-cream">
          Start
        </button>
        <p className="mt-3 text-center text-[13px] font-bold text-taupe">
          I have a participant code
        </p>
      </div>
      <HomeIndicator />
    </PhoneFrame>
  );
}

function ScreenHomeActive() {
  return (
    <PhoneFrame bg="bg-white" label="B2 · Home, active">
      <div className="absolute inset-x-0 top-0 h-[44%] bg-peach">
        <StatusBar />
        <div className="flex items-center gap-2 px-4 pt-3">
          <div className="h-9 w-9 rounded-xl bg-white overflow-hidden flex items-center justify-center">
            <img src={borbyWave} alt="" className="h-8 w-8 object-contain" />
          </div>
          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-extrabold text-espresso">
            Day 3 of 7
          </span>
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-espresso flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" />
            240
          </span>
          <div className="ml-auto h-9 w-9 rounded-xl bg-coral flex items-center justify-center">
            <ChatIcon color="#F7F3EA" />
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <img src={borbyFire} alt="" className="h-32 w-32 object-contain" />
        </div>
      </div>
      <div className="relative pt-[42%]">
        <CurveDivider />
        <div className="px-5 -mt-1">
          <h1 className="text-[26px] leading-[1.05] font-black text-espresso">
            2 sessions left
          </h1>
          <p className="mt-1 text-[13px] font-bold text-taupe">
            1 recorded · 3 logs open
          </p>
          <div className="mt-4 rounded-[22px] bg-peach p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-extrabold text-coral-deep uppercase-off">
                  Before lunch
                </p>
                <p className="mt-1 text-[16px] font-extrabold text-espresso">
                  Session 2
                </p>
                <div className="mt-2 flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-espresso/70" />
                  <span className="h-2 w-2 rounded-full bg-coral" />
                  <span className="h-2 w-2 rounded-full bg-espresso/15" />
                  <span className="h-2 w-2 rounded-full bg-espresso/15" />
                </div>
                <p className="mt-2 text-[11px] font-bold text-taupe">
                  Opens in 42 min · 40 rumbles
                </p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-coral flex items-center justify-center">
                <WaveformIcon />
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <ListRow title="Morning symptoms" reward="10" />
            <ListRow title="Last night's sleep" reward="10" />
          </div>
        </div>
      </div>
      <PillNav active="home" />
      <HomeIndicator />
    </PhoneFrame>
  );
}

function ListRow({ title, reward }: { title: string; reward: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] border-[1.5px] border-hairline bg-white p-3">
      <div className="h-[38px] w-[38px] rounded-xl bg-sand flex items-center justify-center text-espresso">
        <BookIcon />
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-extrabold text-espresso leading-tight">{title}</p>
        <p className="text-[11px] font-bold text-taupe mt-0.5">
          <span className="text-coral-deep">+{reward}</span> rumbles
        </p>
      </div>
      <ArrowRight />
    </div>
  );
}

function ScreenRecording() {
  return (
    <PhoneFrame bg="bg-coral" label="B5 · Recording live">
      <StatusBar tint="cream" />
      <div className="px-6 pt-3">
        <div className="mx-auto flex w-full max-w-[220px] rounded-full bg-white/15 p-1 text-[12px] font-extrabold text-cream">
          <div className="flex-1 rounded-full bg-cream py-1.5 text-center text-coral-deep">
            Right side
          </div>
          <div className="flex-1 py-1.5 text-center opacity-80">Left side</div>
        </div>
      </div>
      <div className="flex flex-col items-center pt-8">
        <div className="relative flex h-52 w-52 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-white/10" />
          <span className="absolute inset-4 rounded-full bg-white/10" />
          <img src={borbyMeditate} alt="" className="relative h-40 w-40 object-contain" />
        </div>
        <p className="mt-4 text-[46px] font-black text-cream leading-none tracking-tight">
          1:47
        </p>
        <p className="mt-2 text-[12px] font-bold text-cream/80">
          of 3:00 · hold still, breathe normally
        </p>
        <div className="mt-5 flex h-12 items-end gap-[3px] px-6">
          {Array.from({ length: 34 }).map((_, i) => {
            const h = 8 + Math.abs(Math.sin(i * 0.9)) * 32 + (i % 3) * 4;
            return (
              <span
                key={i}
                className="w-[3px] rounded-full bg-cream/85"
                style={{ height: `${Math.min(h, 46)}px` }}
              />
            );
          })}
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-20">
        <button className="w-full rounded-full bg-cream py-3.5 text-[14px] font-extrabold text-coral-deep">
          Stop early
        </button>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-cream/85">
          <ShieldIcon color="#F7F3EA" />
          Case off · bare skin · quiet room
        </div>
      </div>
      <HomeIndicator tint="cream" />
    </PhoneFrame>
  );
}

function ScreenSessionPassed() {
  return (
    <PhoneFrame bg="bg-white" label="B8 · Session passed">
      <div className="absolute inset-x-0 top-0 h-[42%] bg-olive">
        <StatusBar tint="cream" />
        <div className="flex flex-col items-center pt-4">
          <p className="text-[140px] font-black text-white leading-none tracking-tight">
            96
          </p>
        </div>
      </div>
      <div className="relative pt-[42%]">
        <CurveDivider />
        <div className="px-5 -mt-1">
          <p className="text-[13px] font-extrabold text-taupe">Clip quality, both sides</p>
          <h1 className="mt-1 text-[22px] font-black text-espresso leading-tight">
            Clean signal. Nothing for you to fix.
          </h1>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-[18px] bg-sand p-3">
              <p className="text-[11px] font-extrabold text-taupe">Streak</p>
              <p className="text-[18px] font-black text-espresso mt-0.5">3 days</p>
            </div>
            <div className="rounded-[18px] bg-sage p-3">
              <p className="text-[11px] font-extrabold text-taupe">Today</p>
              <p className="text-[18px] font-black text-espresso mt-0.5">1 of 4</p>
            </div>
          </div>
          <div className="mt-3 rounded-[20px] border-[1.5px] border-hairline bg-white p-3">
            <p className="text-[13px] font-extrabold text-espresso">Signal check</p>
            <div className="mt-2 space-y-1.5 text-[12px] font-bold">
              <SignalRow label="Noise floor" value="24 dB" />
              <SignalRow label="Motion artifact" value="None" />
              <SignalRow label="Usable audio" value="3:00" />
            </div>
          </div>
          <div className="mt-3 rounded-[20px] bg-peach p-3 flex items-center gap-3">
            <img src={borbyHop} alt="" className="h-12 w-12 object-contain" />
            <p className="text-[12px] font-bold text-espresso leading-snug">
              Go drink your water. I'll nudge you before lunch.
            </p>
          </div>
        </div>
      </div>
      <HomeIndicator />
    </PhoneFrame>
  );
}

function SignalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-taupe">{label}</span>
      <span className="text-olive font-extrabold">{value}</span>
    </div>
  );
}

function ScreenReward() {
  return (
    <PhoneFrame bg="bg-cream" label="B10 · Reward moment">
      <StatusBar />
      <div className="flex flex-col items-center justify-center pt-24">
        <p
          className="font-black text-coral leading-none tracking-tight"
          style={{
            fontSize: 200,
            textShadow:
              "0 8px 0 rgba(194,94,48,0.35), 0 20px 40px rgba(194,94,48,0.25)",
          }}
        >
          40
        </p>
        <p className="mt-6 text-[20px] font-black text-espresso">
          Rumbles collected
        </p>
        <span className="mt-3 rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-espresso border border-hairline">
          Session complete
        </span>
      </div>
      <div className="absolute inset-x-5 bottom-16 rounded-[22px] bg-white p-4 border border-hairline">
        <p className="text-[13px] font-extrabold text-espresso">
          Study compensation
        </p>
        <p className="text-[12px] font-bold text-taupe mt-0.5">
          $25 unlocked · 580 to go for $75
        </p>
        <div className="mt-2.5 h-2 rounded-full bg-hairline overflow-hidden">
          <div className="h-full bg-coral" style={{ width: "41%" }} />
        </div>
      </div>
      <HomeIndicator />
    </PhoneFrame>
  );
}

function ScreenHomeIdle() {
  return (
    <PhoneFrame bg="bg-white" label="B1 · Home, idle">
      <div className="absolute inset-x-0 top-0 h-[42%] bg-peach">
        <StatusBar />
        <div className="flex justify-center mt-6">
          <img src={borbySleep} alt="" className="h-36 w-36 object-contain" />
        </div>
      </div>
      <div className="relative pt-[42%]">
        <CurveDivider />
        <div className="px-5 -mt-1">
          <h1 className="text-[26px] leading-[1.05] font-black text-espresso">
            Nothing due right now
          </h1>
          <p className="mt-1.5 text-[13px] font-bold text-taupe">
            Next window opens at 11:40
          </p>
          <div className="mt-4 rounded-[20px] bg-sand p-4">
            <p className="text-[11px] font-extrabold text-taupe">While you wait</p>
            <p className="mt-1 text-[15px] font-extrabold text-espresso">
              Log last night's sleep
            </p>
            <p className="mt-1 text-[12px] font-bold text-coral-deep">+10 rumbles</p>
          </div>
        </div>
      </div>
      <PillNav active="home" />
      <HomeIndicator />
    </PhoneFrame>
  );
}

function ScreenStreak() {
  const days = [
    { d: "M", state: "lit" },
    { d: "T", state: "lit" },
    { d: "W", state: "lit" },
    { d: "T", state: "today" },
    { d: "F", state: "off" },
    { d: "S", state: "off" },
    { d: "S", state: "off" },
  ];
  return (
    <PhoneFrame bg="bg-white" label="D1 · Streak">
      <div className="absolute inset-x-0 top-0 h-[36%] bg-espresso">
        <StatusBar tint="cream" />
        <div className="flex justify-center mt-6">
          <img src={borbyFire} alt="" className="h-32 w-32 object-contain" />
        </div>
      </div>
      <div className="relative pt-[36%]">
        <CurveDivider />
        <div className="px-5 -mt-1">
          <h1 className="text-[26px] leading-[1.05] font-black text-espresso">
            Three days lit
          </h1>
          <p className="mt-1.5 text-[13px] font-bold text-taupe">
            Keep it going through Sunday
          </p>
          <div className="mt-4 flex justify-between">
            {days.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center ${
                    d.state === "lit"
                      ? "bg-coral text-cream"
                      : d.state === "today"
                        ? "bg-peach text-coral-deep"
                        : "bg-hairline text-taupe"
                  }`}
                >
                  <FlameIcon />
                </div>
                <span className="text-[10px] font-extrabold text-taupe">
                  {d.d}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[18px] bg-sage p-3 flex items-start gap-2">
            <ShieldIcon />
            <p className="text-[12px] font-bold text-espresso leading-snug">
              A protocol skip keeps the fire lit. Only a silent no-show puts it out.
            </p>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-[13px] font-extrabold text-espresso">Rumbles</span>
            <span className="text-[26px] font-black text-coral leading-none">240</span>
          </div>
          <div className="mt-3 rounded-[20px] border-[1.5px] border-hairline p-3">
            <p className="text-[12px] font-extrabold text-espresso">
              Study compensation
            </p>
            <div className="mt-2 h-2 rounded-full bg-hairline overflow-hidden">
              <div className="h-full bg-coral" style={{ width: "41%" }} />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] font-bold text-taupe">
              <span>$25 unlocked</span>
              <span>580 to go for $75</span>
            </div>
          </div>
        </div>
      </div>
      <HomeIndicator />
    </PhoneFrame>
  );
}

/* ---------- Case study deck ---------- */

function Swatch({ hex, name }: { hex: string; name: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-14 w-full rounded-2xl border border-hairline"
        style={{ background: hex }}
      />
      <div>
        <p className="text-[12px] font-extrabold text-espresso">{name}</p>
        <p className="text-[11px] font-bold text-taupe">{hex}</p>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[12px] font-extrabold uppercase-off tracking-wide text-coral-deep">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-[36px] md:text-[44px] font-black text-espresso leading-[1.05] tracking-tight">
        {title}
      </h2>
      {sub && (
        <p className="mt-3 text-[15px] font-semibold text-taupe leading-snug">{sub}</p>
      )}
    </div>
  );
}

function ScreenRow({
  screens,
}: {
  screens: { node: React.ReactNode; caption: string }[];
}) {
  return (
    <div className="mt-12 flex flex-wrap items-start justify-center gap-x-10 gap-y-14">
      {screens.map((s, i) => (
        <div key={i} className="flex flex-col items-center gap-3">
          <div className="relative">
            <span
              className="absolute -inset-6 -z-10 rounded-full bg-peach/60"
              aria-hidden
            />
            {s.node}
          </div>
          <p className="max-w-[280px] text-center text-[13px] font-semibold text-taupe leading-snug">
            {s.caption}
          </p>
        </div>
      ))}
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-cream font-sans text-espresso antialiased">
      {/* Hero */}
      <header className="mx-auto max-w-6xl px-6 pt-10 pb-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-peach flex items-center justify-center overflow-hidden">
              <img src={borbyWave} alt="" className="h-9 w-9 object-contain" />
            </div>
            <span className="text-[16px] font-black tracking-tight">Borby</span>
          </div>
          <span className="text-[12px] font-extrabold text-taupe">
            Stanford School of Medicine · gut sound study
          </span>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid md:grid-cols-[1.15fr,1fr] gap-10 items-center">
          <div>
            <span className="inline-block rounded-full bg-white border border-hairline px-3 py-1 text-[11px] font-extrabold text-coral-deep">
              Case study · mobile
            </span>
            <h1 className="mt-5 text-[52px] md:text-[64px] leading-[0.98] font-black tracking-tight text-espresso">
              Let's listen<br />to your gut.
            </h1>
            <p className="mt-5 max-w-lg text-[16px] font-semibold text-taupe leading-snug">
              Borby is a warm, encouraging companion for a one-week bowel sound study.
              Four short recordings a day. Your phone is the whole device. A mascot,
              not a wellness score, holds the schedule.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-[12px] font-extrabold text-taupe">
              <span className="rounded-full bg-white border border-hairline px-3 py-1.5">
                29 screens
              </span>
              <span className="rounded-full bg-white border border-hairline px-3 py-1.5">
                Clinical research
              </span>
              <span className="rounded-full bg-white border border-hairline px-3 py-1.5">
                Nunito · Cream / Coral / Espresso
              </span>
            </div>
          </div>
          <div className="relative flex justify-center">
            <span
              className="absolute inset-0 -z-10 rounded-[48px] bg-peach"
              aria-hidden
            />
            <div className="py-8">
              <ScreenSplash />
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <SectionHeader
          eyebrow="The problem"
          title="Clinical apps are cold. Compliance is warm work."
          sub="Studies live or die on daily protocol adherence. Yet most research apps ship as spreadsheets in disguise — no character, no encouragement, and no room for the messy way a real week goes."
        />
      </section>

      {/* Protocol */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { n: "01", t: "Fasted morning", d: "Before food or water" },
            { n: "02", t: "Before lunch", d: "Baseline motility" },
            { n: "03", t: "After lunch", d: "Digestive response" },
            { n: "04", t: "Evening", d: "End of day signal" },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-[22px] bg-white border border-hairline p-5"
            >
              <p className="text-[11px] font-extrabold text-coral-deep">{s.n}</p>
              <p className="mt-2 text-[16px] font-black text-espresso">{s.t}</p>
              <p className="mt-1 text-[12px] font-bold text-taupe">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeader eyebrow="Principles" title="Three commitments." />
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {[
            {
              t: "A mascot, not a score.",
              d: "No gut-health rating. Borby holds the schedule and the tone.",
            },
            {
              t: "A protocol skip is a good skip.",
              d: "Compromised data is worse than missing data. Skips keep the streak.",
            },
            {
              t: "The phone is the device.",
              d: "No hardware. No wearable. Just calm audio capture with clear rules.",
            },
          ].map((p, i) => (
            <div
              key={i}
              className="rounded-[22px] bg-white border border-hairline p-6"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-peach text-coral-deep text-[13px] font-black">
                {i + 1}
              </span>
              <p className="mt-4 text-[18px] font-black text-espresso leading-tight">
                {p.t}
              </p>
              <p className="mt-2 text-[13px] font-semibold text-taupe leading-snug">
                {p.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Onboarding */}
      <section className="py-20 bg-white/60">
        <SectionHeader
          eyebrow="Flow · onboarding"
          title="Meet Borby, then start the week."
          sub="A splash, a promise, a short setup. The mascot introduces itself before it asks for anything."
        />
        <ScreenRow
          screens={[
            { node: <ScreenSplash />, caption: "A1 · Full-bleed splash with the mascot and study attribution." },
            { node: <ScreenWelcome />, caption: "A2 · One promise, one primary action. No dark patterns." },
          ]}
        />
      </section>

      {/* Daily loop */}
      <section className="py-20">
        <SectionHeader
          eyebrow="Flow · daily loop"
          title="Idle, active, recording."
          sub="The home screen changes state with the window. Coral means it's time. Peach means rest."
        />
        <ScreenRow
          screens={[
            { node: <ScreenHomeIdle />, caption: "B1 · Borby sleeps between windows. The screen is honest about the wait." },
            { node: <ScreenHomeActive />, caption: "B2 · Session card, streak, rumbles, and a coral tile that starts the capture." },
            { node: <ScreenRecording />, caption: "B5 · Full-bleed coral. Timer, waveform, and the four-rule footer, always visible." },
          ]}
        />
      </section>

      {/* Feedback */}
      <section className="py-20 bg-white/60">
        <SectionHeader
          eyebrow="Flow · feedback"
          title="The reward is legible, not gamified."
          sub="Rumbles map to study compensation. A big number, a small chip, and the honest math beneath."
        />
        <ScreenRow
          screens={[
            { node: <ScreenSessionPassed />, caption: "B8 · Olive block signals a clean clip. Signal-check values are the reward." },
            { node: <ScreenReward />, caption: "B10 · The 3D numeral is the moment. The card underneath is the receipt." },
            { node: <ScreenStreak />, caption: "D1 · Espresso field, campfire, and the sage rule that keeps the fire lit." },
          ]}
        />
      </section>

      {/* Design system */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader eyebrow="Design system" title="The whole palette." />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-6 gap-4">
          <Swatch hex="#F7F3EA" name="Cream" />
          <Swatch hex="#FBE0C8" name="Peach" />
          <Swatch hex="#DB6A3A" name="Coral" />
          <Swatch hex="#C25E30" name="Coral deep" />
          <Swatch hex="#2B2620" name="Espresso" />
          <Swatch hex="#5C7A3D" name="Olive" />
          <Swatch hex="#E4EBDA" name="Sage" />
          <Swatch hex="#EFE4D6" name="Sand" />
          <Swatch hex="#8A8175" name="Taupe" />
          <Swatch hex="#F0EDE7" name="Hairline" />
          <Swatch hex="#F2A87F" name="Borby" />
          <Swatch hex="#F7CBAE" name="Belly" />
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          <div className="rounded-[24px] bg-white border border-hairline p-8">
            <p className="text-[11px] font-extrabold text-taupe">Type scale · Nunito</p>
            <p className="mt-4 text-[40px] font-black leading-none tracking-tight">
              Display 800
            </p>
            <p className="mt-4 text-[16px] font-extrabold">Section header 800</p>
            <p className="mt-3 text-[14px] font-semibold">
              Body copy at 14, weight 600. Sentence case everywhere.
            </p>
            <p className="mt-3 text-[12px] font-bold text-taupe">
              Label · 12 · weight 700 · taupe
            </p>
          </div>
          <div className="rounded-[24px] bg-white border border-hairline p-8">
            <p className="text-[11px] font-extrabold text-taupe">Components</p>
            <div className="mt-5 space-y-3">
              <button className="w-full rounded-full bg-espresso py-3.5 text-[15px] font-extrabold text-cream">
                Anchor button · espresso
              </button>
              <button className="w-full rounded-full bg-coral py-3.5 text-[15px] font-extrabold text-cream">
                Accent button · coral
              </button>
              <div className="rounded-[20px] border-[1.5px] border-hairline bg-white p-3 flex items-center gap-3">
                <div className="h-[38px] w-[38px] rounded-xl bg-sand flex items-center justify-center">
                  <BookIcon />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-extrabold">List row</p>
                  <p className="text-[11px] font-bold text-taupe">
                    <span className="text-coral-deep">+10</span> rumbles
                  </p>
                </div>
                <ArrowRight />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <img
          src={borbyHop}
          alt="Borby delighted"
          className="mx-auto h-40 w-40 object-contain"
          loading="lazy"
        />
        <h2 className="mt-4 text-[40px] md:text-[52px] font-black text-espresso leading-[1.02] tracking-tight">
          Warm enough to keep,<br />
          <span className="text-coral">clinical enough to trust.</span>
        </h2>
        <p className="mt-4 text-[15px] font-semibold text-taupe max-w-xl mx-auto leading-snug">
          Borby is the whole clinical companion — a mascot, a schedule, and a set of
          honest rules that respect the participant's week.
        </p>
      </section>

      <footer className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-wrap items-center justify-between gap-3 text-[12px] font-bold text-taupe">
          <span>Borby · gut sound study</span>
          <span>Stanford School of Medicine · IRB-2024-XXXXX</span>
        </div>
      </footer>
    </div>
  );
}
