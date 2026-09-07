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
                    {p.kind === "recording" ? (
                      <button
                        onClick={() => store.missItem(p.id)}
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
                        p.missed
                          ? "bg-wash text-amber"
                          : p.done
                            ? "bg-teal text-surface"
                            : "bg-wash text-pine-soft",
                      )}
                    >
                      {p.done && !p.missed ? (
                        <IconCheck width={18} height={18} />
                      ) : (
                        <Icon width={18} height={18} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[16px] font-extrabold text-pine">
                      {p.label}
                    </span>
                    <span className="shrink-0 text-[15px] font-bold text-pine-soft">
                      {p.missed ? "Missed" : p.done ? "Done" : clockLabel(p.at)}
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
            Take your phone case off
          </h2>
          <p className="mt-2 text-[17px] font-semibold text-pine-soft">
            Every recording needs bare phone against bare skin. If yours is stiff, ease it off from
            one corner — it still has to come off.
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
        <Btn onClick={next}>My case is off</Btn>
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

export function AbdomenGuide({ height = 230 }: { height?: number }) {
  const line = "#8FC9AC";
  return (
    <svg
      viewBox="0 0 260 210"
      width="100%"
      height={height}
      role="img"
      aria-label="Place the phone about 9 cm below and to the right of your belly button"
    >
      {/* torso, simple outline */}
      <path
        d="M70 8c0 26-6 44-6 70s6 52 14 124h104c8-72 14-98 14-124s-6-44-6-70"
        fill="rgba(143,201,172,0.08)"
        stroke={line}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* waistband */}
      <path d="M74 172h104" stroke={line} strokeWidth="3" strokeLinecap="round" opacity="0.5" />

      {/* belly button */}
      <circle cx="130" cy="86" r="6" fill={line} />
      <line x1="140" y1="82" x2="176" y2="66" stroke={line} strokeWidth="1.6" opacity="0.7" />
      <text x="180" y="70" fontSize="11" fill={line} fontWeight="800">
        belly button
      </text>

      {/* distance marker: down and to the participant's right (viewer's left) */}
      <line
        x1="130"
        y1="94"
        x2="103"
        y2="120"
        stroke="#E8A33D"
        strokeWidth="2.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
      <rect x="52" y="86" width="44" height="22" rx="11" fill="#E8A33D" />
      <text x="74" y="101" textAnchor="middle" fontSize="12" fill="#143029" fontWeight="900">
        9 cm
      </text>

      {/* phone, mic end down onto the skin */}
      <g transform="translate(80 116) rotate(-4)">
        <rect
          x="0"
          y="0"
          width="48"
          height="84"
          rx="10"
          fill="#E7F1EC"
          stroke="#143029"
          strokeWidth="2.5"
        />
        <rect x="17" y="7" width="14" height="3.5" rx="1.75" fill="#8FC9AC" />
        <circle cx="24" cy="74" r="4" fill="#2E7D6B" />
        <text x="24" y="46" textAnchor="middle" fontSize="10" fill="#2E7D6B" fontWeight="900">
          mic down
        </text>
      </g>
    </svg>
  );
}



const POSITION_CHECKS = [
  {
    t: "Case off",
    b: "Nothing at all between the phone and your skin — no case, no shirt, no blanket.",
  },
  { t: "Quiet room", b: "TV, radio, fans and extractor off. Close the door if you can." },
  { t: "Sitting upright, no talking", b: "Feet on the floor, breathe normally, stay still." },
];

export function PositioningScreen({ store }: { store: TummyStore }) {
  const [step, setStep] = useState(0);
  const gated = step < POSITION_CHECKS.length;
  const check = POSITION_CHECKS[Math.min(step, POSITION_CHECKS.length - 1)];
  return (
    <Screen dark className="relative">
      <TopBar title="Positioning guide" onBack={store.back} dark step="Placement" />
      <div className={cn("flex-1 overflow-y-auto px-5 pb-6", gated && "blur-md")}>
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
          {POSITION_CHECKS.map(({ t }) => (
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
        <Btn disabled={gated} onClick={() => store.go("recording")}>
          I'm in position
        </Btn>
      </div>

      {gated ? (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-pine/70 px-5 pb-10">
          <div className="rounded-3xl bg-surface p-5">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-teal">
              Check {step + 1} of {POSITION_CHECKS.length}
            </p>
            <p className="mt-2 text-[22px] font-extrabold leading-tight text-pine">{check.t}</p>
            <p className="mt-2 text-[16px] font-semibold leading-snug text-pine-soft">{check.b}</p>
            <div className="mt-5">
              <Btn onClick={() => setStep((s) => s + 1)}>Done — it's ready</Btn>
            </div>
          </div>
        </div>
      ) : null}
    </Screen>
  );
}

/* ---------------- recording ---------------- */

export const SYMPTOMS = [
  { key: "gurgle", label: "Gurgle", Icon: IconWave },
  { key: "bloat", label: "Bloating", Icon: IconBalloon },
  { key: "pain", label: "Pain", Icon: IconBolt },
  { key: "cramp", label: "Cramp", Icon: IconSpiral },
  { key: "nausea", label: "Nausea", Icon: IconDizzy },
  { key: "gas", label: "Gas", Icon: IconWind },
];

export const SEV_LABELS = ["very mild", "mild", "moderate", "strong", "very strong"];

/** Big, legible countdown ring shared by the real recording and the dry run. */
export function RecordTimer({ left, total }: { left: number; total: number }) {
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const pct = Math.min(1, Math.max(0, 1 - left / total));
  const R = 96;
  const C = 2 * Math.PI * R;

  return (
    <div className="relative h-[216px] w-[216px]">
      <svg width="216" height="216" viewBox="0 0 216 216" className="absolute inset-0">
        <circle
          cx="108"
          cy="108"
          r={R}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="108"
          cy="108"
          r={R}
          stroke="#8FC9AC"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
          transform="rotate(-90 108 108)"
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-[56px] font-extrabold leading-none tracking-tight text-surface tabular-nums">
          {mm}:{ss}
        </p>
        <p className="mt-2 text-[15px] font-bold text-mint">
          left of {Math.round(total / 60)} min
        </p>
      </div>
    </div>
  );
}


export function SymptomGrid({
  counts,
  onPick,
  disabled,
}: {
  counts: Record<string, number>;
  onPick: (key: string, label: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="shrink-0 px-4 pt-3">
      <p className="mb-2 text-[15px] font-extrabold text-mint">
        Feel something? Tap it — buttons are up here, away from the microphone.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {SYMPTOMS.map(({ key, label, Icon }) => (
          <button
            key={key}
            disabled={disabled}
            onClick={() => {
              onPick(key, label);
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
  );
}

export function SeveritySheet({
  pending,
  onPick,
  onCancel,
}: {
  pending: { key: string; label: string; at: number };
  onPick: (n: number) => void;
  onCancel: () => void;
}) {
  return (
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
            onClick={onCancel}
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
                onPick(n);
                if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(12);
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
      <button className="flex-1" aria-label="Cancel" onClick={onCancel} />
    </div>
  );
}

const TOTAL = 120; // 2 minutes


export function RecordingScreen({ store }: { store: TummyStore }) {
  const [left, setLeft] = useState(TOTAL);
  const [pending, setPending] = useState<{ key: string; label: string; at: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);
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
      <SymptomGrid counts={counts} onPick={(key, label) => setPending({ key, label, at: TOTAL - left })} />

      {/* timer */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-5">
        <RecordTimer left={left} total={TOTAL} />
        <p className="mt-5 text-[16px] font-bold text-mint">Keep still until the ring empties</p>
        <p className="mt-1 text-[15px] font-bold text-surface/70">
          {store.marks.length} symptom {store.marks.length === 1 ? "mark" : "marks"} recorded
        </p>
      </div>


      <div className="shrink-0 px-5 pb-7">
        {left === 0 ? (
          <Btn variant="secondary" onClick={() => store.go("postMeta")}>
            Continue to the questions
          </Btn>
        ) : confirmEnd ? (
          <div className="rounded-3xl bg-surface p-5 text-center">
            <p className="text-[20px] font-extrabold leading-tight text-pine">
              Are you sure? {left} seconds left
            </p>
            <p className="mt-2 text-[16px] font-semibold leading-snug text-pine-soft">
              A full two minutes gives the study usable audio. Stay still and I'll tell you when
              it's done.
            </p>
            <div className="mt-4 space-y-3">
              <Btn onClick={() => setConfirmEnd(false)}>Keep recording</Btn>
              <Btn variant="secondary" onClick={() => store.go("postMeta")}>
                Finish early anyway
              </Btn>
            </div>
          </div>
        ) : (
          <Btn variant="secondary" onClick={() => setConfirmEnd(true)}>
            Finish early
          </Btn>
        )}
      </div>

      {/* severity picker — top sheet, saves on tap */}
      {pending ? (
        <SeveritySheet
          pending={pending}
          onCancel={() => setPending(null)}
          onPick={(n) => {
            store.addMark({ ...pending, severity: n });
            setPending(null);
            setToast(`${pending.label} · ${SEV_LABELS[n - 1]} saved`);
          }}
        />
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
