import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import borbyWave from "@/assets/borby-wave.png";
import borbyMeditate from "@/assets/borby-meditate.png";
import borbySleep from "@/assets/borby-sleep.png";
import borbyHop from "@/assets/borby-hop.png";
import borbyFire from "@/assets/borby-fire.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Borby — Gut sound study" },
      {
        name: "description",
        content:
          "Interactive prototype of Borby, a warm mobile companion for the Stanford gut sound study.",
      },
      { property: "og:title", content: "Borby — Gut sound study" },
      {
        property: "og:description",
        content:
          "Interactive prototype of Borby, a warm mobile companion for the Stanford gut sound study.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Prototype,
});

/* =================================================================
   State
================================================================= */

type ScreenKey =
  | "splash"
  | "welcome"
  | "permissions"
  | "schedule"
  | "practice"
  | "welcomeGift"
  | "home"
  | "chat"
  | "preGate"
  | "recording"
  | "sideSwitch"
  | "uploading"
  | "passed"
  | "flagged"
  | "reward"
  | "symptom"
  | "meal"
  | "water"
  | "bathroom"
  | "sleep"
  | "dailyFlow"
  | "dayComplete"
  | "streak"
  | "week"
  | "profile";

type StepId =
  | "sleep"
  | "symptomAM"
  | "fasted"
  | "breakfast"
  | "water"
  | "bathroom"
  | "preLunch"
  | "lunch"
  | "evening"
  | "symptomPM";

type FlowStep = {
  id: StepId;
  title: string;
  sub: string;
  screen: ScreenKey;
  emoji: string;
  reward: number;
};

const FLOW_STEPS: FlowStep[] = [
  { id: "sleep",      title: "Last night's sleep",     sub: "How many hours",             screen: "sleep",   emoji: "🌙", reward: 10 },
  { id: "symptomAM",  title: "Morning symptoms",       sub: "Bloat, cramps, energy",      screen: "symptom", emoji: "😊", reward: 10 },
  { id: "fasted",     title: "Fasted recording",       sub: "3-min quiet-window clip",    screen: "preGate", emoji: "🎙️", reward: 40 },
  { id: "breakfast",  title: "Log breakfast",          sub: "What you ate & when",        screen: "meal",    emoji: "🥣", reward: 10 },
  { id: "water",      title: "Log water intake",       sub: "Glasses since waking",       screen: "water",   emoji: "💧", reward: 5  },
  { id: "bathroom",   title: "Log bathroom",           sub: "Bowel movement (Bristol)",   screen: "bathroom",emoji: "🚽", reward: 15 },
  { id: "preLunch",   title: "Before-lunch recording", sub: "3-min quiet-window clip",    screen: "preGate", emoji: "🎙️", reward: 40 },
  { id: "lunch",      title: "Log lunch",              sub: "What you ate & when",        screen: "meal",    emoji: "🍜", reward: 10 },
  { id: "evening",    title: "Evening recording",      sub: "3-min quiet-window clip",    screen: "preGate", emoji: "🎙️", reward: 40 },
  { id: "symptomPM",  title: "Evening symptoms",       sub: "How the day felt",           screen: "symptom", emoji: "🌆", reward: 10 },
];

type Store = {
  screen: ScreenKey;
  go: (s: ScreenKey) => void;
  rumbles: number;
  streak: number;
  sessions: number; // completed today
  totalSessions: number;
  addRumbles: (n: number) => void;
  completeSession: () => void;
  flowActive: boolean;
  currentStepIdx: number | null;
  completedSteps: Record<StepId, boolean>;
  startFlow: () => void;
  openStep: (idx: number) => void;
  finishCurrentStep: () => void;
  exitFlow: () => void;
};

/* =================================================================
   Root
================================================================= */

function Prototype() {
  const [screen, setScreen] = useState<ScreenKey>("splash");
  const [rumbles, setRumbles] = useState(200);
  const [streak, setStreak] = useState(3);
  const [sessions, setSessions] = useState(1);
  const [flowActive, setFlowActive] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<StepId, boolean>>({
    sleep: false, symptomAM: false, fasted: true, breakfast: false, water: false,
    bathroom: false, preLunch: false, lunch: false, evening: false, symptomPM: false,
  });

  const store: Store = {
    screen,
    go: setScreen,
    rumbles,
    streak,
    sessions,
    totalSessions: 4,
    addRumbles: (n) => setRumbles((r) => r + n),
    completeSession: () => setSessions((s) => Math.min(s + 1, 4)),
    flowActive,
    currentStepIdx,
    completedSteps,
    startFlow: () => {
      setFlowActive(true);
      setCurrentStepIdx(null);
      setScreen("dailyFlow");
    },
    openStep: (idx) => {
      setFlowActive(true);
      setCurrentStepIdx(idx);
      setScreen(FLOW_STEPS[idx].screen);
    },
    finishCurrentStep: () => {
      if (currentStepIdx == null) { setScreen("dailyFlow"); return; }
      const step = FLOW_STEPS[currentStepIdx];
      setCompletedSteps((c) => ({ ...c, [step.id]: true }));
      setCurrentStepIdx(null);
      setScreen("dailyFlow");
    },
    exitFlow: () => { setFlowActive(false); setCurrentStepIdx(null); setScreen("home"); },
  };

  useEffect(() => {
    if (screen === "splash") {
      const t = setTimeout(() => setScreen("welcome"), 1600);
      return () => clearTimeout(t);
    }
  }, [screen]);



  return (
    <div className="min-h-screen bg-cream font-sans text-espresso antialiased">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pt-8 pb-24">
        <header className="mb-6 flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={borbyWave} alt="" className="h-9 w-9 object-contain" />
            <div>
              <p className="text-[15px] font-black tracking-tight">Borby</p>
              <p className="text-[10px] font-extrabold text-taupe">
                Interactive prototype
              </p>
            </div>
          </div>
          <ScreenJumper current={screen} go={setScreen} />
        </header>

        <PhoneShell screen={screen}>
          <ActiveScreen store={store} />
        </PhoneShell>

        <p className="mt-6 max-w-md text-center text-[12px] font-bold text-taupe">
          Tap through the flow like a real participant, or jump to any screen
          from the picker above.
        </p>
      </div>
    </div>
  );
}

