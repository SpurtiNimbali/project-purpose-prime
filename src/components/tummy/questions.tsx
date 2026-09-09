import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Screen,
  ScreenBody,
  TopBar,
  Btn,
  Note,
  Choice,
  Mascot,
  StickyFooter,
  TextInput,
  MASCOT,
} from "./ui";
import { IconMic } from "./icons";
import bristolScale from "@/assets/bristol-scale.jpg";
import type { TummyStore } from "./store";


export type FlowQ = {
  id: string;
  q: string;
  type: "single" | "text" | "scale" | "time" | "duration" | "bristol";
  options?: string[];
  /** default value for time questions */
  def?: string;
  /** answers that open a free-text follow-up */
  textIf?: string[];
  followUp?: string;
  /** answers that open a Bristol-type follow-up */
  bristolIf?: string[];
  optional?: boolean;
  hint?: string;
  /** answers that trigger a warning message */
  warnIf?: string[];
  warn?: string;
  /** skip this question unless a previous answer matches */
  skipUnless?: { id: string; values: string[] };
};

function shouldSkip(q: FlowQ, answers: Record<string, string>) {
  return !!q.skipUnless && !q.skipUnless.values.includes(answers[q.skipUnless.id] ?? "");
}

type Turn = { from: "bot" | "you"; text: string; warn?: boolean };

const VS_USUAL = ["Better than usual", "Same as usual", "Worse than usual"];

const WATCH_QS: FlowQ[] = [
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
    q: "How much battery does it have?",
    type: "single",
    options: ["Above 50%", "20 to 50%", "Below 20%", "Not sure"],
    skipUnless: { id: "watchWearing", values: ["Yes"] },
  },
];

export const MORNING_QS: FlowQ[] = [
  { id: "bedTime", q: "What time did you get into bed last night?", type: "time", def: "23:00" },
  {
    id: "intake",
    q: "Have you had anything to eat or drink yet this morning?",
    type: "single",
    options: ["Nothing at all", "A few sips of water", "Yes, something else"],
    textIf: ["Yes, something else"],
    followUp: "What was it, and roughly when?",
    warnIf: ["Yes, something else"],
    warn: "The morning recording is meant to be fasted. I'll note what you had so the team can interpret it.",
  },
  { id: "wakeTime", q: "What time did you wake up?", type: "time", def: "07:00" },
  {
    id: "bathroom",
    q: "Have you been to the toilet since waking?",
    type: "single",
    options: ["No", "Yes, but no bowel movement", "Yes, a bowel movement"],
    bristolIf: ["Yes, a bowel movement"],
  },
  {
    id: "latency",
    q: "How long did it take you to fall asleep?",
    type: "duration",
    hint: "A rough guess is fine.",
  },
  {
    id: "activity",
    q: "Any physical activity since waking, other than going to the toilet?",
    type: "single",
    options: ["No", "Yes"],
    textIf: ["Yes"],
    followUp: "What did you do?",
  },
  { id: "outOfBed", q: "What time did you get out of bed?", type: "time", def: "07:15" },
];

export const EVENING_QS: FlowQ[] = [
  {
    id: "intakeLogged",
    q: "Did you log everything you ate and drank today?",
    type: "single",
    options: ["Yes, all of it", "No, some is missing"],
    textIf: ["No, some is missing"],
    followUp: "What's missing, and roughly when?",
  },
  {
    id: "physical",
    q: "How do you feel physically, compared with a usual evening?",
    type: "single",
    options: VS_USUAL,
  },
  {
    id: "missed",
    q: "Did you miss any recordings today?",
    type: "single",
    options: ["No, I did them all", "Yes, one or more"],
    textIf: ["Yes, one or more"],
    followUp: "Which ones, and what got in the way?",
  },
  {
    id: "giScore",
    q: "Overall, how bad were your gut symptoms today?",
    type: "scale",
  },
  {
    id: "giWords",
    q: "In a few words, what were they like?",
    type: "text",
    optional: true,
    hint: "For example: bloating was very bad, nothing else. Skip this if you had none.",
  },
  {
    id: "emotional",
    q: "How do you feel emotionally, compared with a usual evening?",
    type: "single",
    options: VS_USUAL,
  },
  {
    id: "unusual",
    q: "Was today unusual in any way? An exam, a stressful event, an argument?",
    type: "text",
    optional: true,
    hint: "Only the study team sees this.",
  },
  {
    id: "difficulty",
    q: "Was anything else about today hard to manage?",
    type: "single",
    options: ["No, it went fine", "Yes"],
    textIf: ["Yes"],
    followUp: "What made it hard?",
  },
  { id: "anythingElse", q: "Anything else you'd like to tell us?", type: "text", optional: true },
  ...WATCH_QS,
];

