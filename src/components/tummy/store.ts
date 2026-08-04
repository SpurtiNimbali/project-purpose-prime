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

export type Session = { id: string; label: string; done: boolean };

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
};

const INITIAL_SESSIONS: Session[] = [
  { id: "fasting", label: "Fasting (morning)", done: true },
  { id: "m30", label: "Breakfast + 30 min", done: true },
  { id: "m90", label: "Breakfast + 90 min", done: false },
  { id: "m210", label: "Breakfast + 3.5 hrs", done: false },
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
  };
}