function ActiveScreen({ store }: { store: Store }) {
  switch (store.screen) {
    case "splash": return <SplashScreen />;
    case "welcome": return <WelcomeScreen store={store} />;
    case "permissions": return <PermissionsScreen store={store} />;
    case "schedule": return <ScheduleScreen store={store} />;
    case "practice": return <PracticeScreen store={store} />;
    case "welcomeGift": return <WelcomeGiftScreen store={store} />;
    case "home": return <HomeScreen store={store} />;
    case "chat": return <ChatScreen store={store} />;
    case "preGate": return <PreGateScreen store={store} />;
    case "recording": return <RecordingScreen store={store} />;
    case "sideSwitch": return <SideSwitchScreen store={store} />;
    case "uploading": return <UploadingScreen store={store} />;
    case "passed": return <PassedScreen store={store} />;
    case "flagged": return <FlaggedScreen store={store} />;
    case "reward": return <RewardScreen store={store} />;
    case "symptom": return <SymptomScreen store={store} />;
    case "meal": return <MealScreen store={store} />;
    case "water": return <WaterScreen store={store} />;
    case "bathroom": return <BathroomScreen store={store} />;
    case "sleep": return <SleepScreen store={store} />;
    case "dailyFlow": return <DailyFlowScreen store={store} />;
    case "dayComplete": return <DayCompleteScreen store={store} />;
    case "streak": return <StreakScreen store={store} />;
    case "week": return <WeekScreen store={store} />;
    case "profile": return <ProfileScreen store={store} />;
  }
}

/* =================================================================
   Chrome
================================================================= */

