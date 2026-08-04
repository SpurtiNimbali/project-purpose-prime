import { useState } from "react";
import {
  Screen,
  ScreenBody,
  TopBar,
  Btn,
  Card,
  Note,
  Choice,
  ScaleRow,
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
          A one-week study listening to the sounds your gut makes. I'll walk you through
          every step, and nothing here is a test.
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
          Enter the ID printed on the card your study coordinator gave you. We check it
          against the study database — your name is never stored in this app.
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
          {state === "checking" ? (
            <Note tone="blue">Checking the study database…</Note>
          ) : null}
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
    body: "One fasting recording after you wake, then three recordings following one meal.",
  },
  {
    title: "Each recording is 8 minutes",
    body: "You sit still with the phone against your skin. Right side first, then left side.",
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
              className={cn("h-full bg-mint transition-all duration-700", watched ? "w-full" : "w-0")}
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <p className="text-[17px] font-semibold leading-relaxed text-pine-soft">
            The video shows exactly how to place the phone, how still to sit, and what a good
            recording sounds like. There's a short quiz afterwards so we know the setup is
            clear.
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
    options: ["30 min, 90 min, 3.5 hrs", "1 hr, 2 hrs, 3 hrs", "Whenever I remember"],
    answer: 0,
    why: "Those three moments capture the early, middle and late stages of digestion, which is what makes the data comparable.",
  },
];

