import { useState, useCallback } from "react";

export type ScreenKey =
  // onboarding
  | "welcome"
  | "subjectId"
  | "aboutYou"
  | "protocolIntro"
  | "video"
  | "quiz"
  | "technicalSetup"
  | "permissions"
  | "practiceRun"
  | "scheduling"
  | "mealPick"
  | "snacking"
  | "onboardDone"
  // main
  | "home"
  | "sessionHub"
  | "caseReminder"
  | "fastingCheck"
  | "whichMeal"
  | "mealCapture"
  | "mealEnd"
  | "sessionCheck"
  | "positioning"
  | "recording"
  | "postMeta"
  | "uploadDone"
  | "extraSession"
  | "skipReason"
  | "snackSkip"
  // logging
  | "logHub"
  | "logMeal"
  | "logSymptom"
  | "logSleep"
  | "morningQuestions"
  | "eveningCheckin"
  | "logActivity"
  | "logHydration"
  | "logToilet"
  | "periodCheck"
  // other
  | "progress"
  | "profile"
  | "contact"
  | "contactForm";

export type Gender = "female" | "male" | "other" | "unsaid";

export type Track = "fasting" | "postMeal";
export type Meal = "breakfast" | "lunch" | "dinner";

/** Which of the protocol's session types is being recorded. */
export type SessionKind = "fasted" | "preMeal" | "postMeal" | "extra";

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
  reason?: string;
  window: string;
  /** recordings only */
  fasting?: boolean;
  sessionKind?: SessionKind;
  /** minutes after the end of the study meal, post-meal recordings only */
  offset?: number;
  /** meals only */
  meal?: Meal;
  /** a diary entry for a meal or snack outside the study meal */
  mealLog?: boolean;
};

/** Kept for older call sites, recordings only. */
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
  sessionKind: SessionKind;
  setSessionKind: (k: SessionKind) => void;
  startExtraSession: () => void;
  meal: Meal;
  setMeal: (m: Meal) => void;
  /** pick the study meal during onboarding, rebuilds the day's plan around it */
  chooseStudyMeal: (m: Meal) => void;
  /** tick off a scheduled diary item that matches what was just logged */
  completeMealLog: (which: string) => void;
  freezeUsed: boolean;
  /** today's plan is paused, no recordings, meals or questions expected */
  frozen: boolean;
  useFreeze: () => void;

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
  missItem: (id: string, reason?: string) => void;
  /** snack or non-water drink inside the meal window, skip everything after it */
  skipRemainingAfterSnack: (reason: string) => number;
  completeSession: (id: string) => void;
  /** minutes-from-midnight of the last finished recording, for the water rule */
  lastRecordingAt: number | null;
  day: number;
  entries: LogEntry[];
  addEntry: (kind: LogKind, label: string, detail?: string) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  questions: { morning: boolean; night: boolean };
  markQuestions: (when: "morning" | "night") => void;
  nextTask: NextTask;
  gender: Gender;
  /** prototype clock: current simulated minutes from midnight */
  demoNow: number;
  setDemoNow: (mins: number) => void;
  setGender: (g: Gender) => void;
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

/** Prototype-only clock shift, in minutes, so the demo can jump through the day. */
let demoShift = 0;

export function realMinutesNow() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

export function getDemoShift() {
  return demoShift;
}

export function setDemoShift(mins: number) {
  demoShift = mins;
}

