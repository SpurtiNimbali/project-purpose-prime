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
} from "./icons";
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
              Double-check the card, or contact your coordinator at (650) 555-0134.
            </Note>
          ) : null}
        </div>
        <p className="mt-4 text-[15px] font-semibold text-pine-soft">
          Try STF-0142 to see a successful crosscheck.
        </p>
      </ScreenBody>
      <StickyFooter>
        {state === "ok" ? (
          <Btn onClick={() => store.go("studyIntro")}>Continue</Btn>
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
    title: "One week, four-plus sessions a day",
    body: "A fasting recording after you wake, then recordings across the three hours after a meal.",
  },
  {
    title: "Each recording is 2 minutes",
    body: "You sit still with the phone held against the skin of your belly. That's the whole thing.",
  },
  {
    title: "You also log a little context",
    body: "Meals, sleep, hydration, toilet habits and symptoms — quick taps, no writing needed.",
  },
  {
    title: "Nothing is diagnostic",
    body: "We never tell you that something is wrong. This is research into normal gut sounds.",
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
  },
  {
    q: "You had a coffee 20 minutes ago. Can you do the fasting recording?",
    options: ["Yes, coffee doesn't count", "No, that breaks the fast"],
    answer: 1,
    why: "Anything other than a sip of water changes your gut activity, so the recording would no longer be a fasting one.",
  },
  {
    q: "How long after your target meal are the three recordings?",
    options: ["30 min, 90 min, 3 hrs", "1 hr, 2 hrs, 4 hrs", "Whenever I remember"],
    answer: 0,
    why: "Those three moments capture the early, middle and late stages of digestion, which is what makes the data comparable.",
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

export function ProtocolIntroScreen({ store }: { store: TummyStore }) {
  return (
    <Screen>
      <TopBar title="How a day works" onBack={store.back} step="Step 5 of 9" />
      <ScreenBody>
        <MascotSays size={78}>
          Every day has the same shape. Once you've done it twice it takes about as much thought as
          brushing your teeth.
        </MascotSays>
        <div className="mt-5 space-y-3">
          {[
            {
              t: "1 · Fasting recording",
              b: "Soon after waking, before any food, drink or activity. Two minutes.",
              Icon: IconSun,
            },
            {
              t: "2 · Log your meal",
              b: "Usually breakfast. Type it or record it out loud — your timers run from here.",
              Icon: IconBowl,
            },
            {
              t: "3 · Recordings across the next 3 hours",
              b: "A short recording at each reminder. Only water in between, taken right after a recording.",
              Icon: IconMic,
            },
            {
              t: "4 · A few questions",
              b: "Once after your morning recording, and once at the end of the day.",
              Icon: IconMoon,
            },
          ].map(({ t, b, Icon }) => (
            <Card key={t}>
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
        </div>
        <div className="mt-4">
          <Note tone="amber" title="Take your phone case off">
            A case leaves a gap between the microphone and your skin, and that gap loses most of the
            sound we're listening for.
          </Note>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("scheduling")}>Continue</Btn>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- technical setup ---------------- */

const PHONE_MODELS: Record<"apple" | "android", string[]> = {
  apple: [
    "iPhone 12",
    "iPhone 13",
    "iPhone 14",
    "iPhone 15",
    "iPhone 16",
    "iPhone SE",
    "Other iPhone",
  ],
  android: [
    "Samsung Galaxy S23",
    "Samsung Galaxy S24",
    "Google Pixel 7",
    "Google Pixel 8",
    "OnePlus 12",
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
          Different phones hear slightly differently. Telling us your handset lets us standardise
          the audio across everyone in the study.
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
                  Confirm you can remove your case easily.
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
                Yes, my case comes off easily
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
      sub: "For your 30, 90 and 210 minute alarms",
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
        <Btn onClick={() => store.go("practice")} disabled={!all}>
          Continue
        </Btn>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- practice part 1: sound check ---------------- */

export function PracticeScreen({ store }: { store: TummyStore }) {
  const [phase, setPhase] = useState<"idle" | "listening" | "noisy" | "clear">("idle");
  const run = () => {
    setPhase("listening");
    setTimeout(() => setPhase((p) => (p === "listening" ? "noisy" : p)), 1800);
  };
  const retry = () => {
    setPhase("listening");
    setTimeout(() => setPhase("clear"), 1800);
  };
  return (
    <Screen>
      <TopBar title="Sound check" onBack={store.back} step="Step 9 of 9 · part 1 of 2" />
      <ScreenBody>
        <MascotSays size={78} src={MASCOT.calm}>
          First a sound check, then a short practice recording. Twenty seconds of listening — no
          need to lift your shirt for this one.
        </MascotSays>

        <div className="mt-6 flex flex-col items-center">
          <div
            className={cn(
              "flex h-[168px] w-[168px] items-center justify-center rounded-full border-[10px]",
              phase === "listening"
                ? "animate-pulse border-sage bg-mint-soft"
                : phase === "noisy"
                  ? "border-amber bg-amber-soft"
                  : phase === "clear"
                    ? "border-teal bg-mint-soft"
                    : "border-line bg-surface",
            )}
          >
            <span className="text-teal">
              <IconMic width={64} height={64} />
            </span>
          </div>
          <p className="mt-4 text-center text-[17px] font-extrabold text-pine">
            {phase === "idle" && "Ready when you are"}
            {phase === "listening" && "Listening…"}
            {phase === "noisy" && "It's a bit loud in there"}
            {phase === "clear" && "That's a clean room"}
          </p>
        </div>

        {phase === "noisy" ? (
          <div className="mt-5">
            <Note tone="amber" title="Background noise detected">
              We picked up a TV or fan. Move somewhere quieter, or turn it off, then try again.
              We'll keep looping until it's clear.
            </Note>
          </div>
        ) : null}
        {phase === "clear" ? (
          <div className="mt-5">
            <Note tone="green" title="Noise check passed">
              This spot works well. Try to use the same room each morning.
            </Note>
          </div>
        ) : null}
      </ScreenBody>
      <StickyFooter>
        {phase === "clear" ? (
          <Btn onClick={() => store.go("practiceRun")}>Continue to the practice recording</Btn>
        ) : (
          <Btn onClick={phase === "noisy" ? retry : run} disabled={phase === "listening"}>
            {phase === "noisy" ? "Try again" : "Start sound check"}
          </Btn>
        )}
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- practice part 2: dry run recording ---------------- */

const COACH_STEPS = [
  "Do not disturb stays on and you shouldn't leave this screen while recording.",
  "The time remaining is always shown here, inside the circle.",
  "Feel something? Tap the symptom, then pick how strong it is. Buttons are up top, away from the microphone.",
  "You can always finish early if you need to. Nothing breaks.",
];

export function PracticeRunScreen({ store }: { store: TummyStore }) {
  const TOTAL = 45;
  const [left, setLeft] = useState(TOTAL);
  const [coach, setCoach] = useState(0);

  useEffect(() => {
    if (coach < COACH_STEPS.length) return;
    const t = setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [coach]);

  const mmss = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
  const coaching = coach < COACH_STEPS.length;
  const finished = left === 0;

  return (
    <Screen dark className="relative">
      <TopBar title="Practice recording" onBack={store.back} dark step="Step 9 of 9 · part 2 of 2" />

      <div className="shrink-0 px-5">
        <div className="flex items-center gap-2 rounded-2xl bg-surface/10 px-4 py-3">
          <span className="text-mint">
            <IconLock width={20} height={20} />
          </span>
          <p className="flex-1 text-[15px] font-extrabold text-surface">
            Dry run · nothing is uploaded
          </p>
        </div>
      </div>

      <div className="shrink-0 px-5 pt-4">
        <div className="grid grid-cols-3 gap-2">
          {["Gurgle", "Bloating", "Pain"].map((s) => (
            <div
              key={s}
              className="flex h-[68px] items-center justify-center rounded-2xl border-2 border-surface/20 bg-surface/10 text-[15px] font-extrabold text-surface"
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-5">
        <div className="flex h-[190px] w-[190px] flex-col items-center justify-center rounded-full border-[10px] border-mint/40">
          <p className="text-[44px] font-extrabold leading-none tabular-nums text-surface">
            {mmss}
          </p>
          <p className="mt-1 text-[13px] font-extrabold uppercase tracking-[0.14em] text-mint">
            remaining
          </p>
        </div>
      </div>

      <div className="shrink-0 px-5 pb-7">
        <Btn variant="secondary" onClick={() => setLeft(0)} disabled={coaching || finished}>
          {finished ? "Practice complete" : "Finish early"}
        </Btn>
      </div>

      {coaching ? (
        <div className="absolute inset-0 z-20 flex flex-col justify-end bg-pine/70 px-5 pb-10 backdrop-blur-md">
          <div className="flex items-end gap-3">
            <Mascot src={MASCOT.calm} size={84} />
            <p className="min-w-0 flex-1 rounded-3xl rounded-bl-md bg-surface px-4 py-4 text-[17px] font-semibold leading-snug text-pine">
              {COACH_STEPS[coach]}
            </p>
          </div>
          <div className="mt-5">
            <Btn onClick={() => setCoach((c) => c + 1)}>
              {coach === COACH_STEPS.length - 1 ? "Start the practice run" : "Next"}
            </Btn>
          </div>
        </div>
      ) : null}

      {finished ? (
        <div className="absolute inset-0 z-20 flex flex-col justify-center bg-pine/80 px-5 backdrop-blur-md">
          <div className="rounded-[28px] bg-surface p-6 text-center">
            <Mascot src={MASCOT.cheer} size={140} className="mx-auto" />
            <h2 className="mt-3 text-[24px] font-extrabold text-pine">Successful session</h2>
            <p className="mt-2 text-[16px] font-semibold leading-snug text-pine-soft">
              After a real recording you'll be asked a few short questions. That's all there is to
              it — you're set.
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

export function SchedulingScreen({ store }: { store: TummyStore }) {
  return (
    <Screen>
      <TopBar title="Daily schedule" onBack={store.back} step="Step 6 of 9" />
      <ScreenBody>
        <MascotSays size={78} src={MASCOT.cheer}>
          Tell me when you usually eat and sleep, and I'll place your reminders around your life
          instead of the other way round.
        </MascotSays>
        <div className="mt-5 space-y-3">
          {[
            { label: "Wake up", def: "07:00", Icon: IconSun },
            { label: "Breakfast", def: "08:00", Icon: IconBowl },
            { label: "Lunch", def: "12:30", Icon: IconBowl },
            { label: "Dinner", def: "19:00", Icon: IconSunset },
            { label: "Go to bed", def: "23:00", Icon: IconMoon },
          ].map(({ label, def, Icon }) => (
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
        <Btn onClick={() => store.go("technicalSetup")}>Save my schedule</Btn>
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
