import placementArt from "@/assets/placement-main.png";
import { useEffect, useRef, useState } from "react";
import {
  Screen,
  ScreenBody,
  TopBar,
  Btn,
  Card,
  Note,
  Choice,
  Field,
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
  IconRuler,

  IconDizzy,
  IconWind,
  IconLock,
  IconShield,
  IconChart,
  IconX,

} from "./icons";
import {
  clockLabel,
  minutesNow,
  untilLabel,
  QUALITY_RULE,
  WINDOW_RULE,
  type PlanItem,
  type SessionKind,
  type TummyStore,
} from "./store";
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
      store.setSessionKind(p.sessionKind ?? (p.fasting ? "fasted" : "postMeal"));
      store.go("caseReminder");
    } else if (p.kind === "meal") {
      store.go(p.id === "mealEnd" ? "mealEnd" : "mealCapture");
    } else {
      store.go(p.id === "qEvening" ? "eveningCheckin" : "morningQuestions");
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
                          ? p.id === "mealEnd"
                            ? "I've finished eating"
                            : "Log the meal and start eating"
                          : "Answer questions"}
                    </button>
                    {p.kind === "recording" ? (
                      <button
                        onClick={() => {
                          store.startItem(p.id);
                          store.go("skipReason");
                        }}
                        className="mt-2 min-h-[48px] w-full text-[15px] font-extrabold text-amber-soft"
                      >
                        Skip this one and tell us why
                      </button>
                    ) : p.kind === "meal" ? (
                      <button
                        onClick={() => store.missItem(p.id, "Meal skipped or not eaten")}
                        className="mt-2 min-h-[48px] w-full text-[15px] font-extrabold text-amber-soft"
                      >
                        I skipped this meal
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
              Everything for today is done. Nothing more until tomorrow morning.
            </p>
          ) : null}

          <button
            onClick={() => store.go("extraSession")}
            className="mt-3 flex min-h-[60px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-teal bg-surface text-[17px] font-extrabold text-teal"
          >
            <IconMic width={22} height={22} />
            Record an extra session
          </button>
        </div>

        <p className="pt-2 text-center text-[15px] font-bold text-pine-soft">
          {WINDOW_RULE}
        </p>
      </div>
    </Screen>
  );
}


/* ---------------- case reminder ---------------- */

export function CaseReminderScreen({ store }: { store: TummyStore }) {
  const [why, setWhy] = useState(false);
  // the wake-up questions already cover food and drink, so fasted sessions go straight on
  const next = () => store.go(store.sessionKind === "fasted" ? "positioning" : "sessionCheck");

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
            The bare phone sits against bare skin every time.
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
      <TopBar title="Fasted check" onBack={store.back} />
      <ScreenBody className="flex flex-col">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Mascot src={MASCOT.calm} size={140} />
          <h2 className="mt-4 text-[25px] font-extrabold leading-tight text-pine">
            Still fasted, and within 30 minutes of waking?
          </h2>
          <p className="mt-2 text-[17px] font-semibold leading-snug text-pine-soft">
            Nothing except a few sips of water. Using the bathroom is fine. Sitting up counts;
            still lying down does not.
          </p>
        </div>
        <Note tone="amber" title="If either is a no">
          Skip this morning's recording and tell us why. A gap is more useful than a recording we
          can't use.
        </Note>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("positioning")}>Yes, fasted and just woke up</Btn>
        <div className="mt-3">
          <Btn variant="danger" onClick={() => store.go("skipReason")}>
            No, skip this one
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
          You'll use the same meal every study day. Pick the one you eat at a steady time.
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
        <div className="mt-4">
          <Note tone="amber" title="This can't change later">
            Every study day uses the same meal, so we can compare the recordings with each other.
          </Note>
        </div>
      </ScreenBody>
    </Screen>
  );
}

/* ---------------- meal start ---------------- */

