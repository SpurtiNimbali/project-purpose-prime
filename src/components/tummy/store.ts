import { useState, useCallback } from "react";

export type ScreenKey =
  // onboarding
  | "welcome"
  | "studyIntro"
  | "subjectId"
  | "survey"
  | "protocolIntro"
  | "video"
  | "quiz"
  | "technicalSetup"
  | "permissions"
  | "practice"
  | "scheduling"
  | "onboardDone"
  // main
  | "home"
  | "sessionHub"
  | "caseReminder"
  | "fastingCheck"
  | "whichMeal"
  | "mealCapture"
  | "sessionCheck"
  | "positioning"
  | "recording"
  | "postMeta"
  | "uploadDone"
  // logging
  | "logHub"
  | "logMeal"
  | "logSymptom"
  | "logSleep"
  | "logActivity"
  | "logHydration"
  | "logToilet"
  // other
  | "progress"
  | "profile";

export type Track = "fasting" | "postMeal";
export type Meal = "breakfast" | "lunch" | "dinner";

export type SymptomMark = { key: string; label: string; at: number; severity: number };

export type Session = {
  id: string;
  label: string;
  done: boolean;
  /** minutes from midnight for the scheduled window */
  at: number;
  window: string;
};

export type NextTask = {
  tag: string;
  title: string;
  sub: string;
  cta: string;
  screen: ScreenKey;
  state: "due" | "soon" | "clear";
  minsUntil: number | null;
  sessionId?: string;
};


export type LogKind =
  | "meal"
  | "symptom"
  | "sleep"
  | "activity"
  | "hydration"
  | "toilet"
  | "recording";

export type LogEntry = {
  id: string;
  kind: LogKind;
  label: string;
  detail?: string;
  time: string;
};

export type TummyStore = {
  screen: ScreenKey;
  go: (s: ScreenKey) => void;
  back: () => void;
  track: Track;
  setTrack: (t: Track) => void;
  meal: Meal;
  setMeal: (m: Meal) => void;
  offset: 30 | 90 | 210;
  setOffset: (o: 30 | 90 | 210) => void;
  side: "right" | "left";
  setSide: (s: "right" | "left") => void;
  region: "upper" | "lower";
  setRegion: (r: "upper" | "lower") => void;
  marks: SymptomMark[];
  addMark: (m: SymptomMark) => void;
  resetMarks: () => void;
  sessions: Session[];
  completeSession: (id: string) => void;
  day: number;
  entries: LogEntry[];
  addEntry: (kind: LogKind, label: string, detail?: string) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
};

export function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function clockLabel(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function minutesNow() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

const INITIAL_SESSIONS: Session[] = [
  { id: "fasting", label: "Fasting (morning)", done: true, at: 7 * 60 + 30, window: "6:30 – 8:30 am" },
  { id: "m30", label: "Breakfast + 30 min", done: true, at: 8 * 60 + 35, window: "30 min after breakfast" },
  { id: "m90", label: "Breakfast + 90 min", done: false, at: 9 * 60 + 35, window: "90 min after breakfast" },
  { id: "m210", label: "Breakfast + 3.5 hrs", done: false, at: 11 * 60 + 35, window: "3.5 hrs after breakfast" },
];


export function useTummyStore(): TummyStore {
  const [stack, setStack] = useState<ScreenKey[]>(["welcome"]);

  const [track, setTrack] = useState<Track>("fasting");
  const [meal, setMeal] = useState<Meal>("breakfast");
  const [offset, setOffset] = useState<30 | 90 | 210>(30);
  const [side, setSide] = useState<"right" | "left">("right");
  const [region, setRegion] = useState<"upper" | "lower">("lower");
  const [marks, setMarks] = useState<SymptomMark[]>([]);
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [entries, setEntries] = useState<LogEntry[]>([
    { id: "seed-1", kind: "sleep", label: "Sleep", detail: "7 hrs · slept well", time: "7:10 am" },
    {
      id: "seed-2",
      kind: "recording",
      label: "Gut sound recording",
      detail: "Fasting · both sides",
      time: "7:35 am",
    },
    { id: "seed-3", kind: "meal", label: "Breakfast", detail: "Oats and berries", time: "8:05 am" },
  ]);
  const [chatOpen, setChatOpen] = useState(false);


  const go = useCallback((s: ScreenKey) => {
    setStack((prev) => [...prev, s]);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);
  const back = useCallback(
    () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)),
    [],
  );

  return {
    screen: stack[stack.length - 1],
    go,
    back,
    track,
    setTrack,
    meal,
    setMeal,
    offset,
    setOffset,
    side,
    setSide,
    region,
    setRegion,
    marks,
    addMark: (m) => setMarks((prev) => [...prev, m]),
    resetMarks: () => setMarks([]),
    sessions,
    completeSession: (id) =>
      setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, done: true } : s))),
    day: 3,
    entries,
    addEntry: (kind, label, detail) =>
      setEntries((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, kind, label, detail, time: nowLabel() },
      ]),
    chatOpen,
    setChatOpen,
  };
}