export function minutesNow() {
  return ((realMinutesNow() + demoShift) % (24 * 60) + 24 * 60) % (24 * 60);
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

export const WINDOW_RULE =
  "No food or drink until the 3.5 hours are up. Water only if you need it: one cup, straight after a recording.";

export const QUALITY_RULE =
  "Quality over quantity. If you can't record properly, skip it and tell us why.";

/** Post-meal recording offsets in minutes, measured from the END of the meal. */
export const POST_MEAL_OFFSETS = [0, 30, 60, 90, 120, 150, 180, 210];

function offsetLabel(off: number) {
  if (off === 0) return "Right after the meal";
  if (off < 60) return `${off} min after the meal`;
  const h = off / 60;
  return `${h % 1 === 0 ? h : h.toFixed(1)} hr after the meal`;
}

/** The day's plan, in clock order, with nothing done yet. */
const MEAL_TIMES: Record<Meal, number> = {
  breakfast: 8 * 60,
  lunch: 12 * 60 + 30,
  dinner: 19 * 60,
};

function createInitialPlan(meal: Meal = "breakfast"): PlanItem[] {
  const wake = 7 * 60; // 7:00 am
  const mealStartAt = MEAL_TIMES[meal];
  const mealEndAt = mealStartAt + 25;
  const mealName = meal[0].toUpperCase() + meal.slice(1);

  const post: PlanItem[] = POST_MEAL_OFFSETS.map((off) => ({
    id: `p${off}`,
    kind: "recording" as const,
    label:
      off === 0 ? "Right after the meal" : `Meal + ${off < 60 ? `${off} min` : `${off / 60} hr`}`,
    at: mealEndAt + off,
    done: false,
    window: offsetLabel(off),
    sessionKind: "postMeal" as const,
    offset: off,
  }));

  /** everything else you eat that day, as diary entries */
  const otherMeals: PlanItem[] = (["breakfast", "lunch", "dinner"] as Meal[])
    .filter((m) => m !== meal)
    .map((m) => ({
      id: `log-${m}`,
      kind: "meal" as const,
      label: `Log your ${m}`,
      at: MEAL_TIMES[m],
      done: false,
      window: "Photo and time, as soon as you can",
      mealLog: true,
      meal: m,
    }));

  const snacks: PlanItem[] = [
    { id: "logSnackPm", label: "Log your afternoon snack", at: 16 * 60 },
    { id: "logSnackEve", label: "Log your evening snack", at: 20 * 60 + 30 },
  ].map((s) => ({
    id: s.id,
    kind: "meal" as const,
    label: s.label,
    at: s.at,
    done: false,
    window: "Photo, or a quick line of text",
    mealLog: true,
  }));

  const core: PlanItem[] = [
    {
      id: "qMorning",
      kind: "questions",
      label: "Wake-up questions",
      at: wake,
      done: false,
      window: "Before the fasted recording",
    },
    {
      id: "fasted",
      kind: "recording",
      label: "Fasted morning recording",
      at: wake + 10,
      done: false,
      window: "Within 30 min of waking, before any food or drink",
      fasting: true,
      sessionKind: "fasted",
    },
    {
      id: "preMeal",
      kind: "recording",
      label: `Before ${mealName.toLowerCase()}`,
      at: mealStartAt - 5,
      done: false,
      window: "Immediately before you start eating",
      sessionKind: "preMeal",
    },
    {
      id: "mealStart",
      kind: "meal",
      label: `${mealName}, start eating`,
      at: mealStartAt,
      done: false,
      window: "Tap when you take the first bite",
      meal,
    },
    {
      id: "mealEnd",
      kind: "meal",
      label: `${mealName}, finished eating`,
      at: mealEndAt,
      done: false,
      window: "Tap the moment you finish, all timers start here",
      meal,
    },
    ...post,
  ];

  const diary = [...otherMeals, ...snacks].sort((a, b) => a.at - b.at);
  const lastAt = Math.max(...core.map((p) => p.at), ...diary.map((p) => p.at));

  return [
    ...core,
    ...diary,
    {
      id: "qEvening",
      kind: "questions" as const,

      label: "Evening check-in",
      at: Math.max(21 * 60, lastAt + 30),
      done: false,
      window: "Before bed",
    },
  ].sort((a, b) => a.at - b.at);
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
        sub: "Nothing until tomorrow morning.",
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
        tag:
          item.sessionKind === "fasted"
            ? "Fasted recording"
            : item.sessionKind === "preMeal"
              ? "Pre-meal recording"
              : "Post-meal recording",
        title: item.label,
        sub:
          item.sessionKind === "fasted"
            ? "Before food, drink, or moving around. Case off, quiet room, sit upright."
            : item.sessionKind === "preMeal"
              ? "Record now, then start eating straight away."
              : mins < -20
                ? "This one is late — record now, or skip and say why."
                : "Case off, quiet room, sit still. Two minutes minimum.",
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
      note: item.sessionKind === "postMeal" ? WINDOW_RULE : undefined,
      cta: "Open today's plan",
      screen: "sessionHub",
      state: "soon",
      minsUntil: mins,
      itemId: item.id,
      sessionId: item.id,
      fasting: item.fasting,
    };
  }

  if (item.kind === "meal" && item.mealLog) {
    if (due) {
      return {
        kind: "meal",
        tag: "Meal logging",
        title: item.label,
        sub: "Add a photo and the time. A line of text is fine for a snack.",
        cta: "Log it now",
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

  if (item.kind === "meal") {
    const start = item.id === "mealStart";
    if (due) {
      return {
        kind: "meal",
        tag: "Meal logging",
        title: start ? item.label : "Finished eating?",
        sub: start
          ? "Photo of the plate, then tap at the first bite."
          : "Tap when the last bite is done. Recordings time from that.",
        cta: start ? "Start the meal" : "I've finished eating",
        screen: start ? "mealCapture" : "mealEnd",
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
  const evening = item.id === "qEvening";
  if (due) {
    return {
      kind: "questions",
      tag: evening ? "Evening check-in" : "Wake-up questions",
      title: evening ? "A few questions about your day" : "A few questions before you record",
      sub: evening
        ? "What you ate, what you missed, how you felt — about three minutes."
        : "Sleep, food or drink, bathroom, and activity since waking.",
      cta: "Answer questions",
      screen: evening ? "eveningCheckin" : "morningQuestions",
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

  const [gender, setGender] = useState<Gender>("unsaid");
  const [track, setTrack] = useState<Track>("fasting");
  const [sessionKind, setSessionKind] = useState<SessionKind>("fasted");
  const [meal, setMeal] = useState<Meal>("breakfast");
  const [offset, setOffset] = useState<30 | 90 | 210>(30);
  const [side, setSide] = useState<"right" | "left">("right");
  const [region, setRegion] = useState<"upper" | "lower">("lower");
  const [marks, setMarks] = useState<SymptomMark[]>([]);
  const [plan, setPlan] = useState<PlanItem[]>(() => createInitialPlan("breakfast"));
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [lastRecordingAt, setLastRecordingAt] = useState<number | null>(null);
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [demoTick, setDemoTick] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [questions, setQuestions] = useState({ morning: false, night: false });
  const [freezeUsed, setFreezeUsed] = useState(false);
  const [frozen, setFrozen] = useState(false);

  const chooseStudyMeal = useCallback((m: Meal) => {
    setMeal(m);
    setPlan(createInitialPlan(m));
  }, []);


  const go = useCallback((s: ScreenKey) => {
    setStack((prev) => [...prev, s]);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);
  const back = useCallback(
    () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)),
    [],
  );

  const completeItem = useCallback((id: string) => {
    const at = minutesNow();
    setPlan((prev) => {
      const completed = prev.find((p) => p.id === id);
      return prev.map((p) => {
        if (p.id === id)
          return { ...p, done: true, at: completed?.kind === "meal" ? at : p.at };
        // every post-meal recording is anchored to the END of the meal
        if (id === "mealEnd" && p.sessionKind === "postMeal" && p.offset !== undefined) {
          return { ...p, at: at + p.offset };
        }
        return p;
      });
    });
    
    const item = plan.find((p) => p.id === id);
    if (item?.kind === "recording") setLastRecordingAt(at);
  }, [plan]);

  const missItem = useCallback((id: string, reason?: string) => {
    setPlan((prev) =>
      prev.map((p) => (p.id === id ? { ...p, done: true, missed: true, reason } : p)),
    );
    setEntries((prev) => [
      ...prev,
      {
        id: `${Date.now()}-miss`,
        kind: "recording",
        label: "Session skipped",
        detail: reason ?? "Marked as skipped",
        time: nowLabel(),
      },
    ]);
  }, []);

  const skipRemainingAfterSnack = useCallback(
    (reason: string) => {
      let count = 0;
      setPlan((prev) =>
        prev.map((p) => {
          if (p.sessionKind === "postMeal" && !p.done) {
            count += 1;
            return { ...p, done: true, missed: true, reason };
          }
          return p;
        }),
      );
      setEntries((prev) => [
        ...prev,
        {
          id: `${Date.now()}-snack`,
          kind: "meal",
          label: "Snack or drink in the meal window",
          detail: `${reason} · remaining post-meal recordings skipped`,
          time: nowLabel(),
        },
      ]);
      return count;
    },
    [],
  );

  const startItem = useCallback(
    (id: string) => {
      setActiveItemId(id);
      const item = plan.find((p) => p.id === id);
      if (item?.kind === "recording") {
        setTrack(item.fasting ? "fasting" : "postMeal");
        setSessionKind(item.sessionKind ?? (item.fasting ? "fasted" : "postMeal"));
      }
    },
    [plan],
  );

  const startExtraSession = useCallback(() => {
    setActiveItemId(null);
    setTrack("postMeal");
    setSessionKind("extra");
  }, []);

  void demoTick;
  const nextTask: NextTask = frozen
    ? {
        kind: "done",
        tag: "Freeze day",
        title: "Today is a freeze day",
        sub: "Nothing to do today. The study picks up tomorrow.",
        cta: "Open today's log",
        screen: "logHub",
        state: "clear",
        minsUntil: null,
      }
    : computeNextTask(plan);

  return {
    demoNow: minutesNow(),
    setDemoNow: (mins: number) => {
      setDemoShift(mins - realMinutesNow());
      setDemoTick((t) => t + 1);
    },
    nextTask,
    gender,
    setGender,
    questions,
    markQuestions: (when) => {
      setQuestions((q) => ({ ...q, [when]: true }));
      completeItem(when === "morning" ? "qMorning" : "qEvening");
    },

    screen: stack[stack.length - 1],
    go,
    back,
    track,
    setTrack,
    sessionKind,
    setSessionKind,
    startExtraSession,
    meal,
    setMeal,
    chooseStudyMeal,
    freezeUsed,
    frozen,
    useFreeze: () => {
      setFreezeUsed(true);
      setFrozen(true);
      setPlan((prev) =>
        prev.map((p) =>
          p.done ? p : { ...p, done: true, missed: true, reason: "Freeze day" },
        ),
      );
      setEntries((prev) => [
        ...prev,
        {
          id: `${Date.now()}-freeze`,
          kind: "recording",
          label: "Freeze day used",
          detail: "Today is paused.",
          time: nowLabel(),
        },
      ]);
    },
    completeMealLog: (which: string) => {
      const key = which.toLowerCase();
      setPlan((prev) => {
        const target =
          prev.find((p) => p.mealLog && !p.done && p.meal === key) ??
          prev.find(
            (p) =>
              p.mealLog &&
              !p.done &&
              (key === "snack" || key === "drink" ? !p.meal : false),
          );
        if (!target) return prev;
        return prev.map((p) => (p.id === target.id ? { ...p, done: true } : p));
      });
    },

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
    skipRemainingAfterSnack,
    completeSession: completeItem,
    lastRecordingAt,
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
