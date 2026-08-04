import { useEffect, useRef, useState } from "react";
import {
  Screen,
  ScreenBody,
  TopBar,
  Btn,
  Card,
  Note,
  Choice,
  Severity,
  Mascot,
  MascotSays,
  StickyFooter,
  TextInput,
  MASCOT,
} from "./ui";
import {
  IconMic,
  IconPhone,
  IconCheck,
  IconClock,
  IconCamera,
  IconSun,
  IconBowl,
  IconSunset,
  IconWave,
  IconBalloon,
  IconBolt,
  IconSpiral,
  IconDizzy,
  IconWind,
  IconLock,
  IconX,
} from "./icons";
import type { TummyStore } from "./store";
import { cn } from "@/lib/utils";

/* ---------------- session hub ---------------- */

const PLAN: {
  id: string;
  title: string;
  due: string;
  track: "fasting" | "postMeal";
  offset?: 30 | 90 | 210;
  Icon: typeof IconSun;
}[] = [
  { id: "fasting", title: "Fasting", due: "7:30 am", track: "fasting", Icon: IconSun },
  { id: "m30", title: "Meal + 30 min", due: "9:05 am", track: "postMeal", offset: 30, Icon: IconBowl },
  { id: "m90", title: "Meal + 90 min", due: "10:05 am", track: "postMeal", offset: 90, Icon: IconClock },
  { id: "m210", title: "Meal + 3.5 hrs", due: "12:05 pm", track: "postMeal", offset: 210, Icon: IconSunset },
];

