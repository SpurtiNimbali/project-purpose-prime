import { useEffect, useRef, useState } from "react";
import {
  Screen,
  ScreenBody,
  TopBar,
  Btn,
  Card,
  Note,
  Choice,
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
  IconList,
  IconWave,
  IconBalloon,
  IconBolt,
  IconSpiral,
  IconDizzy,
  IconWind,
  IconLock,
  IconX,
} from "./icons";
import { clockLabel, minutesNow, untilLabel, type PlanItem, type TummyStore } from "./store";
import { cn } from "@/lib/utils";

/* ---------------- session hub ---------------- */

function ProgressRing({ done, total }: { done: number; total: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center">
      <svg width="52" height="52" viewBox="0 0 52 52" className="-rotate-90">
        <circle cx="26" cy="26" r={r} fill="none" stroke="#CFE3D8" strokeWidth="6" />
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke="#2E7D6B"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - done / total)}
        />
      </svg>
      <span className="absolute text-[15px] font-extrabold tabular-nums text-pine">
        {done}/{total}
      </span>
    </span>
  );
}

function planIcon(p: PlanItem) {
  if (p.kind === "meal") return IconBowl;
  if (p.kind === "questions") return IconList;
  return p.fasting ? IconSun : IconMic;
}

export function SessionHubScreen({ store }: { store: TummyStore }) {
  const plan = store.plan;
  const doneCount = plan.filter((p) => p.done).length;
  const next = plan.find((p) => !p.done);
  const now = minutesNow();

  const open = (p: PlanItem) => {
    store.startItem(p.id);
    if (p.kind === "recording") {
      store.setTrack(p.fasting ? "fasting" : "postMeal");
      store.go("caseReminder");
    } else if (p.kind === "meal") {
      store.go("logMeal");
    } else {
      store.go("logSleep");
    }
  };

  return (
    <Screen>
      <TopBar
        title="Today's plan"
        onBack={store.back}
        step={`Day ${store.day} of 7`}
        right={<ProgressRing done={doneCount} total={plan.length} />}
      />
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-4">
        <div className="min-h-0 flex-1 overflow-y-auto">
          {plan.map((p, i) => {
            const isNext = p.id === next?.id;
            const late = !p.done && now - p.at > 45;
            const Icon = planIcon(p);
            const mins = p.at - now;
            return (
              <div key={p.id} className="relative flex gap-3 pb-2">
                <div className="flex w-[24px] shrink-0 flex-col items-center">
                  <span
                    className={cn(
                      "mt-4 h-[16px] w-[16px] shrink-0 rounded-full border-[3px]",
                      p.done
                        ? "border-teal bg-teal"
                        : isNext
                          ? "border-teal bg-surface"
                          : "border-line bg-surface",
                    )}
                  />
                  {i < plan.length - 1 ? (
                    <span className={cn("w-[3px] flex-1", p.done ? "bg-teal" : "bg-line")} />
                  ) : null}
                </div>

                {isNext ? (
                  <div className="min-w-0 flex-1 rounded-2xl bg-teal p-4 text-surface">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface/15">
                        <Icon width={22} height={22} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[19px] font-extrabold leading-tight">
                          {p.label}
                        </p>
                        <p className="truncate text-[15px] font-bold text-mint">
                          {late
                            ? "Window closing"
                            : mins > 10
                              ? `In ${untilLabel(mins)} · ${clockLabel(p.at)}`
                              : `Due now · ${clockLabel(p.at)}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => open(p)}
                      className="mt-3 flex min-h-[56px] w-full items-center justify-center rounded-xl bg-surface text-[17px] font-extrabold text-teal active:scale-[0.99]"
                    >
                      {p.kind === "recording"
                        ? "Start this recording"
                        : p.kind === "meal"
                          ? `Log ${p.label.toLowerCase()}`
                          : "Answer questions"}
                    </button>
                    {late && p.kind === "recording" ? (
                      <button
                        onClick={() => store.completeItem(p.id)}
                        className="mt-2 min-h-[48px] w-full text-[15px] font-extrabold text-amber-soft"
                      >
                        Mark as missed
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex min-h-[56px] min-w-0 flex-1 items-center gap-3 rounded-2xl border border-line bg-surface px-4">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                        p.done ? "bg-teal text-surface" : "bg-wash text-pine-soft",
                      )}
                    >
                      {p.done ? <IconCheck width={18} height={18} /> : <Icon width={18} height={18} />}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[16px] font-extrabold text-pine">
                      {p.label}
                    </span>
                    <span className="shrink-0 text-[15px] font-bold text-pine-soft">
                      {p.done ? "Done" : clockLabel(p.at)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {!next ? (
            <p className="mt-2 rounded-2xl bg-mint-soft px-4 py-4 text-center text-[16px] font-bold text-pine">
              Everything is done today. Nothing more until tomorrow morning.
            </p>
          ) : null}
        </div>

        <p className="pt-2 text-center text-[15px] font-bold text-pine-soft">
          No food or drinks other than water for 3 hours after your meal
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
            A case creates a gap between the microphone and your skin. Gut sounds are quiet and low,
            so even a couple of millimetres of air loses most of the signal.
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
    { k: "dinner", label: "Dinner", Icon: IconClock },
  ] as const;
  return (
    <Screen>
      <TopBar title="Which meal?" onBack={store.back} />
      <ScreenBody>
        <p className="text-[17px] font-semibold leading-relaxed text-pine-soft">
          Pick the meal these recordings will follow. Your three timers start from the moment you
          finish eating.
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
            Once you save, reminders land at 30 minutes, 90 minutes and 3 hours from now. Only water in between, taken right after a recording.
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
            Anything eaten in between changes what we hear, so we'd rather skip the session than
            record it.
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

function AbdomenGuide() {
  const x = 74;
  const y = 132;
  return (
    <svg
      viewBox="0 0 200 220"
      width="100%"
      height="230"
      role="img"
      aria-label="Phone placement guide"
    >
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
      <line x1="100" y1={y} x2={x} y2={y} stroke="#E8A33D" strokeWidth="2" strokeDasharray="4 4" />
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
  return (
    <Screen dark>
      <TopBar title="Positioning guide" onBack={store.back} dark step="Placement" />
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <AbdomenGuide />

        <div className="mt-2 space-y-2">
          <p className="text-[18px] font-extrabold leading-snug text-surface">
            Lift your shirt and place the bottom of the phone 9 cm below and to the right of your
            belly button, flat against bare skin.
          </p>
          <p className="text-[16px] font-semibold leading-snug text-mint">
            Microphone end onto the skin. Case off. Sit upright, breathe normally and stay still —
            the whole recording is two minutes.
          </p>
        </div>

        <div className="mt-5 space-y-2">
          {[
            "Case off, nothing between the phone and your skin",
            "Quiet room, TV and fans off",
            "Sitting upright, no talking",
          ].map((t) => (
            <div
              key={t}
              className="flex min-h-[56px] items-center gap-3 rounded-2xl bg-surface/10 px-4 text-surface"
            >
              <span className="shrink-0 text-mint">
                <IconCheck width={20} height={20} />
              </span>
              <span className="min-w-0 flex-1 text-[16px] font-bold">{t}</span>
            </div>
          ))}
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

const TOTAL = 120; // 2 minutes
const SEV_LABELS = ["very mild", "mild", "moderate", "strong", "very strong"];

export function RecordingScreen({ store }: { store: TummyStore }) {
  const [left, setLeft] = useState(TOTAL);
  const [pending, setPending] = useState<{ key: string; label: string; at: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
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

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const mmss = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
  const pct = 1 - left / TOTAL;
  const R = 90;
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
          Feel something? Tap it — buttons are up here, away from the microphone.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {SYMPTOMS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => {
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

      {/* timer */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-5">
        <div className="relative h-[212px] w-[212px]">
          <svg width="212" height="212" viewBox="0 0 212 212" className="absolute inset-0">
            <circle
              cx="106"
              cy="106"
              r={R}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="106"
              cy="106"
              r={R}
              stroke="#8FC9AC"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              transform="rotate(-90 106 106)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint/20 text-mint">
              <IconMic width={20} height={20} />
            </span>
            <p className="mt-2 text-[46px] font-extrabold leading-none tracking-tight text-surface tabular-nums">
              {mmss}
            </p>
            <p className="mt-1 text-[13px] font-extrabold uppercase tracking-[0.14em] text-mint">
              remaining
            </p>
          </div>
        </div>
        <p className="mt-5 text-[16px] font-bold text-mint">Keep still until the circle empties</p>
        <p className="mt-1 text-[15px] font-bold text-surface/70">
          {store.marks.length} symptom {store.marks.length === 1 ? "mark" : "marks"} recorded
        </p>
      </div>

      <div className="shrink-0 px-5 pb-7">
        <Btn variant="secondary" onClick={() => store.go("postMeta")}>
          {left === 0 ? "Continue to the questions" : "Finish early"}
        </Btn>
      </div>

      {/* severity picker — top sheet, saves on tap */}
      {pending ? (
        <div className="absolute inset-0 z-20 flex flex-col bg-pine/70 backdrop-blur-sm">
          <div className="rounded-b-[32px] bg-pine px-5 pb-6 pt-14 ring-1 ring-surface/15">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[22px] font-extrabold text-surface">{pending.label}</p>
                <p className="text-[15px] font-bold text-mint">
                  At {String(Math.floor(pending.at / 60)).padStart(2, "0")}:
                  {String(pending.at % 60).padStart(2, "0")} · how strong is it?
                </p>
              </div>
              <button
                onClick={() => setPending(null)}
                aria-label="Cancel"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface/15 text-surface"
              >
                <IconX width={22} height={22} />
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    store.addMark({ ...pending, severity: n });
                    setPending(null);
                    setToast(`${pending.label} · ${SEV_LABELS[n - 1]} saved`);
                    if (typeof navigator !== "undefined" && navigator.vibrate)
                      navigator.vibrate(12);
                  }}
                  className="flex h-[72px] flex-1 flex-col items-center justify-center rounded-2xl border-2 border-surface/25 bg-surface/10 text-surface active:border-mint active:bg-mint active:text-pine"
                >
                  <span className="text-[22px] font-extrabold leading-none">{n}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[14px] font-bold text-mint">
              <span>Very mild</span>
              <span>Very strong</span>
            </div>
            <p className="mt-3 text-center text-[14px] font-bold text-surface/60">
              Tap a number — it saves straight away.
            </p>
          </div>
          <button className="flex-1" aria-label="Cancel" onClick={() => setPending(null)} />
        </div>
      ) : null}

      {toast ? (
        <div className="pointer-events-none absolute inset-x-5 top-[350px] z-30 rounded-2xl bg-mint px-4 py-3 text-center text-[16px] font-extrabold text-pine shadow-lg">
          {toast}
        </div>
      ) : null}
    </Screen>
  );
}

/* ---------------- post-recording metadata (chat) ---------------- */

type Turn = { from: "bot" | "you"; text: string };

export function PostMetaScreen({ store }: { store: TummyStore }) {
  const morning = store.track === "fasting";
  const questions: { q: string; options?: string[]; open?: boolean }[] = [
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
    {
      q: "Last one — in your own words, how did your stomach feel during those two minutes?",
      open: true,
    },
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
      <TopBar title="Post-recording questions" onBack={store.back} />
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

        {!done && !needNote && !questions[step].open ? (
          <div className="mt-4 space-y-2">
            {(questions[step].options ?? []).map((o) => (
              <Choice key={o} label={o} onClick={() => answer(o)} />
            ))}
          </div>
        ) : null}

        {!done && (needNote || questions[step].open) ? (
          <div className="mt-4 space-y-2">
            <TextInput
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Type your answer, or record it instead"
            />
            <Btn onClick={submitNote} disabled={note.trim().length === 0}>
              Send
            </Btn>
            <Btn variant="secondary" onClick={submitNote} icon={<IconMic width={22} height={22} />}>
              Record a voice note instead
            </Btn>
            <p className="text-center text-[15px] font-semibold text-pine-soft">
              Longer questions can always be answered out loud.
            </p>
          </div>
        ) : null}
      </ScreenBody>
      {done ? (
        <StickyFooter>
          <Btn
            onClick={() => {
              if (store.activeItemId) store.completeItem(store.activeItemId);
              store.addEntry(
                "recording",
                "Gut sound recording",
                store.track === "fasting" ? "Fasting" : "Post-meal",
              );
              store.go("uploadDone");
            }}
          >
            Finish session
          </Btn>

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
        <h1 className="mt-4 text-[26px] font-extrabold leading-tight text-pine">Session saved</h1>
        <p className="mt-2 text-[17px] font-semibold leading-snug text-pine-soft">
          Two minutes uploaded, with {store.marks.length} symptom{" "}
          {store.marks.length === 1 ? "mark" : "marks"} timestamped against the audio.
        </p>
        <div className="mt-5 rounded-3xl border border-line bg-surface p-5 text-left">
          <div className="flex items-center gap-2 text-teal">
            <IconClock width={22} height={22} />
            <p className="text-[16px] font-extrabold">Next recording</p>
          </div>
          <p className="mt-1 text-[19px] font-extrabold text-pine">In 1 hr 40 min</p>
          <p className="mt-1 text-[16px] font-semibold text-pine-soft">
            No food, snacks or drinks other than water until then. If you want water, have it in\n            the 5 minutes right after a recording.
          </p>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("home")}>Back to home</Btn>
      </StickyFooter>
    </Screen>
  );
}