function PhoneShell({ children, screen }: { children: React.ReactNode; screen: ScreenKey }) {
  // Choose device-frame background based on screen tone.
  const dark = screen === "recording" || screen === "sideSwitch";
  return (
    <div
      className="relative rounded-[46px] p-[6px] shadow-[0_30px_60px_-30px_rgba(43,38,32,0.35)]"
      style={{ background: "#2B2620", width: 360, height: 780 }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-[40px]"
        style={{ background: dark ? "#DB6A3A" : "#F7F3EA", isolation: "isolate" }}
      >
        <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-[26px] w-[110px] -translate-x-1/2 rounded-full bg-espresso" />
        {children}
      </div>
    </div>
  );
}

function ScreenJumper({
  current,
  go,
}: {
  current: ScreenKey;
  go: (s: ScreenKey) => void;
}) {
  const options: { k: ScreenKey; label: string }[] = [
    { k: "splash", label: "Splash" },
    { k: "welcome", label: "Welcome" },
    { k: "permissions", label: "Permissions" },
    { k: "schedule", label: "Schedule" },
    { k: "practice", label: "Practice" },
    { k: "welcomeGift", label: "Welcome gift" },
    { k: "home", label: "Home" },
    { k: "chat", label: "Agent chat" },
    { k: "preGate", label: "Pre-session gate" },
    { k: "recording", label: "Recording live" },
    { k: "sideSwitch", label: "Side switch" },
    { k: "uploading", label: "Uploading" },
    { k: "passed", label: "Session passed" },
    { k: "flagged", label: "Session flagged" },
    { k: "reward", label: "Reward moment" },
    { k: "symptom", label: "Symptom log" },
    { k: "meal", label: "Meal log" },
    { k: "water", label: "Water log" },
    { k: "bathroom", label: "Bathroom log" },
    { k: "sleep", label: "Sleep log" },
    { k: "dailyFlow", label: "Daily flow" },
    { k: "dayComplete", label: "Day complete" },
    { k: "streak", label: "Streak" },
    { k: "week", label: "Week grid" },
    { k: "profile", label: "Profile" },
  ];
  return (
    <select
      value={current}
      onChange={(e) => go(e.target.value as ScreenKey)}
      className="rounded-full border border-hairline bg-white px-4 py-2 text-[12px] font-extrabold text-espresso"
    >
      {options.map((o) => (
        <option key={o.k} value={o.k}>{o.label}</option>
      ))}
    </select>
  );
}

function StatusBar({ tint = "espresso" }: { tint?: "espresso" | "cream" }) {
  const color = tint === "cream" ? "text-cream" : "text-espresso";
  return (
    <div className={`flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-extrabold ${color}`}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="17" height="10" viewBox="0 0 17 10" fill="none">
          <rect x="0" y="7" width="3" height="3" rx="0.5" fill="currentColor" />
          <rect x="4.5" y="5" width="3" height="5" rx="0.5" fill="currentColor" />
          <rect x="9" y="3" width="3" height="7" rx="0.5" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="10" rx="0.5" fill="currentColor" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 10.5a1 1 0 100-2 1 1 0 000 2zm-3.6-3.2a5 5 0 017.2 0M1 4.6a9 9 0 0113 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" fill="none" />
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
    <div className="absolute inset-x-0 bottom-0 flex justify-center pb-2 pt-3">
      <span className={`h-[5px] w-[134px] rounded-full ${bg} opacity-80`} />
    </div>
  );
}

function CurveDivider({ fill = "#FFFFFF" }: { fill?: string }) {
  return (
    <svg viewBox="0 0 393 90" preserveAspectRatio="none" className="block w-full" style={{ height: 60 }}>
      <path d="M0 90 L0 60 Q 196 -30 393 60 L393 90 Z" fill={fill} />
    </svg>
  );
}

function PillNav({
  active,
  go,
}: {
  active: "home" | "book" | "flame" | "chart" | "profile";
  go: (s: ScreenKey) => void;
}) {
  const items: { k: typeof active; screen: ScreenKey; icon: React.FC | null }[] = [
    { k: "home", screen: "home", icon: HomeIcon },
    { k: "book", screen: "symptom", icon: BookIcon },
    { k: "flame", screen: "streak", icon: FlameIcon },
    { k: "chart", screen: "week", icon: ChartIcon },
    { k: "profile", screen: "profile", icon: null },
  ];
  return (
    <div className="absolute inset-x-4 bottom-8 z-20">
      <div className="flex items-center justify-between rounded-[28px] bg-white px-4 py-2.5 shadow-[0_10px_24px_-14px_rgba(43,38,32,0.25)] border border-hairline">
        {items.map(({ k, screen, icon: Icon }) => {
          const isActive = k === active;
          const inner = k === "profile" ? (
            <div className="h-8 w-8 rounded-full overflow-hidden bg-peach flex items-center justify-center">
              <img src={borbyWave} alt="" className="h-7 w-7 object-contain" />
            </div>
          ) : (
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${isActive ? "bg-peach text-coral-deep" : "text-taupe"}`}>
              {Icon && <Icon />}
            </div>
          );
          return (
            <button key={k} onClick={() => go(screen)} className="focus:outline-none">
              {inner}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =================================================================
   Icons
================================================================= */

const stroke = {
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

function HomeIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z" /></svg>); }
function BookIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" /><path d="M8 7h7M8 11h7M8 15h5" /></svg>); }
function FlameIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><path d="M12 3s4 4 4 8a4 4 0 11-8 0c0-1 .5-2 1-2.5C10 10 12 8 12 3z" /></svg>); }
function ChartIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></svg>); }
function WaveformIcon({ color = "#F7F3EA" }: { color?: string }) { return (<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 12v0M8 8v8M12 4v16M16 8v8M20 12v0" stroke={color} strokeWidth="2.4" strokeLinecap="round" /></svg>); }
function ArrowRight() { return (<svg width="18" height="18" viewBox="0 0 24 24" {...stroke} stroke="#DB6A3A"><path d="M5 12h14M13 6l6 6-6 6" /></svg>); }
function ChatBubbleIcon({ color = "#DB6A3A" }: { color?: string }) { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-4 4v-4H6a2 2 0 01-2-2V6z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ShieldIcon({ color = "#5C7A3D" }: { color?: string }) { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function CheckIcon({ color = "#5C7A3D" }: { color?: string }) { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function MicIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v3" /></svg>); }
function BellIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><path d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15L6 16zM10 21h4" /></svg>); }
function HeartPulseIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><path d="M20.8 11c.8-4-2.2-7-5.3-7-1.5 0-2.9.7-3.5 1.6C11.4 4.7 10 4 8.5 4 5.4 4 2.4 7 3.2 11c.7 3.5 4.4 6.4 8.8 9 4.4-2.6 8.1-5.5 8.8-9z" /><path d="M6 13h3l1.5-3 3 6L15 13h3" /></svg>); }

/* =================================================================
   Small UI atoms
================================================================= */

function PrimaryBtn({ children, onClick, tone = "espresso" }: { children: React.ReactNode; onClick?: () => void; tone?: "espresso" | "coral" | "cream" }) {
  const cls =
    tone === "coral" ? "bg-coral text-cream" :
    tone === "cream" ? "bg-cream text-coral-deep" :
    "bg-espresso text-cream";
  return (
    <button onClick={onClick} className={`w-full rounded-full py-3.5 text-[15px] font-extrabold ${cls} active:scale-[0.98] transition`}>
      {children}
    </button>
  );
}

function ListRow({ title, meta, icon, onClick }: { title: string; meta?: string; icon?: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 rounded-[20px] border-[1.5px] border-hairline bg-white p-3 text-left active:scale-[0.99] transition">
      <div className="h-[38px] w-[38px] rounded-xl bg-sand flex items-center justify-center text-espresso">
        {icon ?? <BookIcon />}
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-extrabold text-espresso leading-tight">{title}</p>
        {meta && <p className="text-[11px] font-bold text-taupe mt-0.5">{meta}</p>}
      </div>
      <ArrowRight />
    </button>
  );
}

/* =================================================================
   Screens — Onboarding
================================================================= */

function SplashScreen() {
  return (
    <>
      <StatusBar />
      <div className="flex h-full flex-col items-center justify-center pb-16 -mt-4">
        <img src={borbyWave} alt="Borby" className="h-56 w-56 object-contain" />
        <h1 className="mt-2 text-[34px] font-black text-espresso tracking-tight">Borby</h1>
        <p className="mt-2 text-[12px] font-bold text-taupe px-8 text-center">
          Stanford School of Medicine · gut sound study
        </p>
      </div>
      <HomeIndicator />
    </>
  );
}

function WelcomeScreen({ store }: { store: Store }) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[42%] bg-peach">
        <StatusBar />
      </div>
      <div className="relative pt-10">
        <div className="flex justify-center pt-6">
          <img src={borbyWave} alt="" className="h-52 w-52 object-contain relative z-10" />
        </div>
        <div className="relative -mt-6 z-0"><CurveDivider /></div>
        <div className="px-6 -mt-2">
          <h1 className="text-[28px] leading-[1.05] font-black tracking-tight">Let's listen to your gut</h1>
          <p className="mt-3 text-[14px] font-semibold text-taupe leading-snug">
            One week. Four short recordings a day. Your phone is the whole device.
          </p>
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-16">
        <PrimaryBtn onClick={() => store.go("permissions")}>Start</PrimaryBtn>
        <p className="mt-3 text-center text-[13px] font-bold text-taupe">I have a participant code</p>
      </div>
      <HomeIndicator />
    </>
  );
}

function PermissionsScreen({ store }: { store: Store }) {
  const [perms, setPerms] = useState({ mic: false, notif: false, health: false });
  const all = perms.mic && perms.notif && perms.health;
  const rows: { k: keyof typeof perms; title: string; sub: string; icon: React.ReactNode }[] = [
    { k: "mic", title: "Microphone", sub: "To record", icon: <MicIcon /> },
    { k: "notif", title: "Notifications", sub: "So windows don't pass you by", icon: <BellIcon /> },
    { k: "health", title: "Health app", sub: "Sleep only, nothing else", icon: <HeartPulseIcon /> },
  ];
  return (
    <>
      <StatusBar />
      <div className="px-6 pt-6">
        <h1 className="text-[28px] font-black leading-tight">Three things I need</h1>
        <div className="mt-6 space-y-2.5">
          {rows.map((r) => (
            <div key={r.k} className="flex items-center gap-3 rounded-[20px] border-[1.5px] border-hairline bg-white p-3">
              <div className="h-[38px] w-[38px] rounded-xl bg-sand flex items-center justify-center">{r.icon}</div>
              <div className="flex-1">
                <p className="text-[14px] font-extrabold">{r.title}</p>
                <p className="text-[11px] font-bold text-taupe mt-0.5">{r.sub}</p>
              </div>
              <Toggle
                on={perms[r.k]}
                onChange={(v) => setPerms((p) => ({ ...p, [r.k]: v }))}
              />
            </div>
          ))}
        </div>
        <p className="mt-6 text-[12px] font-bold text-taupe leading-snug">
          Recordings upload encrypted. Only the study team can hear them.
        </p>
      </div>
      <div className="absolute inset-x-6 bottom-16">
        <PrimaryBtn onClick={() => store.go("schedule")} tone={all ? "espresso" : "espresso"}>
          {all ? "Continue" : "Grant to continue"}
        </PrimaryBtn>
      </div>
      <HomeIndicator />
    </>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`h-7 w-12 rounded-full p-0.5 transition ${on ? "bg-olive" : "bg-hairline"}`}
      aria-pressed={on}
    >
      <span className={`block h-6 w-6 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

function ScheduleScreen({ store }: { store: Store }) {
  const [hour, setHour] = useState(7);
  const [meal, setMeal] = useState<"Breakfast" | "Lunch" | "Dinner">("Lunch");
  return (
    <>
      <StatusBar />
      <div className="px-6 pt-6">
        <h1 className="text-[28px] font-black leading-tight">When do you usually wake?</h1>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={() => setHour((h) => Math.max(4, h - 1))} className="h-10 w-10 rounded-full bg-sand text-[20px] font-black">−</button>
          <p className="text-[40px] font-black tracking-tight w-40 text-center">{hour}:00 <span className="text-[16px] text-taupe">AM</span></p>
          <button onClick={() => setHour((h) => Math.min(11, h + 1))} className="h-10 w-10 rounded-full bg-sand text-[20px] font-black">+</button>
        </div>
        <p className="mt-8 text-[14px] font-extrabold">Which meal will you anchor to?</p>
        <div className="mt-3 flex gap-2">
          {(["Breakfast", "Lunch", "Dinner"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMeal(m)}
              className={`flex-1 rounded-full py-2.5 text-[13px] font-extrabold ${
                meal === m ? "bg-coral text-cream" : "bg-white border border-hairline text-espresso"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-16">
        <PrimaryBtn onClick={() => store.go("practice")}>Set my week</PrimaryBtn>
      </div>
      <HomeIndicator />
    </>
  );
}

function PracticeScreen({ store }: { store: Store }) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[38%] bg-peach">
        <StatusBar />
        <div className="flex justify-center pt-6">
          <img src={borbyMeditate} alt="" className="h-36 w-36 object-contain" />
        </div>
      </div>
      <div className="relative pt-[38%]">
        <CurveDivider />
        <div className="px-6 -mt-1">
          <h1 className="text-[26px] font-black leading-tight">Let's do one practice recording</h1>
          <p className="mt-2 text-[13px] font-bold text-taupe">
            It won't count toward your week. I just want you to feel it once.
          </p>
          <div className="mt-4 rounded-[20px] bg-sand p-4 space-y-2.5">
            {["Phone case off", "Directly on bare skin", "Sitting upright", "Quiet room"].map((r) => (
              <div key={r} className="flex items-center gap-2 text-[13px] font-extrabold">
                <span className="h-5 w-5 rounded-full bg-sage flex items-center justify-center"><CheckIcon /></span>
                {r}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-16">
        <PrimaryBtn tone="coral" onClick={() => store.go("welcomeGift")}>Try it now</PrimaryBtn>
      </div>
      <HomeIndicator />
    </>
  );
}

function WelcomeGiftScreen({ store }: { store: Store }) {
  useEffect(() => { store.addRumbles(100); }, []); // one-time
  return (
    <>
      <StatusBar />
      <div className="flex flex-col items-center justify-center pt-20">
        <BalloonNumber value="100" />
        <p className="mt-6 text-[20px] font-black">Rumbles collected</p>
        <span className="mt-3 rounded-full bg-white px-3 py-1 text-[11px] font-extrabold border border-hairline">Welcome gift</span>
      </div>
      <div className="absolute inset-x-5 bottom-24 rounded-[22px] bg-white border border-hairline p-4">
        <p className="text-[12px] font-bold text-taupe leading-snug">
          <span className="font-extrabold text-espresso">What rumbles are — </span>
          they track sessions that pass quality, and they map to your study compensation.
        </p>
      </div>
      <div className="absolute inset-x-6 bottom-8">
        <PrimaryBtn onClick={() => store.go("home")}>Enter Borby</PrimaryBtn>
      </div>
    </>
  );
}

function BalloonNumber({ value, color = "#DB6A3A" }: { value: string; color?: string }) {
  return (
    <p
      className="font-black leading-none tracking-tight"
      style={{
        fontSize: 180,
        color,
        textShadow: `0 8px 0 rgba(194,94,48,0.35), 0 20px 40px rgba(194,94,48,0.25)`,
      }}
    >
      {value}
    </p>
  );
}

/* =================================================================
   Screens — Home / core loop
================================================================= */

function HomeScreen({ store }: { store: Store }) {
  const idle = store.sessions >= store.totalSessions;
  return idle ? <HomeIdle store={store} /> : <HomeActive store={store} />;
}

function HomeIdle({ store }: { store: Store }) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[42%] bg-peach">
        <StatusBar />
        <div className="flex justify-center mt-6">
          <img src={borbySleep} alt="" className="h-36 w-36 object-contain" />
        </div>
      </div>
      <div className="relative pt-[42%]">
        <CurveDivider />
        <div className="px-5 -mt-1">
          <h1 className="text-[26px] font-black leading-tight">All done for today</h1>
          <p className="mt-1.5 text-[13px] font-bold text-taupe">Tomorrow's first window opens at 6:40</p>
          <button onClick={() => store.go("dayComplete")} className="mt-4 w-full rounded-[20px] bg-sand p-4 text-left active:scale-[0.99] transition">
            <p className="text-[11px] font-extrabold text-taupe">Wrap the day</p>
            <p className="mt-1 text-[15px] font-extrabold">Review today's summary</p>
          </button>
        </div>
      </div>
      <PillNav active="home" go={store.go} />
      <HomeIndicator />
    </>
  );
}

function HomeActive({ store }: { store: Store }) {
  const remaining = store.totalSessions - store.sessions;
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[44%] bg-peach">
        <StatusBar />
        <div className="flex items-center gap-2 px-4 pt-3">
          <button onClick={() => store.go("profile")} className="h-9 w-9 rounded-xl bg-white overflow-hidden flex items-center justify-center">
            <img src={borbyWave} alt="" className="h-8 w-8 object-contain" />
          </button>
          <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-extrabold text-espresso">Day {store.streak} of 7</span>
          <button onClick={() => store.go("streak")} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-espresso flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" />
            {store.rumbles}
          </button>
          <button onClick={() => store.go("chat")} className="ml-auto h-9 w-9 rounded-xl bg-coral flex items-center justify-center">
            <ChatBubbleIcon color="#F7F3EA" />
          </button>
        </div>
        <div className="flex justify-center mt-1">
          <img src={borbyFire} alt="" className="h-28 w-28 object-contain" />
        </div>
      </div>
      <div className="relative pt-[44%]">
        <CurveDivider />
        <div className="px-5 -mt-1">
          <h1 className="text-[26px] font-black leading-tight">{remaining} sessions left</h1>
          <p className="mt-1 text-[13px] font-bold text-taupe">{store.sessions} recorded · 3 logs open</p>
          <button onClick={() => store.go("preGate")} className="mt-4 w-full rounded-[22px] bg-peach p-4 text-left active:scale-[0.99] transition">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-extrabold text-coral-deep">Before lunch</p>
                <p className="mt-1 text-[16px] font-extrabold">Session {store.sessions + 1}</p>
                <div className="mt-2 flex gap-1.5">
                  {Array.from({ length: store.totalSessions }).map((_, i) => (
                    <span key={i} className={`h-2 w-2 rounded-full ${i < store.sessions ? "bg-espresso/70" : i === store.sessions ? "bg-coral" : "bg-espresso/15"}`} />
                  ))}
                </div>
                <p className="mt-2 text-[11px] font-bold text-taupe">Tap to open · 40 rumbles</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-coral flex items-center justify-center">
                <WaveformIcon />
              </div>
            </div>
          </button>
          <div className="mt-3 space-y-2">
            <ListRow title="Morning symptoms" meta="+10 rumbles" onClick={() => store.go("symptom")} />
            <ListRow title="Last night's sleep" meta="+10 rumbles" onClick={() => store.go("sleep")} />
          </div>
        </div>
      </div>
      <PillNav active="home" go={store.go} />
      <HomeIndicator />
    </>
  );
}

/* =================================================================
   Screens — Chat
================================================================= */

function ChatScreen({ store }: { store: Store }) {
  const [msgs, setMsgs] = useState<{ who: "borby" | "me"; text: string }[]>([
    { who: "borby", text: "Morning. Before water, food, or standing up — let's catch the quiet window." },
  ]);
  const [input, setInput] = useState("");

  function send(text: string) {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { who: "me", text }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { who: "borby", text: "Hold off — water starts contractions we'd read as baseline. Record first, then drink all you want." },
      ]);
    }, 700);
  }

  return (
    <>
      <StatusBar />
      <div className="flex items-center gap-3 px-5 pt-3 pb-3 border-b border-hairline">
        <button onClick={() => store.go("home")} className="h-9 w-9 rounded-full bg-peach flex items-center justify-center overflow-hidden">
          <img src={borbyWave} alt="" className="h-8 w-8 object-contain" />
        </button>
        <div className="flex-1">
          <p className="text-[15px] font-black">Borby</p>
          <p className="text-[11px] font-bold text-taupe">Day {store.streak} of 7 · always here</p>
        </div>
      </div>
      <div className="absolute inset-x-0 top-[92px] bottom-[132px] overflow-y-auto px-5 py-4 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.who === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[78%] rounded-[18px] px-3.5 py-2.5 text-[13px] font-semibold leading-snug ${
              m.who === "me" ? "bg-espresso text-cream" : "bg-white border border-hairline text-espresso"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        <div className="rounded-[18px] bg-coral text-cream p-3">
          <p className="text-[11px] font-extrabold opacity-90">Closes in 48 min</p>
          <button onClick={() => store.go("preGate")} className="mt-2 w-full rounded-full bg-cream text-coral-deep py-2 text-[13px] font-extrabold">
            Start fasted recording
          </button>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-12 px-4">
        <div className="flex gap-2 mb-2">
          {["My week", "What's next", "Skip today"].map((s) => (
            <button key={s} onClick={() => send(s)} className="rounded-full bg-white border border-hairline px-3 py-1.5 text-[11px] font-extrabold text-espresso">
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Borby anything"
            className="flex-1 rounded-full bg-white border border-hairline px-4 py-2.5 text-[13px] font-semibold placeholder:text-taupe focus:outline-none focus:border-coral"
          />
          <button type="submit" className="rounded-full bg-coral text-cream px-4 text-[13px] font-extrabold">Send</button>
        </form>
      </div>
      <HomeIndicator />
    </>
  );
}

/* =================================================================
   Screens — Pre-gate + recording
================================================================= */

function PreGateScreen({ store }: { store: Store }) {
  const [checks, setChecks] = useState([false, false, false, false]);
  const items = ["Phone case off, bare skin", "Sitting upright", "Nothing eaten or drunk yet", "Room is quiet"];
  const all = checks.every(Boolean);
  return (
    <>
      <StatusBar />
      <div className="px-6 pt-4 flex items-center gap-2">
        <p className="text-[13px] font-extrabold">Fasted morning</p>
        <span className="ml-auto rounded-full bg-sand px-2.5 py-1 text-[10px] font-extrabold text-taupe">Step 1 of 3</span>
      </div>
      <div className="px-6 mt-4">
        <h1 className="text-[26px] font-black leading-tight">Quick gate</h1>
        <p className="mt-2 text-[13px] font-bold text-taupe leading-snug">
          All four have to be true. If one isn't, skip — a compromised clip is worse than a missing one.
        </p>
        <div className="mt-5 space-y-2">
          {items.map((it, i) => (
            <button
              key={i}
              onClick={() => setChecks((c) => c.map((v, j) => (j === i ? !v : v)))}
              className="w-full flex items-center gap-3 rounded-[18px] bg-sand p-3.5 text-left"
            >
              <span className={`h-7 w-7 rounded-full flex items-center justify-center ${checks[i] ? "bg-olive" : "bg-white border border-hairline"}`}>
                {checks[i] && <CheckIcon color="#F7F3EA" />}
              </span>
              <span className="text-[14px] font-extrabold">{it}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-16">
        <button
          disabled={!all}
          onClick={() => store.go("recording")}
          className={`w-full rounded-full py-3.5 text-[15px] font-extrabold ${all ? "bg-espresso text-cream" : "bg-espresso/30 text-cream/70"}`}
        >
          Continue
        </button>
        <button onClick={() => store.go("home")} className="mt-3 w-full text-center text-[13px] font-bold text-taupe">
          Skip this session instead
        </button>
      </div>
      <HomeIndicator />
    </>
  );
}

function RecordingScreen({ store }: { store: Store }) {
  const [elapsed, setElapsed] = useState(0);
  const total = 15; // sped up for prototype
  useEffect(() => {
    if (elapsed >= total) { store.go("sideSwitch"); return; }
    const t = setTimeout(() => setElapsed((e) => e + 1), 200);
    return () => clearTimeout(t);
  }, [elapsed]);

  const mm = Math.floor((elapsed * 12) / 60);
  const ss = String((elapsed * 12) % 60).padStart(2, "0");

  return (
    <>
      <StatusBar tint="cream" />
      <div className="px-6 pt-3">
        <div className="mx-auto flex w-full max-w-[220px] rounded-full bg-white/15 p-1 text-[12px] font-extrabold text-cream">
          <div className="flex-1 rounded-full bg-cream py-1.5 text-center text-coral-deep">Right side</div>
          <div className="flex-1 py-1.5 text-center opacity-80">Left side</div>
        </div>
      </div>
      <div className="flex flex-col items-center pt-6">
        <div className="relative flex h-52 w-52 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
          <span className="absolute inset-4 rounded-full bg-white/10" />
          <img src={borbyMeditate} alt="" className="relative h-40 w-40 object-contain" />
        </div>
        <p className="mt-4 text-[46px] font-black text-cream leading-none tracking-tight tabular-nums">
          {mm}:{ss}
        </p>
        <p className="mt-2 text-[12px] font-bold text-cream/80">of 3:00 · hold still, breathe normally</p>
        <div className="mt-5 flex h-12 items-end gap-[3px] px-6">
          {Array.from({ length: 34 }).map((_, i) => {
            const active = i / 34 < elapsed / total;
            const h = 8 + Math.abs(Math.sin(i * 0.9 + elapsed * 0.3)) * 32 + (i % 3) * 4;
            return <span key={i} className={`w-[3px] rounded-full ${active ? "bg-cream" : "bg-cream/40"}`} style={{ height: `${Math.min(h, 46)}px` }} />;
          })}
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-20">
        <button onClick={() => store.go("sideSwitch")} className="w-full rounded-full bg-cream text-coral-deep py-3.5 text-[14px] font-extrabold">
          Stop early
        </button>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-cream/85">
          <ShieldIcon color="#F7F3EA" />
          Case off · bare skin · quiet room
        </div>
      </div>
      <HomeIndicator tint="cream" />
    </>
  );
}

function SideSwitchScreen({ store }: { store: Store }) {
  return (
    <>
      <StatusBar tint="cream" />
      <div className="flex flex-col items-center justify-center pt-20">
        <img src={borbyHop} alt="" className="h-52 w-52 object-contain" />
        <h1 className="mt-4 px-8 text-center text-[30px] font-black text-cream leading-tight">Now the other side</h1>
        <p className="mt-3 px-8 text-center text-[13px] font-bold text-cream/85">
          Same spot, left of your navel. Take your time.
        </p>
      </div>
      <div className="absolute inset-x-6 bottom-16">
        <button onClick={() => store.go("uploading")} className="w-full rounded-full bg-cream text-coral-deep py-3.5 text-[15px] font-extrabold">
          I'm ready
        </button>
      </div>
      <HomeIndicator tint="cream" />
    </>
  );
}

function UploadingScreen({ store }: { store: Store }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (pct >= 100) {
      const t = setTimeout(() => {
        // 20% chance of flagged for demo variety
        store.go(Math.random() < 0.2 ? "flagged" : "passed");
      }, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPct((p) => Math.min(100, p + 4)), 60);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <>
      <StatusBar />
      <div className="flex flex-col items-center justify-center pt-24">
        <div className="relative h-48 w-48">
          <svg viewBox="0 0 100 100" className="absolute inset-0">
            <circle cx="50" cy="50" r="46" stroke="#F0EDE7" strokeWidth="6" fill="none" />
            <circle
              cx="50" cy="50" r="46" stroke="#DB6A3A" strokeWidth="6" fill="none"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - pct / 100)}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <img src={borbyMeditate} alt="" className="absolute inset-4 h-40 w-40 object-contain" />
        </div>
        <h1 className="mt-6 text-[24px] font-black">Sending it over</h1>
        <p className="mt-2 text-[13px] font-bold text-taupe px-8 text-center">
          Encrypted and on its way to the study team.
        </p>
        <p className="mt-3 text-[11px] font-bold text-taupe">{pct}%</p>
      </div>
      <HomeIndicator />
    </>
  );
}

function PassedScreen({ store }: { store: Store }) {
  useEffect(() => { store.completeSession(); store.addRumbles(40); }, []);
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[42%] bg-olive">
        <StatusBar tint="cream" />
        <div className="flex flex-col items-center pt-2">
          <p className="text-[140px] font-black text-white leading-none tracking-tight">96</p>
        </div>
      </div>
      <div className="relative pt-[42%]">
        <CurveDivider />
        <div className="px-5 -mt-1">
          <p className="text-[13px] font-extrabold text-taupe">Clip quality, both sides</p>
          <h1 className="mt-1 text-[22px] font-black leading-tight">Clean signal. Nothing for you to fix.</h1>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-[18px] bg-sand p-3">
              <p className="text-[11px] font-extrabold text-taupe">Streak</p>
              <p className="text-[18px] font-black mt-0.5">{store.streak} days</p>
            </div>
            <div className="rounded-[18px] bg-sage p-3">
              <p className="text-[11px] font-extrabold text-taupe">Today</p>
              <p className="text-[18px] font-black mt-0.5">{store.sessions} of {store.totalSessions}</p>
            </div>
          </div>
          <div className="mt-3 rounded-[20px] border-[1.5px] border-hairline bg-white p-3">
            <p className="text-[13px] font-extrabold">Signal check</p>
            <div className="mt-2 space-y-1 text-[12px] font-bold">
              <SignalRow label="Noise floor" value="24 dB" />
              <SignalRow label="Motion artifact" value="None" />
              <SignalRow label="Usable audio" value="3:00" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-16">
        <PrimaryBtn onClick={() => store.go("reward")}>Continue</PrimaryBtn>
      </div>
      <HomeIndicator />
    </>
  );
}

function SignalRow({ label, value, tone = "olive" }: { label: string; value: string; tone?: "olive" | "coral" }) {
  return (
    <div className="flex justify-between">
      <span className="text-taupe">{label}</span>
      <span className={`font-extrabold ${tone === "coral" ? "text-coral" : "text-olive"}`}>{value}</span>
    </div>
  );
}

function FlaggedScreen({ store }: { store: Store }) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[42%] bg-coral">
        <StatusBar tint="cream" />
        <div className="flex flex-col items-center pt-2">
          <p className="text-[140px] font-black text-white leading-none tracking-tight">41</p>
        </div>
      </div>
      <div className="relative pt-[42%]">
        <CurveDivider />
        <div className="px-5 -mt-1">
          <p className="text-[13px] font-extrabold text-taupe">Clip quality</p>
          <h1 className="mt-1 text-[22px] font-black leading-tight">Too much background noise</h1>
          <div className="mt-3 rounded-[20px] border-[1.5px] border-hairline bg-white p-3">
            <p className="text-[13px] font-extrabold">Signal check</p>
            <div className="mt-2 space-y-1 text-[12px] font-bold">
              <SignalRow label="Noise floor" value="58 dB" tone="coral" />
              <SignalRow label="Motion artifact" value="Some" tone="coral" />
              <SignalRow label="Usable audio" value="1:12" tone="coral" />
            </div>
          </div>
          <div className="mt-3 rounded-[20px] bg-peach p-3 flex items-center gap-3">
            <img src={borbyWave} alt="" className="h-12 w-12 object-contain" />
            <p className="text-[12px] font-bold leading-snug">
              That one won't be usable. Want to redo it while you're still fasted?
            </p>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-16 space-y-2">
        <PrimaryBtn onClick={() => store.go("recording")}>Redo now</PrimaryBtn>
        <button onClick={() => store.go("home")} className="w-full text-center text-[13px] font-bold text-taupe">
          Skip this session
        </button>
      </div>
      <HomeIndicator />
    </>
  );
}

function RewardScreen({ store }: { store: Store }) {
  const pct = Math.min(100, Math.round(((store.rumbles) / 580) * 100));
  return (
    <>
      <StatusBar />
      <div className="flex flex-col items-center justify-center pt-20">
        <BalloonNumber value="40" />
        <p className="mt-6 text-[20px] font-black">Rumbles collected</p>
        <span className="mt-3 rounded-full bg-white px-3 py-1 text-[11px] font-extrabold border border-hairline">Session complete</span>
      </div>
      <div className="absolute inset-x-5 bottom-24 rounded-[22px] bg-white p-4 border border-hairline">
        <p className="text-[13px] font-extrabold">Study compensation</p>
        <p className="text-[12px] font-bold text-taupe mt-0.5">$25 unlocked · {Math.max(0, 580 - store.rumbles)} to go for $75</p>
        <div className="mt-2.5 h-2 rounded-full bg-hairline overflow-hidden">
          <div className="h-full bg-coral" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-8">
        <PrimaryBtn onClick={() => store.go("home")}>Back to home</PrimaryBtn>
      </div>
    </>
  );
}

/* =================================================================
   Screens — Logs
================================================================= */

const severityFaces = [
  { label: "None", color: "#5C7A3D" },
  { label: "Mild", color: "#D8B94A" },
  { label: "Some", color: "#8A8175" },
  { label: "A lot", color: "#DB6A3A" },
  { label: "Severe", color: "#A98BC0" },
];

function SymptomScreen({ store }: { store: Store }) {
  const [sel, setSel] = useState(1);
  const [tags, setTags] = useState<string[]>(["Cramping"]);
  const allTags = ["Cramping", "Urgency", "Nausea", "Gas", "Reflux"];
  return (
    <>
      <StatusBar />
      <div className="px-6 pt-4 flex items-center gap-2">
        <p className="text-[13px] font-extrabold">Daily symptoms</p>
        <span className="ml-auto rounded-full bg-sand px-2.5 py-1 text-[10px] font-extrabold text-taupe">2 of 5</span>
      </div>
      <div className="px-6 mt-3">
        <h1 className="text-[24px] font-black leading-tight">How bloated do you feel right now?</h1>
        <p className="mt-1.5 text-[12px] font-bold text-taupe">Since your last recording</p>
        <div className="mt-6 flex items-end justify-between">
          {severityFaces.map((f, i) => (
            <button key={i} onClick={() => setSel(i)} className={`flex flex-col items-center gap-1.5 transition ${sel === i ? "scale-110" : "opacity-40"}`}>
              <span className="rounded-full flex items-center justify-center relative" style={{ background: f.color, width: sel === i ? 46 : 36, height: sel === i ? 46 : 36 }}>
                <span className="absolute inset-0 flex items-center justify-center text-white text-[12px] font-black">•‿•</span>
              </span>
              <span className="text-[10px] font-extrabold text-taupe">{f.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-[20px] bg-white border border-hairline p-4">
          <p className="text-[13px] font-extrabold">Anything else going on?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {allTags.map((t) => {
              const on = tags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => setTags((ts) => on ? ts.filter((x) => x !== t) : [...ts, t])}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-extrabold ${on ? "bg-espresso text-cream" : "bg-sand text-espresso"}`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-16">
        <PrimaryBtn onClick={() => { store.addRumbles(10); store.flowActive ? store.finishCurrentStep() : store.go("meal"); }}>Continue</PrimaryBtn>
      </div>
      <HomeIndicator />
    </>
  );
}

function MealScreen({ store }: { store: Store }) {
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const options = ["Dairy", "Gluten", "Spicy", "Alcohol", "High FODMAP"];
  return (
    <>
      <StatusBar />
      <div className="px-6 pt-6">
        <h1 className="text-[26px] font-black leading-tight">What did you eat?</h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Oatmeal, black coffee"
          className="mt-4 w-full h-24 rounded-[18px] border border-hairline bg-white p-3 text-[14px] font-semibold placeholder:text-taupe focus:outline-none focus:border-coral resize-none"
        />
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full bg-sand px-3 py-1.5 text-[12px] font-extrabold text-espresso">12:15 PM</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((t) => {
            const on = tags.includes(t);
            return (
              <button
                key={t}
                onClick={() => setTags((ts) => on ? ts.filter((x) => x !== t) : [...ts, t])}
                className={`rounded-full px-3 py-1.5 text-[12px] font-extrabold ${on ? "bg-coral text-cream" : "bg-white border border-hairline text-espresso"}`}
              >
                {t}
              </button>
            );
          })}
        </div>
        <div className="mt-5 rounded-[18px] bg-sand p-3 flex items-center gap-3">
          <img src={borbyWave} alt="" className="h-10 w-10 object-contain" />
          <p className="text-[12px] font-bold leading-snug">No snacks until 3:10 PM — I'll remind you.</p>
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-16">
        <PrimaryBtn onClick={() => { store.addRumbles(10); store.go("sleep"); }}>Log it</PrimaryBtn>
      </div>
      <HomeIndicator />
    </>
  );
}

function SleepScreen({ store }: { store: Store }) {
  const [minutes, setMinutes] = useState(6 * 60 + 40);
  const [wake, setWake] = useState<"Not at all" | "Once or twice" | "More than that">("Once or twice");
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return (
    <>
      <StatusBar />
      <div className="px-6 pt-6">
        <h1 className="text-[26px] font-black leading-tight">How did you sleep?</h1>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={() => setMinutes((x) => Math.max(0, x - 30))} className="h-10 w-10 rounded-full bg-sand text-[20px] font-black">−</button>
          <p className="text-[40px] font-black tracking-tight w-44 text-center">{h} h {m.toString().padStart(2, "0")} m</p>
          <button onClick={() => setMinutes((x) => Math.min(720, x + 30))} className="h-10 w-10 rounded-full bg-sand text-[20px] font-black">+</button>
        </div>
        <p className="mt-8 text-[14px] font-extrabold">Woke during the night?</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {(["Not at all", "Once or twice", "More than that"] as const).map((w) => (
            <button
              key={w}
              onClick={() => setWake(w)}
              className={`rounded-full px-3 py-2 text-[12px] font-extrabold ${wake === w ? "bg-coral text-cream" : "bg-white border border-hairline text-espresso"}`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-16">
        <PrimaryBtn onClick={() => { store.addRumbles(10); store.go("home"); }}>Save</PrimaryBtn>
      </div>
      <HomeIndicator />
    </>
  );
}

function DayCompleteScreen({ store }: { store: Store }) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[46%] bg-peach">
        <StatusBar />
        <div className="flex justify-center mt-6">
          <img src={borbySleep} alt="" className="h-40 w-40 object-contain" />
        </div>
      </div>
      <div className="relative pt-[46%]">
        <CurveDivider />
        <div className="px-6 -mt-1">
          <h1 className="text-[28px] font-black leading-tight">That's the day</h1>
          <p className="mt-2 text-[13px] font-bold text-taupe">All four sessions, all five logs. Tomorrow starts at 6:40.</p>
          <div className="mt-4 rounded-[20px] bg-sand p-4 space-y-1.5">
            {[["6:40 AM", "Fasted"], ["11:40 AM", "Before lunch"], ["3:10 PM", "After lunch"], ["9:00 PM", "Evening"]].map(([t, l]) => (
              <div key={l} className="flex justify-between text-[12px] font-bold">
                <span className="text-taupe">{t}</span>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-16">
        <button onClick={() => store.go("home")} className="w-full text-center text-[13px] font-bold text-taupe">Close</button>
      </div>
      <HomeIndicator />
    </>
  );
}

/* =================================================================
   Screens — Engagement
================================================================= */

function StreakScreen({ store }: { store: Store }) {
  const states = ["lit", "lit", "lit", "today", "off", "off", "off"] as const;
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const pct = Math.min(100, Math.round((store.rumbles / 580) * 100));
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[36%] bg-espresso">
        <StatusBar tint="cream" />
        <div className="flex justify-center mt-4">
          <img src={borbyFire} alt="" className="h-32 w-32 object-contain" />
        </div>
      </div>
      <div className="relative pt-[36%]">
        <CurveDivider />
        <div className="px-5 -mt-1">
          <h1 className="text-[26px] font-black leading-tight">Three days lit</h1>
          <p className="mt-1 text-[13px] font-bold text-taupe">Keep it going through Sunday</p>
          <div className="mt-4 flex justify-between">
            {states.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                  s === "lit" ? "bg-coral text-cream" : s === "today" ? "bg-peach text-coral-deep" : "bg-hairline text-taupe"
                }`}><FlameIcon /></div>
                <span className="text-[10px] font-extrabold text-taupe">{labels[i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[18px] bg-sage p-3 flex items-start gap-2">
            <ShieldIcon />
            <p className="text-[12px] font-bold leading-snug">
              A protocol skip keeps the fire lit. Only a silent no-show puts it out.
            </p>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-[13px] font-extrabold">Rumbles</span>
            <span className="text-[26px] font-black text-coral leading-none">{store.rumbles}</span>
          </div>
          <div className="mt-3 rounded-[20px] border-[1.5px] border-hairline p-3">
            <p className="text-[12px] font-extrabold">Study compensation</p>
            <div className="mt-2 h-2 rounded-full bg-hairline overflow-hidden">
              <div className="h-full bg-coral" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] font-bold text-taupe">
              <span>$25 unlocked</span>
              <span>{Math.max(0, 580 - store.rumbles)} to go for $75</span>
            </div>
          </div>
        </div>
      </div>
      <PillNav active="flame" go={store.go} />
      <HomeIndicator />
    </>
  );
}

function WeekScreen({ store }: { store: Store }) {
  const cells = useMemo(() => {
    const arr: ("clean" | "redo" | "skip" | "future")[] = [];
    for (let i = 0; i < 28; i++) {
      if (i < 11) arr.push(Math.random() < 0.15 ? "redo" : Math.random() < 0.1 ? "skip" : "clean");
      else arr.push("future");
    }
    return arr;
  }, []);
  const color = (s: string) => s === "clean" ? "bg-olive" : s === "redo" ? "bg-coral" : s === "skip" ? "bg-sand" : "bg-hairline";
  return (
    <>
      <StatusBar />
      <div className="px-5 pt-4">
        <h1 className="text-[26px] font-black leading-tight">Your week</h1>
        <p className="mt-1 text-[13px] font-bold text-taupe">Day {store.streak} of 7 · 11 sessions banked</p>
        <div className="mt-5 rounded-[22px] bg-white border border-hairline p-4">
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((c, i) => (
              <span key={i} className={`aspect-square rounded-md ${color(c)}`} />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-extrabold text-taupe">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-olive" />Clean</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-coral" />Redo</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-sand" />Skip</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-hairline" />Future</span>
          </div>
        </div>
        <div className="mt-3 rounded-[18px] bg-sage p-3 text-[12px] font-bold leading-snug">
          Wednesday's skip kept your streak. Good call — that's the rule working.
        </div>
        <p className="mt-4 text-[12px] font-extrabold text-taupe">Logged today</p>
        <div className="mt-2 space-y-2">
          <ListRow title="Lunch · Oatmeal, coffee" meta="12:15 PM" onClick={() => store.go("meal")} />
          <ListRow title="Sleep · 6 h 40 m" meta="Last night" onClick={() => store.go("sleep")} />
        </div>
      </div>
      <PillNav active="chart" go={store.go} />
      <HomeIndicator />
    </>
  );
}

function ProfileScreen({ store }: { store: Store }) {
  return (
    <>
      <StatusBar />
      <div className="flex flex-col items-center pt-6">
        <img src={borbyWave} alt="" className="h-36 w-36 object-contain" />
        <p className="mt-2 text-[13px] font-extrabold text-taupe">Participant · GS-2847</p>
        <p className="text-[18px] font-black">Day {store.streak} of 7</p>
      </div>
      <div className="px-5 mt-6 space-y-2">
        <ListRow title="Schedule" meta="Wake 7:00 AM · Anchor Lunch" onClick={() => store.go("schedule")} />
        <ListRow title="Reminders" meta="Push · haptic" />
        <ListRow title="Data and privacy" meta="Encrypted uploads" />
        <ListRow title="Protocol reference" meta="The rules" />
        <ListRow title="Talk to a person" meta="Study coordinator" />
        <button className="w-full text-left rounded-[20px] border-[1.5px] border-hairline bg-white p-3 flex items-center gap-3">
          <div className="h-[38px] w-[38px] rounded-xl bg-sand flex items-center justify-center"><ShieldIcon color="#DB6A3A" /></div>
          <div className="flex-1">
            <p className="text-[14px] font-extrabold text-coral">Withdraw from study</p>
            <p className="text-[11px] font-bold text-taupe mt-0.5">IRB-2024-XXXXX</p>
          </div>
        </button>
      </div>
      <PillNav active="profile" go={store.go} />
      <HomeIndicator />
    </>
  );
}

/* silence unused-import warnings safely */
const _keep = { useRef };
void _keep;