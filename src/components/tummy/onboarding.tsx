import { useEffect, useState } from "react";
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
  IconClock,
  IconCamera,
  IconDroplet,
  IconShield,
} from "./icons";
import {
  AbdomenGuide,
  PlacementTips,
  PositionChecksGate,

  RecordTimer,
  SymptomGrid,
  SeveritySheet,
  QualityPanel,
} from "./recording";

import type { TummyStore } from "./store";

import { cn } from "@/lib/utils";

/* ---------------- welcome ---------------- */

export function WelcomeScreen({ store }: { store: TummyStore }) {
  return (
    <Screen className="bg-wash">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Mascot src={MASCOT.wave} size={200} />
        <h1 className="mt-4 text-[34px] font-extrabold leading-tight text-pine">Tummy</h1>
        <p className="mt-1 text-[15px] font-extrabold uppercase tracking-[0.14em] text-teal">
          Stanford School of Medicine
        </p>
        <p className="mt-4 text-[17px] font-semibold leading-relaxed text-pine-soft">
          A one-week study listening to the sounds your gut makes. I'll walk you through every step,
          and nothing here is a test.
        </p>
      </div>
      <StickyFooter>
        <Btn onClick={() => store.go("subjectId")}>Get started</Btn>
        <button className="mt-3 min-h-[48px] w-full text-[16px] font-extrabold text-teal">
          I already have an account
        </button>
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
      <TopBar title="Your subject ID" onBack={store.back} step="Step 1 of 9" />
      <ScreenBody>
        <p className="text-[17px] font-semibold leading-relaxed text-pine-soft">
          Enter the ID printed on the card your study coordinator gave you. We check it against the
          study database — your name is never stored in this app.
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
              Matched to cohort B, healthy group. Day 1 starts tomorrow morning.
            </Note>
          ) : null}
          {state === "bad" ? (
            <Note tone="coral" title="We can't find that ID">
              Double-check the card, or contact your coordinator through the Help page.
            </Note>
          ) : null}
        </div>
        <p className="mt-4 text-[15px] font-semibold text-pine-soft">
          Try STF-0142 to see a successful crosscheck.
        </p>
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

/* ---------------- study intro ---------------- */

const INTRO_POINTS = [
  {
    title: "Seven days in a row",
    body: "You take part on seven consecutive days. If life gets in the way, you can freeze the study for up to two days within a fortnight.",
  },
  {
    title: "Ten recordings a day, about 20 minutes",
    body: "One after you wake before eating, one right before your chosen meal, then one straight after it and every 30 minutes for the next three and a half hours.",
  },
  {
    title: "Two minutes each, longer is welcome",
    body: "Sit upright and still in a quiet room with the phone on the bare skin of your lower right belly. Two minutes is the minimum, keep going if you can.",
  },
  {
    title: "Eating and drinking during the meal window",
    body: "Once the meal ends, nothing to eat or drink until the last recording, apart from a small amount of water straight after a recording.",
  },
  {
    title: "A short diary alongside",
    body: "Questions when you wake and before bed, a few after each recording, and a photo and time for everything you eat or drink that day.",
  },
  {
    title: "Quality matters more than quantity",
    body: "If a session can't be done properly, skip it and tell us why. Missing a session never ends your part in the study.",
  },
];