export function QuizScreen({ store }: { store: TummyStore }) {
  const [picks, setPicks] = useState<(number | null)[]>([null, null, null]);
  const allAnswered = picks.every((p) => p !== null);

  return (
    <Screen>
      <TopBar title="Quick check" onBack={store.back} step="Step 4 of 9" />
      <ScreenBody>
        <p className="text-[17px] font-semibold leading-relaxed text-pine-soft">
          Three quick questions so we know the setup is clear. Wrong answers are fine —
          I'll explain either way.
        </p>
        <div className="mt-5 space-y-5">
          {QUIZ.map((item, qi) => {
            const pick = picks[qi];
            const correct = pick === item.answer;
            return (
              <Card key={item.q}>
                <p className="text-[16px] font-extrabold leading-snug text-pine">
                  {qi + 1}. {item.q}
                </p>
                <div className="mt-3 space-y-2">
                  {item.options.map((opt, oi) => {
                    const picked = pick === oi;
                    const isRight = oi === item.answer;
                    return (
                      <button
                        key={opt}
                        disabled={pick !== null}
                        onClick={() =>
                          setPicks((p) => p.map((v, i) => (i === qi ? oi : v)))
                        }
                        className={cn(
                          "flex min-h-[56px] w-full items-center gap-3 rounded-2xl border-2 px-3 py-2 text-left text-[16px] font-bold",
                          pick === null
                            ? "border-line bg-wash text-pine"
                            : picked && isRight
                              ? "border-teal bg-mint-soft text-pine"
                              : picked
                                ? "border-amber/60 bg-amber-soft text-pine"
                                : isRight
                                  ? "border-teal bg-surface text-pine"
                                  : "border-line bg-surface text-pine-soft opacity-60",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[16px] font-black",
                            pick !== null && isRight
                              ? "bg-teal text-surface"
                              : "bg-wash text-pine-soft",
                          )}
                        >
                          {pick !== null && isRight ? (
                            <IconCheck width={20} height={20} />
                          ) : (
                            "ABC"[oi]
                          )}
                        </span>
                        <span className="min-w-0 flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {pick !== null ? (
                  <p className="mt-3 text-[15px] font-semibold leading-snug text-pine-soft">
                    <span className="font-extrabold text-pine">
                      {correct ? "That's right. " : "Not quite. "}
                    </span>
                    {item.why}
                  </p>
                ) : null}
              </Card>
            );
          })}
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn disabled={!allAnswered} onClick={() => store.go("survey")}>
          {allAnswered ? "Continue" : "Answer all three"}
        </Btn>
      </StickyFooter>
    </Screen>
  );
}



/* ---------------- background survey ---------------- */

const SYMPTOM_ROWS: { label: string; info: string }[] = [
  {
    label: "Rumbling or gurgling you can hear",
    info: "Noises coming from your stomach or gut that you or people near you can actually hear.",
  },
  {
    label: "Bloating",
    info: "A full, tight or swollen feeling in your belly, often worse after eating.",
  },
  { label: "Feeling sick to your stomach", info: "Nausea — feeling like you might be sick." },
  {
    label: "Stomach pain or cramps",
    info: "Any ache, sharp pain or squeezing feeling anywhere in your belly.",
  },
  { label: "Passing wind", info: "Gas released from the back passage — also called flatulence." },
  { label: "Burping", info: "Bringing up air through your mouth — also called belching." },
  { label: "Being sick", info: "Vomiting — actually throwing up, not just feeling like it." },
  {
    label: "Sudden rush to the toilet",
    info: "A strong, urgent need to go that is hard to hold in.",
  },
];


export function SurveyScreen({ store }: { store: TummyStore }) {
  const [gender, setGender] = useState("");
  const [gi, setGi] = useState<string>("");
  const [scale, setScale] = useState<Record<string, number>>({});
  const [meds, setMeds] = useState("");
  const [eating, setEating] = useState("");
  const [skip, setSkip] = useState<Record<string, boolean>>({});
  const [snacks, setSnacks] = useState("");
  const [sleepReg, setSleepReg] = useState("");
  const [sleepEnough, setSleepEnough] = useState("");

  return (
    <Screen>
      <TopBar title="Background survey" onBack={store.back} step="Step 5 of 9" />
      <ScreenBody>
        <Note tone="green" title="Completely anonymous">
          Your answers are stored against your subject ID only. No names, no contact
          details, nothing that identifies you.
        </Note>

        <div className="mt-4">
          <MascotSays src={MASCOT.calm} size={78}>
            These help me understand the data context. You won't have to do this again —
            it's a one-time survey.
          </MascotSays>
        </div>

        <div className="mt-6 space-y-6">
          <Field label="Gender">
            <div className="space-y-2">
              {["Woman", "Man", "Non-binary", "Prefer not to say"].map((g) => (
                <Choice key={g} label={g} selected={gender === g} onClick={() => setGender(g)} />
              ))}
            </div>
          </Field>

          <Field label="Do you have any diagnosed GI conditions?">
            <div className="flex gap-3">
              {["Yes", "No"].map((v) => (
                <button
                  key={v}
                  onClick={() => setGi(v)}
                  className={cn(
                    "min-h-[60px] flex-1 rounded-2xl border-2 text-[17px] font-extrabold",
                    gi === v ? "border-teal bg-teal text-surface" : "border-line bg-surface text-pine",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </Field>

          <Field
            label="How often do you notice each of these?"
            hint="1 is never, 5 is very frequently."
          >
            <div className="mb-2 flex justify-between px-1 text-[14px] font-bold text-pine-soft">
              <span>1 · never</span>
              <span>5 · very frequently</span>
            </div>
            <div className="space-y-2">
              {SYMPTOM_ROWS.map((row) => (
                <ScaleRow
                  key={row.label}
                  label={row.label}
                  info={row.info}
                  value={scale[row.label] ?? 0}
                  onChange={(v) => setScale((s) => ({ ...s, [row.label]: v }))}
                />
              ))}
            </div>
          </Field>

          <Field
            label="Medications affecting bowel function"
            hint="Optional. Include anything regular, like laxatives or antacids."
          >
            <TextInput
              value={meds}
              onChange={(e) => setMeds(e.target.value)}
              placeholder="Type here, or leave blank"
            />
          </Field>

          <Field label="Your eating schedule">
            <div className="space-y-2">
              <Choice
                label="I eat at similar times"
                sub="Within about an hour each day"
                selected={eating === "similar"}
                onClick={() => setEating("similar")}
              />
              <Choice
                label="It changes often"
                sub="Meal times move around a lot"
                selected={eating === "changes"}
                onClick={() => setEating("changes")}
              />
            </div>
          </Field>

          <Field label="Regular meal times">
            <div className="space-y-2">
              {[
                { k: "breakfast", label: "Breakfast", def: "08:00", Icon: IconSun },
                { k: "lunch", label: "Lunch", def: "12:30", Icon: IconBowl },
                { k: "dinner", label: "Dinner", def: "19:00", Icon: IconSunset },
              ].map(({ k, label, def, Icon }) => (
                <div key={k} className="rounded-2xl border border-line bg-surface p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-teal">
                      <Icon width={24} height={24} />
                    </span>
                    <span className="flex-1 text-[17px] font-extrabold text-pine">{label}</span>
                    <input
                      type="time"
                      defaultValue={def}
                      disabled={skip[k]}
                      className="min-h-[52px] rounded-xl border-2 border-line bg-wash px-3 text-[17px] font-extrabold text-pine disabled:opacity-40"
                    />
                  </div>
                  <button
                    onClick={() => setSkip((s) => ({ ...s, [k]: !s[k] }))}
                    className="mt-3 flex min-h-[48px] w-full items-center gap-3 text-left"
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg border-[3px]",
                        skip[k] ? "border-teal bg-teal text-surface" : "border-line",
                      )}
                    >
                      {skip[k] ? <IconCheck width={16} height={16} /> : null}
                    </span>
                    <span className="text-[16px] font-bold text-pine-soft">
                      I skip {label.toLowerCase()}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </Field>

          <Field label="Do you snack between meals?">
            <div className="flex gap-3">
              {["Yes", "No"].map((v) => (
                <button
                  key={v}
                  onClick={() => setSnacks(v)}
                  className={cn(
                    "min-h-[60px] flex-1 rounded-2xl border-2 text-[17px] font-extrabold",
                    snacks === v
                      ? "border-teal bg-teal text-surface"
                      : "border-line bg-surface text-pine",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Your sleep schedule">
            <div className="space-y-2">
              <Choice
                label="Regular"
                selected={sleepReg === "regular"}
                onClick={() => setSleepReg("regular")}
              />
              <Choice
                label="Irregular"
                selected={sleepReg === "irregular"}
                onClick={() => setSleepReg("irregular")}
              />
            </div>
            <div className="mt-3 flex gap-3">
              {[
                { label: "Usual sleep", def: "23:00", Icon: IconMoon },
                { label: "Usual wake", def: "07:00", Icon: IconSun },
              ].map(({ label, def, Icon }) => (
                <div key={label} className="flex-1 rounded-2xl border border-line bg-surface p-3">
                  <span className="flex items-center gap-2 text-[15px] font-extrabold text-pine-soft">
                    <span className="text-teal">
                      <Icon width={20} height={20} />
                    </span>
                    {label}
                  </span>
                  <input
                    type="time"
                    defaultValue={def}
                    className="mt-2 min-h-[52px] w-full rounded-xl border-2 border-line bg-wash px-2 text-[17px] font-extrabold text-pine"
                  />
                </div>
              ))}
            </div>
          </Field>

          <Field label="Do you usually get enough sleep?">
            <div className="space-y-2">
              {["Enough", "Not enough", "More than I need"].map((v) => (
                <Choice
                  key={v}
                  label={v}
                  selected={sleepEnough === v}
                  onClick={() => setSleepEnough(v)}
                />
              ))}
            </div>
          </Field>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("protocolIntro")}>Complete survey</Btn>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- protocol intro ---------------- */

export function ProtocolIntroScreen({ store }: { store: TummyStore }) {
  return (
    <Screen>
      <TopBar title="How a day works" onBack={store.back} step="Step 6 of 9" />
      <ScreenBody>
        <MascotSays size={78}>
          Every day has the same shape. Once you've done it twice it takes about as much
          thought as brushing your teeth.
        </MascotSays>
        <div className="mt-5 space-y-3">
          {[
            {
              t: "Morning · fasting recording",
              b: "Soon after waking, before any food, drink or activity.",
              Icon: IconSun,
            },
            {
              t: "Pick one meal and capture it",
              b: "A photo or short description of what you ate.",
              Icon: IconBowl,
            },
            {
              t: "Three recordings after that meal",
              b: "At 30 minutes, 90 minutes and 3.5 hours. Set alarms — they matter.",
              Icon: IconMic,
            },
            {
              t: "Before bed",
              b: "A short sleep and symptom log. Two minutes at most.",
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
            A case leaves a gap between the microphone and your skin, and that gap loses
            most of the sound we're listening for.
          </Note>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("technicalSetup")}>Continue</Btn>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- technical setup ---------------- */

export function TechnicalSetupScreen({ store }: { store: TummyStore }) {
  const [model, setModel] = useState("iPhone 14");
  const [mic, setMic] = useState("Bottom microphone");
  const [caseOff, setCaseOff] = useState(false);
  return (
    <Screen>
      <TopBar title="Technical Setup" onBack={store.back} step="Step 7 of 9" />
      <ScreenBody>
        <p className="text-[17px] font-semibold leading-relaxed text-pine-soft">
          Different phones hear slightly differently. Recording your hardware lets us
          standardise the audio across everyone in the study.
        </p>
        <div className="mt-5 space-y-5">
          <Field label="Phone model">
            <div className="space-y-2">
              {["iPhone 14", "iPhone 15", "iPhone 16", "Other model"].map((m) => (
                <Choice key={m} label={m} selected={model === m} onClick={() => setModel(m)} />
              ))}
            </div>
          </Field>
          <Field
            label="Microphone used for capture"
            hint="We default to the bottom microphone, the one nearest the charging port."
          >
            <div className="space-y-2">
              {["Bottom microphone", "Top microphone", "External clip mic"].map((m) => (
                <Choice key={m} label={m} selected={mic === m} onClick={() => setMic(m)} />
              ))}
            </div>
          </Field>
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
        <Btn onClick={() => store.go("permissions")} disabled={!caseOff}>
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
    { k: "notif", label: "Reminders", sub: "For your 30, 90 and 210 minute alarms", Icon: IconPhone },
    { k: "dnd", label: "Do not disturb", sub: "Silences calls during a recording", Icon: IconLock },
  ];
  const all = items.every((i) => granted[i.k]);
  return (
    <Screen>
      <TopBar title="Permissions" onBack={store.back} step="Step 8 of 9" />
      <ScreenBody>
        <Note tone="green" title="Audio stays private">
          Recordings are encrypted and labelled with your subject ID only. No one on the
          study team can link them back to you by name.
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
        <Btn onClick={() => store.go("practice")} disabled={!all}>
          Continue
        </Btn>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- practice recording ---------------- */

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
      <TopBar title="Practice recording" onBack={store.back} step="Step 9 of 9" />
      <ScreenBody>
        <MascotSays size={78} src={MASCOT.calm}>
          Let's test your room. Twenty seconds of listening — no need to lift your shirt for
          this one.
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
              We picked up a TV or fan. Move somewhere quieter, or turn it off, then try
              again. We'll keep looping until it's clear.
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
          <Btn onClick={() => store.go("scheduling")}>Continue</Btn>
        ) : (
          <Btn onClick={phase === "noisy" ? retry : run} disabled={phase === "listening"}>
            {phase === "noisy" ? "Try again" : "Start noise check"}
          </Btn>
        )}
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- scheduling (last) ---------------- */

export function SchedulingScreen({ store }: { store: TummyStore }) {
  return (
    <Screen>
      <TopBar title="Set your daily times" onBack={store.back} step="Last step" />
      <ScreenBody>
        <MascotSays size={78} src={MASCOT.cheer}>
          Last one. Tell me when you usually eat and sleep, and I'll place your reminders
          around your life instead of the other way round.
        </MascotSays>
        <div className="mt-5 space-y-3">
          {[
            { label: "Wake up", def: "07:00", Icon: IconSun },
            { label: "Breakfast", def: "08:00", Icon: IconBowl },
            { label: "Lunch", def: "12:30", Icon: IconBowl },
            { label: "Dinner", def: "19:00", Icon: IconSunset },
            { label: "Bedtime", def: "23:00", Icon: IconMoon },
          ].map(({ label, def, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-teal">
                <Icon width={24} height={24} />
              </span>
              <span className="flex-1 text-[17px] font-extrabold text-pine">{label}</span>
              <input
                type="time"
                defaultValue={def}
                className="min-h-[52px] rounded-xl border-2 border-line bg-wash px-3 text-[17px] font-extrabold text-pine"
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Note tone="blue" title="You can change these any day">
            If a day looks different, adjust the times from your profile and the reminders
            move with you.
          </Note>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("onboardDone")}>Save my schedule</Btn>
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
          Day 1 begins with your fasting recording tomorrow morning. I'll nudge you shortly
          after your wake-up time.
        </p>
      </div>
      <StickyFooter>
        <Btn onClick={() => store.go("home")}>Go to home</Btn>
      </StickyFooter>
    </Screen>
  );
}
