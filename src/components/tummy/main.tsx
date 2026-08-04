import { useState } from "react";
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
} from "./icons";
import type { ScreenKey, TummyStore } from "./store";
import { cn } from "@/lib/utils";

/* ---------------- home ---------------- */

export function HomeScreen({ store }: { store: TummyStore }) {
  const done = store.sessions.filter((s) => s.done).length;
  const next = store.sessions.find((s) => !s.done);
  const eveningReady = false;

  return (
    <Screen>
      <div className="shrink-0 px-5 pb-2 pt-14">
        <div className="flex items-center gap-3">
          <Mascot size={54} />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-pine-soft">Good morning</p>
            <h1 className="text-[22px] font-extrabold leading-tight text-pine">
              Day {store.day} of 7
            </h1>
          </div>
          <span className="rounded-full bg-mint-soft px-4 py-2 text-[15px] font-extrabold text-teal">
            {done}/4 today
          </span>
        </div>
      </div>

      <ScreenBody className="pt-3">
        <Card className="border-0 bg-teal text-surface">
          <p className="text-[15px] font-extrabold uppercase tracking-[0.12em] text-mint">
            Next session
          </p>
          <p className="mt-1 text-[24px] font-extrabold leading-tight">
            {next ? next.label : "All done for today"}
          </p>
          {next ? (
            <div className="mt-2 flex items-center gap-2 text-mint">
              <IconClock width={20} height={20} />
              <p className="text-[16px] font-bold">Starts in 42 min · 10:05 am</p>
            </div>
          ) : (
            <p className="mt-2 text-[16px] font-bold text-mint">
              Come back this evening for your bedtime log.
            </p>
          )}
          <button
            onClick={() => store.go("sessionHub")}
            className="mt-4 flex min-h-[62px] w-full items-center justify-center gap-2 rounded-2xl bg-surface text-[18px] font-extrabold text-teal active:scale-[0.99]"
          >
            <IconMic width={24} height={24} />
            Start recording
          </button>
        </Card>

        <div className="mt-4 rounded-3xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-[17px] font-extrabold text-pine">Today's sessions</p>
            <Dots states={store.sessions.map((s) => s.done)} />
          </div>
          <div className="mt-3 space-y-2">
            {store.sessions.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px]",
                    s.done ? "border-teal bg-teal text-surface" : "border-line text-pine-soft",
                  )}
                >
                  {s.done ? <IconCheck width={18} height={18} /> : <IconMic width={16} height={16} />}
                </span>
                <span
                  className={cn(
                    "flex-1 text-[16px] font-bold",
                    s.done ? "text-pine-soft" : "text-pine",
                  )}
                >
                  {s.label}
                </span>
                {s.done ? (
                  <span className="text-[15px] font-extrabold text-teal">done</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <Note tone="amber" title="Case off before every recording">
            Bare phone on bare skin, microphone side down.
          </Note>
        </div>

        <h2 className="mt-6 text-[15px] font-extrabold uppercase tracking-[0.12em] text-teal">
          Quick logging
        </h2>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {[
            { k: "logMeal" as ScreenKey, label: "Meal", Icon: IconBowl },
            { k: "logSymptom" as ScreenKey, label: "Symptom", Icon: IconWave },
            { k: "logHydration" as ScreenKey, label: "Hydration", Icon: IconDroplet },
            { k: "logToilet" as ScreenKey, label: "Toilet habits", Icon: IconToilet },
          ].map(({ k, label, Icon }) => (
            <button
              key={k}
              onClick={() => store.go(k)}
              className="flex min-h-[92px] flex-col items-start justify-center gap-2 rounded-3xl border border-line bg-surface p-4"
            >
              <span className="text-teal">
                <Icon width={28} height={28} />
              </span>
              <span className="text-[16px] font-extrabold text-pine">{label}</span>
            </button>
          ))}
        </div>

        <div
          className={cn(
            "mt-4 rounded-3xl border border-line p-5",
            eveningReady ? "bg-surface" : "bg-surface/50 opacity-60",
          )}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-teal">
              <IconMoon width={26} height={26} />
            </span>
            <div className="flex-1">
              <p className="text-[17px] font-extrabold text-pine">Before bed</p>
              <p className="text-[15px] font-semibold text-pine-soft">
                {eveningReady ? "Ready now" : "Opens at 8:00 pm"}
              </p>
            </div>
          </div>
        </div>
      </ScreenBody>
    </Screen>
  );
}

/* ---------------- logging hub ---------------- */

const LOG_ITEMS: { k: ScreenKey; label: string; sub: string; Icon: typeof IconBowl }[] = [
  { k: "logMeal", label: "Meals", sub: "Photo or description", Icon: IconBowl },
  { k: "logSymptom", label: "Symptoms", sub: "Type and severity", Icon: IconWave },
  { k: "logSleep", label: "Sleep", sub: "Duration and quality", Icon: IconMoon },
  { k: "logActivity", label: "Activity", sub: "Walks, workouts, rest", Icon: IconRun },
  { k: "logHydration", label: "Hydration", sub: "Water and other drinks", Icon: IconDroplet },
  { k: "logToilet", label: "Toilet habits", sub: "Timing, frequency, consistency", Icon: IconToilet },
];

