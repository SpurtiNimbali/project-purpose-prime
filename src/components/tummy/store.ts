import { useState, useCallback } from "react";

export type ScreenKey =
  // onboarding
  | "welcome"
  | "studyIntro"
  | "subjectId"
  | "protocolIntro"
  | "video"
  | "quiz"
  | "technicalSetup"
  | "permissions"
  | "practice"
  | "practiceRun"
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
  kind: "recording" | "waiting" | "meal" | "questions";
  tag: string;
  title: string;
  sub: string;
  note?: string;
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
  nextTask: NextTask;
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
  {
    id: "fasting",
    label: "Fasting (morning)",
    done: true,
    at: 7 * 60 + 30,
    window: "6:30 – 8:30 am",
  },
  {
    id: "m30",
    label: "Breakfast + 30 min",
    done: true,
    at: 8 * 60 + 35,
    window: "30 min after breakfast",
  },
  {
    id: "m90",
    label: "Breakfast + 90 min",
    done: false,
    at: 9 * 60 + 35,
    window: "90 min after breakfast",
  },
  {
    id: "m210",
    label: "Breakfast + 3.5 hrs",
    done: false,
    at: 11 * 60 + 35,
    window: "3.5 hrs after breakfast",
  },
];

/** Single source of truth for "what should I do right now". */
export function computeNextTask(
  sessions: Session[],
  entries: LogEntry[],
  questions: { morning: boolean; night: boolean } = { morning: false, night: false },
): NextTask {
  const now = minutesNow();
  const mealLogged = entries.some((e) => e.kind === "meal");
  const fasting = sessions.find((s) => s.id === "fasting");
  const pending = sessions.filter((s) => !s.done);
  const upcoming = pending[0];

  // 1 — fasting recording comes first, before anything else
  if (fasting && !fasting.done) {
    return {
      kind: "recording",
      tag: "Gut sound recording",
      title: "Fasting recording",
      sub: "Before any food, drink or activity. Case off, quiet room, sit still.",
      cta: "Start recording",
      screen: "caseReminder",
      state: "due",
      minsUntil: null,
      sessionId: "fasting",
    };
  }

  // 2 — morning questions, right after the fasting recording
  if (!questions.morning) {
    return {
      kind: "questions",
      tag: "Morning questions",
      title: "A few questions about your morning",
      sub: "Sleep, symptoms and toilet habits — about two minutes.",
      cta: "Answer questions",
      screen: "logSleep",
      state: "due",
      minsUntil: null,
    };
  }

  // 3 — the anchor meal the post-meal recordings run from
  if (!mealLogged) {
    return {
      kind: "meal",
      tag: "Meal logging",
      title: "Log the meal your timers run from",
      sub: "Type it or record it — the three recordings are timed from this meal.",
      cta: "Log the meal",
      screen: "logMeal",
      state: "due",
      minsUntil: null,
    };
  }

  if (upcoming) {
    const mins = upcoming.at - now;
    if (mins <= 10) {
      return {
        kind: "recording",
        tag: "Gut sound recording",
        title: upcoming.label,
        sub:
          mins < -30
            ? "This window is closing — record now or mark it missed."
            : "Case off, quiet room, sit still.",
        cta: "Start recording",
        screen: "caseReminder",
        state: "due",
        minsUntil: null,
        sessionId: upcoming.id,
      };
    }
    return {
      kind: "waiting",
      tag: "Waiting",
      title: upcoming.label,
      sub: `You're clear until ${clockLabel(upcoming.at)}.`,
      note: "No food, snacks or drinks other than water for the 3 hours after your meal. If you want water, have it in the 5 minutes right after a recording.",
      cta: "Open today's recordings",
      screen: "sessionHub",
      state: "soon",
      minsUntil: mins,
      sessionId: upcoming.id,
    };
  }

  // 4 — end of day questions
  if (!questions.night) {
    return {
      kind: "questions",
      tag: "Evening questions",
      title: "A few questions about your day",
      sub: "Sleep, symptoms and toilet habits — about two minutes.",
      cta: "Answer questions",
      screen: "logSleep",
      state: now >= 17 * 60 ? "due" : "soon",
      minsUntil: now >= 17 * 60 ? null : 17 * 60 - now,
    };
  }

  return {
    kind: "waiting",
    tag: "All caught up",
    title: "Nothing due right now",
    sub: "Everything for today is recorded and logged.",
    cta: "Log something anyway",
    screen: "logHub",
    state: "clear",
    minsUntil: null,
  };
}


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

  const nextTask = computeNextTask(sessions, entries);

  return {
    nextTask,

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
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          kind,
          label,
          detail,
          time: nowLabel(),
        },
      ]),
    chatOpen,
    setChatOpen,
  };
}
