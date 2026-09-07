import { useState, useCallback } from "react";

export type ScreenKey =
  // onboarding
  | "welcome"
  | "studyIntro"
  | "subjectId"
  | "aboutYou"
  | "protocolIntro"
  | "video"
  | "quiz"
  | "technicalSetup"
  | "permissions"
  | "practice"
  | "practiceRun"
  | "scheduling"
  | "snacking"
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

export type PlanKind = "recording" | "meal" | "questions";

export type PlanItem = {
  id: string;
  kind: PlanKind;
  label: string;
  /** minutes from midnight */
  at: number;
  done: boolean;
  missed?: boolean;
  window: string;
  /** recordings only */
  fasting?: boolean;
  /** meals only */
  meal?: Meal;
};

/** Kept for older call sites — recordings only. */
export type Session = PlanItem;

export type NextTask = {
  kind: "recording" | "waiting" | "meal" | "questions" | "done";
  tag: string;
  title: string;
  sub: string;
  note?: string;
  cta: string;
  screen: ScreenKey;
  state: "due" | "soon" | "clear";
  minsUntil: number | null;
  itemId?: string;
  sessionId?: string;
  fasting?: boolean;
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
  plan: PlanItem[];
  sessions: PlanItem[];
  activeItemId: string | null;
  startItem: (id: string) => void;
  completeItem: (id: string) => void;
  missItem: (id: string) => void;
  completeSession: (id: string) => void;
  day: number;
  entries: LogEntry[];
  addEntry: (kind: LogKind, label: string, detail?: string) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  questions: { morning: boolean; night: boolean };
  markQuestions: (when: "morning" | "night") => void;
  nextTask: NextTask;
};

