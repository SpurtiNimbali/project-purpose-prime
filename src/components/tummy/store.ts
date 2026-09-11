import { useState, useCallback, useEffect } from "react";

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
  | "contactForm"
  | "contactComplaint";

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
  /** auto-missed because the window closed; still needs a why note */
  needsWhy?: boolean;
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
  /** study meal: photo taken and first bite started */
  started?: boolean;
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
  /** freeze days already used, out of FREEZE_DAYS_ALLOWED */
  freezeDaysUsed: number;
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
  markMealStarted: () => void;
  missItem: (id: string, reason?: string) => void;
  /** undo an auto-miss so a recording can still be done */
  reopenItem: (id: string) => void;
  /** days they reported food or drink before the fasted recording */
  brokeFastDays: number;
  /** count today as another broken-fast day; returns the new total */
  noteBrokeFastDay: () => number;
  /** recording auto-closed after its window; ask why in a popup */
  pendingMissAsk: { id: string; label: string } | null;
  explainMiss: (note: string) => void;
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
  gender: Gender | null;
  /** weekday snack times in minutes from midnight; empty if they don't snack */
  snackTimes: number[];
  setSnackTimes: (mins: number[]) => void;
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

const IN_FLIGHT_SCREENS: ScreenKey[] = [
  "caseReminder",
  "fastingCheck",
  "sessionCheck",
  "positioning",
  "recording",
  "postMeta",
  "skipReason",
  "snackSkip",
];

function recordingWindowClosesAt(item: PlanItem) {
  if (item.sessionKind === "fasted") return item.at + 30;
  if (item.sessionKind === "preMeal") return item.at + 15;
  if (item.sessionKind === "postMeal") return item.at + 10;
  return item.at + 20;
}

function studyMealFinished(plan: PlanItem[]) {
  return plan.some((p) => p.id === "mealStart" && p.done && !p.missed);
}

/** Shift every leftover post-meal row (right after, then each 30 min slot) to this clock time. */
function anchorPostMealTimes(plan: PlanItem[], endAt: number): PlanItem[] {
  let changed = false;
  const next = plan.map((p) => {
    if (p.sessionKind !== "postMeal" || p.offset === undefined || p.done) return p;
    const at = endAt + p.offset;
    if (p.at === at) return p;
    changed = true;
    return { ...p, at };
  });
  return changed ? next : plan;
}