function QuestionFlow({
  store,
  title,
  intro,
  questions,
  onFinish,
  finishLabel,
}: {
  store: TummyStore;
  title: string;
  intro: string;
  questions: FlowQ[];
  onFinish: (answers: Record<string, string>) => void;
  finishLabel: string;
}) {
  const [step, setStep] = useState(0);
  const [turns, setTurns] = useState<Turn[]>([
    { from: "bot", text: intro },
    { from: "bot", text: questions[0].q },
  ]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [needNote, setNeedNote] = useState(false);
  const [needBristol, setNeedBristol] = useState(false);
  const [showScale, setShowScale] = useState(false);

  const [time, setTime] = useState(questions[0].def ?? "07:00");
  const [durH, setDurH] = useState(0);
  const [durM, setDurM] = useState(15);
  const done = step >= questions.length;
  const current = questions[Math.min(step, questions.length - 1)];

  const nextAskable = (from: number, given: Record<string, string>) => {
    let n = from;
    while (n < questions.length && shouldSkip(questions[n], given)) n += 1;
    return n;
  };

  const advance = (from: Turn[], n: number) => {
    setStep(n);
    if (questions[n]?.def) setTime(questions[n].def as string);
    setTurns(
      n < questions.length
        ? [...from, { from: "bot", text: questions[n].q }]
        : [...from, { from: "bot", text: "That's everything. Thank you." }],
    );
  };

  const record = (value: string) => {
    const given = { ...answers, [current.id]: value };
    setAnswers(given);
    const next: Turn[] = [...turns, { from: "you", text: value }];
    if (current.warnIf?.includes(value) && current.warn) {
      next.push({ from: "bot", text: current.warn, warn: true });
    }
    if (current.bristolIf?.includes(value)) {
      setNeedBristol(true);
      setTurns([...next, { from: "bot", text: "Which Bristol type was it, 1 to 7?" }]);
      return;
    }
    if (current.textIf?.includes(value)) {
      setNeedNote(true);
      setTurns([...next, { from: "bot", text: current.followUp ?? "Tell me a little more." }]);
      return;
    }
    advance(next, nextAskable(step + 1, given));
  };

  const submitNote = (skipped?: boolean) => {
    const text = skipped ? "Nothing to add" : note || "A voice note";
    const given = { ...answers, [`${current.id}Note`]: text };
    setNeedNote(false);
    setAnswers(given);
    advance([...turns, { from: "you", text }], nextAskable(step + 1, given));
    setNote("");
  };

  const lowBattery = answers["watchBattery"] === "Below 20%";

  return (
    <Screen>
      <TopBar
        title={title}
        onBack={store.back}
        step={`${Math.min(step + 1, questions.length)} of ${questions.length}`}
      />
      <ScreenBody>
        <div className="space-y-3">
          {turns.map((t, i) =>
            t.from === "bot" ? (
              <div key={i} className="flex items-start gap-2">
                <Mascot size={44} src={MASCOT.calm} />
                <p
                  className={cn(
                    "max-w-[78%] rounded-3xl rounded-tl-md border px-4 py-3 text-[16px] font-semibold leading-snug",
                    t.warn
                      ? "border-amber bg-amber/20 text-pine"
                      : "border-line bg-surface text-pine",
                  )}
                >
                  {t.text}
                </p>
              </div>
            ) : (
              <p
                key={i}
                className="ml-auto max-w-[78%] rounded-3xl rounded-br-md bg-teal px-4 py-3 text-[16px] font-bold text-surface"
              >
                {t.text}
              </p>
            ),
          )}
        </div>

        {!done && !needNote && !needBristol ? (
          <div className="mt-4">
            {current.hint ? (
              <p className="mb-2 text-[15px] font-semibold text-pine-soft">{current.hint}</p>
            ) : null}

            {current.type === "single" ? (
              <div className="space-y-2">
                {(current.options ?? []).map((o) => (
                  <Choice key={o} label={o} onClick={() => record(o)} />
                ))}
              </div>
            ) : null}

            {current.type === "time" ? (
              <div className="space-y-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="min-h-[62px] w-full rounded-2xl border-2 border-line bg-surface px-4 text-[18px] font-extrabold text-pine"
                />
                <Btn onClick={() => record(time)}>Save this time</Btn>
              </div>
            ) : null}

            {current.type === "duration" ? (
              <div className="space-y-2">
                <div className="flex gap-3">
                  {[
                    { label: "Hours", value: durH, set: setDurH, max: 12, st: 1 },
                    { label: "Minutes", value: durM, set: setDurM, max: 55, st: 5 },
                  ].map(({ label, value, set, max, st }) => (
                    <label key={label} className="flex-1">
                      <span className="mb-1 block text-[15px] font-extrabold text-pine-soft">
                        {label}
                      </span>
                      <select
                        value={value}
                        onChange={(e) => set(Number(e.target.value))}
                        className="min-h-[62px] w-full rounded-2xl border-2 border-line bg-surface px-4 text-[18px] font-extrabold text-pine"
                      >
                        {Array.from({ length: Math.floor(max / st) + 1 }, (_, i) => i * st).map(
                          (n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ),
                        )}
                      </select>
                    </label>
                  ))}
                </div>
                <Btn
                  onClick={() =>
                    record(
                      durH === 0 && durM === 0
                        ? "Straight away"
                        : `${durH ? `${durH} hr ` : ""}${durM ? `${durM} min` : ""}`.trim(),
                    )
                  }
                >
                  Save
                </Btn>
              </div>
            ) : null}

            {current.type === "scale" ? (
              <>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => record(String(n))}
                      className="h-[68px] flex-1 rounded-2xl border-2 border-line bg-surface text-[20px] font-extrabold text-pine active:border-teal active:bg-mint-soft"
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[14px] font-bold text-pine-soft">
                  <span>1 = none</span>
                  <span>5 = severe</span>
                </div>
              </>
            ) : null}

            {current.type === "text" ? (
              <div className="space-y-2">
                <TextInput
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Type it, or record it instead"
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
                {current.optional ? (
                  <button
                    onClick={() => submitNote(true)}
                    className="min-h-[48px] w-full text-[16px] font-extrabold text-pine-soft"
                  >
                    Nothing to add
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {!done && needBristol ? (
          <div className="mt-4">
            <button
              onClick={() => setShowScale((v) => !v)}
              className="mb-3 flex min-h-[56px] w-full items-center gap-3 rounded-2xl border-2 border-line bg-surface px-4 text-left"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-teal text-[16px] font-black text-teal">
                i
              </span>
              <span className="min-w-0 flex-1 text-[16px] font-extrabold text-pine">
                {showScale ? "Hide consistency descriptions" : "Check consistency descriptions"}
              </span>
            </button>
            {showScale ? (
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
                  onClick={() => {
                    setNeedBristol(false);
                    setShowScale(false);
                    const given = { ...answers, bristol: String(n) };
                    setAnswers(given);
                    store.addEntry("toilet", "Bowel movement", `Bristol type ${n}`);
                    advance(
                      [...turns, { from: "you", text: `Type ${n}` }],
                      nextAskable(step + 1, given),
                    );
                  }}
                  className="h-[62px] flex-1 rounded-xl border-2 border-line bg-surface text-[17px] font-extrabold text-pine"
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[15px] font-semibold text-pine-soft">
              1 is hard separate lumps, 7 is entirely liquid.
            </p>
          </div>
        ) : null}


        {!done && needNote ? (
          <div className="mt-4 space-y-2">
            <TextInput
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Type it, or record it instead"
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
          </div>
        ) : null}

        {lowBattery ? (
          <div className="mt-4">
            <Note tone="amber" title="Please charge your smartwatch now">
              Put it on the charger now, and back on your wrist before you sleep. The overnight
              data matters a great deal to us.
            </Note>
          </div>
        ) : null}
      </ScreenBody>
      {done ? (
        <StickyFooter>
          <Btn onClick={() => onFinish(answers)}>{finishLabel}</Btn>
        </StickyFooter>
      ) : null}
    </Screen>
  );
}

export function MorningQuestionsScreen({ store }: { store: TummyStore }) {
  return (
    <QuestionFlow
      store={store}
      title="Before your first recording"
      intro="A few questions before your fasted recording. Try not to eat, drink, or move around until it's done."
      questions={MORNING_QS}
      finishLabel="Start the fasted recording"
      onFinish={(a) => {
        store.addEntry(
          "sleep",
          "Wake-up questions",
          `In bed ${a.bedTime ?? "-"} · awake ${a.wakeTime ?? "-"}${
            a.latency ? ` · fell asleep in ${a.latency.toLowerCase()}` : ""
          }`,
        );
        if (a.intake === "A few sips of water") {
          store.addEntry("hydration", "A few sips of water", "Before the fasted recording");
        }
        if (a.intake === "Yes, something else") {
          store.addEntry(
            "meal",
            "Food or drink before fasting",
            a.intakeNote ?? "Reported in the morning questions",
          );
        }
        if (a.activity === "Yes") {
          store.addEntry("activity", "Morning activity", a.activityNote ?? "Reported on waking");
        }
        store.markQuestions("morning");

        const fasted = store.plan.find((p) => p.id === "fasted" && !p.done);
        if (fasted) {
          store.startItem(fasted.id);
          store.go("caseReminder");
        } else {
          store.go("home");
        }
      }}
    />
  );
}

export function EveningCheckinScreen({ store }: { store: TummyStore }) {
  return (
    <QuestionFlow
      store={store}
      title="Evening check-in"
      intro="Last thing for today. Honest gaps are more useful to the study than tidy guesses."
      questions={EVENING_QS}
      finishLabel="Finish the day"
      onFinish={(a) => {
        store.addEntry(
          "symptom",
          "Evening check-in",
          `GI symptoms ${a.giScore ?? "-"} of 5${a.giWords ? ` · ${a.giWords}` : ""}${
            a.giWordsNote ? ` · ${a.giWordsNote}` : ""
          }`,
        );
        if (a.intakeLogged === "No, some is missing" && a.intakeLoggedNote) {
          store.addEntry("meal", "Added at the evening check-in", a.intakeLoggedNote);
        }
        if (a.missed === "Yes" && a.missedNote) {
          store.addEntry("recording", "Missed sessions reported", a.missedNote);
        }
        if (a.unusualNote && a.unusualNote !== "Nothing to add") {
          store.addEntry("activity", "Something unusual today", a.unusualNote);
        }
        store.markQuestions("night");

        store.go(store.gender === "female" ? "periodCheck" : "home");
      }}
    />
  );
}