export function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function clockLabel(mins: number) {
  const normalized = ((mins % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function minutesNow() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

export function untilLabel(mins: number) {
  if (mins <= 0) return "now";
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h} hr ${m} min` : `${h} hr`;
  }
  return `${mins} min`;
}

const WATER_NOTE =
  "No food, snacks or drinks other than water for the 3 hours after your meal. If you want water, have it in the 5 minutes right after a recording.";

function createInitialPlan(): PlanItem[] {
  const now = minutesNow();
  return [
  {
    id: "fasting",
    kind: "recording",
    label: "Fasting recording",
    at: now - 95,
    done: true,
    window: "6:30 – 8:30 am",
    fasting: true,
  },
  {
    id: "breakfast",
    kind: "meal",
    label: "Breakfast",
    at: now - 90,
    done: true,
    window: "After the fasting recording",
    meal: "breakfast",
  },
  {
    id: "m30",
    kind: "recording",
    label: "Breakfast + 30 min",
    at: now - 60,
    done: true,
    window: "30 min after breakfast",
  },
  {
    id: "m90",
    kind: "recording",
    label: "Breakfast + 90 min",
    at: now + 30,
    done: false,
    window: "90 min after breakfast",
  },
  {
    id: "m180",
    kind: "recording",
    label: "Breakfast + 3 hrs",
    at: now + 120,
    done: false,
    window: "3 hrs after breakfast",
  },
  {
    id: "qMorning",
    kind: "questions",
    label: "Morning questions",
    at: now + 135,
    done: false,
    window: "After the morning recordings",
  },
  {
    id: "lunch",
    kind: "meal",
    label: "Lunch",
    at: now + 225,
    done: false,
    window: "Whenever you eat",
    meal: "lunch",
  },
  {
    id: "dinner",
    kind: "meal",
    label: "Dinner",
    at: now + 480,
    done: false,
    window: "Whenever you eat",
    meal: "dinner",
  },
  {
    id: "qNight",
    kind: "questions",
    label: "End of day questions",
    at: now + 600,
    done: false,
    window: "Before bed",
  },
  ];
}

/** Single source of truth for "what should I do right now". */
export function computeNextTask(plan: PlanItem[]): NextTask {
  const now = minutesNow();
  const item = plan.find((p) => !p.done);

  if (!item) {
    return {
      kind: "done",
      tag: "All done",
      title: "Everything is done for today",
      sub: "Nothing more until tomorrow morning's fasting recording.",
      cta: "Open today's log",
      screen: "logHub",
      state: "clear",
      minsUntil: null,
    };
  }

  const mins = item.at - now;
  const due = mins <= 10;

  if (item.kind === "recording") {
    if (due) {
      return {
        kind: "recording",
        tag: "Gut sound recording",
        title: item.label,
        sub: item.fasting
          ? "Before any food, drink or activity. Case off, quiet room, sit still."
          : mins < -30
            ? "This window is closing — record now or mark it missed."
            : "Case off, quiet room, sit still. Two minutes.",
        cta: "Start recording",
        screen: "caseReminder",
        state: "due",
        minsUntil: null,
        itemId: item.id,
        sessionId: item.id,
        fasting: item.fasting,
      };
    }
    return {
      kind: "waiting",
      tag: "Waiting",
      title: item.label,
      sub: `You're clear until ${clockLabel(item.at)}.`,
      note: WATER_NOTE,
      cta: "Open today's plan",
      screen: "sessionHub",
      state: "soon",
      minsUntil: mins,
      itemId: item.id,
      sessionId: item.id,
      fasting: item.fasting,
    };
  }

  if (item.kind === "meal") {
    if (due) {
      return {
        kind: "meal",
        tag: "Meal logging",
        title: `Log your ${item.label.toLowerCase()}`,
        sub:
          item.meal === "breakfast"
            ? "Type it or record it — the three recordings are timed from this meal."
            : "Type it or record it. A photo helps but isn't required.",
        cta: `Log ${item.label.toLowerCase()}`,
        screen: "logMeal",
        state: "due",
        minsUntil: null,
        itemId: item.id,
      };
    }
    return {
      kind: "waiting",
      tag: "Waiting",
      title: item.label,
      sub: `Nothing due until around ${clockLabel(item.at)}.`,
      cta: "Open today's plan",
      screen: "sessionHub",
      state: "soon",
      minsUntil: mins,
      itemId: item.id,
    };
  }

  // questions
  if (due) {
    return {
      kind: "questions",
      tag: item.id === "qNight" ? "Evening questions" : "Morning questions",
      title:
        item.id === "qNight"
          ? "A few questions about your day"
          : "A few questions about your morning",
      sub: "Sleep, symptoms and toilet habits — about two minutes.",
      cta: "Answer questions",
      screen: "logSleep",
      state: "due",
      minsUntil: null,
      itemId: item.id,
    };
  }
  return {
    kind: "waiting",
    tag: "Waiting",
    title: item.label,
    sub: `Nothing due until around ${clockLabel(item.at)}.`,
    cta: "Open today's plan",
    screen: "sessionHub",
    state: "soon",
    minsUntil: mins,
    itemId: item.id,
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
  const [plan, setPlan] = useState<PlanItem[]>(createInitialPlan);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [entries, setEntries] = useState<LogEntry[]>([
    { id: "seed-1", kind: "sleep", label: "Sleep", detail: "7 hrs · slept well", time: "7:10 am" },
    {
      id: "seed-2",
      kind: "recording",
      label: "Gut sound recording",
      detail: "Fasting",
      time: "7:35 am",
    },
    { id: "seed-3", kind: "meal", label: "Breakfast", detail: "Oats and berries", time: "8:05 am" },
    {
      id: "seed-4",
      kind: "recording",
      label: "Gut sound recording",
      detail: "Breakfast + 30 min",
      time: "8:35 am",
    },
  ]);
  const [chatOpen, setChatOpen] = useState(false);
  const [questions, setQuestions] = useState({ morning: false, night: false });

  const go = useCallback((s: ScreenKey) => {
    setStack((prev) => [...prev, s]);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);
  const back = useCallback(
    () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)),
    [],
  );

  const completeItem = useCallback((id: string) => {
    setPlan((prev) => {
      const completed = prev.find((p) => p.id === id);
      const mealFinishedAt = minutesNow();
      return prev.map((p) => {
        if (p.id === id) return { ...p, done: true, at: completed?.kind === "meal" ? mealFinishedAt : p.at };
        if (id !== "breakfast") return p;
        if (p.id === "m30") return { ...p, at: mealFinishedAt + 30 };
        if (p.id === "m90") return { ...p, at: mealFinishedAt + 90 };
        if (p.id === "m180") return { ...p, at: mealFinishedAt + 180 };
        if (p.id === "qMorning") return { ...p, at: mealFinishedAt + 195 };
        return p;
      });
    });
  }, []);

  const missItem = useCallback((id: string) => {
    setPlan((prev) =>
      prev.map((p) => (p.id === id ? { ...p, done: true, missed: true } : p)),
    );
    setEntries((prev) => [
      ...prev,
      {
        id: `${Date.now()}-miss`,
        kind: "recording",
        label: "Recording missed",
        detail: "Marked as missed",
        time: nowLabel(),
      },
    ]);
  }, []);

  const startItem = useCallback(
    (id: string) => {
      setActiveItemId(id);
      const item = plan.find((p) => p.id === id);
      if (item?.kind === "recording") setTrack(item.fasting ? "fasting" : "postMeal");
    },
    [plan],
  );

  const nextTask = computeNextTask(plan);

  return {
    nextTask,
    questions,
    markQuestions: (when) => {
      setQuestions((q) => ({ ...q, [when]: true }));
      completeItem(when === "morning" ? "qMorning" : "qNight");
    },

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
    plan,
    sessions: plan.filter((p) => p.kind === "recording"),
    activeItemId,
    startItem,
    completeItem,
    missItem,
    completeSession: completeItem,
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
