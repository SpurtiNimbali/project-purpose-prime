import { useEffect, useState } from "react";
import bristolScale from "@/assets/bristol-scale.jpg";
import {
  Screen,
  ScreenBody,
  TopBar,
  Btn,
  Card,
  Note,
  Choice,
  Severity,
  Dots,
  Mascot,
  MascotSays,
  StickyFooter,
  TextInput,
  Field,
  MASCOT,
} from "./ui";
import {
  IconMic,
  IconClock,
  IconMoon,
  IconBowl,
  IconDroplet,
  IconToilet,
  IconRun,
  IconWave,
  IconCamera,
  IconCheck,
  IconArrowRight,
  IconChart,
  IconUser,
  IconShield,
  IconSun,
  IconBalloon,
  IconBolt,
  IconSpiral,
  IconDizzy,
  IconWind,
  IconPhone,
  IconList,
  IconChat,
  IconSend,
} from "./icons";
import {
  clockLabel,
  computeNextTask,
  untilLabel,
  type LogKind,
  type ScreenKey,
  type TummyStore,
} from "./store";
import { AssistantHint } from "./assistant";
import { cn } from "@/lib/utils";

/* ---------------- home ---------------- */

function useTick() {
  const [, set] = useState(0);
  useEffect(() => {
    const t = setInterval(() => set((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);
}


const HOME_LOGS: {
  k: ScreenKey;
  label: string;
  kind: LogKind;
  Icon: typeof IconBowl;
}[] = [
  { k: "logMeal", label: "Meal", kind: "meal", Icon: IconBowl },
  { k: "logHydration", label: "Drink", kind: "hydration", Icon: IconDroplet },
  { k: "logToilet", label: "Toilet", kind: "toilet", Icon: IconToilet },
  { k: "logSymptom", label: "Symptom", kind: "symptom", Icon: IconWave },
];


export function HomeScreen({ store }: { store: TummyStore }) {
  useTick();
  const task = computeNextTask(store.plan);
  const hour = Math.floor(store.demoNow / 60);
  const due = task.state === "due";
  const doneCount = store.plan.filter((p) => p.done).length;
  const currentIndex = Math.max(0, store.plan.findIndex((p) => !p.done));
  const railStart = Math.min(
    Math.max(0, currentIndex - 1),
    Math.max(0, store.plan.length - 4),
  );
  const railItems = store.plan.slice(railStart, railStart + 4);

  const TaskIcon =
    task.kind === "recording"
      ? IconMic
      : task.kind === "meal"
        ? IconBowl
        : task.kind === "questions"
          ? IconList
          : task.kind === "done"
            ? IconCheck
            : IconClock;

  const startTask = () => {
    if (task.itemId) store.startItem(task.itemId);
    store.go(task.screen);
  };

  return (
    <Screen>
      <div className="shrink-0 px-5 pb-1 pt-14">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <Mascot size={48} />
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-pine-soft">
              {hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"}
            </p>
            <h1 className="truncate text-[20px] font-extrabold leading-tight text-pine">
              Day {store.day} of 7
            </h1>
          </div>
          <span className="shrink-0 rounded-full bg-mint-soft px-3 py-2 text-[15px] font-extrabold text-teal">
            {doneCount}/{store.plan.length}
          </span>
        </div>
      </div>

      <ScreenBody className="pb-[180px] pt-3">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-teal">Next up</p>
        <div
          className={cn(
            "mt-2 rounded-[28px] p-5",
            due ? "bg-teal text-surface" : "border border-line bg-surface text-pine",
          )}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                due ? "bg-surface/15" : "bg-mint-soft text-teal",
              )}
            >
              <TaskIcon width={26} height={26} />
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-[13px] font-extrabold uppercase tracking-[0.12em]",
                  due ? "text-mint" : "text-teal",
                )}
              >
                {task.tag}
              </p>
              <p className="text-[20px] font-extrabold leading-tight">{task.title}</p>
            </div>
          </div>

          <p
            className={cn(
              "mt-3 text-[16px] font-semibold leading-snug",
              due ? "text-mint" : "text-pine-soft",
            )}
          >
            {task.sub}
          </p>

          {task.note ? (
            <div className="mt-3 flex gap-3 rounded-2xl bg-amber-soft px-4 py-3">
              <span className="shrink-0 text-teal">
                <IconDroplet width={22} height={22} />
              </span>
              <p className="min-w-0 flex-1 text-[15px] font-semibold leading-snug text-pine">
                {task.note}
              </p>
            </div>
          ) : null}

          {task.minsUntil !== null ? (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-mint-soft px-4 py-3 text-pine">
              <span className="shrink-0 text-teal">
                <IconClock width={22} height={22} />
              </span>
              <p className="min-w-0 flex-1 truncate text-[15px] font-bold text-pine-soft">
                Starts in
              </p>
              <p className="shrink-0 text-[20px] font-extrabold leading-none tabular-nums">
                {untilLabel(task.minsUntil)}
              </p>
            </div>
          ) : null}

          {task.kind === "recording" && task.itemId ? (
            <button
              onClick={() => {
                store.startItem(task.itemId!);
                store.go("skipReason");
              }}
              className={cn(
                "mt-3 min-h-[54px] w-full rounded-2xl border-2 text-[16px] font-extrabold active:scale-[0.99]",
                due
                  ? "border-surface/40 bg-surface/10 text-surface"
                  : "border-line bg-wash text-pine",
              )}
            >
              Skip this recording
            </button>
          ) : null}

          <button
            onClick={startTask}
            className={cn(
              "mt-4 flex min-h-[60px] w-full items-center justify-center gap-2 rounded-2xl text-[18px] font-extrabold active:scale-[0.99]",
              due ? "bg-surface text-teal" : "bg-teal text-surface",
            )}
          >
            {task.cta}
          </button>
        </div>

        {/* day rail — recordings, meals and question blocks */}
        <div className="mt-5 rounded-3xl border border-line bg-surface px-4 py-4">
          <div className="flex items-end justify-between gap-3">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-teal">
              Today's rail
            </p>
            <button
              onClick={() => store.go("sessionHub")}
              className="shrink-0 text-[15px] font-extrabold text-teal"
            >
              Open
            </button>
          </div>
          <div className="mt-3 flex items-start">
            {railStart > 0 ? (
              <span className="flex h-[28px] w-5 shrink-0 items-center justify-center text-[18px] font-extrabold text-teal" aria-label={`${railStart} earlier items`}>•••</span>
            ) : null}
            {railItems.map((p, i) => {
              const RailIcon =
                p.kind === "recording" ? IconMic : p.kind === "meal" ? IconBowl : IconList;
              const current = task.itemId === p.id;
              const planIndex = railStart + i;
              return (
                <button
                  key={p.id}
                  onClick={() => store.go("sessionHub")}
                  className="relative flex min-w-0 flex-1 flex-col items-center gap-1.5"
                >
                  {planIndex > 0 ? (
                    <span
                      className={cn(
                        "absolute left-[-50%] top-[13px] h-[3px] w-full",
                        p.done || store.plan[planIndex - 1].done ? "bg-teal" : "bg-line",
                      )}
                    />
                  ) : null}
                  <span
                    className={cn(
                      "relative z-10 flex h-[28px] w-[28px] items-center justify-center rounded-full border-2",
                      p.missed
                        ? "border-amber bg-surface text-amber"
                        : p.done
                        ? "border-teal bg-teal text-surface"
                        : current
                          ? "border-teal bg-surface text-teal"
                          : "border-line bg-surface text-pine-soft",
                    )}
                  >
                    <RailIcon width={15} height={15} />
                  </span>
                  <span className="w-full truncate text-center text-[12px] font-bold text-pine-soft">
                    {clockLabel(p.at).replace(" ", "")}
                  </span>
                </button>
              );
            })}
            {railStart + railItems.length < store.plan.length ? (
              <span className="flex h-[28px] w-5 shrink-0 items-center justify-center text-[18px] font-extrabold text-pine-soft" aria-label={`${store.plan.length - railStart - railItems.length} later items`}>•••</span>
            ) : null}
          </div>
        </div>

        <button
          onClick={() => {
            store.startExtraSession();
            store.go("extraSession");
          }}
          className="mt-4 flex min-h-[76px] w-full items-center gap-3 rounded-3xl border-2 border-teal bg-mint-soft px-4 text-left shadow-sm active:scale-[0.99]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal text-surface">
            <IconMic width={24} height={24} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-extrabold text-pine">
              Something feels different?
            </span>
            <span className="block text-[15px] font-semibold text-pine-soft">
              Add an extra 2 minute recording — loud sounds, worse symptoms
            </span>
          </span>
        </button>


        {/* quick log */}
        <div className="mt-5">
          <div className="flex items-end justify-between gap-3">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-teal">
              Quick log
            </p>
            <button
              onClick={() => store.go("logHub")}
              className="shrink-0 text-[15px] font-extrabold text-teal"
            >
              More
            </button>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {HOME_LOGS.map(({ k, label, kind, Icon }) => {
              const count = store.entries.filter((e) => e.kind === kind).length;
              return (
                <button
                  key={k}
                  onClick={() => store.go(k)}
                  className="relative flex min-h-[86px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-line bg-surface px-1 active:scale-[0.98]"
                >
                  {count > 0 ? (
                    <span className="absolute right-1.5 top-1.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-mint-soft px-1 text-[13px] font-extrabold text-teal">
                      {count}
                    </span>
                  ) : null}
                  <span className="text-teal">
                    <Icon width={26} height={26} />
                  </span>
                  <span className="w-full truncate text-center text-[14px] font-extrabold text-pine">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </ScreenBody>
    </Screen>
  );
}


/* ---------------- logging hub ---------------- */

const LOG_ITEMS: {
  k: ScreenKey;
  label: string;
  sub: string;
  Icon: typeof IconBowl;
  kind: LogKind;
}[] = [
  {
    k: "logMeal",
    label: "Meal or snack",
    sub: "Photo or description",
    Icon: IconBowl,
    kind: "meal",
  },
  {
    k: "logHydration",
    label: "Drinks",
    sub: "Water, tea, anything fizzy",
    Icon: IconDroplet,
    kind: "hydration",
  },
  {
    k: "logSymptom",
    label: "Symptom",
    sub: "Type and how strong",
    Icon: IconWave,
    kind: "symptom",
  },
  {
    k: "logToilet",
    label: "Toilet habits",
    sub: "Timing and consistency",
    Icon: IconToilet,
    kind: "toilet",
  },
  { k: "logSleep", label: "Sleep", sub: "Last night's rest", Icon: IconMoon, kind: "sleep" },
  {
    k: "logActivity",
    label: "Activity",
    sub: "Walks, workouts, rest",
    Icon: IconRun,
    kind: "activity",
  },
];

const KIND_ICON: Record<LogKind, typeof IconBowl> = {
  meal: IconBowl,
  hydration: IconDroplet,
  symptom: IconWave,
  toilet: IconToilet,
  sleep: IconMoon,
  activity: IconRun,
  recording: IconMic,
};

export function LogHubScreen({ store }: { store: TummyStore }) {
  const [tab, setTab] = useState<"add" | "today">("add");
  const entries = store.entries;
  const counts = (k: LogKind) => entries.filter((e) => e.kind === k).length;

  return (
    <Screen>
      <div className="shrink-0 px-5 pb-3 pt-14">
        <h1 className="text-[24px] font-extrabold leading-tight text-pine">Logging</h1>
        <p className="mt-1 text-[16px] font-semibold text-pine-soft">
          {entries.length} things logged today · nothing has to be in order
        </p>
        <div className="mt-4 flex rounded-2xl bg-surface p-1">
          {(["add", "today"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "min-h-[48px] flex-1 rounded-xl text-[16px] font-extrabold",
                tab === t ? "bg-teal text-surface" : "text-pine-soft",
              )}
            >
              {t === "add" ? "Add an entry" : "Today's log"}
            </button>
          ))}
        </div>
      </div>

      <ScreenBody className="pt-1">
        {tab === "add" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              {LOG_ITEMS.map(({ k, label, sub, Icon, kind }) => (
                <button
                  key={k}
                  onClick={() => store.go(k)}
                  className="relative flex min-h-[126px] flex-col justify-between rounded-[26px] border border-line bg-surface p-4 text-left active:scale-[0.99]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-soft text-teal">
                    <Icon width={26} height={26} />
                  </span>
                  <span>
                    <span className="block text-[17px] font-extrabold leading-tight text-pine">
                      {label}
                    </span>
                    <span className="block text-[14px] font-semibold leading-snug text-pine-soft">
                      {sub}
                    </span>
                  </span>
                  {counts(kind) ? (
                    <span className="absolute right-3 top-3 flex h-7 min-w-7 items-center justify-center rounded-full bg-teal px-2 text-[14px] font-extrabold text-surface">
                      {counts(kind)}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <AssistantHint store={store} />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { kind: "meal" as LogKind, label: "Meals" },
                { kind: "hydration" as LogKind, label: "Drinks" },
                { kind: "symptom" as LogKind, label: "Symptoms" },
              ].map(({ kind, label }) => (
                <div
                  key={kind}
                  className="rounded-3xl border border-line bg-surface p-3 text-center"
                >
                  <p className="text-[28px] font-extrabold leading-none text-teal">
                    {counts(kind)}
                  </p>
                  <p className="mt-1 text-[14px] font-bold text-pine-soft">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[26px] border border-line bg-surface p-5">
              <div className="flex items-center gap-2 text-teal">
                <IconList width={20} height={20} />
                <p className="text-[17px] font-extrabold text-pine">Timeline</p>
              </div>
              {entries.length === 0 ? (
                <p className="mt-3 text-[16px] font-semibold text-pine-soft">
                  Nothing logged yet today.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {entries.map((e, i) => {
                    const Icon = KIND_ICON[e.kind];
                    return (
                      <div key={e.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint-soft text-teal">
                            <Icon width={20} height={20} />
                          </span>
                          {i < entries.length - 1 ? (
                            <span className="mt-1 w-[2px] flex-1 rounded bg-line" />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1 pb-1">
                          <div className="flex items-baseline gap-2">
                            <p className="min-w-0 flex-1 truncate text-[17px] font-extrabold text-pine">
                              {e.label}
                            </p>
                            <p className="shrink-0 text-[14px] font-bold text-pine-soft">
                              {e.time}
                            </p>
                          </div>
                          {e.detail ? (
                            <p className="text-[15px] font-semibold leading-snug text-pine-soft">
                              {e.detail}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4">
              <Note tone="green" title="Everything is saved against your subject ID">
                You can add anything you forgot later in the day — nothing locks.
              </Note>
            </div>
          </>
        )}
      </ScreenBody>
    </Screen>
  );
}

export function LogMealScreen({ store }: { store: TummyStore }) {
  const [photos, setPhotos] = useState(0);
  const [which, setWhich] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState(
    new Date().toTimeString().slice(0, 5),
  );
  const [mode, setMode] = useState<"type" | "voice">("type");
  const [recorded, setRecorded] = useState(false);
  const photo = photos > 0;
  const isSnack = which === "Snack";
  return (
    <Screen>
      <TopBar title="Log food or drink" onBack={store.back} />
      <ScreenBody>
        <button
          onClick={() => setPhotos((p) => p + 1)}
          className={cn(
            "flex h-[170px] w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed",
            photo ? "border-teal bg-mint-soft text-teal" : "border-line bg-surface text-pine-soft",
          )}
        >
          <IconCamera width={44} height={44} />
          <span className="text-[17px] font-extrabold">
            {photo
              ? `${photos} photo${photos === 1 ? "" : "s"} — add another`
              : "Photo of what you had"}
          </span>
        </button>
        <p className="mt-2 text-[15px] font-semibold text-pine-soft">
          {isSnack
            ? "A photo is best, but a quick line of text is fine for snacks."
            : "Photos are needed for every meal and drink. Add several if one shot doesn't cover it."}
        </p>
        <div className="mt-4">
          <Field label="What time was this?">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="min-h-[62px] w-full rounded-2xl border-2 border-line bg-surface px-4 text-[18px] font-extrabold text-pine"
            />
          </Field>
        </div>
        <div className="mt-4 space-y-4">
          <Field label="What was it?">
            <div className="space-y-2">
              {["Breakfast", "Lunch", "Dinner", "Snack", "Drink"].map((m) => (
                <Choice key={m} label={m} selected={which === m} onClick={() => setWhich(m)} />
              ))}
            </div>
          </Field>
          <Field label="What was in it?" hint="Type it out, or just say it out loud.">
            <div className="mb-2 flex rounded-2xl bg-surface p-1">
              {(
                [
                  { k: "type", label: "Type it" },
                  { k: "voice", label: "Record it" },
                ] as const
              ).map(({ k, label }) => (
                <button
                  key={k}
                  onClick={() => setMode(k)}
                  className={cn(
                    "min-h-[52px] flex-1 rounded-xl text-[16px] font-extrabold",
                    mode === k ? "bg-teal text-surface" : "text-pine-soft",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {mode === "type" ? (
              <TextInput
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Chicken salad and a roll"
              />
            ) : (
              <button
                onClick={() => {
                  setRecorded((v) => !v);
                  setDesc(recorded ? "" : "Voice note · 12 sec");
                }}
                className={cn(
                  "flex min-h-[96px] w-full items-center gap-4 rounded-2xl border-2 px-5 text-left",
                  recorded ? "border-teal bg-mint-soft" : "border-dashed border-line bg-surface",
                )}
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal text-surface">
                  <IconMic width={26} height={26} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-extrabold text-pine">
                    {recorded ? "Voice note saved · 12 sec" : "Hold to describe your meal"}
                  </span>
                  <span className="block text-[15px] font-semibold text-pine-soft">
                    {recorded ? "Tap to record again" : "We transcribe it for you"}
                  </span>
                </span>
              </button>
            )}
          </Field>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn
          disabled={!which || (!photo && !isSnack && desc.trim().length === 0)}
          onClick={() => {
            const detail = [
              time,
              desc.trim() || undefined,
              photo ? `${photos} photo${photos === 1 ? "" : "s"}` : undefined,
            ]
              .filter(Boolean)
              .join(" · ");
            store.addEntry(which === "Drink" ? "hydration" : "meal", which, detail);
            const scheduled = store.plan.find(
              (p) => p.id === store.activeItemId && p.mealLog && !p.done,
            );
            if (scheduled) store.completeItem(scheduled.id);
            else store.completeMealLog(which);
            store.go("logHub");
          }}
        >
          Save to today's diary
        </Btn>
      </StickyFooter>
    </Screen>
  );
}

const SYMPTOM_TYPES = [
  { label: "Gurgling", Icon: IconWave },
  { label: "Bloating", Icon: IconBalloon },
  { label: "Abdominal pain", Icon: IconBolt },
  { label: "Cramping", Icon: IconSpiral },
  { label: "Nausea", Icon: IconDizzy },
  { label: "Gas", Icon: IconWind },
  { label: "Urgency", Icon: IconToilet },
];

export function LogSymptomScreen({ store }: { store: TummyStore }) {
  const [type, setType] = useState("");
  const [sev, setSev] = useState(3);
  return (
    <Screen>
      <TopBar title="Log a symptom" onBack={store.back} />
      <ScreenBody>
        <p className="text-[16px] font-extrabold text-pine">What are you feeling?</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {SYMPTOM_TYPES.map(({ label, Icon }) => (
            <button
              key={label}
              onClick={() => setType(label)}
              className={cn(
                "flex min-h-[96px] flex-col items-start justify-center gap-2 rounded-3xl border-2 bg-surface p-4",
                type === label ? "border-teal bg-mint-soft" : "border-line",
              )}
            >
              <span className="text-teal">
                <Icon width={28} height={28} />
              </span>
              <span className="text-[16px] font-extrabold text-pine">{label}</span>
            </button>
          ))}
        </div>
        {type ? (
          <div className="mt-5">
            <p className="mb-2 text-[16px] font-extrabold text-pine">How strong is it?</p>
            <Severity value={sev} onChange={setSev} />
          </div>
        ) : null}
      </ScreenBody>
      <StickyFooter>
        <Btn
          disabled={!type}
          onClick={() => {
            store.addEntry("symptom", type, `Severity ${sev} of 5`);
            store.go("logHub");
          }}
        >
          Save symptom
        </Btn>
      </StickyFooter>
    </Screen>
  );
}

export function LogSleepScreen({ store }: { store: TummyStore }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const qs = [
    { q: "How did you sleep last night?", options: ["Well", "So-so", "Badly"] },
    { q: "Roughly how many hours?", options: ["Under 5", "5 to 6", "7 to 8", "More than 8"] },
    { q: "Did you wake up during the night?", options: ["No", "Once", "A few times"] },
  ];
  const done = step >= qs.length;
  return (
    <Screen>
      <TopBar title="Log sleep" onBack={store.back} />
      <ScreenBody>
        <MascotSays src={MASCOT.calm} size={72}>
          Three taps and we're done.
        </MascotSays>
        <div className="mt-4 space-y-3">
          {answers.map((a, i) => (
            <div key={i} className="space-y-2">
              <p className="rounded-3xl rounded-tl-md border border-line bg-surface px-4 py-3 text-[16px] font-semibold text-pine">
                {qs[i].q}
              </p>
              <p className="ml-auto w-fit rounded-3xl rounded-br-md bg-teal px-4 py-3 text-[16px] font-bold text-surface">
                {a}
              </p>
            </div>
          ))}
          {!done ? (
            <>
              <p className="rounded-3xl rounded-tl-md border border-line bg-surface px-4 py-3 text-[16px] font-semibold text-pine">
                {qs[step].q}
              </p>
              <div className="space-y-2">
                {qs[step].options.map((o) => (
                  <Choice
                    key={o}
                    label={o}
                    onClick={() => {
                      setAnswers((a) => [...a, o]);
                      setStep((s) => s + 1);
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <Note tone="green" title="Sleep logged">
              Thanks — that helps us read this morning's fasting recording.
            </Note>
          )}
        </div>
      </ScreenBody>
      {done ? (
        <StickyFooter>
          <Btn
            onClick={() => {
              store.addEntry("sleep", "Sleep", answers.join(" · "));
              store.go("logHub");
            }}

          >
            Done
          </Btn>
        </StickyFooter>
      ) : null}
    </Screen>
  );
}

export function LogActivityScreen({ store }: { store: TummyStore }) {
  const [kind, setKind] = useState("");
  const [mins, setMins] = useState("");
  return (
    <Screen>
      <TopBar title="Log activity" onBack={store.back} />
      <ScreenBody>
        <Field label="What kind of activity?">
          <div className="space-y-2">
            {["Walking", "Light exercise", "Hard exercise", "Mostly sitting"].map((k) => (
              <Choice key={k} label={k} selected={kind === k} onClick={() => setKind(k)} />
            ))}
          </div>
        </Field>
        <div className="mt-4">
          <Field label="For how long?">
            <TextInput
              value={mins}
              onChange={(e) => setMins(e.target.value)}
              inputMode="numeric"
              placeholder="30 minutes"
            />
          </Field>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn
          disabled={!kind}
          onClick={() => {
            store.addEntry("activity", kind, mins ? `${mins}` : undefined);
            store.go("logHub");
          }}
        >
          Save activity
        </Btn>
      </StickyFooter>
    </Screen>
  );
}

export function LogHydrationScreen({ store }: { store: TummyStore }) {
  const [glasses, setGlasses] = useState(3);
  const [kind, setKind] = useState("Water");
  return (
    <Screen>
      <TopBar title="Log hydration" onBack={store.back} />
      <ScreenBody>
        <div className="rounded-3xl border border-line bg-surface p-5 text-center">
          <p className="text-[16px] font-extrabold text-pine">Glasses today</p>
          <p className="mt-1 text-[52px] font-extrabold leading-none text-teal">{glasses}</p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setGlasses((g) => Math.max(0, g - 1))}
              className="min-h-[64px] flex-1 rounded-2xl border-2 border-line bg-wash text-[26px] font-extrabold text-pine"
            >
              −
            </button>
            <button
              onClick={() => setGlasses((g) => g + 1)}
              className="min-h-[64px] flex-1 rounded-2xl bg-teal text-[26px] font-extrabold text-surface"
            >
              +
            </button>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {Array.from({ length: glasses }, (_, i) => (
              <span key={i} className="text-teal">
                <IconDroplet width={30} height={30} />
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <Field label="What did you drink?">
            <div className="space-y-2">
              {["Water", "Tea or coffee", "Carbonated drink", "Other"].map((k) => (
                <Choice key={k} label={k} selected={kind === k} onClick={() => setKind(k)} />
              ))}
            </div>
          </Field>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn
          onClick={() => {
            store.addEntry("hydration", kind, `${glasses} ${glasses === 1 ? "glass" : "glasses"}`);
            store.go("logHub");
          }}
        >
          Save hydration
        </Btn>
      </StickyFooter>
    </Screen>
  );
}

export function LogToiletScreen({ store }: { store: TummyStore }) {
  const [consistency, setConsistency] = useState(0);
  const [urgency, setUrgency] = useState("");
  const [scale, setScale] = useState(false);
  const [urgencyInfo, setUrgencyInfo] = useState(false);
  return (
    <Screen>
      <TopBar title="Log toilet habits" onBack={store.back} />
      <ScreenBody>
        <Note tone="green" title="Only your subject ID is attached">
          This is routine research data. Nothing here is shared with anyone outside the study team.
        </Note>
        <div className="mt-4 space-y-4">
          <Field label="When was it?">
            <input
              type="time"
              defaultValue="08:20"
              className="min-h-[58px] w-full rounded-2xl border-2 border-line bg-surface px-4 text-[17px] font-extrabold text-pine"
            />
          </Field>
          <div className="flex min-h-[60px] items-center gap-3 rounded-2xl bg-mint-soft px-4">
            <span className="shrink-0 text-teal">
              <IconList width={20} height={20} />
            </span>
            <p className="min-w-0 flex-1 text-[15px] font-bold text-pine">
              Counted automatically from your logs
            </p>
            <p className="shrink-0 text-[20px] font-extrabold tabular-nums text-teal">
              {store.entries.filter((e) => e.kind === "toilet").length + 1}
            </p>
          </div>

          <Field label="Consistency" hint="1 is hard and lumpy, 7 is entirely liquid.">
            <button
              onClick={() => setScale((v) => !v)}
              className="mb-3 flex min-h-[56px] w-full items-center gap-3 rounded-2xl border-2 border-line bg-surface px-4 text-left"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-teal text-[16px] font-black text-teal">
                i
              </span>
              <span className="min-w-0 flex-1 text-[16px] font-extrabold text-pine">
                {scale ? "Hide consistency descriptions" : "Check consistency descriptions"}
              </span>
            </button>
            {scale ? (
              <img
                src={bristolScale}
                alt="Bristol stool scale showing types 1 to 7, from separate hard lumps to entirely liquid"
                width={1024}
                height={1280}
                loading="lazy"
                className="mb-3 w-full rounded-2xl border border-line"
              />
            ) : null}
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  onClick={() => setConsistency(n)}
                  className={cn(
                    "h-[58px] flex-1 rounded-xl border-2 text-[17px] font-extrabold",
                    consistency === n
                      ? "border-teal bg-teal text-surface"
                      : "border-line bg-surface text-pine-soft",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Was there any urgency?">
            <button
              onClick={() => setUrgencyInfo((v) => !v)}
              className="mb-3 flex min-h-[56px] w-full items-center gap-3 rounded-2xl border-2 border-line bg-surface px-4 text-left"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-teal text-[16px] font-black text-teal">
                ?
              </span>
              <span className="min-w-0 flex-1 text-[16px] font-extrabold text-pine">
                What does urgency mean?
              </span>
            </button>
            {urgencyInfo ? (
              <p className="mb-3 rounded-2xl bg-mint-soft px-4 py-3 text-[16px] font-semibold leading-snug text-pine">
                Urgency is the feeling of needing to go right now, with little or no warning. "A
                little" means you could have waited a few minutes; "a lot" means you had to stop
                what you were doing and get to a toilet straight away.
              </p>
            ) : null}
            <div className="space-y-2">
              {["No", "A little", "A lot"].map((u) => (
                <Choice key={u} label={u} selected={urgency === u} onClick={() => setUrgency(u)} />
              ))}
            </div>
          </Field>
        </div>
      </ScreenBody>
      <StickyFooter>
        <Btn
          onClick={() => {
            store.addEntry(
              "toilet",
              "Toilet habits",
              `Consistency ${consistency || "—"}${urgency ? ` · urgency: ${urgency.toLowerCase()}` : ""}`,
            );
            store.go("logHub");
          }}
        >
          Save entry
        </Btn>
      </StickyFooter>
    </Screen>
  );
}

/* ---------------- progress ---------------- */

export function ProgressScreen({ store }: { store: TummyStore }) {
  const days = [true, true, true, false, false, false, false];
  return (
    <Screen>
      <TopBar title="Progress" />
      <ScreenBody>
        <Card className="border-0 bg-teal text-surface">
          <div className="flex items-center gap-3">
            <Mascot src={MASCOT.cheer} size={72} />
            <div>
              <p className="text-[34px] font-extrabold leading-none">3 days</p>
              <p className="text-[16px] font-bold text-mint">in a row · keep it going</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            {days.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full border-[3px]",
                    d ? "border-mint bg-mint text-pine" : "border-surface/30 text-surface/50",
                  )}
                >
                  {d ? <IconCheck width={20} height={20} /> : <IconSun width={18} height={18} />}
                </span>
                <span className="text-[13px] font-extrabold text-mint">{"MTWTFSS"[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-4">
          <Card>
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-teal">
                <IconShield width={26} height={26} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[17px] font-extrabold text-pine">
                  {store.freezeUsed ? "Streak freeze used" : "Streak freeze available"}
                </p>
                <p className="mt-1 text-[16px] font-semibold leading-snug text-pine-soft">
                  {store.freezeUsed
                    ? "You've used your one freeze for this study week. Your streak is safe for that day."
                    : "Need a day off? Use your one freeze and your streak stays intact. Life happens — this is a study, not a competition."}
                </p>
                {!store.freezeUsed ? (
                  <div className="mt-3">
                    <Btn variant="secondary" onClick={() => store.useFreeze()}>
                      Use my freeze day
                    </Btn>
                  </div>
                ) : null}
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-4">
          <Card>
            <p className="text-[17px] font-extrabold text-pine">Full study goal</p>
            <p className="mt-1 text-[16px] font-semibold text-pine-soft">
              Compensation is released once when the full week is complete.
            </p>
            <div className="mt-4 h-5 w-full overflow-hidden rounded-full bg-wash">
              <div className="h-full w-[43%] rounded-full bg-sage" />
            </div>
            <p className="mt-2 text-[16px] font-extrabold text-teal">12 of 28 sessions complete</p>
          </Card>
        </div>

        <div className="mt-4">
          <Card>
            <div className="flex items-center gap-2 text-teal">
              <IconChart width={22} height={22} />
              <p className="text-[17px] font-extrabold text-pine">This week's sessions</p>
            </div>
            <div className="mt-4 space-y-3">
              {["Day 1", "Day 2", "Day 3"].map((d, i) => (
                <div key={d} className="flex items-center gap-3">
                  <span className="w-[58px] text-[16px] font-extrabold text-pine">{d}</span>
                  <Dots states={[true, true, i < 2, i < 2]} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </ScreenBody>
    </Screen>
  );
}

/* ---------------- profile ---------------- */

export function ProfileScreen({ store }: { store: TummyStore }) {
  const rows: { label: string; sub: string; Icon: typeof IconUser; to?: ScreenKey }[] = [
    { label: "Subject ID", sub: "STF-0142 · cohort B", Icon: IconUser },
    { label: "Daily times", sub: "Meals, sleep and wake", Icon: IconClock, to: "scheduling" },
    {
      label: "Technical Setup",
      sub: "iPhone 14 · bottom microphone",
      Icon: IconPhone,
      to: "technicalSetup",
    },
    { label: "Setup guide", sub: "Rewatch the instruction video", Icon: IconMic, to: "video" },
  ];
  return (
    <Screen>
      <TopBar title="Profile" />
      <ScreenBody>
        <div className="flex items-center gap-3 rounded-3xl border border-line bg-surface p-5">
          <Mascot size={64} />
          <div>
            <p className="text-[19px] font-extrabold text-pine">Participant STF-0142</p>
            <p className="text-[16px] font-semibold text-pine-soft">Day {store.day} of 7</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {rows.map(({ label, sub, Icon, to }) => (
            <button
              key={label}
              onClick={() => to && store.go(to)}
              className="flex min-h-[78px] w-full items-center gap-4 rounded-3xl border border-line bg-surface px-5 text-left"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-teal">
                <Icon width={24} height={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-extrabold text-pine">{label}</span>
                <span className="block text-[15px] font-semibold text-pine-soft">{sub}</span>
              </span>
              {to ? (
                <span className="shrink-0 text-pine-soft">
                  <IconArrowRight width={22} height={22} />
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <Note tone="green" title="Your data is anonymous">
            Recordings and logs are stored against your subject ID. Contact your coordinator at
            (650) 555-0134 with any questions.
          </Note>
        </div>

        <div className="mt-4 space-y-3">
          <Btn variant="secondary" onClick={() => store.go("welcome")}>
            Restart the walkthrough
          </Btn>
          <Btn variant="secondary" onClick={() => store.go("contact")}>
            Contact the study team
          </Btn>
        </div>
      </ScreenBody>
    </Screen>
  );
}

/* ---------------- period check-in ---------------- */

export function PeriodCheckScreen({ store }: { store: TummyStore }) {
  return (
    <Screen>
      <TopBar title="Evening check-in" onBack={store.back} />
      <ScreenBody>
        <MascotSays src={MASCOT.calm} size={78}>
          Last one for today — are you on your period right now?
        </MascotSays>
        <div className="mt-5 space-y-2">
          {["Yes", "No", "Not sure", "Prefer not to say"].map((o) => (
            <Choice
              key={o}
              label={o}
              onClick={() => {
                store.addEntry("symptom", "Period check", o);
                store.go("home");
              }}
            />
          ))}
        </div>
        <div className="mt-4">
          <Note tone="green" title="Why we ask">
            Cycle timing can change gut symptoms, so this helps the team read your recordings
            properly. It's stored against your subject ID only.
          </Note>
        </div>
      </ScreenBody>
    </Screen>
  );
}

/* ---------------- contact the study team ---------------- */

export function ContactScreen({ store }: { store: TummyStore }) {
  return (
    <Screen>
      <TopBar title="Contact the study team" onBack={store.back} />
      <ScreenBody>
        <MascotSays size={78}>
          Tell me what's going on and I'll point you to the right person. Most things can be sorted
          without leaving the study.
        </MascotSays>
        <div className="mt-5 space-y-3">
          {[
            {
              t: "Ask me first",
              b: "Missed recordings, timings, reminders and app problems — I can usually answer straight away.",
              Icon: IconChat,
              action: () => store.setChatOpen(true),
              cta: "Open chat",
            },
            {
              t: "Message your study coordinator",
              b: "Scheduling, compensation, or anything about taking part. Replies within one working day.",
              Icon: IconSend,
              action: () => store.go("contactForm"),
              cta: "Write a message",
            },
            {
              t: "Raise a concern or complaint",
              b: "Goes to the study manager and, if you ask, the independent review board.",
              Icon: IconShield,
              action: () => store.go("contactForm"),
              cta: "Write a message",
            },
          ].map(({ t, b, Icon, action, cta }) => (
            <button
              key={t}
              onClick={action}
              className="flex w-full items-center gap-3 rounded-3xl border border-line bg-surface p-4 text-left active:scale-[0.99]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-teal">
                <Icon width={24} height={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-extrabold text-pine">{t}</span>
                <span className="mt-1 block text-[16px] font-semibold leading-snug text-pine-soft">
                  {b}
                </span>
                <span className="mt-1 block text-[15px] font-extrabold text-teal">{cta} →</span>
              </span>
              <span className="shrink-0 text-[22px] font-extrabold text-teal">›</span>
            </button>
          ))}
        </div>
        <div className="mt-4">
          <Note tone="green" title="Prefer to phone?">
            Your coordinator is on (650) 555-0134, weekdays 9am to 5pm.
          </Note>
        </div>
      </ScreenBody>
    </Screen>
  );
}

export function ContactFormScreen({ store }: { store: TummyStore }) {
  const [topic, setTopic] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <Screen>
      <TopBar title="Send a message" onBack={store.back} />
      <ScreenBody>
        {sent ? (
          <>
            <MascotSays src={MASCOT.cheer} size={78}>
              Sent. Someone from the study team will come back to you within one working day.
            </MascotSays>
            <div className="mt-4">
              <Note tone="green" title="Nothing changes in the meantime">
                Keep recording as usual — if you need to pause, say so and the team will arrange it
                with you.
              </Note>
            </div>
          </>
        ) : (
          <>
            <Field label="What's it about?">
              <div className="space-y-2">
                {[
                  "Scheduling or timings",
                  "The app isn't working",
                  "Compensation",
                  "A concern or complaint",
                  "I'd like to pause or stop taking part",
                ].map((t) => (
                  <Choice key={t} label={t} selected={topic === t} onClick={() => setTopic(t)} />
                ))}
              </div>
            </Field>
            <div className="mt-4">
              <Field label="Tell us a bit more" hint="A sentence or two is plenty.">
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  rows={5}
                  placeholder="What happened, and what would help?"
                  className="w-full rounded-2xl border-2 border-line bg-surface p-4 text-[17px] font-semibold text-pine placeholder:text-pine-soft/60 focus:border-teal focus:outline-none"
                />
              </Field>
            </div>
            <div className="mt-4">
              <Note tone="blue" title="Want a quicker answer?">
                Ask Tummy in the chat — timing and app questions are usually answered instantly.
              </Note>
            </div>
          </>
        )}
      </ScreenBody>
      <StickyFooter>
        {sent ? (
          <Btn onClick={() => store.go("home")}>Back to home</Btn>
        ) : (
          <Btn disabled={!topic} onClick={() => setSent(true)}>
            Send to the study team
          </Btn>
        )}
      </StickyFooter>
    </Screen>
  );
}
