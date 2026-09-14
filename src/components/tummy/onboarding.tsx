import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Screen,
  ScreenBody,
  TopBar,
  Btn,
  Card,
  Note,
  Choice,
  Field,
  TextInput,
  MascotSays,
  Mascot,
  StickyFooter,
  TabBar,
  MASCOT,
} from "./ui";
import {
  IconCheck,
  IconPlay,
  IconPhone,
  IconMic,
  IconLock,
  IconSun,
  IconBowl,
  IconSunset,
  IconMoon,
} from "./icons";
import {
  RecordTimer,
  SymptomGrid,
  SeveritySheet,
  QualityPanel,
  CaseOffLayout,
  SessionHubScreen,
  MealCaptureScreen,
  SkipReasonScreen,
  ExtraSessionScreen,
  PositioningGuideLayout,
} from "./recording";
import {
  HomeScreen,
  LogHubScreen,
  LogToiletScreen,
  ProgressScreen,
  ProfileScreen,
  ContactScreen,
} from "./main";
import { MorningQuestionsScreen, EveningCheckinScreen } from "./questions";
import { AssistantButton, AssistantSheet } from "./assistant";

import type { PlanItem, ScreenKey, SnackHabit, TummyStore } from "./store";
import { computeNextTask, minutesNow } from "./store";

import { cn } from "@/lib/utils";

/* ---------------- welcome ---------------- */