export function MealCaptureScreen({ store }: { store: TummyStore }) {
  const [photos, setPhotos] = useState(0);
  const [desc, setDesc] = useState("");
  return (
    <Screen>
      <TopBar title={`Start your ${store.meal}`} onBack={store.back} step="Start of meal" />
      <ScreenBody>
        <button
          onClick={() => setPhotos((p) => p + 1)}
          className={cn(
            "flex h-[180px] w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed",
            photos ? "border-teal bg-mint-soft text-teal" : "border-line bg-surface text-pine-soft",
          )}
        >
          <IconCamera width={48} height={48} />
          <span className="text-[17px] font-extrabold">
            {photos ? `${photos} photo${photos === 1 ? "" : "s"} added, add another` : "Photo of the plate"}
          </span>
        </button>
        <p className="mt-2 text-[15px] font-semibold text-pine-soft">
          Add another photo if one shot doesn't show the whole plate.
        </p>
        <div className="mt-4">
          <Field label="What's in it?" hint="A line of text, or a voice note.">
            <TextInput
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Two eggs, toast, black coffee"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Note tone="blue" title="Timers start when you finish, not now">
            Tap below as you take the first bite. When you finish eating, tap I've finished. From
            that moment the app schedules a recording right away, then every 30 minutes for 3.5
            hours.
          </Note>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn
          disabled={!photos && desc.trim().length === 0}
          onClick={() => {
            store.addEntry(
              "meal",
              store.meal[0].toUpperCase() + store.meal.slice(1),
              desc.trim() || `${photos} photo${photos === 1 ? "" : "s"}`,
            );
            store.completeItem("mealStart");
            store.go("mealEnd");
          }}
        >
          I'm starting to eat now
        </Btn>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- meal end, the timing anchor ---------------- */

export function MealEndScreen({ store }: { store: TummyStore }) {
  return (
    <Screen>
      <TopBar title="Finished eating?" onBack={store.back} step="Timing anchor" />
      <ScreenBody className="flex flex-col">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Mascot src={MASCOT.wave} size={150} />
          <h2 className="mt-4 text-[25px] font-extrabold leading-tight text-pine">
            Tap the moment your last bite is done
          </h2>
          <p className="mt-2 text-[17px] font-semibold leading-snug text-pine-soft">
            Every recording after this is timed from this moment.
          </p>
        </div>
        <Note tone="amber" title="From now until the last recording">
          {WINDOW_RULE}
        </Note>
      </ScreenBody>
      <StickyFooter>
        <Btn
          onClick={() => {
            store.completeItem("mealEnd");
            store.addEntry("meal", "Finished eating", "Recording timers set");
            store.go("sessionHub");
          }}
        >
          I've finished eating, start the timers
        </Btn>
        <div className="mt-3">
          <Btn variant="secondary" onClick={() => store.go("home")}>
            Return to the home screen
          </Btn>
        </div>
        <p className="mt-2 text-center text-[15px] font-semibold text-pine-soft">
          Still eating? Come back when the last bite is done.
        </p>

      </StickyFooter>
    </Screen>
  );
}

/* ---------------- session checklist ---------------- */

export function SessionCheckScreen({ store }: { store: TummyStore }) {
  const preMeal = store.sessionKind === "preMeal";
  const extra = store.sessionKind === "extra";
  return (
    <Screen>
      <TopBar title="Quick check" onBack={store.back} />
      <ScreenBody className="flex flex-col">
        <div className="flex flex-1 flex-col justify-center">
          <Mascot src={MASCOT.calm} size={120} className="mx-auto" />
          <h2 className="mt-4 text-center text-[24px] font-extrabold leading-tight text-pine">
            {preMeal
              ? "Are you about to start eating, right after this recording?"
              : extra
                ? "Quiet room, case off, sitting upright?"
                : "Have you had anything at all since the meal?"}
          </h2>
          <p className="mt-3 text-center text-[17px] font-semibold leading-snug text-pine-soft">
            {preMeal
              ? "This recording has to happen immediately before the first bite."
              : extra
                ? "Same place on the belly, and the same rules as your scheduled sessions."
                : "No snacks. Water only if it was right after a recording, and at least 15 minutes ago."}
          </p>
        </div>
        <Note tone="amber" title="Quality over quantity">
          {QUALITY_RULE}
        </Note>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("positioning")}>
          {preMeal
            ? "Yes, eating straight after"
            : extra
              ? "All set, let's record"
              : "Nothing since the meal"}
        </Btn>
        <div className="mt-3">
          <Btn
            variant="danger"
            onClick={() => store.go(preMeal || extra ? "skipReason" : "snackSkip")}
          >
            {preMeal
              ? "Not yet, skip this one"
              : extra
                ? "Not right now"
                : "I had a snack or a drink"}
          </Btn>
        </div>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- positioning ---------------- */

export function AbdomenGuide() {
  return (
    <figure className="mx-auto w-full max-w-[340px]">
      <img
        src={placementArt}
        alt="A seated participant holding a portrait phone against bare skin, 8 centimetres to their right and 3 centimetres below their belly button"
        loading="lazy"
        width={1254}
        height={872}
        className="w-full rounded-2xl"
      />
    </figure>
  );
}

export const PLACEMENT_TIPS = [
  {
    t: "Right lower belly",
    b: "8 cm to the right of your belly button, then 3 cm down.",
    Icon: IconRuler,
  },
  {
    t: "Microphone edge down",
    b: "The bottom edge of the phone sits on that point.",
    Icon: IconMic,
  },
  {
    t: "Bare skin",
    b: "Case off, shirt lifted. No fabric between the phone and your skin.",
    Icon: IconShield,
  },
  {
    t: "Same way every time",
    b: "Hold the phone upright, screen facing out, every session.",
    Icon: IconPhone,
  },
  {
    t: "Measure, don't guess",
    b: "Use a ruler rather than guessing by eye.",
    Icon: IconChart,
  },
];

/** Placement rules, revealed one at a time so each one gets read. */
export function PlacementTips({ onAllSeen }: { onAllSeen?: () => void }) {
  const [shown, setShown] = useState(1);
  const all = shown >= PLACEMENT_TIPS.length;
  return (
    <div className="mt-4 space-y-2">
      {PLACEMENT_TIPS.slice(0, shown).map(({ t, b, Icon }) => (
        <div
          key={t}
          className="flex items-center gap-3 rounded-2xl bg-surface/10 px-3 py-2 text-surface"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber text-pine">
            <Icon width={18} height={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold leading-snug">{t}</span>
            <span className="block text-[13px] font-semibold leading-snug text-mint">{b}</span>
          </span>
        </div>
      ))}
      {!all ? (
        <button
          onClick={() => {
            const next = shown + 1;
            setShown(next);
            if (next >= PLACEMENT_TIPS.length) onAllSeen?.();
          }}
          className="min-h-[48px] w-full rounded-2xl border-2 border-mint text-[15px] font-extrabold text-mint"
        >
          Next rule · {shown} of {PLACEMENT_TIPS.length}
        </button>
      ) : null}
    </div>
  );
}

const POSITION_CHECKS = [
  { t: "Case off", b: "Nothing between the phone and your skin." },
  { t: "Quiet room", b: "Turn off the TV, radio, and fans. Close the door if you can." },
  { t: "Sitting upright, no talking", b: "Feet on the floor, breathe normally, and stay still." },
  { t: "Gentle pressure only", b: "Just enough to keep contact. Pressing harder muffles the sound." },
];

/** The three one-at-a-time checks shown over a blurred positioning guide. */
export function PositionChecksGate({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const check = POSITION_CHECKS[Math.min(step, POSITION_CHECKS.length - 1)];
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end bg-pine/70 px-5 pb-10">
      <div className="rounded-3xl bg-surface p-5">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-teal">
          Check {step + 1} of {POSITION_CHECKS.length}
        </p>
        <p className="mt-2 text-[22px] font-extrabold leading-tight text-pine">{check.t}</p>
        <p className="mt-2 text-[16px] font-semibold leading-snug text-pine-soft">{check.b}</p>
        <div className="mt-5">
          <Btn
            onClick={() => {
              if (step + 1 >= POSITION_CHECKS.length) onDone();
              else setStep((s) => s + 1);
            }}
          >
            Done, it's ready
          </Btn>
        </div>
      </div>
    </div>
  );
}

export function PositioningScreen({ store }: { store: TummyStore }) {
  const [checked, setChecked] = useState(false);
  const [tipsSeen, setTipsSeen] = useState(false);
  const ready = checked && tipsSeen;
  return (
    <Screen dark className="relative">
      <TopBar title="Positioning guide" onBack={store.back} dark step="Placement" />
      <div className={cn("flex-1 overflow-y-auto px-5 pb-6", !checked && "blur-md")}>
        <AbdomenGuide />
        <PlacementTips onAllSeen={() => setTipsSeen(true)} />
      </div>


      <div className="shrink-0 px-5 pb-7 pt-3">
        <Btn disabled={!ready} onClick={() => store.go("recording")}>
          I'm in position
        </Btn>
        {checked && !tipsSeen ? (
          <p className="mt-2 text-center text-[15px] font-semibold text-mint">
            Read each placement rule to continue.
          </p>
        ) : null}
      </div>

      {!checked ? <PositionChecksGate onDone={() => setChecked(true)} /> : null}
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

/** Audio quality analysis shown straight after a recording, real or practice. */
export function QualityPanel({
  pass,
  onRedo,
  onContinue,
}: {
  pass: boolean;
  onRedo: () => void;
  onContinue: () => void;
}) {
  const [phase, setPhase] = useState<"checking" | "done">("checking");
  useEffect(() => {
    const t = setTimeout(() => setPhase("done"), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-center bg-pine/80 px-5 backdrop-blur-md">
      <div className="rounded-[28px] bg-surface p-6 text-center">
        {phase === "checking" ? (
          <>
            <span className="mx-auto flex h-[110px] w-[110px] animate-pulse items-center justify-center rounded-full bg-mint-soft text-teal">
              <IconWave width={54} height={54} />
            </span>
            <h2 className="mt-4 text-[23px] font-extrabold text-pine">Checking the audio…</h2>
            <p className="mt-2 text-[16px] font-semibold leading-snug text-pine-soft">
              We listen for background noise, rustling, and any gap between the phone and your
              skin.
            </p>
          </>
        ) : pass ? (
          <>
            <Mascot src={MASCOT.cheer} size={130} className="mx-auto" />
            <h2 className="mt-3 text-[24px] font-extrabold text-pine">Good quality recording</h2>
            <p className="mt-2 text-[16px] font-semibold leading-snug text-pine-soft">
              Clear contact, a quiet room, and gut sounds coming through. Nothing to redo.
            </p>
            <div className="mt-5">
              <Btn onClick={onContinue}>Continue</Btn>
            </div>
          </>
        ) : (
          <>
            <Mascot src={MASCOT.calm} size={130} className="mx-auto" />
            <h2 className="mt-3 text-[24px] font-extrabold text-pine">
              This one is too noisy to use
            </h2>
            <p className="mt-2 text-[16px] font-semibold leading-snug text-pine-soft">
              We picked up rustling or background noise. Press the phone flat on bare skin, find a
              quieter spot, and try again. It only takes two minutes.
            </p>
            <div className="mt-5 space-y-3">
              <Btn onClick={onRedo}>Record it again</Btn>
              <Btn variant="secondary" onClick={onContinue}>
                Keep it anyway
              </Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Big, legible ring shared by the real recording and the dry run. */

export function RecordTimer({ elapsed, min }: { elapsed: number; min: number }) {
  const past = elapsed >= min;
  const shown = past ? elapsed : min - elapsed;
  const mm = String(Math.floor(shown / 60)).padStart(2, "0");
  const ss = String(shown % 60).padStart(2, "0");
  const pct = past ? 1 : Math.min(1, Math.max(0, elapsed / min));
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
          {past ? "recorded so far" : `until ${Math.round(min / 60)} min minimum`}
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
        Feel something? Tap it, buttons are up here, away from the microphone.
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
    <div className="absolute inset-0 z-40 flex flex-col bg-pine/70 backdrop-blur-sm">
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
          Tap a number, it saves straight away.
        </p>
      </div>
      <button className="flex-1" aria-label="Cancel" onClick={onCancel} />
    </div>
  );
}

const MIN_SECONDS = 120; // two minutes minimum, longer is welcome

export function RecordingScreen({ store }: { store: TummyStore }) {
  const [elapsed, setElapsed] = useState(0);
  const [pending, setPending] = useState<{ key: string; label: string; at: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [checking, setChecking] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const startedRef = useRef(false);
  const left = Math.max(0, MIN_SECONDS - elapsed);
  const past = elapsed >= MIN_SECONDS;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    store.resetMarks();
  }, [store]);

  useEffect(() => {
    if (checking) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [checking]);


  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

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
            Do not disturb is on. Stay on this screen.
          </p>
        </div>
      </div>

      {/* symptom taps at TOP, bottom of the phone is against the mic */}
      <SymptomGrid
        counts={counts}
        disabled={!!pending || confirmEnd || checking}
        onPick={(key, label) => {
          setConfirmEnd(false);
          setPending({ key, label, at: elapsed });
        }}
      />

      {/* timer */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-5">
        <RecordTimer elapsed={elapsed} min={MIN_SECONDS} />
        <p className="mt-5 text-center text-[16px] font-bold text-mint">
          {past
            ? "Two minutes is done. Stay still a little longer if you can."
            : "Keep still until the ring fills"}
        </p>
        <p className="mt-1 text-[15px] font-bold text-surface/70">
          {store.marks.length} symptom {store.marks.length === 1 ? "mark" : "marks"} recorded
        </p>
      </div>

      <div className="shrink-0 px-5 pb-7">
        {past ? (
          <>
            <Btn onClick={() => {
              setPending(null);
              setConfirmEnd(false);
              setChecking(true);
            }}>
              Finish and check the audio
            </Btn>
            <p className="mt-3 text-center text-[15px] font-bold text-mint">
              You can keep going. Longer recordings give us more to work with.
            </p>
          </>
        ) : (
          <Btn
            variant="secondary"
            disabled={!!pending}
            onClick={() => {
              setPending(null);
              setConfirmEnd(true);
            }}
          >
            Stop early
          </Btn>
        )}
      </div>

      {toast && !pending && !confirmEnd && !checking ? (
        <div className="pointer-events-none absolute inset-x-5 top-[72px] z-50 rounded-2xl bg-mint px-4 py-3 text-center text-[16px] font-extrabold text-pine shadow-lg">
          {toast}
        </div>
      ) : null}

      {pending && !checking ? (
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

      {confirmEnd && !pending && !checking ? (
        <div className="absolute inset-0 z-40 flex flex-col justify-end bg-pine/80 px-5 pb-10 backdrop-blur-md">
          <div className="rounded-[28px] bg-surface p-5 text-center">
            <p className="text-[20px] font-extrabold leading-tight text-pine">
              Are you sure? {left} seconds left
            </p>
            <p className="mt-2 text-[16px] font-semibold leading-snug text-pine-soft">
              Two minutes is the minimum we can use. Stay still and I'll tell you when you're there.
            </p>
            <div className="mt-4 space-y-3">
              <Btn onClick={() => setConfirmEnd(false)}>Keep recording</Btn>
              <Btn
                variant="secondary"
                onClick={() => {
                  setConfirmEnd(false);
                  setChecking(true);
                }}
              >
                Stop anyway
              </Btn>
            </div>
          </div>
        </div>
      ) : null}

      {checking ? (
        <QualityPanel
          pass={past || attempt > 0}
          onRedo={() => {
            setAttempt((a) => a + 1);
            setChecking(false);
            setConfirmEnd(false);
            setPending(null);
            setElapsed(0);
            store.resetMarks();
          }}
          onContinue={() => store.go("postMeta")}
        />
      ) : null}

    </Screen>
  );
}

/* ---------------- post-recording questions ---------------- */

/** Places you could actually sit and record, usually at home after waking. */
export const HOME_LOCATIONS = [
  "Bedroom",
  "Living room, on a chair or sofa",
  "Kitchen or dining table",
  "Another room at home",
  "Other",
];

/** Places you could privately sit still for two minutes during the day. */
export const DAY_LOCATIONS = [
  "At home",
  "Private room at work",
  "At my desk or in an office",
  "School or campus, in a private room",
  "In a car",
  "Other",
];

const SLEEP_LOCATIONS = [
  "My own bed",
  "A partner's or shared bed",
  "A sofa or guest bed",
  "Away from home, like a hotel",
  "I was up most of the night",
  "Other",
];

type Q = {
  id: string;
  q: string;
  type: "single" | "text" | "scale";
  options?: string[];
  /** answers that open a free-text follow-up */
  textIf?: string[];
  followUp?: string;
  optional?: boolean;
  /** skip this question unless a previous answer matches */
  skipUnless?: { id: string; values: string[] };
};

function shouldSkip(q: Q, answers: Record<string, string>) {
  return !!q.skipUnless && !q.skipUnless.values.includes(answers[q.skipUnless.id] ?? "");
}

const VS_USUAL = ["Better than usual", "Same as usual", "Worse than usual"];

function questionsFor(kind: SessionKind): Q[] {
  const common: Q[] = [
    {
      id: "ordinary",
      q: "Anything out of the ordinary during that recording? Noise, an interruption, a cough?",
      type: "single",
      options: ["No, it was clean", "Yes"],
      textIf: ["Yes"],
      followUp: "What happened?",
    },
    {
      id: "location",
      q: "Where did you record?",
      type: "single",
      options: kind === "fasted" ? HOME_LOCATIONS : DAY_LOCATIONS,
      textIf: ["Other"],
      followUp: "Where was it?",
    },
  ];

  const watch: Q[] = [
    {
      id: "watchWearing",
      q: "Are you wearing your smartwatch right now?",
      type: "single",
      options: ["Yes", "No, it's charging", "No, another reason"],
      textIf: ["No, another reason"],
      followUp: "What's going on with it?",
    },
    {
      id: "watchBattery",
      q: "How much battery does your smartwatch have?",
      type: "single",
      options: ["Above 50%", "20 to 50%", "Below 20%", "Not sure"],
      skipUnless: { id: "watchWearing", values: ["Yes"] },
    },
  ];

  if (kind === "fasted") {
    return [
      ...common,
      {
        id: "sleepPlace",
        q: "Where did you sleep last night?",
        type: "single",
        options: SLEEP_LOCATIONS,
        textIf: ["Other"],
        followUp: "Where did you sleep?",
      },
      {
        id: "physical",
        q: "How do you feel physically, compared with a usual morning?",
        type: "single",
        options: VS_USUAL,
        textIf: ["Better than usual", "Worse than usual"],
        followUp: "What's different this morning?",
      },
      {
        id: "enoughSleep",
        q: "Did you get enough sleep?",
        type: "single",
        options: ["Yes", "No", "Not sure"],
      },
      {
        id: "giAm",
        q: "Any gut symptoms this morning?",
        type: "single",
        options: ["No", "Yes"],
        textIf: ["Yes"],
        followUp: "Which ones, and how strong?",
      },
      {
        id: "wakeCount",
        q: "How many times did you wake during the night?",
        type: "single",
        options: ["None", "Once", "Twice", "Three times", "Four or more"],
      },
      {
        id: "emotional",
        q: "How do you feel emotionally, compared with a usual morning?",
        type: "single",
        options: VS_USUAL,
        textIf: ["Better than usual", "Worse than usual"],
        followUp: "What's different this morning?",
      },
      { id: "rested", q: "How rested do you feel right now?", type: "scale" },
      {
        id: "sleepUnusual",
        q: "Anything unusual about last night's sleep?",
        type: "text",
        optional: true,
      },
      ...watch,
    ];
  }

  if (kind === "preMeal") {
    return [
      ...common,
      {
        id: "mealNow",
        q: "Are you starting your meal right now, immediately after this recording?",
        type: "single",
        options: ["Yes, eating now", "No, not yet"],
      },
      {
        id: "physical",
        q: "How do you feel physically, compared with usual?",
        type: "single",
        options: VS_USUAL,
      },
      {
        id: "strenuous",
        q: "Any strenuous activity in the last hour?",
        type: "single",
        options: ["No", "Yes"],
        textIf: ["Yes"],
        followUp: "What did you do?",
      },
      {
        id: "emotional",
        q: "How do you feel emotionally, compared with usual?",
        type: "single",
        options: VS_USUAL,
      },
      {
        id: "giSince",
        q: "Any gut symptoms since the last recording?",
        type: "single",
        options: ["No", "Yes"],
        textIf: ["Yes"],
        followUp: "Which ones, and how strong?",
      },
      ...watch,
    ];
  }

  if (kind === "extra") {
    // why you're recording and how strong it feels are asked before the recording
    return [...common];
  }

  // post-meal short set
  return [
    ...common,
    {
      id: "outside",
      q: "Since the last recording, did you have any symptoms outside a recording?",
      type: "single",
      options: ["No", "Yes"],
      textIf: ["Yes"],
      followUp: "What did you feel, and roughly when?",
    },
    {
      id: "snack",
      q: "Any snacks or drinks since the last recording?",
      type: "single",
      options: ["Nothing at all", "Water, right after a recording", "Yes, something to eat or drink"],
    },
  ];
}

type Turn = { from: "bot" | "you"; text: string };

export function PostMetaScreen({ store }: { store: TummyStore }) {
  const kind = store.sessionKind;
  const [qs] = useState<Q[]>(() => questionsFor(kind));
  const [step, setStep] = useState(0);
  const [turns, setTurns] = useState<Turn[]>([{ from: "bot", text: qs[0].q }]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [needNote, setNeedNote] = useState(false);
  const done = step >= qs.length;
  const current = qs[Math.min(step, qs.length - 1)];

  const nextAskable = (from: number, given: Record<string, string>) => {
    let n = from;
    while (n < qs.length && shouldSkip(qs[n], given)) n += 1;
    return n;
  };

  const advance = (from: Turn[], n: number) => {
    setStep(n);
    setTurns(
      n < qs.length
        ? [...from, { from: "bot", text: qs[n].q }]
        : [...from, { from: "bot", text: "That's everything. Saving your session now." }],
    );
  };

  const answer = (value: string) => {
    const given = { ...answers, [current.id]: value };
    setAnswers(given);
    const next: Turn[] = [...turns, { from: "you", text: value }];
    if (current.textIf?.includes(value)) {
      setNeedNote(true);
      setTurns([
        ...next,
        { from: "bot", text: current.followUp ?? "Tell us a little more. You can type it or say it." },
      ]);
      return;
    }
    advance(next, nextAskable(step + 1, given));
  };

  const submitNote = (skipped?: boolean) => {
    const text = skipped ? "Nothing to add" : note || "A voice note";
    setNeedNote(false);
    setAnswers((a) => ({ ...a, [`${current.id}Note`]: text }));
    advance([...turns, { from: "you", text }], nextAskable(step + 1, { ...answers, [`${current.id}Note`]: text }));
    setNote("");
  };

  const lowBattery = answers["watchBattery"] === "Below 20%";
  const snacked = answers["snack"] === "Yes, something to eat or drink";

  const finish = () => {
    if (store.activeItemId) store.completeItem(store.activeItemId);
    store.addEntry(
      "recording",
      "Gut sound recording",
      kind === "fasted"
        ? "Fasted morning"
        : kind === "preMeal"
          ? "Before the meal"
          : kind === "extra"
            ? "Extra session"
            : "Post-meal",
    );
    if (snacked) {
      store.go("snackSkip");
      return;
    }
    store.go("uploadDone");
  };

  return (
    <Screen>
      <TopBar
        title="Post-recording questions"
        onBack={store.back}
        step={`${Math.min(step + 1, qs.length)} of ${qs.length}`}
      />
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

        {!done && !needNote && current.type === "single" ? (
          <div className="mt-4 space-y-2">
            {(current.options ?? []).map((o) => (
              <Choice key={o} label={o} onClick={() => answer(o)} />
            ))}
          </div>
        ) : null}

        {!done && !needNote && current.type === "scale" ? (
          <div className="mt-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => answer(String(n))}
                  className="h-[68px] flex-1 rounded-2xl border-2 border-line bg-surface text-[20px] font-extrabold text-pine active:border-teal active:bg-mint-soft"
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[14px] font-bold text-pine-soft">
              <span>1 = not at all</span>
              <span>5 = fully</span>
            </div>
          </div>
        ) : null}

        {!done && (needNote || current.type === "text") ? (
          <div className="mt-4 space-y-2">
            <TextInput
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Type your answer, or record it instead"
            />
            <Btn onClick={() => submitNote()} disabled={note.trim().length === 0}>
              Send
            </Btn>
            <Btn
              variant="secondary"
              onClick={() => submitNote()}
              icon={<IconMic width={22} height={22} />}
            >
              Record a voice note instead
            </Btn>
            {(current.optional && !needNote) ||
            (needNote && current.followUp?.startsWith("Anything")) ? (
              <button
                onClick={() => submitNote(true)}
                className="min-h-[52px] w-full rounded-2xl border-2 border-line bg-surface text-[16px] font-extrabold text-pine-soft"
              >
                Nothing to add
              </button>
            ) : null}

          </div>
        ) : null}

        {lowBattery ? (
          <div className="mt-4">
            <Note tone="amber" title="Please charge your smartwatch">
              Below 20% won't last the night, and sleep data matters a lot to us. Put it on the
              charger now and back on your wrist before bed.
            </Note>
          </div>
        ) : null}

        {snacked && done ? (
          <div className="mt-4">
            <Note tone="amber" title="Thanks for telling us">
              Because something was eaten or drunk in the window, the rest of today's post-meal
              recordings will be skipped. That's the right call. Honest gaps are more useful.
            </Note>
          </div>
        ) : null}
      </ScreenBody>
      {done ? (
        <StickyFooter>
          <Btn onClick={finish}>Finish session</Btn>
        </StickyFooter>
      ) : null}
    </Screen>
  );
}

/* ---------------- snack in the window ---------------- */

export function SnackSkipScreen({ store }: { store: TummyStore }) {
  const [what, setWhat] = useState("");
  const [skipped, setSkipped] = useState<number | null>(null);
  return (
    <Screen>
      <TopBar title="Something was eaten or drunk" onBack={store.back} />
      <ScreenBody>
        <MascotSays src={MASCOT.calm} size={80}>
          Thank you for saying so. A gap is better than a recording we can't use.
        </MascotSays>
        {skipped === null ? (
          <>
            <div className="mt-4">
              <Field label="What did you have?" hint="A rough description is fine: a bar, a coffee, juice.">
                <TextInput
                  value={what}
                  onChange={(e) => setWhat(e.target.value)}
                  placeholder="Half a granola bar"
                />
              </Field>
            </div>
            <div className="mt-4">
              <Note tone="amber" title="What happens now">
                Every remaining recording in this meal window will be skipped. If you can't wait
                next time, try to hold off until at least 2 to 2.5 hours after the meal.
              </Note>
            </div>
          </>
        ) : (
          <div className="mt-4">
            <Note tone="green" title={`${skipped} recording${skipped === 1 ? "" : "s"} skipped`}>
              Logged against today. Your next task is the evening check-in. Everything else carries
              on as normal tomorrow.
            </Note>
          </div>
        )}
      </ScreenBody>
      <StickyFooter>
        {skipped === null ? (
          <Btn
            onClick={() => {
              const n = store.skipRemainingAfterSnack(what.trim() || "Snack or drink in the window");
              store.addEntry("meal", "Snack", what.trim() || "In the meal window");
              setSkipped(n);
            }}
          >
            Log it and skip the rest
          </Btn>
        ) : (
          <Btn onClick={() => store.go("home")}>Back to home</Btn>
        )}
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- skipping a session ---------------- */

const SKIP_REASONS = [
  "I ate or drank something other than water",
  "More than 30 minutes have passed since I woke up",
  "I had a snack or a drink during the meal window",
  "I drank water in the last 15 minutes",
  "I didn't have a quiet, private place",
  "I couldn't sit still and upright for two minutes",
  "I forgot, or I was asleep",
  "Something else",
];

export function SkipReasonScreen({ store }: { store: TummyStore }) {
  const [reason, setReason] = useState("");
  const [other, setOther] = useState("");
  const item = store.plan.find((p) => p.id === store.activeItemId);
  return (
    <Screen>
      <TopBar title="Skip this session" onBack={store.back} />
      <ScreenBody>
        <MascotSays src={MASCOT.calm} size={80}>
          Skipping is the right call if you can't record properly. Tell us what got in the way.
        </MascotSays>
        <p className="mt-4 text-[16px] font-extrabold text-pine">
          {item ? item.label : "This recording"}
        </p>
        <div className="mt-2 space-y-2">
          {SKIP_REASONS.map((r) => (
            <Choice key={r} label={r} selected={reason === r} onClick={() => setReason(r)} />
          ))}
        </div>
        {reason === "Something else" ? (
          <div className="mt-3">
            <TextInput
              value={other}
              onChange={(e) => setOther(e.target.value)}
              placeholder="Tell us in a few words"
            />
          </div>
        ) : null}
      </ScreenBody>
      <StickyFooter>
        <Btn
          disabled={!reason || (reason === "Something else" && other.trim().length === 0)}
          onClick={() => {
            const text = reason === "Something else" ? other.trim() : reason;
            if (store.activeItemId) store.missItem(store.activeItemId, text);
            if (reason === "I had a snack or a drink during the meal window") {
              store.go("snackSkip");
              return;
            }
            store.go("home");
          }}
        >
          Report this skip
        </Btn>
        <div className="mt-3">
          <Btn variant="secondary" onClick={store.back}>
            Actually, I can record
          </Btn>
        </div>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- extra session ---------------- */

export function ExtraSessionScreen({ store }: { store: TummyStore }) {
  const [reason, setReason] = useState<string>("");
  const [symptom, setSymptom] = useState<{ key: string; label: string } | null>(null);
  const [severity, setSeverity] = useState<number>(0);

  const needsSymptom = reason === "Symptoms higher than normal" || reason === "Both";
  const ready = reason !== "" && (!needsSymptom || (symptom !== null && severity > 0));

  const start = () => {
    if (needsSymptom && symptom) {
      store.addEntry("symptom", symptom.label, `${SEV_LABELS[severity - 1]} · before extra recording`);
    }
    store.startExtraSession();
    store.go("caseReminder");
  };

  return (
    <Screen>
      <TopBar title="Extra recording" onBack={store.back} />
      <ScreenBody>
        <MascotSays size={78} src={MASCOT.wave}>
          What made you want an extra recording?
        </MascotSays>
        <div className="mt-5 space-y-3">
          {["Unusually loud or frequent sounds", "Symptoms higher than normal", "Both", "Just curious"].map(
            (r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={cn(
                  "flex min-h-[64px] w-full items-center rounded-2xl border-2 bg-surface px-5 text-left text-[17px] font-extrabold text-pine",
                  reason === r ? "border-teal bg-mint-soft" : "border-line",
                )}
              >
                {r}
              </button>
            ),
          )}
        </div>

        {needsSymptom ? (
          <>
            <h3 className="mt-6 text-[18px] font-extrabold text-pine">Which symptom?</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {SYMPTOMS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setSymptom({ key, label });
                    setSeverity(0);
                  }}
                  className={cn(
                    "flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-surface px-2",
                    symptom?.key === key ? "border-teal bg-mint-soft" : "border-line",
                  )}
                >
                  <span className="text-teal">
                    <Icon width={28} height={28} />
                  </span>
                  <span className="text-[15px] font-extrabold text-pine">{label}</span>
                </button>
              ))}
            </div>
            {symptom ? (
              <>
                <h3 className="mt-6 text-[18px] font-extrabold text-pine">
                  How strong is it right now?
                </h3>
                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setSeverity(n)}
                      className={cn(
                        "min-h-[64px] flex-1 rounded-2xl border-2 text-[20px] font-extrabold",
                        severity === n
                          ? "border-teal bg-teal text-surface"
                          : "border-line bg-surface text-pine",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-center text-[15px] font-semibold text-pine-soft">
                  1 is very mild, 5 is very strong.
                </p>
              </>
            ) : null}
          </>
        ) : null}

        <div className="mt-6">
          <Note tone="blue" title="Same rules as always">
            Case off, bare skin, quiet room, sit upright and still for two minutes.
          </Note>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn disabled={!ready} onClick={start}>
          Start the extra recording
        </Btn>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- upload done ---------------- */

export function UploadDoneScreen({ store }: { store: TummyStore }) {
  const next = store.plan.find((p) => !p.done);
  const mins = next ? Math.max(0, next.at - minutesNow()) : null;

  const title =
    next?.kind === "recording"
      ? "Next recording"
      : next?.kind === "meal"
        ? next.mealLog
          ? "Next thing to log"
          : "Your study meal"
        : next
          ? "Next questions"
          : "All done for today";

  const detail = !next
    ? "Nothing more until tomorrow morning's fasted recording."
    : next.kind === "recording" && next.sessionKind === "postMeal"
      ? "Please don't eat or drink until the window is over. If you need water, one cup now."
      : next.kind === "meal" && !next.mealLog
        ? next.id === "mealStart"
          ? "Take a photo of the plate, then tap when you take your first bite."
          : "Tap the moment your last bite is done. Every recording after that is timed from it."
        : next.kind === "meal"
          ? "A photo and the time is all we need. For a snack, a short description is enough."
          : "Nothing to do until then.";

  return (
    <Screen>
      <ScreenBody className="flex flex-col justify-center pt-14 text-center">
        <Mascot src={MASCOT.cheer} size={170} className="mx-auto" />
        <h1 className="mt-4 text-[26px] font-extrabold leading-tight text-pine">Session saved</h1>
        <p className="mt-2 text-[17px] font-semibold leading-snug text-pine-soft">
          Uploaded, with {store.marks.length} symptom{" "}
          {store.marks.length === 1 ? "mark" : "marks"} timestamped on the audio.
        </p>
        <div className="mt-5 rounded-3xl border border-line bg-surface p-5 text-left">
          <div className="flex items-center gap-2 text-teal">
            <IconClock width={22} height={22} />
            <p className="text-[16px] font-extrabold">{title}</p>
          </div>
          <p className="mt-1 text-[19px] font-extrabold text-pine">
            {next
              ? `${next.label} · ${untilLabel(mins ?? 0)} · ${clockLabel(next.at)}`
              : "Tomorrow morning"}
          </p>
          <p className="mt-1 text-[16px] font-semibold text-pine-soft">{detail}</p>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn onClick={() => store.go("home")}>Back to home</Btn>
      </StickyFooter>
    </Screen>
  );
}