export function SessionHubScreen({ store }: { store: TummyStore }) {
  const doneMap = Object.fromEntries(store.sessions.map((s) => [s.id, s.done]));
  const doneCount = PLAN.filter((p) => doneMap[p.id]).length;
  const next = PLAN.find((p) => !doneMap[p.id]);

  const start = (p: (typeof PLAN)[number]) => {
    store.setTrack(p.track);
    if (p.offset) store.setOffset(p.offset);
    store.go("caseReminder");
  };

  return (
    <Screen>
      <TopBar title="Today's recordings" onBack={store.back} step={`Day ${store.day} of 7`} />
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5">
        {/* progress */}
        <div className="flex items-center gap-3">
          <div className="flex flex-1 gap-2">
            {PLAN.map((p) => (
              <span
                key={p.id}
                className={cn(
                  "h-[10px] flex-1 rounded-full",
                  doneMap[p.id] ? "bg-teal" : p.id === next?.id ? "bg-teal/40" : "bg-line",
                )}
              />
            ))}
          </div>
          <span className="shrink-0 text-[15px] font-extrabold text-pine-soft">
            {doneCount}/4 done
          </span>
        </div>

        {/* next session hero */}
        {next ? (
          <div className="mt-4 rounded-[28px] bg-teal p-5 text-surface">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-mint">
              Up next
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface/15">
                <next.Icon width={30} height={30} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[24px] font-extrabold leading-tight">
                  {next.title}
                </p>
                <p className="text-[16px] font-bold text-mint">Due {next.due} · 8 min</p>
              </div>
            </div>
            <div className="mt-4">
              <Btn variant="secondary" onClick={() => start(next)}>
                Start this recording
              </Btn>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-[28px] bg-teal p-5 text-center text-surface">
            <p className="text-[22px] font-extrabold">All four done today</p>
            <p className="mt-1 text-[16px] font-bold text-mint">
              Nothing more to record until tomorrow morning.
            </p>
          </div>
        )}

        {/* remaining sessions, compact */}
        <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto">
          {PLAN.filter((p) => p.id !== next?.id).map((p) => {
            const done = doneMap[p.id];
            return (
              <button
                key={p.id}
                disabled={done}
                onClick={() => start(p)}
                className="flex min-h-[62px] w-full items-center gap-3 rounded-2xl border border-line bg-surface px-4 text-left disabled:opacity-70"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    done ? "bg-teal text-surface" : "bg-mint-soft text-teal",
                  )}
                >
                  {done ? <IconCheck width={20} height={20} /> : <p.Icon width={20} height={20} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[17px] font-extrabold text-pine">
                    {p.title}
                  </span>
                  <span className="block text-[15px] font-semibold text-pine-soft">
                    {done ? "Recorded" : `Due ${p.due}`}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* one-line setup reminder */}
        <button
          onClick={() => {
            store.setTrack("postMeal");
            store.go("whichMeal");
          }}
          className="mt-3 flex min-h-[58px] w-full items-center gap-3 rounded-2xl border-2 border-line bg-surface px-4 text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint-soft text-teal">
            <IconCamera width={20} height={20} />
          </span>
          <span className="min-w-0 flex-1 text-[16px] font-extrabold text-pine">
            Log the meal that anchors these timers
          </span>
        </button>
        <p className="mt-3 text-center text-[15px] font-bold text-pine-soft">
          Case off · quiet room · sit still, no talking
        </p>
      </div>
    </Screen>
  );
}


/* ---------------- case reminder ---------------- */

export function CaseReminderScreen({ store }: { store: TummyStore }) {
  const [why, setWhy] = useState(false);
  const next = () => store.go(store.track === "fasting" ? "fastingCheck" : "sessionCheck");
  return (
    <Screen>
      <TopBar title="Before we start" onBack={store.back} />
      <ScreenBody className="flex flex-col">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="flex h-[132px] w-[132px] items-center justify-center rounded-full bg-mint-soft text-teal">
            <IconPhone width={72} height={72} />
          </span>
          <h2 className="mt-5 text-[26px] font-extrabold leading-tight text-pine">
            Did you take your phone case off?
          </h2>
          <p className="mt-2 text-[17px] font-semibold text-pine-soft">
            Every recording needs bare phone against bare skin.
          </p>
        </div>
        <button
          onClick={() => setWhy((v) => !v)}
          className="mt-4 min-h-[52px] text-[16px] font-extrabold text-teal"
        >
          {why ? "Hide explanation" : "Why?"}
        </button>
        {why ? (
          <Note tone="amber" title="Why the case matters">
            A case creates a gap between the microphone and your skin. Gut sounds are quiet
            and low, so even a couple of millimetres of air loses most of the signal.
          </Note>
        ) : null}
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={next}>I removed my case</Btn>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- fasting check ---------------- */

export function FastingCheckScreen({ store }: { store: TummyStore }) {
  return (
    <Screen>
      <TopBar title="Fasting check" onBack={store.back} />
      <ScreenBody className="flex flex-col">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Mascot src={MASCOT.calm} size={150} />
          <h2 className="mt-4 text-[26px] font-extrabold leading-tight text-pine">
            Are you in a fasting state right now?
          </h2>
          <p className="mt-2 text-[17px] font-semibold leading-snug text-pine-soft">
            No food, no drinks other than a sip of water, and no exercise since you woke up.
          </p>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("positioning")}>Yes, I am fasting</Btn>
        <div className="mt-3">
          <Btn variant="secondary" onClick={() => store.go("home")}>
            No, return home
          </Btn>
        </div>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- which meal ---------------- */

export function WhichMealScreen({ store }: { store: TummyStore }) {
  const meals = [
    { k: "breakfast", label: "Breakfast", Icon: IconSun },
    { k: "lunch", label: "Lunch", Icon: IconBowl },
    { k: "dinner", label: "Dinner", Icon: IconSunset },
  ] as const;
  return (
    <Screen>
      <TopBar title="Which meal?" onBack={store.back} />
      <ScreenBody>
        <p className="text-[17px] font-semibold leading-relaxed text-pine-soft">
          Pick the meal these recordings will follow. Your three timers start from the
          moment you finish eating.
        </p>
        <div className="mt-5 space-y-3">
          {meals.map(({ k, label, Icon }) => (
            <button
              key={k}
              onClick={() => {
                store.setMeal(k);
                store.go("mealCapture");
              }}
              className={cn(
                "flex min-h-[92px] w-full items-center gap-4 rounded-3xl border-2 bg-surface px-5 text-left",
                store.meal === k ? "border-teal" : "border-line",
              )}
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-teal">
                <Icon width={30} height={30} />
              </span>
              <span className="text-[20px] font-extrabold text-pine">{label}</span>
            </button>
          ))}
        </div>
      </ScreenBody>
    </Screen>
  );
}

/* ---------------- meal capture ---------------- */

export function MealCaptureScreen({ store }: { store: TummyStore }) {
  const [photo, setPhoto] = useState(false);
  const [desc, setDesc] = useState("");
  return (
    <Screen>
      <TopBar title={`Capture your ${store.meal}`} onBack={store.back} />
      <ScreenBody>
        <button
          onClick={() => setPhoto(true)}
          className={cn(
            "flex h-[190px] w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed",
            photo ? "border-teal bg-mint-soft text-teal" : "border-line bg-surface text-pine-soft",
          )}
        >
          <IconCamera width={48} height={48} />
          <span className="text-[17px] font-extrabold">
            {photo ? "Photo added" : "Upload a photo of the meal"}
          </span>
        </button>
        <div className="mt-4">
          <p className="mb-2 text-[16px] font-extrabold text-pine">Or describe it</p>
          <TextInput
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Two eggs, toast, black coffee"
          />
        </div>
        <div className="mt-4">
          <Note tone="blue" title="We'll set the three timers for you">
            Once you save, reminders land at 30 minutes, 90 minutes and 3.5 hours from now.
          </Note>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn
          disabled={!photo && desc.trim().length === 0}
          onClick={() => {
            store.setOffset(30);
            store.go("sessionHub");
          }}
        >
          Save meal and start timers
        </Btn>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- session checklist ---------------- */

export function SessionCheckScreen({ store }: { store: TummyStore }) {
  return (
    <Screen>
      <TopBar title="Session checklist" onBack={store.back} />
      <ScreenBody className="flex flex-col">
        <div className="flex flex-1 flex-col justify-center">
          <Mascot src={MASCOT.calm} size={120} className="mx-auto" />
          <h2 className="mt-4 text-center text-[24px] font-extrabold leading-tight text-pine">
            Please confirm you haven't had any snacks or drinks after that target meal
          </h2>
          <p className="mt-3 text-center text-[17px] font-semibold leading-snug text-pine-soft">
            Anything eaten in between changes what we hear, so we'd rather skip the session
            than record it.
          </p>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("positioning")}>
          I haven't had anything besides the target meal
        </Btn>
        <div className="mt-3">
          <Btn variant="danger" onClick={() => store.go("home")}>
            I consumed something after the target meal
          </Btn>
        </div>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- positioning ---------------- */

function AbdomenGuide({
  side,
  region,
}: {
  side: "right" | "left";
  region: "upper" | "lower";
}) {
  const x = side === "right" ? 74 : 126;
  const y = region === "upper" ? 96 : 132;
  return (
    <svg viewBox="0 0 200 220" width="100%" height="230" role="img" aria-label="Phone placement guide">
      {/* torso */}
      <path
        d="M62 26c0-8 12-14 38-14s38 6 38 14c6 26 8 60 4 96-3 28-10 50-14 66H72c-4-16-11-38-14-66-4-36-2-70 4-96z"
        fill="#1d4a3f"
        stroke="#8FC9AC"
        strokeWidth="2.5"
      />
      {/* lifted shirt hem */}
      <path
        d="M56 74c14 10 30 14 44 14s30-4 44-14c3 6 5 10 5 14-16 12-32 17-49 17s-33-5-49-17c0-4 2-8 5-14z"
        fill="#2E7D6B"
        opacity="0.85"
      />
      {/* navel */}
      <circle cx="100" cy="120" r="4.5" fill="#8FC9AC" />
      <text x="100" y="146" textAnchor="middle" fontSize="9" fill="#8FC9AC" fontWeight="700">
        belly button
      </text>
      {/* measure line */}
      <line
        x1="100"
        y1={y}
        x2={x}
        y2={y}
        stroke="#E8A33D"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <text
        x={(100 + x) / 2}
        y={y - 8}
        textAnchor="middle"
        fontSize="10"
        fill="#E8A33D"
        fontWeight="800"
      >
        9 cm
      </text>
      {/* phone */}
      <g transform={`translate(${x - 13} ${y - 30})`}>
        <rect width="26" height="52" rx="6" fill="#E7F1EC" stroke="#143029" strokeWidth="2" />
        <rect x="8" y="45" width="10" height="3" rx="1.5" fill="#2E7D6B" />
        <text x="13" y="28" textAnchor="middle" fontSize="7" fill="#2E7D6B" fontWeight="800">
          mic
        </text>
      </g>
    </svg>
  );
}

export function PositioningScreen({ store }: { store: TummyStore }) {
  const sideLabel = store.side === "right" ? "RIGHT SIDE" : "LEFT SIDE";
  return (
    <Screen dark>
      <TopBar title="Positioning guide" onBack={store.back} dark step={sideLabel} />
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <AbdomenGuide side={store.side} region={store.region} />

        <div className="mt-2 space-y-2">
          <p className="text-[18px] font-extrabold leading-snug text-surface">
            Lift your shirt and place the microphone exactly 9 cm to the{" "}
            {store.side === "right" ? "right" : "left"} of your belly button, perpendicular
            to your skin.
          </p>
          <p className="text-[16px] font-semibold leading-snug text-mint">
            Bottom of the phone — the microphone side — pressed onto bare skin. Case off.
            Sit upright and stay still.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <div>
            <p className="mb-2 text-[15px] font-extrabold uppercase tracking-[0.1em] text-mint">
              Side
            </p>
            <div className="flex gap-2">
              {(["right", "left"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => store.setSide(s)}
                  className={cn(
                    "min-h-[56px] flex-1 rounded-2xl border-2 text-[16px] font-extrabold",
                    store.side === s
                      ? "border-mint bg-mint text-pine"
                      : "border-surface/25 bg-surface/10 text-surface",
                  )}
                >
                  {s === "right" ? "Right side" : "Left side"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[15px] font-extrabold uppercase tracking-[0.1em] text-mint">
              Position on the abdomen
            </p>
            <div className="flex gap-2">
              {(["upper", "lower"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => store.setRegion(r)}
                  className={cn(
                    "min-h-[56px] flex-1 rounded-2xl border-2 text-[16px] font-extrabold",
                    store.region === r
                      ? "border-mint bg-mint text-pine"
                      : "border-surface/25 bg-surface/10 text-surface",
                  )}
                >
                  {r === "upper" ? "Upper" : "Lower"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="shrink-0 px-5 pb-7 pt-3">
        <Btn onClick={() => store.go("recording")}>I'm in position</Btn>
      </div>
    </Screen>
  );
}

/* ---------------- recording ---------------- */

const SYMPTOMS = [
  { key: "gurgle", label: "Gurgle", Icon: IconWave },
  { key: "bloat", label: "Bloating", Icon: IconBalloon },
  { key: "pain", label: "Pain", Icon: IconBolt },
  { key: "cramp", label: "Cramp", Icon: IconSpiral },
  { key: "nausea", label: "Nausea", Icon: IconDizzy },
  { key: "gas", label: "Gas", Icon: IconWind },
];

const TOTAL = 480; // 8 minutes

export function RecordingScreen({ store }: { store: TummyStore }) {
  const [left, setLeft] = useState(TOTAL);
  const [pending, setPending] = useState<{ key: string; label: string; at: number } | null>(null);
  const [severity, setSeverity] = useState(3);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    store.resetMarks();
  }, [store]);

  useEffect(() => {
    const t = setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mmss = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
  const pct = 1 - left / TOTAL;
  const R = 78;
  const C = 2 * Math.PI * R;

  const counts = store.marks.reduce<Record<string, number>>((acc, m) => {
    acc[m.key] = (acc[m.key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <Screen dark className="relative">
      <div className="shrink-0 px-4 pb-2 pt-14">
        <div className="flex items-center gap-2 rounded-2xl bg-surface/10 px-4 py-3">
          <span className="text-mint">
            <IconLock width={20} height={20} />
          </span>
          <p className="flex-1 text-[15px] font-extrabold text-surface">
            Do not disturb is on · don't leave this screen
          </p>
        </div>
      </div>

      {/* symptom taps at TOP — bottom of the phone is against the mic */}
      <div className="shrink-0 px-4 pt-3">
        <p className="mb-2 text-[15px] font-extrabold text-mint">
          Feel something? Tap it — buttons are up here so your taps stay away from the
          microphone.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {SYMPTOMS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => {
                setSeverity(3);
                setPending({ key, label, at: TOTAL - left });
                if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(18);
              }}
              className="relative flex h-[76px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-surface/20 bg-surface/10 text-surface active:bg-mint active:text-pine"
            >
              <Icon width={26} height={26} />
              <span className="text-[14px] font-extrabold">{label}</span>
              {counts[key] ? (
                <span className="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-mint px-1 text-[13px] font-extrabold text-pine">
                  {counts[key]}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <svg width="196" height="196" viewBox="0 0 196 196">
          <circle cx="98" cy="98" r={R} stroke="rgba(255,255,255,0.16)" strokeWidth="12" fill="none" />
          <circle
            cx="98"
            cy="98"
            r={R}
            stroke="#8FC9AC"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct)}
            transform="rotate(-90 98 98)"
          />
        </svg>
        <div className="-mt-[130px] flex flex-col items-center">
          <span className="text-mint">
            <IconMic width={30} height={30} />
          </span>
          <p className="mt-1 text-[42px] font-extrabold leading-none tracking-tight text-surface">
            {mmss}
          </p>
          <p className="mt-1 text-[15px] font-bold text-mint">
            {store.side === "right" ? "Right side" : "Left side"} · {store.region} abdomen
          </p>
        </div>
        <p className="mt-[86px] text-[15px] font-bold text-mint">
          {store.marks.length} symptom {store.marks.length === 1 ? "mark" : "marks"} recorded
        </p>
      </div>

      <div className="shrink-0 px-5 pb-7">
        {store.side === "right" ? (
          <Btn
            variant="secondary"
            onClick={() => {
              store.setSide("left");
              setLeft(TOTAL);
              store.go("positioning");
            }}
          >
            Finish right side, switch to left
          </Btn>
        ) : (
          <Btn onClick={() => store.go("postMeta")}>Finish recording</Btn>
        )}
      </div>

      {pending ? (
        <div className="absolute inset-0 z-20 flex items-end bg-pine/70 backdrop-blur-sm">
          <div className="w-full rounded-t-[32px] bg-pine p-5 pb-8 ring-1 ring-surface/15">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-[20px] font-extrabold text-surface">{pending.label}</p>
                <p className="text-[15px] font-bold text-mint">
                  Marked at {String(Math.floor(pending.at / 60)).padStart(2, "0")}:
                  {String(pending.at % 60).padStart(2, "0")} into the recording
                </p>
              </div>
              <button
                onClick={() => setPending(null)}
                aria-label="Cancel"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-surface/15 text-surface"
              >
                <IconX width={22} height={22} />
              </button>
            </div>
            <p className="mt-4 text-[16px] font-extrabold text-surface">How strong is it?</p>
            <div className="mt-2">
              <Severity value={severity} onChange={setSeverity} dark />
            </div>
            <div className="mt-4">
              <Btn
                onClick={() => {
                  store.addMark({ ...pending, severity });
                  setPending(null);
                }}
              >
                Save mark
              </Btn>
            </div>
          </div>
        </div>
      ) : null}
    </Screen>
  );
}

/* ---------------- post-recording metadata (chat) ---------------- */

type Turn = { from: "bot" | "you"; text: string };

export function PostMetaScreen({ store }: { store: TummyStore }) {
  const morning = store.track === "fasting";
  const questions = [
    {
      q: "Nicely done. Where were you for that recording?",
      options: ["Home", "Office", "Other — hotel or travel"],
    },
    {
      q: "Any unusual noise? Coughing, someone walking in, a phone ringing?",
      options: ["No, it was quiet", "Yes — let me describe it"],
    },
    ...(morning
      ? [
          {
            q: "Was this before any physical activity?",
            options: ["Yes, before activity", "No, I'd already moved around"],
          },
          {
            q: "Anything carbonated or caffeinated since waking?",
            options: ["Nothing at all", "Yes, a little"],
          },
        ]
      : []),
  ];

  const [step, setStep] = useState(0);
  const [turns, setTurns] = useState<Turn[]>([{ from: "bot", text: questions[0].q }]);
  const [note, setNote] = useState("");
  const [needNote, setNeedNote] = useState(false);
  const done = step >= questions.length;

  const answer = (opt: string) => {
    const wantsNote = opt.startsWith("Yes — let me describe");
    const nextTurns: Turn[] = [...turns, { from: "you", text: opt }];
    if (wantsNote) {
      setNeedNote(true);
      setTurns([...nextTurns, { from: "bot", text: "Go ahead — type it or record a voice note." }]);
      return;
    }
    const n = step + 1;
    setStep(n);
    setTurns(
      n < questions.length
        ? [...nextTurns, { from: "bot", text: questions[n].q }]
        : [...nextTurns, { from: "bot", text: "That's everything. Uploading now." }],
    );
  };

  const submitNote = () => {
    const n = step + 1;
    setNeedNote(false);
    setStep(n);
    setTurns((t) => [
      ...t,
      { from: "you", text: note || "A voice note" },
      n < questions.length
        ? { from: "bot", text: questions[n].q }
        : { from: "bot", text: "That's everything. Uploading now." },
    ]);
    setNote("");
  };

  return (
    <Screen>
      <TopBar title="A few quick details" onBack={store.back} />
      <ScreenBody>
        <div className="space-y-3">
          {turns.map((t, i) =>
            t.from === "bot" ? (
              <div key={i} className="flex items-start gap-2">
                <Mascot size={44} src={MASCOT.calm} />
                <p className="max-w-[76%] rounded-3xl rounded-tl-md border border-line bg-surface px-4 py-3 text-[16px] font-semibold leading-snug text-pine">
                  {t.text}
                </p>
              </div>
            ) : (
              <p
                key={i}
                className="ml-auto max-w-[76%] rounded-3xl rounded-br-md bg-teal px-4 py-3 text-[16px] font-bold text-surface"
              >
                {t.text}
              </p>
            ),
          )}
        </div>

        {!done && !needNote ? (
          <div className="mt-4 space-y-2">
            {questions[step].options.map((o) => (
              <Choice key={o} label={o} onClick={() => answer(o)} />
            ))}
          </div>
        ) : null}

        {needNote ? (
          <div className="mt-4 space-y-2">
            <TextInput
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="My neighbour's dog started barking"
            />
            <Btn onClick={submitNote}>Send</Btn>
            <Btn variant="secondary" onClick={submitNote} icon={<IconMic width={22} height={22} />}>
              Record a voice note instead
            </Btn>
          </div>
        ) : null}
      </ScreenBody>
      {done ? (
        <StickyFooter>
          <Btn onClick={() => store.go("uploadDone")}>Finish session</Btn>
        </StickyFooter>
      ) : null}
    </Screen>
  );
}

/* ---------------- upload done ---------------- */

export function UploadDoneScreen({ store }: { store: TummyStore }) {
  return (
    <Screen>
      <ScreenBody className="flex flex-col justify-center pt-14 text-center">
        <Mascot src={MASCOT.cheer} size={170} className="mx-auto" />
        <h1 className="mt-4 text-[26px] font-extrabold leading-tight text-pine">
          Session saved
        </h1>
        <p className="mt-2 text-[17px] font-semibold leading-snug text-pine-soft">
          Both sides uploaded, with {store.marks.length} symptom{" "}
          {store.marks.length === 1 ? "mark" : "marks"} timestamped against the audio.
        </p>
        <div className="mt-5 rounded-3xl border border-line bg-surface p-5 text-left">
          <div className="flex items-center gap-2 text-teal">
            <IconClock width={22} height={22} />
            <p className="text-[16px] font-extrabold">Next recording</p>
          </div>
          <p className="mt-1 text-[19px] font-extrabold text-pine">In 1 hour · 90 min mark</p>
          <p className="mt-1 text-[16px] font-semibold text-pine-soft">
            No food or drink until then, or we'll skip that one.
          </p>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("home")}>Back to home</Btn>
      </StickyFooter>
    </Screen>
  );
}