/** Time has passed and the person can still do the task. Post-meal rows wait until they finish eating. */
export function isPastDue(item: PlanItem, now = minutesNow(), mealFinished = false) {
  if (item.done) return false;
  if (item.sessionKind === "postMeal" && !mealFinished) return false;
  return now > item.at;
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
  "Please don't eat or drink until the 3.5 hours after your chosen meal are up. If thirsty, you may have one cup of water, right after a recording.";

export const QUALITY_RULE =
  "A usable recording matters more than a complete set. If you can't do this one properly, kindly skip it and tell us why.";

/** How many full days a person can pause during the study. */
export const FREEZE_DAYS_ALLOWED = 2;

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

function createInitialPlan(meal: Meal = "breakfast", snackAts: number[] = []): PlanItem[] {
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

  const snacks: PlanItem[] = snackAts.map((at, i) => ({
    id: `log-snack-${i}`,
    kind: "meal" as const,
    label: snackAts.length === 1 ? "Log your snack" : `Log your ${clockLabel(at)} snack`,
    at,
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
      label: `Log your ${mealName.toLowerCase()}`,
      at: mealStartAt,
      done: false,
      window: "Photo, first bite, then tap when you finish",
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
        sub: "Nothing more until tomorrow morning.",
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
              ? "Record now, then start eating as soon as you finish."
              : mins < -20
                ? "This recording is late. You can still do it now, or skip it and tell us why."
                : "Case off, quiet room, sit still. Two minutes is the minimum.",
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
      sub: `You're free until ${clockLabel(item.at)}.`,
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
        sub: "Add a photo and the time. For a snack, a short description is enough.",
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
    const started = !!item.started;
    if (due) {
      return {
        kind: "meal",
        tag: "Meal logging",
        title: item.label,
        sub: started
          ? "Tap when your last bite is done. Every recording after that is timed from that moment."
          : "Take a photo of the plate, then tap when you take the first bite.",
        cta: started ? "I've finished eating" : "Log your meal",
        screen: started ? "mealEnd" : "mealCapture",
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
      title: "A few questions",
      sub: "",
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

  const [gender, setGender] = useState<Gender | null>(null);
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
  const [freezeDaysUsed, setFreezeDaysUsed] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const [pendingMissAsk, setPendingMissAsk] = useState<{ id: string; label: string } | null>(
    null,
  );
  const [snackTimes, setSnackTimesState] = useState<number[]>([]);
  const [brokeFastDays, setBrokeFastDays] = useState(0);

  const chooseStudyMeal = useCallback((m: Meal) => {
    setMeal(m);
    setPlan(createInitialPlan(m, snackTimes));
  }, [snackTimes]);

  const setSnackTimes = useCallback((mins: number[]) => {
    setSnackTimesState(mins);
    setPlan((prev) => {
      const currentMeal =
        prev.find((p) => p.id === "mealStart")?.meal ?? meal;
      return createInitialPlan(currentMeal, mins);
    });
  }, [meal]);


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
      const marked = prev.map((p) =>
        p.id === id
          ? { ...p, done: true, at: completed?.kind === "meal" ? at : p.at }
          : p,
      );
      // lock every post-meal recording to the moment they tap I've finished eating
      return id === "mealStart" ? anchorPostMealTimes(marked, at) : marked;
    });
    
    const item = plan.find((p) => p.id === id);
    if (item?.kind === "recording") setLastRecordingAt(at);
  }, [plan]);

  const markMealStarted = useCallback(() => {
    const at = minutesNow();
    setPlan((prev) =>
      anchorPostMealTimes(
        prev.map((p) => (p.id === "mealStart" ? { ...p, started: true, at } : p)),
        at,
      ),
    );
  }, []);

  const missItem = useCallback((id: string, reason?: string) => {
    setPlan((prev) =>
      prev.map((p) => {
        if (p.id === id)
          return { ...p, done: true, missed: true, needsWhy: false, reason };
        if (id === "mealStart" && p.sessionKind === "postMeal" && !p.done) {
          return { ...p, done: true, missed: true, needsWhy: false, reason };
        }
        return p;
      }),
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

  const reopenItem = useCallback((id: string) => {
    setPlan((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, done: false, missed: false, needsWhy: false, reason: undefined }
          : p,
      ),
    );
  }, []);

  const skipRemainingAfterSnack = useCallback(
    (reason: string) => {
      let count = 0;
      setPlan((prev) =>
        prev.map((p) => {
          if (p.sessionKind === "postMeal" && !p.done) {
            count += 1;
            return { ...p, done: true, missed: true, needsWhy: false, reason };
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

  useEffect(() => {
    if (frozen) return;
    const now = minutesNow();
    const screen = stack[stack.length - 1];
    const inFlight = IN_FLIGHT_SCREENS.includes(screen);
    setPlan((prev) => {
      const meal = prev.find((x) => x.id === "mealStart");
      // While they are logging / eating, keep every post-meal time on a live clock
      const working =
        meal?.started && !meal.done ? anchorPostMealTimes(prev, now) : prev;

      // Auto-miss only after they've tapped I've finished eating, using those live times
      if (!studyMealFinished(working)) return working;

      let changed = working !== prev;
      const next = working.map((p) => {
        if (p.sessionKind !== "postMeal" || p.done) return p;
        if (inFlight && p.id === activeItemId) return p;
        const closes = recordingWindowClosesAt(p);
        if (now <= closes) return p;
        changed = true;
        return {
          ...p,
          done: true,
          missed: true,
          needsWhy: now <= closes + 40,
          reason: "Window closed",
        };
      });
      return changed ? next : prev;
    });
  }, [demoTick, frozen, stack, activeItemId]);

  useEffect(() => {
    const ask = plan.find((p) => p.kind === "recording" && p.needsWhy);
    setPendingMissAsk(ask ? { id: ask.id, label: ask.label } : null);
  }, [plan]);

  const explainMiss = useCallback((note: string) => {
    setPlan((prev) => {
      const target = prev.find((p) => p.needsWhy);
      if (!target) return prev;
      return prev.map((p) =>
        p.id === target.id ? { ...p, needsWhy: false, reason: note } : p,
      );
    });
    setEntries((prev) => [
      ...prev,
      {
        id: `${Date.now()}-miss-why`,
        kind: "recording",
        label: "Missed recording",
        detail: note,
        time: nowLabel(),
      },
    ]);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setDemoTick((n) => n + 1), 15_000);
    return () => clearInterval(t);
  }, []);

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
    snackTimes,
    setSnackTimes,
    brokeFastDays,
    noteBrokeFastDay: () => {
      let next = brokeFastDays + 1;
      setBrokeFastDays((n) => {
        next = n + 1;
        return next;
      });
      return next;
    },
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
    freezeDaysUsed,
    frozen,
    useFreeze: () => {
      if (frozen || freezeDaysUsed >= FREEZE_DAYS_ALLOWED) return;
      setFreezeDaysUsed((n) => Math.min(FREEZE_DAYS_ALLOWED, n + 1));
      setFrozen(true);
      setPlan((prev) =>
        prev.map((p) =>
          p.done ? p : { ...p, done: true, missed: true, needsWhy: false, reason: "Freeze day" },
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
    markMealStarted,
    missItem,
    reopenItem,
    pendingMissAsk,
    explainMiss,
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
