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
  IconHome,
  IconList,
  IconBook,
  IconChart,
  IconUser,
} from "./icons";
import {
  RecordTimer,
  SymptomGrid,
  SeveritySheet,
  QualityPanel,
  CaseOffLayout,
  SessionHubScreen,
  MealCaptureScreen,
  PositioningGuideLayout,
} from "./recording";
import {
  HomeScreen,
  LogHubScreen,
  LogMealScreen,
  LogHydrationScreen,
  LogToiletScreen,
  LogSymptomScreen,
  LogSleepScreen,
  LogActivityScreen,
  ProgressScreen,
  ProfileScreen,
  ContactScreen,
} from "./main";
import { MorningQuestionsScreen, EveningCheckinScreen } from "./questions";

import type { ScreenKey, SnackHabit, TummyStore } from "./store";

import { cn } from "@/lib/utils";
import abdomenRight from "@/assets/quiz/abdomen-right.png";
import abdomenLeft from "@/assets/quiz/abdomen-left.png";
import abdomenNavel from "@/assets/quiz/abdomen-navel.png";
import phoneSpeakers from "@/assets/quiz/phone-speakers.png";
import phoneScreen from "@/assets/quiz/phone-screen.png";
import roomBedroom from "@/assets/quiz/room-bedroom.png";
import roomOffice from "@/assets/quiz/room-office.png";
import roomBathroom from "@/assets/quiz/room-bathroom.png";
import roomCafe from "@/assets/quiz/room-cafe.png";

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

type QuizOption = {
  label: string;
  img?: string;
  cover?: boolean;
};

type QuizItem = {
  q: string;
  sub?: string;
  options: QuizOption[];
  answer: number | number[];
  why: string;
  hint: string;
  multi?: boolean;
};

const QUIZ: QuizItem[] = [
  {
    q: "Where on the abdomen do you place the phone?",
    options: [
      { label: "Right of the navel", img: abdomenRight },
      { label: "Left of the navel", img: abdomenLeft },
      { label: "On the navel", img: abdomenNavel },
    ],
    answer: 0,
    why: "The spot is about 8 cm to your right of the navel and 3 cm down — over the lower right abdomen.",
    hint: "Look back at the measurements from the placement film.",
  },
  {
    q: "Which side of the phone should touch your skin?",
    options: [
      { label: "Speaker edge", img: phoneSpeakers },
      { label: "Screen", img: phoneScreen },
    ],
    answer: 0,
    why: "The microphone sits on the speaker edge. That edge needs to press gently on bare skin.",
    hint: "The microphone is on the short edge with the speaker holes, not on the glass.",
  },
  {
    q: "Where should the phone be placed during a recording?",
    options: [
      { label: "On top of your shirt" },
      { label: "Directly on bare skin, with the case off" },
    ],
    answer: 1,
    why: "A shirt or a phone case holds the microphone off your skin. Gut sounds are too quiet to carry across that gap.",
    hint: "Think about what the microphone needs in order to hear a quiet gut sound.",
  },
  {
    q: "Which of these rooms are okay for a recording?",
    sub: "Select every quiet indoor space you can close off.",
    multi: true,
    options: [
      { label: "Bedroom", img: roomBedroom, cover: true },
      { label: "Office", img: roomOffice, cover: true },
      { label: "Bathroom", img: roomBathroom, cover: true },
      { label: "Cafe", img: roomCafe, cover: true },
    ],
    answer: [0, 1, 2],
    why: "A bedroom, office, or bathroom works if you can close the door and keep it quiet. A cafe is too noisy — other people will drown out your gut sounds.",
    hint: "Think about background noise, not just privacy.",
  },
  {
    q: "You drank coffee 20 minutes ago. Can you still do a fasting recording?",
    options: [
      { label: "Yes, drinks are acceptable" },
      { label: "No, even drinks are not permitted" },
    ],
    answer: 1,
    why: "Coffee, food, or anything other than a sip of water changes your gut activity, so the recording wouldn't count as fasting.",
    hint: "Think about what fasting means for this recording.",
  },
  {
    q: "After your chosen meal, when do you record?",
    options: [
      { label: "Once an hour, every hour, until bedtime" },
      { label: "Right after eating, then every 30 minutes for 3.5 hours" },
      { label: "Whenever you are available" },
    ],
    answer: 1,
    why: "Recording right after the meal and then every 30 minutes for 3.5 hours keeps the timing consistent across everyone in the study, so the data can be analyzed accurately.",
    hint: "Think about whether the post-meal times are a set schedule or up to you.",
  },
];