export function LogHubScreen({ store }: { store: TummyStore }) {
  return (
    <Screen>
      <TopBar title="Logging hub" />
      <ScreenBody>
        <p className="text-[17px] font-semibold leading-relaxed text-pine-soft">
          Log anything, any time — there's no order to follow here.
        </p>
        <div className="mt-4 space-y-3">
          {LOG_ITEMS.map(({ k, label, sub, Icon }) => (
            <button
              key={k}
              onClick={() => store.go(k)}
              className="flex min-h-[84px] w-full items-center gap-4 rounded-3xl border border-line bg-surface px-5 text-left"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-teal">
                <Icon width={28} height={28} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[18px] font-extrabold text-pine">{label}</span>
                <span className="block text-[15px] font-semibold text-pine-soft">{sub}</span>
              </span>
              <span className="shrink-0 text-pine-soft">
                <IconArrowRight width={24} height={24} />
              </span>
            </button>
          ))}
        </div>
      </ScreenBody>
    </Screen>
  );
}

function LogDone({ store, text }: { store: TummyStore; text: string }) {
  return (
    <StickyFooter>
      <Btn onClick={() => store.go("logHub")}>{text}</Btn>
    </StickyFooter>
  );
}

export function LogMealScreen({ store }: { store: TummyStore }) {
  const [photo, setPhoto] = useState(false);
  const [which, setWhich] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <Screen>
      <TopBar title="Log a meal" onBack={store.back} />
      <ScreenBody>
        <button
          onClick={() => setPhoto(true)}
          className={cn(
            "flex h-[170px] w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed",
            photo ? "border-teal bg-mint-soft text-teal" : "border-line bg-surface text-pine-soft",
          )}
        >
          <IconCamera width={44} height={44} />
          <span className="text-[17px] font-extrabold">
            {photo ? "Photo added" : "Add a photo"}
          </span>
        </button>
        <div className="mt-4 space-y-4">
          <Field label="Which meal?">
            <div className="space-y-2">
              {["Breakfast", "Lunch", "Dinner", "Snack"].map((m) => (
                <Choice key={m} label={m} selected={which === m} onClick={() => setWhich(m)} />
              ))}
            </div>
          </Field>
          <Field label="What was in it?" hint="Optional if you added a photo.">
            <TextInput
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Chicken salad and a roll"
            />
          </Field>
        </div>
      </ScreenBody>
      <LogDone store={store} text="Save meal" />
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
        <Btn disabled={!type} onClick={() => store.go("logHub")}>
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
      {done ? <LogDone store={store} text="Done" /> : null}
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
        <Btn disabled={!kind} onClick={() => store.go("logHub")}>
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
      <LogDone store={store} text="Save hydration" />
    </Screen>
  );
}

export function LogToiletScreen({ store }: { store: TummyStore }) {
  const [consistency, setConsistency] = useState(0);
  const [urgency, setUrgency] = useState("");
  return (
    <Screen>
      <TopBar title="Log toilet habits" onBack={store.back} />
      <ScreenBody>
        <Note tone="green" title="Only your subject ID is attached">
          This is routine research data. Nothing here is shared with anyone outside the
          study team.
        </Note>
        <div className="mt-4 space-y-4">
          <Field label="When was it?">
            <input
              type="time"
              defaultValue="08:20"
              className="min-h-[58px] w-full rounded-2xl border-2 border-line bg-surface px-4 text-[17px] font-extrabold text-pine"
            />
          </Field>
          <Field label="How many times today?">
            <div className="flex gap-2">
              {[1, 2, 3, "4+"].map((n) => (
                <button
                  key={String(n)}
                  className="min-h-[60px] flex-1 rounded-2xl border-2 border-line bg-surface text-[18px] font-extrabold text-pine focus:border-teal"
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Consistency" hint="1 is hard and lumpy, 7 is entirely liquid.">
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
            <div className="space-y-2">
              {["No", "A little", "A lot"].map((u) => (
                <Choice key={u} label={u} selected={urgency === u} onClick={() => setUrgency(u)} />
              ))}
            </div>
          </Field>
        </div>
      </ScreenBody>
      <LogDone store={store} text="Save entry" />
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
              <div>
                <p className="text-[17px] font-extrabold text-pine">Streak freeze available</p>
                <p className="mt-1 text-[16px] font-semibold leading-snug text-pine-soft">
                  Miss one day and your streak stays intact. Life happens — this is a study,
                  not a competition.
                </p>
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
            <p className="mt-2 text-[16px] font-extrabold text-teal">
              12 of 28 sessions complete
            </p>
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
    { label: "Technical Setup", sub: "iPhone 14 · bottom microphone", Icon: IconPhone, to: "technicalSetup" },
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
            Recordings and logs are stored against your subject ID. Contact your coordinator
            at (650) 555-0134 with any questions.
          </Note>
        </div>

        <div className="mt-4 space-y-3">
          <Btn variant="secondary" onClick={() => store.go("welcome")}>
            Restart the walkthrough
          </Btn>
          <Btn variant="danger">Withdraw from the study</Btn>
        </div>
      </ScreenBody>
    </Screen>
  );
}