export function StudyIntroScreen({ store }: { store: TummyStore }) {
  return (
    <Screen>
      <TopBar title="What the study involves" onBack={store.back} step="Step 2 of 9" />
      <ScreenBody>
        <div className="space-y-3">
          {INTRO_POINTS.map((p, i) => (
            <Card key={p.title}>
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint-soft text-[16px] font-extrabold text-teal">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[17px] font-extrabold text-pine">{p.title}</p>
                  <p className="mt-1 text-[16px] font-semibold leading-snug text-pine-soft">
                    {p.body}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("video")}>Watch the short video</Btn>
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
            The video shows exactly how to place the phone, how still to sit, and what a good
            recording sounds like. There's a short quiz afterwards so we know the setup is clear.
          </p>
          <Note tone="blue" title="Captions and transcript">
            Tap the transcript button in the player if you'd rather read along.
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
    q: "Where should the phone sit during a recording?",
    options: ["On top of my shirt", "Directly on bare skin, case off", "In my pocket"],
    answer: 1,
    why: "Clothing and cases hold the microphone away from your skin, and gut sounds are far too quiet to survive that gap.",
    hint: "Think about what has to touch your skin for a very quiet sound to be picked up.",
  },
  {
    q: "You had a coffee 20 minutes ago. Can you do the fasting recording?",
    options: ["Yes, coffee doesn't count", "No, that breaks the fast"],
    answer: 1,
    why: "Anything other than a sip of water changes your gut activity, so the recording would no longer be a fasting one.",
    hint: "Fasting means nothing at all in your stomach except water.",
  },
  {
    q: "After your study meal, how often do you record?",
    options: [
      "Right after eating, then every 30 minutes for 3.5 hours",
      "Once an hour until bedtime",
      "Whenever I remember",
    ],
    answer: 0,
    why: "A recording right after the meal and then every 30 minutes for three and a half hours captures the whole of digestion, which is what makes the data comparable between people.",
    hint: "It starts the moment the meal ends, and the gaps between recordings are short.",
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
              ? "One question at a time. Pick the answer you think is right — you'll need the right one before we move on."
              : "Nice. Here's the next one."
            : correct
              ? "That's it. Read the reason, then carry on."
              : "Not quite — have another go. Take your time, there's no penalty."}
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


/* ---------------- protocol intro ---------------- */

const DAY_STEPS = [
  {
    t: "1 · Wake-up questions",
    b: "A few quick questions as soon as you wake — sleep, and anything you've had to eat or drink.",
    Icon: IconSun,
  },
  {
    t: "2 · Fasted recording",
    b: "Within 30 minutes of waking, before any food, drink or moving around. Two minutes, sitting still.",
    Icon: IconMic,
  },
  {
    t: "3 · Your study meal",
    b: "One meal you choose. Record right before you start, log a photo, then tap when your last bite is done.",
    Icon: IconBowl,
  },
  {
    t: "4 · Recordings for 3.5 hours after",
    b: "Straight after the meal, then every 30 minutes up to 3.5 hours. Nothing to eat or drink in that window — water only, right after a recording.",
    Icon: IconClock,
  },
  {
    t: "5 · Log the rest of your day",
    b: "Every other meal, snack and drink — a photo and the time, or a quick voice note.",
    Icon: IconCamera,
  },
  {
    t: "6 · Evening check-in",
    b: "A short set of questions before bed about how the day went.",
    Icon: IconMoon,
  },
];


export function ProtocolIntroScreen({ store }: { store: TummyStore }) {
  const [shown, setShown] = useState(1);
  const all = shown >= DAY_STEPS.length;
  return (
    <Screen>
      <TopBar title="How a day works" onBack={store.back} step="Step 5 of 9" />
      <ScreenBody>
        <MascotSays size={78}>
          Every day has the same shape. I'll show you one step at a time — read each one, then tap
          for the next.
        </MascotSays>
        <div className="mt-5 space-y-3">
          {DAY_STEPS.slice(0, shown).map(({ t, b, Icon }, i) => (
            <Card key={t} className={cn(i === shown - 1 && "border-teal")}>
              <div className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-teal">
                  <Icon width={24} height={24} />
                </span>
                <div>
                  <p className="text-[17px] font-extrabold text-pine">{t}</p>
                  <p className="mt-1 text-[16px] font-semibold leading-snug text-pine-soft">{b}</p>
                </div>
              </div>
            </Card>
          ))}
          {!all ? (
            <p className="pt-1 text-center text-[15px] font-bold text-pine-soft">
              {shown} of {DAY_STEPS.length}
            </p>
          ) : null}
        </div>
        {all ? (
          <div className="mt-4">
            <Note tone="amber" title="Take your phone case off">
              A case leaves a gap between the microphone and your skin, and that gap loses most of
              the sound we're listening for.
            </Note>
          </div>
        ) : null}
      </ScreenBody>
      <StickyFooter>
        {all ? (
          <Btn onClick={() => store.go("scheduling")}>Continue</Btn>
        ) : (
          <Btn onClick={() => setShown((s) => s + 1)}>Got it — next step</Btn>
        )}
      </StickyFooter>
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
          Every recording is made with the phone's own microphone, held on bare skin. Telling us
          your handset lets us standardise the audio across everyone in the study.
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
                  The case has to come off for every recording, even if yours is stiff. Take your
                  time and work it off from one corner.
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
    { k: "mic", label: "Microphone", sub: "To capture gut sounds", Icon: IconMic },
    {
      k: "notif",
      label: "Reminders",
      sub: "For your fasted recording, your meal, and every 30 minutes after it",
      Icon: IconPhone,
    },
    {
      k: "dnd",
      label: "Do not disturb",
      sub: "Switched on only for the 2 minutes of a recording session — never the rest of the day",
      Icon: IconLock,
    },
  ];
  const all = items.every((i) => granted[i.k]);
  return (
    <Screen>
      <TopBar title="Permissions" onBack={store.back} step="Step 8 of 9" />
      <ScreenBody>
        <Note tone="green" title="Audio stays private">
          Recordings are encrypted and labelled with your subject ID only. No one on the study team
          can link them back to you by name.
        </Note>
        <div className="mt-3">
          <Note tone="blue" title="Do not disturb is only for recordings">
            We turn it on when a recording session starts and turn it straight back off when the
            session ends. Calls and messages come through normally at every other moment of the
            day.
          </Note>
        </div>
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
  const TOTAL = 45;
  const [stage, setStage] = useState<"case" | "position" | "record">("case");
  const [posChecked, setPosChecked] = useState(false);
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
        text: "You're recording now. Do not disturb is on for this session only, and it switches off the moment the recording ends.",
        cta: "Got it",
      });
    } else if (elapsed >= 4 && notSeen("timer")) {
      show({
        id: "timer",
        text: "The time left is always in the middle of the ring. The ring fills as the recording runs, so you can see progress at a glance.",
        cta: "Makes sense",
      });
    } else if (elapsed >= 9 && notSeen("symptom")) {
      show({
        id: "symptom",
        text: "Feel a gurgle, a cramp, anything? Tap its icon up top — try one now. The buttons sit away from the microphone end.",
        cta: "Let me try",
      });
    } else if (left <= 15 && left > 0 && notSeen("timeleft")) {
      show({
        id: "timeleft",
        text: "Under fifteen seconds left. When it hits zero the recording saves itself and a few short questions follow.",
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
    <div className="shrink-0 px-4 pt-3">
      <div className="flex items-center gap-2 rounded-2xl bg-surface/10 px-4 py-3">
        <span className="text-mint">
          <IconLock width={20} height={20} />
        </span>
        <p className="flex-1 text-[15px] font-extrabold text-surface">
          Dry run · nothing is uploaded
        </p>
      </div>
    </div>
  );

  /* stage 1 — case off, exactly like the real thing */
  if (stage === "case") {
    return (
      <Screen dark className="relative">
        <TopBar
          title="Practice recording"
          onBack={store.back}
          dark
          step="Step 9 of 9"
        />
        {banner}
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="flex h-[132px] w-[132px] items-center justify-center rounded-full bg-surface/10 text-mint">
            <IconPhone width={72} height={72} />
          </span>
          <h2 className="mt-5 text-[24px] font-extrabold leading-tight text-surface">
            Take your phone case off
          </h2>
          <p className="mt-2 text-[16px] font-semibold leading-snug text-mint">
            Every real recording starts here. Bare phone against bare skin — a case holds the
            microphone away from you.
          </p>
        </div>
        <div className="shrink-0 px-5 pb-7">
          <Btn onClick={() => setStage("position")}>My case is off</Btn>
        </div>
      </Screen>
    );
  }

  /* stage 2 — positioning guide, exactly like the real thing */
  if (stage === "position") {
    return (
      <Screen dark className="relative">
        <TopBar title="Positioning guide" onBack={() => setStage("case")} dark step="Practice" />
        {banner}
        <div className={cn("min-h-0 flex-1 overflow-y-auto px-5 pt-2", !posChecked && "blur-md")}>
          <AbdomenGuide />
          <p className="mt-3 text-[17px] font-extrabold leading-snug text-surface">
            Lift your shirt and put the bottom of the phone 8 cm to the right of your belly button
            and 3 cm down, flat on bare skin.
          </p>
          <p className="mt-2 text-[15px] font-semibold leading-snug text-mint">
            Microphone end onto the skin. Sit upright, breathe normally, no talking.
          </p>
          <PlacementTips />
        </div>

        <div className="shrink-0 px-5 pb-7 pt-3">
          <Btn disabled={!posChecked} onClick={() => setStage("record")}>
            I'm in position
          </Btn>
        </div>

        {!posChecked ? <PositionChecksGate onDone={() => setPosChecked(true)} /> : null}
      </Screen>
    );
  }


  /* stage 3 — the run itself, identical UI to a real recording */
  return (
    <Screen dark className="relative">
      {banner}

      <SymptomGrid
        counts={counts}
        onPick={(key, label) => setPending({ key, label, at: TOTAL - left })}
      />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-5">
        <RecordTimer elapsed={TOTAL - left} min={TOTAL} />
        <p className="mt-5 text-[16px] font-bold text-mint">Keep still until the ring empties</p>
        <p className="mt-1 text-[15px] font-bold text-surface/70">
          {marks.length} symptom {marks.length === 1 ? "mark" : "marks"} recorded
        </p>
      </div>

      <div className="shrink-0 px-5 pb-7">
        <Btn variant="secondary" onClick={() => setLeft(0)} disabled={finished}>
          {finished ? "Practice complete" : "Finish early"}
        </Btn>
      </div>

      {pending ? (
        <>
          <SeveritySheet
            pending={pending}
            onCancel={() => setPending(null)}
            onPick={(n) => {
              setMarks((m) => [...m, { key: pending.key, label: pending.label, severity: n }]);
              setPending(null);
              setToast(`${pending.label} saved at level ${n}`);
            }}
          />
          {notSeen("severity") ? (
            <div className="absolute inset-x-0 bottom-0 top-[300px] z-30 flex flex-col justify-end bg-pine/70 px-5 pb-10 backdrop-blur-md">
              <div className="flex items-end gap-3">
                <Mascot src={MASCOT.calm} size={78} />
                <p className="min-w-0 flex-1 rounded-3xl rounded-bl-md bg-surface px-4 py-4 text-[16px] font-semibold leading-snug text-pine">
                  Now say how strong it is, 1 to 5. It saves the moment you tap a number — no save
                  button, and the time is stamped for you.
                </p>
              </div>
              <div className="mt-4">
                <Btn onClick={() => setSeen((s) => [...s, "severity"])}>Got it</Btn>
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      {toast ? (
        <div className="pointer-events-none absolute inset-x-5 top-[360px] z-30 rounded-2xl bg-mint px-4 py-3 text-center text-[16px] font-extrabold text-pine shadow-lg">
          {toast}
        </div>
      ) : null}

      {coach ? (
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
          pass={attempt > 0}
          onRedo={() => {
            setAttempt((a) => a + 1);
            setLeft(TOTAL);
            setMarks([]);
            setStage("position");
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
              After a real recording you'll get the same sound check, then a few short questions.
              That's all there is to it — you're set.
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
          Tell me when you usually eat and sleep. Weekends are usually different, so I ask for both.
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
          These times are for reminders only — no worries at all if they move around from day to
          day.
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
    { k: "breakfast", label: "Breakfast", sub: "Recordings run through the morning", Icon: IconSun },
    { k: "lunch", label: "Lunch", sub: "Recordings run through the afternoon", Icon: IconBowl },
    { k: "dinner", label: "Dinner", sub: "Recordings run through the evening", Icon: IconSunset },
  ] as const;
  return (
    <Screen>
      <TopBar title="Your study meal" onBack={store.back} step="Step 6 of 9" />
      <ScreenBody>
        <MascotSays size={78} src={MASCOT.calm}>
          Which meal would you like your recordings to follow? Pick the one you eat at the steadiest
          time — it stays the same every study day.
        </MascotSays>
        <div className="mt-5 space-y-3">
          {meals.map(({ k, label, sub, Icon }) => (
            <button
              key={k}
              onClick={() => store.chooseStudyMeal(k)}
              className={cn(
                "flex min-h-[92px] w-full items-center gap-4 rounded-3xl border-2 bg-surface px-5 text-left",
                store.meal === k ? "border-teal bg-mint-soft" : "border-line",
              )}
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-teal">
                <Icon width={30} height={30} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[20px] font-extrabold text-pine">{label}</span>
                <span className="block text-[15px] font-semibold text-pine-soft">{sub}</span>
              </span>
              {store.meal === k ? (
                <span className="shrink-0 text-teal">
                  <IconCheck width={24} height={24} />
                </span>
              ) : null}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <Note tone="blue" title="What this changes">
            A recording just before this meal, one straight after, then every 30 minutes for 3.5
            hours. Other meals and snacks are only logged.
          </Note>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("snacking")}>Continue</Btn>
      </StickyFooter>
    </Screen>
  );
}



/* ---------------- snacking ---------------- */

export function SnackingScreen({ store }: { store: TummyStore }) {
  const [tab, setTab] = useState<"weekday" | "weekend">("weekday");
  const [snacks, setSnacks] = useState<"" | "yes" | "no">("");
  const [seenWeekend, setSeenWeekend] = useState(false);
  const [times, setTimes] = useState<Record<"weekday" | "weekend", string[]>>({
    weekday: ["10:30"],
    weekend: ["11:00"],
  });

  const list = times[tab];
  const setList = (next: string[]) => setTimes((t) => ({ ...t, [tab]: next }));

  return (
    <Screen>
      <TopBar title="Snacking" onBack={store.back} step="Step 6 of 9" />
      <ScreenBody>
        <MascotSays size={78} src={MASCOT.calm}>
          Do you usually snack in between meals?
        </MascotSays>
        <div className="mt-5 space-y-2">
          <Choice
            label="Yes, most days"
            selected={snacks === "yes"}
            onClick={() => setSnacks("yes")}
          />
          <Choice
            label="No, rarely or never"
            selected={snacks === "no"}
            onClick={() => setSnacks("no")}
          />
        </div>
        {snacks === "yes" ? (
          <>
            <div className="mt-5">
              <DayTypeTabs
                value={tab}
                onChange={(v) => {
                  setTab(v);
                  if (v === "weekend") setSeenWeekend(true);
                }}
              />
            </div>
            <div className="mt-4 rounded-2xl border-2 border-teal bg-mint-soft p-4">
              <p className="text-[18px] font-extrabold leading-snug text-pine">
                A rough guess is completely fine.
              </p>
              <p className="mt-1 text-[16px] font-semibold leading-snug text-pine-soft">
                These times never have to be exact. Just add roughly when you usually snack on a{" "}
                {tab === "weekday" ? "weekday" : "weekend day"}, and add as many as you like.
              </p>
            </div>
            <div className="mt-3 space-y-3">
              {list.map((value, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border-2 border-line bg-surface p-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-teal">
                    <IconBowl width={24} height={24} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[17px] font-extrabold text-pine">
                    Snack {i + 1}
                  </span>
                  <input
                    type="time"
                    value={value}
                    onChange={(e) =>
                      setList(list.map((t, n) => (n === i ? e.target.value : t)))
                    }
                    className="min-h-[52px] shrink-0 rounded-xl border-2 border-line bg-wash px-3 text-[17px] font-extrabold text-pine"
                  />
                  <button
                    onClick={() => setList(list.filter((_, n) => n !== i))}
                    aria-label={`Remove snack ${i + 1}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wash text-[22px] font-extrabold text-pine-soft"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => setList([...list, "15:00"])}
                className="flex min-h-[60px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-teal bg-surface text-[17px] font-extrabold text-teal"
              >
                + Add another snack time
              </button>
            </div>
          </>
        ) : null}
      </ScreenBody>
      <StickyFooter>
        {snacks === "yes" && !seenWeekend ? (
          <Btn
            onClick={() => {
              setTab("weekend");
              setSeenWeekend(true);
            }}
          >
            Next: weekend snacks
          </Btn>
        ) : (
          <Btn disabled={!snacks} onClick={() => store.go("technicalSetup")}>
            Continue
          </Btn>
        )}
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
        <MascotSays size={78}>
          One quick question. Gut activity differs between people, so the study team records this
          alongside your subject ID.
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
        <div className="mt-4">
          <Note tone="green" title="Why we ask">
            If you're female, we'll add one short question about your cycle to the evening check-in,
            because it can change gut symptoms.
          </Note>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("video")}>Continue</Btn>
      </StickyFooter>
    </Screen>
  );
}


export function OnboardDoneScreen({ store }: { store: TummyStore }) {
  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Mascot src={MASCOT.cheer} size={190} />
        <h1 className="mt-4 text-[28px] font-extrabold leading-tight text-pine">
          You're all set up
        </h1>
        <p className="mt-3 text-[17px] font-semibold leading-relaxed text-pine-soft">
          Day 1 begins with your fasting recording tomorrow morning. I'll nudge you shortly after
          your wake-up time.
        </p>
      </div>
      <StickyFooter>
        <Btn onClick={() => store.go("home")}>Go to home</Btn>
      </StickyFooter>
    </Screen>
  );
}