function sameAnswers(picked: number[], answer: number | number[]) {
  const need = Array.isArray(answer) ? answer : [answer];
  if (picked.length !== need.length) return false;
  const set = new Set(picked);
  return need.every((n) => set.has(n));
}

export function QuizScreen({ store }: { store: TummyStore }) {
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const item = QUIZ[qi];
  const visual = item.options.some((opt) => opt.img);
  const correct = checked && sameAnswers(picked, item.answer);
  const showHint = checked && !correct;

  const choose = (oi: number) => {
    if (correct) return;
    if (item.multi) {
      setChecked(false);
      setPicked((cur) => (cur.includes(oi) ? cur.filter((n) => n !== oi) : [...cur, oi]));
      return;
    }
    setPicked([oi]);
    setChecked(true);
  };

  const next = () => {
    if (qi === QUIZ.length - 1) {
      store.go("protocolIntro");
      return;
    }
    setQi((n) => n + 1);
    setPicked([]);
    setChecked(false);
  };

  const footer = () => {
    if (correct) {
      return (
        <Btn onClick={next}>{qi === QUIZ.length - 1 ? "Continue" : "Next question"}</Btn>
      );
    }
    if (item.multi) {
      return (
        <Btn disabled={picked.length === 0} onClick={() => setChecked(true)}>
          {picked.length === 0 ? "Select every room that works" : "Check answers"}
        </Btn>
      );
    }
    return <Btn disabled>Pick the right answer to continue</Btn>;
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
          {!checked
            ? qi === 0
              ? "A few questions to make sure the instructions landed. You'll need the right answer before we move on."
              : item.multi
                ? "Pick every room that works."
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
        {item.sub ? (
          <p className="mt-1.5 text-[15px] font-semibold leading-snug text-pine-soft">{item.sub}</p>
        ) : null}

        {visual ? (
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {item.options.map((opt, oi) => {
              const selected = picked.includes(oi);
              const wrongPick = selected && showHint;
              return (
                <button
                  key={opt.label}
                  type="button"
                  disabled={correct}
                  onClick={() => choose(oi)}
                  className={cn(
                    "overflow-hidden rounded-2xl border-2 text-left",
                    item.options.length === 3 && oi === 2 && "col-span-2 w-[calc(50%-5px)] justify-self-center",
                    selected && correct
                      ? "border-teal bg-mint-soft"
                      : wrongPick
                        ? "border-amber bg-amber-soft"
                        : selected
                          ? "border-teal bg-mint-soft"
                          : correct
                            ? "border-line bg-surface opacity-60"
                            : "border-line bg-surface",
                  )}
                >
                  <div className="aspect-[5/4] bg-[#e7efe8]">
                    <img
                      src={opt.img}
                      alt={opt.label}
                      className={cn(
                        "h-full w-full",
                        opt.cover ? "object-cover" : "object-contain",
                      )}
                    />
                  </div>
                  <span className="flex items-center gap-2 px-2.5 py-2.5 text-[14px] font-extrabold leading-snug text-pine">
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black",
                        selected && correct
                          ? "bg-teal text-surface"
                          : selected
                            ? "bg-teal/15 text-teal"
                            : "bg-wash text-pine-soft",
                      )}
                    >
                      {selected && correct ? (
                        <IconCheck width={14} height={14} />
                      ) : item.multi ? (
                        selected ? (
                          <IconCheck width={14} height={14} />
                        ) : (
                          ""
                        )
                      ) : (
                        "ABC"[oi]
                      )}
                    </span>
                    <span className="min-w-0">{opt.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {item.options.map((opt, oi) => {
              const selected = picked.includes(oi);
              const wrongPick = selected && showHint;
              return (
                <button
                  key={opt.label}
                  type="button"
                  disabled={correct}
                  onClick={() => choose(oi)}
                  className={cn(
                    "flex min-h-[68px] w-full items-center gap-3 rounded-2xl border-2 px-3 py-2 text-left text-[17px] font-bold",
                    selected && correct
                      ? "border-teal bg-mint-soft text-pine"
                      : wrongPick
                        ? "border-amber bg-amber-soft text-pine"
                        : correct
                          ? "border-line bg-surface text-pine-soft opacity-60"
                          : "border-line bg-wash text-pine",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[16px] font-black",
                      selected && correct ? "bg-teal text-surface" : "bg-surface text-pine-soft",
                    )}
                  >
                    {selected && correct ? <IconCheck width={20} height={20} /> : "ABC"[oi]}
                  </span>
                  <span className="min-w-0 flex-1">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {correct ? (
          <div className="mt-4">
            <Note tone="green" title="Why this is the answer">
              {item.why}
            </Note>
          </div>
        ) : showHint ? (
          <div className="mt-4">
            <Note tone="amber" title="Try again">
              {item.hint}
            </Note>
          </div>
        ) : null}
      </ScreenBody>
      <StickyFooter>{footer()}</StickyFooter>
    </Screen>
  );
}


/* ---------------- how a day works: tap the real app ---------------- */

const TOUR_TABS: ScreenKey[] = ["home", "logHub", "progress", "profile"];

const TOUR_COACH: Partial<
  Record<ScreenKey, { title: string; body: string; Icon: typeof IconHome }>
> = {
  home: {
    title: "Home",
    body: "Tap Next up, today's plan, or a tab at the bottom.",
    Icon: IconHome,
  },
  sessionHub: {
    title: "Today's plan",
    body: "Tap a task to open it. Recordings, your meal, and check-ins live here.",
    Icon: IconList,
  },
  morningQuestions: {
    title: "Morning questions",
    body: "A peek at the wake-up check-in. Tap an answer or back — you do not need to finish it.",
    Icon: IconSun,
  },
  caseReminder: {
    title: "Before a recording",
    body: "The case comes off every time. Tap the button, then we'll skip the rest of this dry run.",
    Icon: IconPhone,
  },
  mealCapture: {
    title: "Your study meal",
    body: "Tap when you start eating, or use back. You do not need to add a photo here.",
    Icon: IconBowl,
  },
  logHub: {
    title: "Log",
    body: "Tap a tile to see a form, or pick another tab.",
    Icon: IconBook,
  },
  logMeal: {
    title: "A log form",
    body: "This is how you add a meal. Use back when you are done looking.",
    Icon: IconBowl,
  },
  logHydration: {
    title: "A log form",
    body: "This is how you add a drink. Use back when you are done looking.",
    Icon: IconBook,
  },
  logToilet: {
    title: "A log form",
    body: "This is how you log toilet habits. Use back when you are done looking.",
    Icon: IconBook,
  },
  logSymptom: {
    title: "A log form",
    body: "This is how you log a symptom. Use back when you are done looking.",
    Icon: IconBook,
  },
  logSleep: {
    title: "A log form",
    body: "This is how you log sleep. Use back when you are done looking.",
    Icon: IconBook,
  },
  logActivity: {
    title: "A log form",
    body: "This is how you log activity. Use back when you are done looking.",
    Icon: IconBook,
  },
  progress: {
    title: "Progress",
    body: "The week at a glance, plus freeze days. Tap another tab to keep looking.",
    Icon: IconChart,
  },
  profile: {
    title: "Profile",
    body: "Change reminder times or reach the study team. Tap another tab to keep looking.",
    Icon: IconUser,
  },
  contact: {
    title: "Study team",
    body: "This is how you reach the team. Use back when you are done looking.",
    Icon: IconUser,
  },
  eveningCheckin: {
    title: "Evening check-in",
    body: "Last thing on the plan. Tap an answer or back — you do not need to finish it.",
    Icon: IconMoon,
  },
};

function mapTourView(s: ScreenKey, from: ScreenKey): ScreenKey | "done" | null {
  if (s === "periodCheck" || s === "scheduling" || s === "onboardDone") return "done";
  if (s === "whichMeal") return "mealCapture";
  if (s === "mealEnd") return "sessionHub";
  if (
    s === "caseReminder" ||
    s === "fastingCheck" ||
    s === "sessionCheck" ||
    s === "positioning" ||
    s === "recording" ||
    s === "skipReason"
  ) {
    return from === "caseReminder" ? "sessionHub" : "caseReminder";
  }
  if (s === "contactForm" || s === "contactComplaint") return "contact";
  if (s === "extraSession") return "home";
  if (TOUR_COACH[s]) return s;
  return null;
}

function tourStore(
  store: TummyStore,
  view: ScreenKey,
  onNav: (s: ScreenKey | "back") => void,
): TummyStore {
  const noop = () => undefined;
  return {
    ...store,
    day: 1,
    screen: view,
    tourPreview: true,
    go: (s) => onNav(s),
    back: () => onNav("back"),
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
  if (view === "caseReminder") {
    return (
      <CaseOffLayout
        title="Before we start"
        onBack={store.back}
        onContinue={() => store.go("sessionHub")}
      />
    );
  }
  if (view === "mealCapture") return <MealCaptureScreen store={store} />;
  if (view === "logHub") return <LogHubScreen store={store} />;
  if (view === "logMeal") return <LogMealScreen store={store} />;
  if (view === "logHydration") return <LogHydrationScreen store={store} />;
  if (view === "logToilet") return <LogToiletScreen store={store} />;
  if (view === "logSymptom") return <LogSymptomScreen store={store} />;
  if (view === "logSleep") return <LogSleepScreen store={store} />;
  if (view === "logActivity") return <LogActivityScreen store={store} />;
  if (view === "progress") return <ProgressScreen store={store} />;
  if (view === "profile") return <ProfileScreen store={store} />;
  if (view === "contact") return <ContactScreen store={store} />;
  return <EveningCheckinScreen store={store} />;
}

function blurPanels(
  holes: { x: number; y: number; w: number; h: number }[],
  W: number,
  H: number,
  pad: number,
) {
  if (W <= 0 || H <= 0) return [{ x: 0, y: 0, w: W, h: H }];
  const boxes: { x: number; y: number; r: number; b: number }[] = [];
  for (const h of [...holes].sort((a, b) => a.y - b.y)) {
    const next = {
      x: Math.max(0, h.x - pad),
      y: Math.max(0, h.y - pad),
      r: Math.min(W, h.x + h.w + pad),
      b: Math.min(H, h.y + h.h + pad),
    };
    const last = boxes[boxes.length - 1];
    if (last && next.y < last.b && next.b > last.y) {
      last.x = Math.min(last.x, next.x);
      last.y = Math.min(last.y, next.y);
      last.r = Math.max(last.r, next.r);
      last.b = Math.max(last.b, next.b);
    } else {
      boxes.push(next);
    }
  }
  const panels: { x: number; y: number; w: number; h: number }[] = [];
  let y = 0;
  for (const box of boxes) {
    if (box.y > y) panels.push({ x: 0, y, w: W, h: box.y - y });
    if (box.x > 0) panels.push({ x: 0, y: box.y, w: box.x, h: box.b - box.y });
    if (box.r < W) panels.push({ x: box.r, y: box.y, w: W - box.r, h: box.b - box.y });
    y = Math.max(y, box.b);
  }
  if (y < H) panels.push({ x: 0, y, w: W, h: H - y });
  return panels.filter((p) => p.w > 0 && p.h > 0);
}

function TourGuide({
  rootRef,
  view,
  title,
  body,
  Icon,
}: {
  rootRef: { current: HTMLDivElement | null };
  view: ScreenKey;
  title: string;
  body: string;
  Icon: typeof IconHome;
}) {
  const [holes, setHoles] = useState<{ x: number; y: number; w: number; h: number }[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const cr = root.getBoundingClientRect();
      setSize({ w: cr.width, h: cr.height });
      setHoles(
        [...root.querySelectorAll("[data-tour-spot]")].map((node) => {
          const r = node.getBoundingClientRect();
          return {
            x: r.left - cr.left,
            y: r.top - cr.top,
            w: r.width,
            h: r.height,
          };
        }),
      );
    };
    measure();
    const id = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    root.querySelectorAll("[data-tour-spot]").forEach((n) => ro.observe(n));
    root.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      root.removeEventListener("scroll", measure, true);
    };
  }, [rootRef, view, title]);

  const pad = 8;
  const panels = blurPanels(holes, size.w, size.h, pad);

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {panels.map((p, i) => (
        <div
          key={`${p.x}-${p.y}-${i}`}
          className="absolute bg-pine/30"
          style={{ left: p.x, top: p.y, width: p.w, height: p.h }}
        />
      ))}
      {holes.map((h, i) => (
        <div
          key={`ring-${h.x}-${h.y}-${i}`}
          className="absolute rounded-[24px] ring-[3px] ring-teal"
          style={{
            left: h.x - pad,
            top: h.y - pad,
            width: h.w + pad * 2,
            height: h.h + pad * 2,
          }}
        />
      ))}
      <div className="absolute inset-x-0 top-3 px-4">
        <div className="rounded-[28px] bg-surface px-5 py-4 shadow-[0_18px_50px_rgba(20,48,46,0.18)]">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-teal">
              <Icon width={24} height={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[20px] font-extrabold leading-tight text-pine">{title}</h2>
              <p className="mt-1 text-[15px] font-semibold leading-snug text-pine-soft">{body}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProtocolIntroScreen({ store }: { store: TummyStore }) {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [readyToFinish, setReadyToFinish] = useState(false);
  const [stack, setStack] = useState<ScreenKey[]>(["home"]);
  const [seenTabs, setSeenTabs] = useState<Set<ScreenKey>>(() => new Set(["home"]));
  const view = stack[stack.length - 1] ?? "home";
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = store.demoNow;
    const first = store.plan[0]?.at ?? 7 * 60;
    store.setDemoNow(first - 2);
    return () => store.setDemoNow(prev);
    // Pin the clock once so Next up looks like morning of a real day.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNav = (s: ScreenKey | "back") => {
    if (s === "back") {
      setStack((st) => (st.length > 1 ? st.slice(0, -1) : st));
      return;
    }
    if (s === "welcome") {
      setStarted(false);
      setDone(false);
      setReadyToFinish(false);
      setStack(["home"]);
      setSeenTabs(new Set(["home"]));
      return;
    }
    if (readyToFinish && TOUR_TABS.includes(s)) {
      setDone(true);
      return;
    }
    const mapped = mapTourView(s, view);
    if (mapped === "done") {
      setDone(true);
      return;
    }
    if (!mapped) return;
    setStack((st) => [...st, mapped]);
    if (TOUR_TABS.includes(mapped)) {
      setSeenTabs((prev) => {
        const next = new Set(prev);
        next.add(mapped);
        if (TOUR_TABS.every((k) => next.has(k))) setReadyToFinish(true);
        return next;
      });
    }
  };

  const previewStore = useMemo(
    () => tourStore(store, view, onNav),
    // store identity is stable enough for this walkthrough; view must update the tab highlight
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, view, readyToFinish],
  );

  if (!started) {
    return (
      <Screen>
        <TopBar title="How a day works" onBack={store.back} step="Step 5 of 9" />
        <ScreenBody className="flex flex-col">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <Mascot src={MASCOT.wave} size={170} />
            <h2 className="mt-4 text-[26px] font-extrabold leading-tight text-pine">
              A quick look around
            </h2>
            <p className="mt-3 text-[17px] font-semibold leading-snug text-pine-soft">
              You'll see the real app. Tap the buttons to move around. You will not fill anything
              in, and nothing from this walkthrough is saved.
            </p>
          </div>
        </ScreenBody>
        <StickyFooter>
          <Btn onClick={() => setStarted(true)}>Start the tour</Btn>
        </StickyFooter>
      </Screen>
    );
  }

  const coach = readyToFinish
    ? {
        title: "That's the app",
        body: "You've seen the main screens. Tap a tab to set your daily times.",
        Icon: IconCheck,
      }
    : (TOUR_COACH[view] ?? {
        title: "Keep looking",
        body: "Tap a button to keep moving through the app.",
        Icon: IconHome,
      });

  return (
    <Screen className="relative">
      <div ref={rootRef} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-hidden">
          <TourView view={view} store={previewStore} />
        </div>
        {TOUR_TABS.includes(view) ? <TabBar store={previewStore} /> : null}
        {!done ? (
          <TourGuide
            rootRef={rootRef}
            view={view}
            title={coach.title}
            body={coach.body}
            Icon={coach.Icon}
          />
        ) : null}
      </div>

      {done ? (
        <div className="absolute inset-0 z-40 flex flex-col justify-center bg-pine/80 px-5">
          <div className="rounded-[28px] bg-surface p-6 text-center shadow-[0_18px_50px_rgba(20,48,46,0.28)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-soft text-teal">
              <IconCheck width={28} height={28} />
            </div>
            <h2 className="mt-4 text-[24px] font-extrabold text-pine">That's the whole app</h2>
            <p className="mt-2 text-[16px] font-semibold leading-snug text-pine-soft">
              Home, the day's plan, logging, progress, and profile. Next you'll set the times we
              use for reminders.
            </p>
            <div className="mt-5">
              <Btn onClick={() => store.go("scheduling")}>Set my daily times</Btn>
            </div>
          </div>
        </div>
      ) : null}
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
    <span className="flex items-center gap-1.5 rounded-full bg-mint-soft px-2.5 py-1 text-[13px] font-extrabold text-pine">
      <IconLock width={14} height={14} className="text-teal" />
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
              <Mascot src={MASCOT.calm} size={78} />
              <p className="min-w-0 flex-1 rounded-3xl rounded-bl-md bg-surface px-4 py-4 text-[16px] font-semibold leading-snug text-pine">
                Now tell me how strong it feels, from 1 to 5. Tapping a number saves it and
                stamps the time. There's no extra save button.
              </p>
            </div>
            <div className="mt-4">
              <Btn onClick={() => setSeen((s) => [...s, "severity"])}>Got it</Btn>
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
            <Mascot src={MASCOT.calm} size={84} />
            <p className="min-w-0 flex-1 rounded-3xl rounded-bl-md bg-surface px-4 py-4 text-[17px] font-semibold leading-snug text-pine">
              {coach.text}
            </p>
          </div>
          <div className="mt-5">
            <Btn onClick={() => setCoach(null)}>{coach.cta}</Btn>
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