export function WelcomeScreen({ store }: { store: TummyStore }) {
  return (
    <Screen className="relative overflow-hidden bg-wash">
      <span className="pointer-events-none absolute -right-16 top-16 h-56 w-56 rounded-full bg-mint/35" />
      <span className="pointer-events-none absolute -left-20 bottom-32 h-48 w-48 rounded-full bg-teal/10" />
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Mascot src={MASCOT.wave} size={200} />
        <h1 className="mt-4 text-[34px] font-extrabold leading-tight text-pine">Tummy</h1>
        <p className="mt-1 text-[15px] font-extrabold uppercase tracking-[0.14em] text-teal">
          Stanford School of Medicine
        </p>
        <p className="mt-4 text-[17px] font-semibold leading-relaxed text-pine-soft">
          Thank you for participating in our study. Let me walk you through the initial setup first!
        </p>
      </div>
      <StickyFooter>
        <Btn onClick={() => store.go("subjectId")}>Get started</Btn>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- subject id ---------------- */

export function SubjectIdScreen({ store }: { store: TummyStore }) {
  const [id, setId] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "ok" | "bad">("idle");
  const check = () => {
    setState("checking");
    setTimeout(() => setState(id.trim().toUpperCase().startsWith("STF") ? "ok" : "bad"), 900);
  };
  return (
    <Screen>
      <TopBar title="Subject ID" onBack={store.back} step="Step 1 of 9" />
      <ScreenBody>
        <p className="text-[17px] font-semibold leading-relaxed text-pine-soft">
          Enter the ID the study coordinator assigned you. We store all your data under this ID
          only, never your name.
        </p>
        <div className="mt-5 space-y-3">
          <Field label="Subject ID">
            <TextInput
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setState("idle");
              }}
              placeholder="STF-0000"
              autoCapitalize="characters"
            />
          </Field>
          {state === "checking" ? <Note tone="blue">Checking the study database…</Note> : null}
          {state === "ok" ? (
            <Note tone="green" title="ID confirmed">
              Day 1 starts tomorrow morning.
            </Note>
          ) : null}
          {state === "bad" ? (
            <Note tone="coral" title="We can't find that ID">
              Check your Subject ID carefully and try again, or reach out to the study coordinator
              from Help.
            </Note>
          ) : null}
        </div>
      </ScreenBody>
      <StickyFooter>
        {state === "ok" ? (
          <Btn onClick={() => store.go("aboutYou")}>Continue</Btn>
        ) : (
          <Btn onClick={check} disabled={id.trim().length < 3}>
            Check my ID
          </Btn>
        )}
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- instruction video ---------------- */

export function VideoScreen({ store }: { store: TummyStore }) {
  const [watched, setWatched] = useState(false);
  return (
    <Screen>
      <TopBar title="Instruction video" onBack={store.back} step="Step 3 of 9" />
      <ScreenBody>
        <div className="relative flex h-[220px] items-center justify-center overflow-hidden rounded-3xl bg-pine">
          <button
            onClick={() => setWatched(true)}
            className="flex flex-col items-center gap-2 text-surface"
          >
            <IconPlay width={64} height={64} />
            <span className="text-[16px] font-extrabold">
              {watched ? "Watch again" : "Play · 4 min"}
            </span>
          </button>
          <div className="absolute bottom-0 left-0 h-1.5 w-full bg-surface/20">
            <div
              className={cn(
                "h-full bg-mint transition-all duration-700",
                watched ? "w-full" : "w-0",
              )}
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <p className="text-[17px] font-semibold leading-relaxed text-pine-soft">
            This video covers how to position your phone on your body, the desired posture during
            recordings, and what a usable recording sounds like. A short quiz will follow this.
          </p>
          <Note tone="blue" title="Captions and transcript">
            If you'd rather read, open the transcript in the player.
          </Note>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("quiz")} disabled={!watched}>
          {watched ? "Continue to the quiz" : "Watch the video first"}
        </Btn>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- attention check quiz ---------------- */

const QUIZ = [
  {
    q: "Where should the phone be placed during a recording?",
    options: ["On top of your shirt", "Directly on bare skin, with the case off"],
    answer: 1,
    why: "A shirt or a phone case holds the microphone off your skin. Gut sounds are too quiet to carry across that gap.",
    hint: "Think about what the microphone needs in order to hear a quiet gut sound.",
  },
  {
    q: "You drank coffee 20 minutes ago. Can you still do a fasting recording?",
    options: ["Yes, drinks are acceptable", "No, even drinks are not permitted"],
    answer: 1,
    why: "Coffee, food, or anything other than a sip of water changes your gut activity, so the recording wouldn't count as fasting.",
    hint: "Think about what fasting means for this recording.",
  },
  {
    q: "After your chosen meal, when do you record?",
    options: [
      "Once an hour, every hour, until bedtime",
      "Right after eating, then every 30 minutes for 3.5 hours",
      "Whenever you are available",
    ],
    answer: 1,
    why: "Recording right after the meal and then every 30 minutes for 3.5 hours keeps the timing consistent across everyone in the study, so the data can be analyzed accurately.",
    hint: "Think about whether the post-meal times are a set schedule or up to you.",
  },
];

export function QuizScreen({ store }: { store: TummyStore }) {
  const [qi, setQi] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const item = QUIZ[qi];
  const correct = pick !== null && pick === item.answer;

  const next = () => {
    if (qi === QUIZ.length - 1) {
      store.go("protocolIntro");
      return;
    }
    setQi((n) => n + 1);
    setPick(null);
  };

  return (
    <Screen>
      <TopBar
        title="Attention check"
        onBack={store.back}
        step={`Step 4 of 9 · question ${qi + 1} of ${QUIZ.length}`}
      />
      <ScreenBody>
        <MascotSays size={78} src={correct ? MASCOT.cheer : MASCOT.calm}>
          {pick === null
            ? qi === 0
              ? "A few questions to make sure the instructions landed. You'll need the right answer before we move on."
              : "Here's the next one."
            : correct
              ? "That's the one. Read why, then we'll continue."
              : "Not quite. Have another look."}
        </MascotSays>

        <div className="mt-3 flex gap-1.5">
          {QUIZ.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-[6px] flex-1 rounded-full",
                i < qi ? "bg-teal" : i === qi ? "bg-sage" : "bg-line",
              )}
            />
          ))}
        </div>

        <p className="mt-5 text-[22px] font-extrabold leading-snug text-pine">{item.q}</p>

        <div className="mt-4 space-y-2.5">
          {item.options.map((opt, oi) => {
            const picked = pick === oi;
            const wrongPick = picked && !correct;
            const lock = correct;
            return (
              <button
                key={opt}
                disabled={lock}
                onClick={() => setPick(oi)}
                className={cn(
                  "flex min-h-[68px] w-full items-center gap-3 rounded-2xl border-2 px-3 py-2 text-left text-[17px] font-bold",
                  picked && correct
                    ? "border-teal bg-mint-soft text-pine"
                    : wrongPick
                      ? "border-amber bg-amber-soft text-pine"
                      : lock
                        ? "border-line bg-surface text-pine-soft opacity-60"
                        : "border-line bg-wash text-pine",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[16px] font-black",
                    picked && correct ? "bg-teal text-surface" : "bg-surface text-pine-soft",
                  )}
                >
                  {picked && correct ? <IconCheck width={20} height={20} /> : "ABC"[oi]}
                </span>
                <span className="min-w-0 flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {correct ? (
          <div className="mt-4">
            <Note tone="green" title="Why this is the answer">
              {item.why}
            </Note>
          </div>
        ) : pick !== null ? (
          <div className="mt-4">
            <Note tone="amber" title="Try again">
              {item.hint}
            </Note>
          </div>
        ) : null}
      </ScreenBody>
      <StickyFooter>
        <Btn disabled={!correct} onClick={next}>
          {correct
            ? qi === QUIZ.length - 1
              ? "Continue"
              : "Next question"
            : "Pick the right answer to continue"}
        </Btn>
      </StickyFooter>
    </Screen>
  );
}


/* ---------------- how a day works: a fixed walk through the real app ---------------- */

type TourStep = {
  view: ScreenKey;
  tabs?: boolean;
  clock: number;
  done: string[];
  coach: string;
  spot: string;
  /** Ring this node instead of `spot` (arrow still goes to `spot`). */
  highlight?: string;
  activeItemId?: string;
  chatOpen?: boolean;
  explore?: boolean;
  dim?: boolean;
  tone?: "light" | "green";
  coachAt?: "top" | "under" | "bottom" | "above-tabs";
};

function tourChrome(item: TourStep) {
  const back = item.spot === "back";
  return {
    highlight: item.highlight ?? item.spot,
    explore: item.explore ?? back,
    dim: item.dim ?? !back,
    tone: item.tone ?? (back ? "green" : "light"),
    coachAt: item.coachAt ?? (back ? "bottom" : undefined),
    chatOpen: !!item.chatOpen,
  };
}

const TOUR_THROUGH_MEAL = ["qMorning", "fasted", "preMeal", "mealStart"];
const TOUR_DAY_DONE = [
  ...TOUR_THROUGH_MEAL,
  "p0",
  "p30",
  "p60",
  "p90",
  "p120",
  "p150",
  "p180",
  "p210",
  "log-lunch",
  "log-dinner",
  "qEvening",
];

const APP_TOUR: TourStep[] = [
  {
    view: "home",
    tabs: true,
    clock: 7 * 60 - 2,
    done: [],
    spot: "next-up",
    coach: "When something is due, start here.",
  },
  {
    view: "home",
    tabs: true,
    clock: 7 * 60 - 2,
    done: [],
    spot: "todays-plan",
    coach: "Today's plan is the full day, in order.",
  },
  {
    view: "sessionHub",
    clock: 7 * 60 - 2,
    done: [],
    spot: "plan-cta",
    coach: "A few questions when you wake up.",
  },
  {
    view: "morningQuestions",
    clock: 7 * 60,
    done: [],
    spot: "back",
    coach: "This is the morning check-in. Try a question if you like, then tap back.",
  },
  {
    view: "sessionHub",
    clock: 7 * 60 + 10,
    done: ["qMorning"],
    spot: "plan-cta",
    coach: "Then a two-minute fasted recording.",
  },
  {
    view: "sessionHub",
    clock: 7 * 60 + 10,
    done: ["qMorning"],
    spot: "skip-recording",
    coach: "Skip if you cannot record well, and say why.",
  },
  {
    view: "skipReason",
    clock: 7 * 60 + 10,
    done: ["qMorning"],
    activeItemId: "fasted",
    spot: "back",
    coach: "Pick a reason. Tap back when you are done looking.",
  },
  {
    view: "sessionHub",
    clock: 8 * 60,
    done: ["qMorning", "fasted", "preMeal"],
    spot: "plan-cta",
    coach: "Photo the plate, then mark start and finish.",
  },
  {
    view: "mealCapture",
    clock: 8 * 60,
    done: ["qMorning", "fasted", "preMeal"],
    spot: "back",
    coach: "This is the meal page. Tap back when you are done looking.",
  },
  {
    view: "sessionHub",
    clock: 8 * 60 + 25,
    done: TOUR_THROUGH_MEAL,
    spot: "plan-cta",
    coach: "A recording right after the last bite, then every 30 minutes.",
  },
  {
    view: "sessionHub",
    clock: 8 * 60 + 25,
    done: TOUR_THROUGH_MEAL,
    spot: "extra-session",
    coach: "You can record an extra session any time.",
  },
  {
    view: "extraSession",
    clock: 8 * 60 + 25,
    done: TOUR_THROUGH_MEAL,
    spot: "back",
    coach: "Say what prompted it. Tap back when you are done looking.",
  },
  {
    view: "eveningCheckin",
    clock: 21 * 60,
    done: TOUR_THROUGH_MEAL,
    spot: "back",
    coach: "Night ends with a short check-in. Tap back when you are done looking.",
  },
  {
    view: "sessionHub",
    clock: 8 * 60 + 25,
    done: TOUR_THROUGH_MEAL,
    spot: "back",
    coach: "Back takes you home.",
  },
  {
    view: "home",
    tabs: true,
    clock: 8 * 60,
    done: TOUR_THROUGH_MEAL,
    spot: "next-up",
    coach: "Before it is due, you can see how long you have.",
  },
  {
    view: "home",
    tabs: true,
    clock: 9 * 60,
    done: TOUR_THROUGH_MEAL,
    spot: "next-up",
    coach: "If the window passed, you can still do it or skip.",
  },
  {
    view: "home",
    tabs: true,
    clock: 21 * 60,
    done: TOUR_DAY_DONE,
    spot: "next-up",
    coach: "When the day is done, Next up says so.",
  },
  {
    view: "home",
    tabs: true,
    clock: 12 * 60,
    done: TOUR_THROUGH_MEAL,
    spot: "ask-tummy-close",
    chatOpen: true,
    explore: true,
    dim: false,
    tone: "green",
    coachAt: "bottom",
    coach: "Ask Tummy can log a meal or tell you what's next.",
  },
  {
    view: "home",
    tabs: true,
    clock: 12 * 60,
    done: TOUR_THROUGH_MEAL,
    spot: "logHub",
    coachAt: "above-tabs",
    coach: "Log is food, drinks, symptoms, toilet, sleep, and activity.",
  },
  {
    view: "logHub",
    tabs: true,
    clock: 12 * 60,
    done: TOUR_THROUGH_MEAL,
    spot: "log-toilet",
    coach: "Add any of these when you remember. Open toilet for a look.",
  },
  {
    view: "logToilet",
    clock: 12 * 60,
    done: TOUR_THROUGH_MEAL,
    spot: "log-save",
    coach: "Time, consistency, and urgency.",
  },
  {
    view: "logHub",
    tabs: true,
    clock: 12 * 60,
    done: TOUR_THROUGH_MEAL,
    spot: "progress",
    coachAt: "above-tabs",
    coach: "Progress is your week.",
  },
  {
    view: "progress",
    tabs: true,
    clock: 12 * 60,
    done: TOUR_THROUGH_MEAL,
    spot: "freeze-day",
    coach:
      "Days, recordings, meals, and questions live here. You also get two freeze days if you need a pause.",
  },
  {
    view: "progress",
    tabs: true,
    clock: 12 * 60,
    done: TOUR_THROUGH_MEAL,
    spot: "profile",
    coachAt: "above-tabs",
    coach: "Profile is times, setup, and help.",
  },
  {
    view: "profile",
    tabs: true,
    clock: 12 * 60,
    done: TOUR_THROUGH_MEAL,
    spot: "contact-team",
    coach: "Change your times, review setup, or reach the study team.",
  },
  {
    view: "contact",
    clock: 12 * 60,
    done: TOUR_THROUGH_MEAL,
    spot: "back",
    coach: "Chat, write the coordinator, or raise a concern. Tap back when you are done looking.",
  },
  {
    view: "profile",
    tabs: true,
    clock: 12 * 60,
    done: TOUR_THROUGH_MEAL,
    spot: "daily-times",
    coach: "Set your usual times next.",
  },
];

function withDone(plan: PlanItem[], ids: string[]): PlanItem[] {
  const set = new Set(ids);
  return plan.map((p) => ({ ...p, done: set.has(p.id) }));
}

function tourStore(store: TummyStore, item: TourStep): TummyStore {
  const plan = withDone(store.plan, item.done);
  const noop = () => undefined;
  return {
    ...store,
    day: 1,
    screen: item.view,
    tourPreview: true,
    chatOpen: !!item.chatOpen,
    demoNow: item.clock,
    plan,
    nextTask: computeNextTask(plan),
    activeItemId: item.activeItemId ?? store.activeItemId,
    sessionKind: item.activeItemId === "fasted" ? "fasted" : store.sessionKind,
    go: noop,
    back: noop,
    startItem: noop,
    completeItem: noop,
    completeSession: noop,
    missItem: noop,
    reopenItem: noop,
    addEntry: noop,
    markQuestions: noop,
    startExtraSession: noop,
    useFreeze: noop,
    setChatOpen: noop,
    markMealStarted: noop,
    explainMiss: noop,
    skipRemainingAfterSnack: () => 0,
    noteBrokeFastDay: () => store.brokeFastDays,
    chooseStudyMeal: noop,
    setSnackHabit: noop,
    setSnackTimes: noop,
    setDemoNow: noop,
  };
}

function TourView({ view, store }: { view: ScreenKey; store: TummyStore }) {
  if (view === "home") return <HomeScreen store={store} />;
  if (view === "sessionHub") return <SessionHubScreen store={store} />;
  if (view === "morningQuestions") return <MorningQuestionsScreen store={store} />;
  if (view === "eveningCheckin") return <EveningCheckinScreen store={store} />;
  if (view === "mealCapture") return <MealCaptureScreen store={store} />;
  if (view === "skipReason") return <SkipReasonScreen store={store} />;
  if (view === "extraSession") return <ExtraSessionScreen store={store} />;
  if (view === "logHub") return <LogHubScreen store={store} />;
  if (view === "logToilet") return <LogToiletScreen store={store} />;
  if (view === "progress") return <ProgressScreen store={store} />;
  if (view === "contact") return <ContactScreen store={store} />;
  return <ProfileScreen store={store} />;
}

function tourRoot(rootRef: { current: HTMLDivElement | null }) {
  return rootRef.current ?? document.getElementById("tour-root");
}

function scrollSpotIntoView(node: HTMLElement, root: HTMLElement) {
  let parent: HTMLElement | null = node.parentElement;
  while (parent && root.contains(parent)) {
    const overflow = getComputedStyle(parent).overflowY;
    if (overflow === "auto" || overflow === "scroll") {
      const n = node.getBoundingClientRect();
      const p = parent.getBoundingClientRect();
      if (n.top < p.top + 12 || n.bottom > p.bottom - 12) {
        parent.scrollTop += n.top - p.top - (p.height - n.height) / 2;
      }
      return;
    }
    parent = parent.parentElement;
  }
}

type TourBox = { x: number; y: number; w: number; h: number; r: number };

function nodeRadius(el: HTMLElement) {
  const n = parseFloat(getComputedStyle(el).borderTopLeftRadius);
  return Number.isFinite(n) ? n : 16;
}

function toBox(root: DOMRect, el: HTMLElement): TourBox {
  const node = el.getBoundingClientRect();
  return {
    x: node.left - root.left,
    y: node.top - root.top,
    w: node.width,
    h: node.height,
    r: nodeRadius(el),
  };
}

function edgeToward(box: TourBox, toward: { x: number; y: number }, gap: number) {
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const dx = toward.x - cx;
  const dy = toward.y - cy;
  if (Math.abs(dx) * box.h > Math.abs(dy) * box.w) {
    return { x: dx > 0 ? box.x + box.w + gap : box.x - gap, y: cy };
  }
  return { x: cx, y: dy > 0 ? box.y + box.h + gap : box.y - gap };
}

/** Short stub that ends on the target, never a screen-long line. */
function pointerPath(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const stub = Math.min(52, len);
  return `M ${x2 - (dx / len) * stub} ${y2 - (dy / len) * stub} L ${x2} ${y2}`;
}

function cutRadius(hole: TourBox, pad: number) {
  const circle =
    Math.abs(hole.w - hole.h) < 10 && hole.r >= Math.min(hole.w, hole.h) / 2 - 1;
  if (circle) return Math.min(hole.w, hole.h) / 2 + pad;
  if (Math.min(hole.w, hole.h) < 90) return Math.min(hole.r + 2, 12);
  return Math.min(hole.r + 2, 24);
}

const COACH_FILL =
  "border-[2.5px] border-teal-deep bg-mint text-pine shadow-[0_12px_28px_rgba(20,48,46,0.18)]";
const TOUR_RING = "0 0 0 2px #ffffff, 0 0 0 5px #2e7d6b";

function FrostPanel({
  left,
  top,
  width,
  height,
  right,
  bottom,
}: {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  right?: number;
  bottom?: number;
}) {
  if (width !== undefined && width <= 0) return null;
  if (height !== undefined && height <= 0) return null;
  return (
    <div
      className="absolute bg-pine/30 backdrop-blur-[4px]"
      style={{ left, top, width, height, right, bottom }}
    />
  );
}

function TourGuide({
  rootRef,
  spot,
  highlight,
  coach,
  step,
  total,
  onAdvance,
  dim,
  explore,
  coachAt,
}: {
  rootRef: { current: HTMLDivElement | null };
  spot: string;
  highlight: string;
  coach: string;
  step: number;
  total: number;
  onAdvance: () => void;
  dim: boolean;
  explore: boolean;
  tone: "light" | "green";
  coachAt?: "top" | "under" | "bottom" | "above-tabs";
}) {
  const coachRef = useRef<HTMLDivElement>(null);
  const [hole, setHole] = useState<TourBox | null>(null);
  const [coachLow, setCoachLow] = useState(false);
  const [link, setLink] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const advanceRef = useRef(onAdvance);
  advanceRef.current = onAdvance;

  useLayoutEffect(() => {
    let cancelled = false;
    const find = () => {
      const root = tourRoot(rootRef);
      if (!root || cancelled) return;
      const ringNode = root.querySelector(`[data-tour-spot="${highlight}"]`);
      const spotNode = root.querySelector(`[data-tour-spot="${spot}"]`);
      const node =
        ringNode instanceof HTMLElement && ringNode.getBoundingClientRect().width >= 2
          ? ringNode
          : spotNode instanceof HTMLElement && spotNode.getBoundingClientRect().width >= 2
            ? spotNode
            : null;
      const tip =
        spotNode instanceof HTMLElement && spotNode.getBoundingClientRect().width >= 2
          ? spotNode
          : node;
      if (!node || !tip) {
        setHole(null);
        setLink(null);
        return;
      }
      scrollSpotIntoView(tip, root);
      const rootBox = root.getBoundingClientRect();
      const nextHole = toBox(rootBox, node);
      const nextTip = toBox(rootBox, tip);
      setHole(nextHole);
      if (coachAt === "top" || coachAt === "under") setCoachLow(false);
      else if (coachAt === "bottom" || coachAt === "above-tabs") setCoachLow(true);
      else setCoachLow(nextTip.y < 170);

      const bubble = coachRef.current;
      const wideButton = nextTip.w > 200 && nextTip.h < 80;
      if (!bubble || spot === "back" || wideButton) {
        setLink(null);
        return;
      }
      const coachBox = toBox(rootBox, bubble);
      const start = edgeToward(
        coachBox,
        { x: nextTip.x + nextTip.w / 2, y: nextTip.y + nextTip.h / 2 },
        8,
      );
      const end = edgeToward(nextTip, start, 12);
      if (Math.hypot(end.x - start.x, end.y - start.y) < 56) {
        setLink(null);
        return;
      }
      setLink({ x1: start.x, y1: start.y, x2: end.x, y2: end.y });
    };

    find();
    const frames = [requestAnimationFrame(find), 0];
    frames[1] = requestAnimationFrame(() => find());
    const poll = window.setInterval(find, 160);
    const root = tourRoot(rootRef);
    const ro = new ResizeObserver(find);
    if (root) ro.observe(root);
    root?.addEventListener("scroll", find, true);

    const onClick = (event: Event) => {
      const el = (event.target as Element | null)?.closest?.("[data-tour-spot]");
      if (!el || el.getAttribute("data-tour-spot") !== spot) return;
      event.preventDefault();
      event.stopPropagation();
      advanceRef.current();
    };
    root?.addEventListener("click", onClick, true);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frames[0]);
      cancelAnimationFrame(frames[1]);
      window.clearInterval(poll);
      ro.disconnect();
      root?.removeEventListener("scroll", find, true);
      root?.removeEventListener("click", onClick, true);
    };
  }, [rootRef, spot, highlight, coachLow, coachAt]);

  const pad = hole && hole.h > 220 ? 5 : 4;
  const cut = hole
    ? {
        x: Math.max(0, hole.x - pad),
        y: Math.max(0, hole.y - pad),
        w: hole.w + pad * 2,
        h: hole.h + pad * 2,
        r: cutRadius(hole, pad),
      }
    : null;

  return (
    <>
      <style>{`
        #tour-root [data-tour-spot="${spot}"] {
          pointer-events: auto !important;
          position: relative;
          z-index: 1;
          filter: none !important;
        }
        ${
          explore
            ? ""
            : `#tour-root [data-tour-spot="${highlight}"] {
          pointer-events: auto !important;
          filter: none !important;
        }`
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0 z-50">
        {cut ? (
          <>
            {dim ? (
              <>
                <FrostPanel left={0} top={0} right={0} height={cut.y} />
                <FrostPanel left={0} top={cut.y + cut.h} right={0} bottom={0} />
                <FrostPanel left={0} top={cut.y} width={cut.x} height={cut.h} />
                <FrostPanel left={cut.x + cut.w} top={cut.y} right={0} height={cut.h} />
              </>
            ) : null}
            <div
              className="absolute"
              style={{
                left: cut.x,
                top: cut.y,
                width: cut.w,
                height: cut.h,
                borderRadius: cut.r,
                boxShadow: TOUR_RING,
              }}
            />
          </>
        ) : null}
        {link ? (
          <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            <defs>
              <marker
                id="tour-arrowhead"
                markerWidth="11"
                markerHeight="11"
                refX="9"
                refY="5.5"
                orient="auto"
              >
                <path d="M0 0.6 L10 5.5 L0 10.4 Z" fill="#2e7d6b" />
              </marker>
            </defs>
            <path
              d={pointerPath(link.x1, link.y1, link.x2, link.y2)}
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d={pointerPath(link.x1, link.y1, link.x2, link.y2)}
              fill="none"
              stroke="#2e7d6b"
              strokeWidth="2.2"
              strokeLinecap="round"
              markerEnd="url(#tour-arrowhead)"
            />
          </svg>
        ) : null}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 h-44",
            coachLow
              ? dim
                ? "bottom-0 bg-gradient-to-t from-pine/35 to-transparent"
                : "bottom-0 bg-gradient-to-t from-wash from-30% to-transparent"
              : dim
                ? "top-0 bg-gradient-to-b from-pine/30 to-transparent"
                : "top-0 bg-gradient-to-b from-wash from-25% to-transparent",
          )}
        />
        <div
          className={cn(
            "absolute inset-x-0 z-10 px-4",
            coachAt === "above-tabs"
              ? "bottom-[100px]"
              : coachLow
                ? "bottom-4"
                : coachAt === "under"
                  ? "top-[76px]"
                  : "top-3",
          )}
        >
          <div className="flex items-end gap-3">
            <span
              className={cn(
                "flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full",
                COACH_FILL,
              )}
            >
              <Mascot src={MASCOT.calm} size={64} />
            </span>
            <div ref={coachRef} className={cn("rounded-3xl rounded-bl-md px-4 py-3", COACH_FILL)}>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-teal-deep">
                {step} of {total}
              </p>
              <p className="mt-1 text-[16px] font-bold leading-snug text-pine">{coach}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ProtocolIntroScreen({ store }: { store: TummyStore }) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const item = APP_TOUR[Math.min(step, APP_TOUR.length - 1)];
  const chrome = tourChrome(item);
  const last = step >= APP_TOUR.length - 1;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = store.demoNow;
    return () => store.setDemoNow(prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (started && minutesNow() !== item.clock) {
    store.setDemoNow(item.clock);
  }

  const previewStore = useMemo(
    () => tourStore(store, item),
    // store identity is stable enough for this walkthrough; the step drives the preview
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, step],
  );

  const advance = () => {
    if (last) {
      store.go("scheduling");
      return;
    }
    setStep((n) => n + 1);
  };

  if (!started) {
    return (
      <Screen>
        <TopBar title="How a day works" onBack={store.back} step="Step 5 of 9" />
        <ScreenBody className="flex flex-col">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <Mascot src={MASCOT.wave} size={170} />
            <h2 className="mt-4 text-[26px] font-extrabold leading-tight text-pine">
              Let's walk through a day
            </h2>
            <p className="mt-3 text-[17px] font-semibold leading-snug text-pine-soft">
              Tap what I point to. Nothing is saved.
            </p>
          </div>
        </ScreenBody>
        <StickyFooter>
          <Btn onClick={() => setStarted(true)}>Start the walkthrough</Btn>
        </StickyFooter>
      </Screen>
    );
  }

  return (
    <Screen className="relative">
      <div
        ref={rootRef}
        id="tour-root"
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div
          className={cn(
            "min-h-0 flex-1 overflow-hidden",
            chrome.explore ? undefined : "pointer-events-none",
          )}
        >
          <TourView view={item.view} store={previewStore} />
        </div>
        {item.tabs ? (
          <div className={chrome.explore ? undefined : "pointer-events-none"}>
            <TabBar store={previewStore} />
          </div>
        ) : null}
        {item.tabs && !chrome.chatOpen && item.view === "home" && item.spot !== "logHub" ? (
          <div className="pointer-events-none">
            <AssistantButton store={previewStore} />
          </div>
        ) : null}
        {chrome.chatOpen ? <AssistantSheet store={previewStore} /> : null}
        <TourGuide
          rootRef={rootRef}
          spot={item.spot}
          highlight={chrome.highlight}
          coach={item.coach}
          step={step + 1}
          total={APP_TOUR.length}
          onAdvance={advance}
          dim={chrome.dim}
          explore={chrome.explore}
          tone={chrome.tone}
          coachAt={chrome.coachAt}
        />
      </div>
    </Screen>
  );
}

/* ---------------- technical setup ---------------- */

const PHONE_MODELS: Record<"apple" | "android", string[]> = {
  apple: [
    "iPhone 17 Pro Max",
    "iPhone 17 Pro",
    "iPhone 17",
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 16e",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14 Plus",
    "iPhone 14",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 13 mini",
    "iPhone 12 Pro Max",
    "iPhone 12 Pro",
    "iPhone 12",
    "iPhone 12 mini",
    "iPhone 11 Pro Max",
    "iPhone 11 Pro",
    "iPhone 11",
    "iPhone XS / XR",
    "iPhone SE (2nd or 3rd gen)",
    "Other iPhone",
  ],
  android: [
    "Samsung Galaxy S25 Ultra",
    "Samsung Galaxy S25",
    "Samsung Galaxy S24 Ultra",
    "Samsung Galaxy S24+",
    "Samsung Galaxy S24",
    "Samsung Galaxy S23 Ultra",
    "Samsung Galaxy S23",
    "Samsung Galaxy S22",
    "Samsung Galaxy A55",
    "Samsung Galaxy A54",
    "Samsung Galaxy Z Fold / Flip",
    "Google Pixel 9 Pro",
    "Google Pixel 9",
    "Google Pixel 8 Pro",
    "Google Pixel 8 / 8a",
    "Google Pixel 7 / 7a",
    "Google Pixel 6 / 6a",
    "OnePlus 12",
    "OnePlus 11",
    "Motorola Edge / G series",
    "Xiaomi / Redmi",
    "Other Android phone",
  ],
};

export function TechnicalSetupScreen({ store }: { store: TummyStore }) {
  const [platform, setPlatform] = useState<"apple" | "android" | "">("");
  const [model, setModel] = useState("");
  const [caseOff, setCaseOff] = useState(false);
  return (
    <Screen>
      <TopBar title="Technical setup" onBack={store.back} step="Step 7 of 9" />
      <ScreenBody>
        <p className="text-[17px] font-semibold leading-relaxed text-pine-soft">
          Recordings use your phone's microphone. Telling us the model helps our study team analyze
          your recordings accurately.
        </p>

        <div className="mt-5 space-y-5">
          <Field label="Which kind of phone do you have?">
            <div className="flex gap-3">
              {(
                [
                  { k: "apple", label: "Apple" },
                  { k: "android", label: "Android" },
                ] as const
              ).map(({ k, label }) => (
                <button
                  key={k}
                  onClick={() => {
                    setPlatform(k);
                    setModel("");
                  }}
                  className={cn(
                    "min-h-[68px] flex-1 rounded-2xl border-2 text-[18px] font-extrabold",
                    platform === k
                      ? "border-teal bg-teal text-surface"
                      : "border-line bg-surface text-pine",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>
          {platform ? (
            <Field label="Phone model" hint="Pick the closest match from the list.">
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="min-h-[64px] w-full appearance-none rounded-2xl border-2 border-line bg-surface px-4 pr-12 text-[17px] font-extrabold text-pine"
                >
                  <option value="">Select your model</option>
                  {PHONE_MODELS[platform].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[16px] font-extrabold text-teal">
                  ▾
                </span>
              </div>
            </Field>
          ) : null}
          <Card>
            <div className="flex items-center gap-3">
              <span className="text-teal">
                <IconPhone width={28} height={28} />
              </span>
              <div className="flex-1">
                <p className="text-[17px] font-extrabold text-pine">Case check</p>
                <p className="text-[16px] font-semibold text-pine-soft">
                  The case must come off before every recording. Recordings done with the case on
                  severely deteriorate the quality of the recordings.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCaseOff((v) => !v)}
              className={cn(
                "mt-4 flex min-h-[56px] w-full items-center gap-3 rounded-2xl border-2 px-4 text-left",
                caseOff ? "border-teal bg-mint-soft" : "border-line bg-wash",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border-[3px]",
                  caseOff ? "border-teal bg-teal text-surface" : "border-line",
                )}
              >
                {caseOff ? <IconCheck width={18} height={18} /> : null}
              </span>
              <span className="text-[16px] font-extrabold text-pine">
                I can get my case off before each recording
              </span>
            </button>
          </Card>

        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("permissions")} disabled={!caseOff || !model}>
          Save setup
        </Btn>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- permissions ---------------- */

export function PermissionsScreen({ store }: { store: TummyStore }) {
  const [granted, setGranted] = useState<Record<string, boolean>>({});
  const items = [
    { k: "mic", label: "Microphone", sub: "So we can record your gut sounds", Icon: IconMic },
    {
      k: "notif",
      label: "Reminders",
      sub: "For the fasted recording, your study meal, and each recording after it",
      Icon: IconPhone,
    },
    {
      k: "dnd",
      label: "Do not disturb",
      sub: "On only while you record",
      Icon: IconLock,
    },
  ];
  const all = items.every((i) => granted[i.k]);
  return (
    <Screen>
      <TopBar title="Permissions" onBack={store.back} step="Step 8 of 9" />
      <ScreenBody>
        <Note tone="blue" title="Do not disturb is only for recordings">
          Do not disturb turns on when a recording starts and off the moment it ends.
        </Note>
        <div className="mt-4 space-y-3">
          {items.map(({ k, label, sub, Icon }) => (
            <Card key={k}>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-teal">
                  <Icon width={24} height={24} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-extrabold text-pine">{label}</p>
                  <p className="text-[15px] font-semibold text-pine-soft">{sub}</p>
                </div>
                <button
                  onClick={() => setGranted((g) => ({ ...g, [k]: true }))}
                  className={cn(
                    "min-h-[48px] shrink-0 rounded-xl px-4 text-[15px] font-extrabold",
                    granted[k] ? "bg-mint-soft text-teal" : "bg-teal text-surface",
                  )}
                >
                  {granted[k] ? "Allowed" : "Allow"}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("practiceRun")} disabled={!all}>
          Continue
        </Btn>
      </StickyFooter>
    </Screen>
  );
}



/* ---------------- practice part 2: dry run recording ---------------- */

type Coach = { id: string; text: string; cta: string };

export function PracticeRunScreen({ store }: { store: TummyStore }) {
  const TOTAL = 120;
  const [stage, setStage] = useState<"intro" | "case" | "position" | "record">("intro");
  const [left, setLeft] = useState(TOTAL);
  const [marks, setMarks] = useState<{ key: string; label: string; severity: number }[]>([]);
  const [pending, setPending] = useState<{ key: string; label: string; at: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const [coach, setCoach] = useState<Coach | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [passed, setPassed] = useState(false);


  const show = (c: Coach) => {
    setSeen((s) => (s.includes(c.id) ? s : [...s, c.id]));
    setCoach(c);
  };
  const notSeen = (id: string) => !seen.includes(id);

  /* the clock only runs while nothing is being explained */
  useEffect(() => {
    if (stage !== "record" || coach || pending) return;
    const t = setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [stage, coach, pending]);

  /* incremental coaching, revealed as the run unfolds */
  useEffect(() => {
    if (stage !== "record" || coach || pending) return;
    const elapsed = TOTAL - left;
    if (notSeen("dnd")) {
      show({
        id: "dnd",
        text: "Do not disturb stays on until this recording ends, then it turns off on its own.",
        cta: "Got it",
      });
    } else if (elapsed >= 4 && notSeen("timer")) {
      show({
        id: "timer",
        text: "The number in the middle is time left. The ring fills as you record.",
        cta: "Makes sense",
      });
    } else if (elapsed >= 9 && notSeen("symptom")) {
      show({
        id: "symptom",
        text: "If you feel something, tap an icon at the top. Try one now so you can see how it works.",
        cta: "Let me try",
      });
    } else if (left <= 15 && left > 0 && notSeen("timeleft")) {
      show({
        id: "timeleft",
        text: "Under 15 seconds left. When the ring fills, we'll save this and ask a few questions.",
        cta: "Okay",
      });
    }
  }, [stage, left, coach, pending, seen]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const counts = marks.reduce<Record<string, number>>((acc, m) => {
    acc[m.key] = (acc[m.key] ?? 0) + 1;
    return acc;
  }, {});
  const finished = left === 0;

  const banner = (
    <span className="flex items-center gap-1.5 rounded-full border-2 border-teal-deep bg-mint px-2.5 py-1 text-[13px] font-extrabold text-pine">
      <IconLock width={14} height={14} className="text-teal-deep" />
      Dry run
    </span>
  );

  /* stage 0, get somewhere quiet */
  if (stage === "intro") {
    return (
      <Screen>
        <TopBar title="Practice recording" onBack={store.back} step="Step 9 of 9" />
        <ScreenBody className="flex flex-col">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <Mascot src={MASCOT.wave} size={170} />
            <h2 className="mt-4 text-[26px] font-extrabold leading-tight text-pine">
              Let's practice a recording
            </h2>
            <p className="mt-3 text-[17px] font-semibold leading-snug text-pine-soft">
              Find a quiet room and tap start when you're ready. Nothing from this run is uploaded.
            </p>
            <div className="mt-5 w-full text-left">
              <Note tone="green" title="Audio stays private">
                Recordings are encrypted and labelled with your subject ID only. No one on the study
                team can link them back to you by name.
              </Note>
            </div>
          </div>
        </ScreenBody>
        <StickyFooter>
          <Btn onClick={() => setStage("case")}>Start</Btn>
        </StickyFooter>
      </Screen>
    );
  }

  /* stage 1, case off, exactly like the real thing */
  if (stage === "case") {
    return (
      <CaseOffLayout
        title="Practice recording"
        step="Step 9 of 9"
        onBack={store.back}
        onContinue={() => setStage("position")}
        banner={banner}
      />
    );
  }

  /* stage 2, positioning guide, exactly like the real thing */
  if (stage === "position") {
    return (
      <PositioningGuideLayout
        onBack={() => setStage("case")}
        onReady={() => setStage("record")}
        step="Practice"
        banner={banner}
      />
    );
  }


  /* stage 3, the run itself, identical UI to a real recording */
  return (
    <Screen dark className="relative">
      <div className="absolute right-4 top-14 z-20">{banner}</div>

      <SymptomGrid
        counts={counts}
        disabled={!!pending || !!coach || finished}
        onPick={(key, label) => {
          setCoach(null);
          setPending({ key, label, at: TOTAL - left });
        }}
      />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-5">
        <RecordTimer elapsed={TOTAL - left} min={TOTAL} />
        <p className="mt-5 text-[16px] font-bold text-mint">Keep still until the timer ends</p>
        <p className="mt-1 text-[15px] font-bold text-surface/70">
          {marks.length} symptom {marks.length === 1 ? "mark" : "marks"} recorded
        </p>
      </div>

      <div className="shrink-0 px-5 pb-7">
        <Btn
          variant="secondary"
          onClick={() => {
            setPending(null);
            setCoach(null);
            setLeft(0);
          }}
          disabled={finished || !!pending}
        >
          {finished ? "Practice complete" : "Finish early"}
        </Btn>
      </div>

      {toast && !pending && !coach && !finished ? (
        <div className="pointer-events-none absolute inset-x-5 top-[72px] z-50 rounded-2xl bg-mint px-4 py-3 text-center text-[16px] font-extrabold text-pine shadow-lg">
          {toast}
        </div>
      ) : null}

      {pending && !finished ? (
        notSeen("severity") ? (
          <div className="absolute inset-0 z-40 flex flex-col justify-end bg-pine/80 px-5 pb-10 backdrop-blur-md">
            <div className="flex items-end gap-3">
              <span className={cn("flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-full", COACH_FILL)}>
                <Mascot src={MASCOT.calm} size={70} />
              </span>
              <p className={cn("px-4 py-4 text-[16px] font-bold leading-snug", COACH_FILL, "rounded-3xl rounded-bl-md")}>
                Now tell me how strong it feels, from 1 to 5. Tapping a number saves it and
                stamps the time. There's no extra save button.
              </p>
            </div>
            <div className="mt-4">
              <Btn variant="mint" onClick={() => setSeen((s) => [...s, "severity"])}>Got it</Btn>
            </div>
          </div>
        ) : (
          <SeveritySheet
            pending={pending}
            onCancel={() => setPending(null)}
            onPick={(n) => {
              setMarks((m) => [...m, { key: pending.key, label: pending.label, severity: n }]);
              setPending(null);
              setToast(`${pending.label} saved at level ${n}`);
            }}
          />
        )
      ) : null}

      {coach && !pending && !finished ? (
        <div className="absolute inset-0 z-40 flex flex-col justify-end bg-pine/70 px-5 pb-10 backdrop-blur-md">
          <div className="flex items-end gap-3">
            <span className={cn("flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full", COACH_FILL)}>
              <Mascot src={MASCOT.calm} size={76} />
            </span>
            <p className={cn("px-4 py-4 text-[17px] font-bold leading-snug", COACH_FILL, "rounded-3xl rounded-bl-md")}>
              {coach.text}
            </p>
          </div>
          <div className="mt-5">
            <Btn variant="mint" onClick={() => setCoach(null)}>{coach.cta}</Btn>
          </div>
        </div>
      ) : null}

      {finished && !passed ? (
        <QualityPanel
          key={attempt}
          pass={attempt > 0}
          allowKeep={false}
          onRedo={() => {
            setAttempt((a) => a + 1);
            setLeft(TOTAL);
            setMarks([]);
            setPending(null);
            setCoach(null);
            setToast(null);
          }}
          onContinue={() => setPassed(true)}
        />
      ) : null}

      {finished && passed ? (
        <div className="absolute inset-0 z-40 flex flex-col justify-center bg-pine/80 px-5 backdrop-blur-md">
          <div className="rounded-[28px] bg-surface p-6 text-center">
            <Mascot src={MASCOT.cheer} size={140} className="mx-auto" />
            <h2 className="mt-3 text-[24px] font-extrabold text-pine">Successful session</h2>
            <p className="mt-2 text-[16px] font-semibold leading-snug text-pine-soft">
              {marks.length > 0
                ? `You logged ${marks.length} symptom ${marks.length === 1 ? "mark" : "marks"}. `
                : ""}
              After a real recording you'll get this same sound check, then a few short questions.
            </p>
            <div className="mt-5">
              <Btn onClick={() => store.go("onboardDone")}>Continue</Btn>
            </div>
          </div>
        </div>
      ) : null}

    </Screen>
  );
}



/* ---------------- daily schedule ---------------- */

const SCHEDULE_ROWS = {
  weekday: [
    { label: "Wake up", def: "07:00", Icon: IconSun },
    { label: "Breakfast", def: "08:00", Icon: IconBowl },
    { label: "Lunch", def: "12:30", Icon: IconBowl },
    { label: "Dinner", def: "19:00", Icon: IconSunset },
    { label: "Go to bed", def: "23:00", Icon: IconMoon },
  ],
  weekend: [
    { label: "Wake up", def: "08:30", Icon: IconSun },
    { label: "Breakfast", def: "09:30", Icon: IconBowl },
    { label: "Lunch", def: "13:30", Icon: IconBowl },
    { label: "Dinner", def: "20:00", Icon: IconSunset },
    { label: "Go to bed", def: "23:30", Icon: IconMoon },
  ],
} as const;

export function DayTypeTabs({
  value,
  onChange,
}: {
  value: "weekday" | "weekend";
  onChange: (v: "weekday" | "weekend") => void;
}) {
  return (
    <div className="flex rounded-2xl bg-surface p-1">
      {(
        [
          { k: "weekday", label: "Weekdays" },
          { k: "weekend", label: "Weekends" },
        ] as const
      ).map(({ k, label }) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          className={cn(
            "min-h-[56px] flex-1 rounded-xl text-[17px] font-extrabold",
            value === k ? "bg-teal text-surface" : "text-pine-soft",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function SchedulingScreen({ store }: { store: TummyStore }) {
  const [tab, setTab] = useState<"weekday" | "weekend">("weekday");
  const [seenWeekend, setSeenWeekend] = useState(false);
  return (
    <Screen>
      <TopBar title="Daily schedule" onBack={store.back} step="Step 6 of 9" />
      <ScreenBody>
        <MascotSays size={78} src={MASCOT.cheer}>
          When do you usually eat and sleep? Weekends are often different, so I'll ask for both.
        </MascotSays>
        <div className="mt-5">
          <DayTypeTabs
            value={tab}
            onChange={(v) => {
              setTab(v);
              if (v === "weekend") setSeenWeekend(true);
            }}
          />
        </div>
        <div className="mt-4 space-y-3">
          {SCHEDULE_ROWS[tab].map(({ label, def, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-teal">
                <Icon width={24} height={24} />
              </span>
              <span className="min-w-0 flex-1 truncate text-[17px] font-extrabold text-pine">
                {label}
              </span>
              <input
                key={tab + label}
                type="time"
                defaultValue={def}
                className="min-h-[52px] shrink-0 rounded-xl border-2 border-line bg-wash px-3 text-[17px] font-extrabold text-pine"
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[15px] font-semibold leading-snug text-pine-soft">
          These times are only for reminders.
        </p>
      </ScreenBody>
      <StickyFooter>
        {tab === "weekday" && !seenWeekend ? (
          <Btn
            onClick={() => {
              setTab("weekend");
              setSeenWeekend(true);
            }}
          >
            Next: weekend times
          </Btn>
        ) : (
          <Btn onClick={() => store.go("mealPick")}>Save my schedule</Btn>
        )}
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- which meal the recordings follow ---------------- */

export function MealPickScreen({ store }: { store: TummyStore }) {
  const meals = [
    {
      k: "breakfast" as const,
      label: "Breakfast",
      when: "Recordings run through the morning",
      why: "Best if you work from home. A commute after breakfast usually breaks the 3.5-hour recording window.",
      Icon: IconSun,
    },
    {
      k: "lunch" as const,
      label: "Lunch",
      when: "Recordings run through the afternoon",
      why: "You'll need a private, quiet room, not a bathroom. Skip lunch if you have talking meetings in the 3.5 hours after.",
      Icon: IconBowl,
    },
    {
      k: "dinner" as const,
      label: "Dinner",
      when: "Recordings run through the evening",
      why: "Only if you'll still be awake 3.5 hours later. For most people this is the easiest, because there are no office meetings to work around.",
      Icon: IconSunset,
    },
  ];
  return (
    <Screen>
      <TopBar title="Your study meal" onBack={store.back} step="Step 6 of 9" />
      <ScreenBody>
        <MascotSays size={78} src={MASCOT.calm}>
          Choose the meal you eat at a steady time, around which you wish to do your recordings.
        </MascotSays>
        <div className="mt-5 space-y-3">
          {meals.map(({ k, label, when, why, Icon }) => (
            <button
              key={k}
              onClick={() => store.chooseStudyMeal(k)}
              className={cn(
                "flex w-full items-start gap-4 rounded-3xl border-2 bg-surface px-5 py-4 text-left",
                store.meal === k ? "border-teal bg-mint-soft" : "border-line",
              )}
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-teal">
                <Icon width={30} height={30} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="block text-[20px] font-extrabold text-pine">{label}</span>
                  {store.meal === k ? (
                    <span className="shrink-0 text-teal">
                      <IconCheck width={22} height={22} />
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-[15px] font-semibold text-pine-soft">{when}</span>
                <span className="mt-2 block text-[15px] font-semibold leading-snug text-pine">
                  {why}
                </span>
              </span>
            </button>
          ))}
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("snacking")}>Continue</Btn>
      </StickyFooter>
    </Screen>
  );
}



/* ---------------- snacking ---------------- */

const SNACK_HABITS = [
  { k: "never" as const, label: "Never" },
  { k: "once" as const, label: "Once a day" },
  { k: "few" as const, label: "A few times a day" },
  { k: "threePlus" as const, label: "3 or more times a day" },
];

export function SnackingScreen({ store }: { store: TummyStore }) {
  const [habit, setHabit] = useState<SnackHabit | "">("");

  return (
    <Screen>
      <TopBar title="Snacking" onBack={store.back} step="Step 6 of 9" />
      <ScreenBody>
        <MascotSays size={78} src={MASCOT.calm}>
          Do you usually snack in between meals?
        </MascotSays>
        <div className="mt-5 space-y-2">
          {SNACK_HABITS.map(({ k, label }) => (
            <Choice
              key={k}
              label={label}
              selected={habit === k}
              onClick={() => setHabit(k)}
            />
          ))}
        </div>
        {habit && habit !== "never" ? (
          <div className="mt-5 rounded-2xl border-2 border-teal bg-mint-soft p-4">
            <p className="text-[16px] font-semibold leading-snug text-pine">
              We'll email you between meals to log a snack. No times to set here.
            </p>
          </div>
        ) : habit === "never" ? (
          <div className="mt-5 rounded-2xl border-2 border-line bg-surface p-4">
            <p className="text-[16px] font-semibold leading-snug text-pine">
              Got it. If that changes, you can still log a snack from today's log.
            </p>
          </div>
        ) : null}
      </ScreenBody>
      <StickyFooter>
        <Btn
          disabled={!habit}
          onClick={() => {
            store.setSnackHabit(habit as SnackHabit);
            store.setSnackTimes([]);
            store.go("technicalSetup");
          }}
        >
          Continue
        </Btn>
      </StickyFooter>
    </Screen>
  );
}


/* ---------------- about you ---------------- */

export function AboutYouScreen({ store }: { store: TummyStore }) {
  return (
    <Screen>
      <TopBar title="About you" onBack={store.back} step="Step 2 of 9" />
      <ScreenBody>
        <MascotSays src={MASCOT.calm} size={78}>
          What's your gender?
        </MascotSays>
        <div className="mt-5 space-y-2">
          {(
            [
              { k: "female", label: "Female" },
              { k: "male", label: "Male" },
              { k: "other", label: "Another description" },
              { k: "unsaid", label: "Prefer not to say" },
            ] as const
          ).map(({ k, label }) => (
            <Choice
              key={k}
              label={label}
              selected={store.gender === k}
              onClick={() => store.setGender(k)}
            />
          ))}
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn disabled={!store.gender} onClick={() => store.go("video")}>
          Continue
        </Btn>
      </StickyFooter>
    </Screen>
  );
}


export function OnboardDoneScreen({ store }: { store: TummyStore }) {
  return (
    <Screen className="relative overflow-hidden bg-wash">
      <span className="pointer-events-none absolute -left-16 top-20 h-52 w-52 rounded-full bg-mint/40" />
      <span className="pointer-events-none absolute -right-20 bottom-28 h-48 w-48 rounded-full bg-teal/10" />
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Mascot src={MASCOT.cheer} size={190} />
        <h1 className="mt-4 text-[28px] font-extrabold leading-tight text-pine">
          You're all set up
        </h1>
        <p className="mt-3 text-[17px] font-semibold leading-relaxed text-pine-soft">
          Day 1 starts tomorrow morning after you wake.
        </p>
      </div>
      <StickyFooter>
        <Btn onClick={() => store.go("home")}>Go to home</Btn>
      </StickyFooter>
    </Screen>
  );
}
