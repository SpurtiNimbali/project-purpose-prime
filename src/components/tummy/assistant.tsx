import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IconChat, IconX, IconSend, IconCheck } from "./icons";
import { Mascot, MASCOT } from "./ui";
import { nowLabel, type TummyStore } from "./store";

type Msg = {
  id: string;
  from: "tummy" | "me";
  text: string;
  action?: { label: string; run: () => void };
  done?: boolean;
};

const CHIPS = [
  "I just had a protein bar",
  "I drank a glass of water",
  "Bloating, quite bad",
  "I went to the toilet",
  "What's next?",
];

let seq = 0;
const uid = () => `m${++seq}`;

const SEV_WORDS: [RegExp, number][] = [
  [/very (bad|strong|severe)|terrible|awful|unbearable/, 5],
  [/(quite|really|pretty) (bad|strong)|severe|strong/, 4],
  [/moderate|medium|so-so|okay-ish/, 3],
  [/mild|a bit|slight|light|little/, 2],
  [/very mild|barely|hardly/, 1],
];
const SEV_LABELS = ["", "very mild", "mild", "moderate", "strong", "very strong"];

function severityFrom(t: string) {
  for (const [re, n] of SEV_WORDS) if (re.test(t)) return n;
  return 3;
}

/** Pull the food description out of "I just had a protein bar" style sentences. */
function foodFrom(raw: string) {
  const m = raw.match(
    /(?:had|ate|eaten|eating|having|just|log(?:ged)?(?: a| my)?)\s+(?:a |an |some |my )?(.+)/i,
  );
  const text = (m ? m[1] : raw).replace(/\bfor (breakfast|lunch|dinner)\b.*/i, "").trim();
  return text.replace(/[.!]+$/, "") || "Meal";
}

function mealSlot(t: string): "Breakfast" | "Lunch" | "Dinner" | "Snack" {
  if (/breakfast/.test(t)) return "Breakfast";
  if (/lunch/.test(t)) return "Lunch";
  if (/dinner|supper/.test(t)) return "Dinner";
  if (/snack|bar|biscuit|cookie|fruit|coffee|tea/.test(t)) return "Snack";
  const h = new Date().getHours();
  return h < 11 ? "Breakfast" : h < 16 ? "Lunch" : "Dinner";
}

const SYMPTOM_WORDS: [RegExp, string, string][] = [
  [/bloat/, "bloat", "Bloating"],
  [/cramp/, "cramp", "Cramp"],
  [/naus|sick/, "nausea", "Nausea"],
  [/gas|wind|belch|burp/, "gas", "Gas"],
  [/gurgl|rumbl|noise/, "gurgle", "Gurgle"],
  [/pain|ache|hurt|sore/, "pain", "Pain"],
];

function reply(store: TummyStore, raw: string): Msg[] {
  const t = raw.toLowerCase();
  const say = (text: string, action?: Msg["action"]): Msg[] => [
    { id: uid(), from: "tummy", text, action },
  ];
  const openLog = (label = "See today's log"): Msg["action"] => ({
    label,
    run: () => {
      store.setChatOpen(false);
      store.go("logHub");
    },
  });

  // hydration, logged automatically
  if (/water|drink|drank|hydrat|glass|sip/.test(t) && !/food|ate|meal/.test(t)) {
    const glasses = Number((t.match(/(\d+)\s*(glass|cup)/) || [])[1] || 1);
    store.addEntry("hydration", "Water", `${glasses} glass${glasses > 1 ? "es" : ""}`);
    return say(
      `Logged, ${glasses} glass${glasses > 1 ? "es" : ""} of water at ${nowLabel()}. Nothing else needed.`,
      openLog(),
    );
  }

  // symptoms, logged automatically with a severity guess
  const sym = SYMPTOM_WORDS.find(([re]) => re.test(t));
  if (sym) {
    const sev = severityFrom(t);
    store.addEntry("symptom", sym[2], `${SEV_LABELS[sev]} · ${nowLabel()}`);
    return say(
      `Logged ${sym[2].toLowerCase()} as ${SEV_LABELS[sev]} at ${nowLabel()}. Tap below if you'd like to change the strength.`,
      {
        label: "Adjust this symptom",
        run: () => {
          store.setChatOpen(false);
          store.go("logSymptom");
        },
      },
    );
  }

  // meals, logged automatically from the description
  if (/meal|breakfast|lunch|dinner|snack|ate|eat|had|bar|toast|coffee|banana/.test(t)) {
    const slot = mealSlot(t);
    const food = foodFrom(raw);
    store.addEntry("meal", slot, food);
    const planItem = store.plan.find(
      (p) => p.kind === "meal" && !p.done && p.label.toLowerCase() === slot.toLowerCase(),
    );
    if (planItem) store.completeItem(planItem.id);
    return say(
      planItem
        ? `Logged ${slot.toLowerCase()}: "${food}" at ${nowLabel()}. Your next three recordings are now timed from this meal.`
        : `Logged as a ${slot.toLowerCase()}: "${food}" at ${nowLabel()}.`,
      openLog(),
    );
  }

  if (/toilet|bowel|stool|poo|bathroom/.test(t)) {
    const type = /loose|diarr|watery/.test(t)
      ? "Loose"
      : /hard|constip/.test(t)
        ? "Hard"
        : "Normal";
    store.addEntry("toilet", "Toilet visit", `${type} · ${nowLabel()}`);
    return say(
      `Logged a toilet visit (${type.toLowerCase()}) at ${nowLabel()}. I'll count it towards today's total.`,
      openLog(),
    );
  }

  if (/sleep|slept|bed|woke/.test(t)) {
    const hrs = (t.match(/(\d+(?:\.\d+)?)\s*(hr|hour)/) || [])[1];
    const quality = /bad|poor|badly|rough|awful/.test(t) ? "slept poorly" : "slept well";
    store.addEntry("sleep", "Sleep", `${hrs ? `${hrs} hrs · ` : ""}${quality}`);
    return say(`Logged last night's sleep${hrs ? `, ${hrs} hours` : ""}, ${quality}.`, openLog());
  }

  if (/record|gut sound|session|mic/.test(t)) {
    return say(
      "I can't record for you. Case off, somewhere quiet, and I'll run the two minutes with you.",
      {
        label: "Start recording",
        run: () => {
          store.setChatOpen(false);
          store.go("caseReminder");
        },
      },
    );
  }

  if (/next|what.*do|todo|left/.test(t)) {
    const task = store.nextTask;
    return say(`${task.title}. ${task.sub}`, {
      label: task.cta,
      run: () => {
        store.setChatOpen(false);
        store.go(task.screen);
      },
    });
  }

  if (/case|position|9 ?cm|belly/.test(t)) {
    return say(
      "Case off, bare skin, 8 cm right and 3 cm down from your belly button. Two minutes.",
    );
  }
  return say(
    "Tell me in plain words: \"I had a protein bar\", \"two glasses of water\", \"bloating, quite bad\". I'll log it straight away.",
  );
}


export function AssistantSheet({ store }: { store: TummyStore }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: uid(),
      from: "tummy",
      text: "Hi, I'm Tummy. Tell me what you ate, drank, or felt and I'll log it.",
    },
  ]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(() => {
    if (store.chatOpen) inputRef.current?.focus();
  }, [store.chatOpen]);

  function send(raw: string) {
    const value = raw.trim();
    if (!value) return;
    setMsgs((m) => [...m, { id: uid(), from: "me", text: value }]);
    setText("");
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      const answer = reply(store, value);
      setMsgs((m) => [...m, ...answer]);
      inputRef.current?.focus();
    }, 600);
  }

  if (!store.chatOpen) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-pine/45 backdrop-blur-[2px]">
      <button
        aria-label="Close assistant"
        className="h-16 w-full shrink-0"
        onClick={() => store.setChatOpen(false)}
      />
      <div className="flex min-h-0 flex-1 flex-col rounded-t-[32px] bg-wash shadow-2xl">
        <div className="flex shrink-0 items-center gap-3 border-b border-line px-5 pb-3 pt-4">
          <Mascot size={44} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[18px] font-extrabold text-pine">Ask Tummy</p>
            <p className="text-[14px] font-bold text-teal">Logs things for you · always on</p>
          </div>
          <button
            onClick={() => store.setChatOpen(false)}
            aria-label="Close"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-pine"
          >
            <IconX width={22} height={22} />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {msgs.map((m) =>
            m.from === "me" ? (
              <p
                key={m.id}
                className="ml-auto w-fit max-w-[84%] rounded-3xl rounded-br-md bg-teal px-4 py-3 text-[16px] font-bold text-surface"
              >
                {m.text}
              </p>
            ) : (
              <div key={m.id} className="max-w-[88%]">
                <p className="w-fit rounded-3xl rounded-tl-md border border-line bg-surface px-4 py-3 text-[16px] font-semibold leading-snug text-pine">
                  {m.text}
                </p>
                {m.action ? (
                  <button
                    onClick={m.action.run}
                    className="mt-2 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-teal px-4 text-[16px] font-extrabold text-surface"
                  >
                    {m.action.label}
                  </button>
                ) : null}
              </div>
            ),
          )}
          {typing ? (
            <div className="flex w-fit gap-1.5 rounded-3xl rounded-tl-md border border-line bg-surface px-4 py-4">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2.5 w-2.5 animate-bounce rounded-full bg-teal"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="shrink-0 border-t border-line bg-surface px-4 pb-6 pt-3">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="shrink-0 rounded-full border-2 border-line bg-wash px-4 py-2 text-[15px] font-extrabold text-pine"
              >
                {c}
              </button>
            ))}
          </div>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(text);
            }}
          >
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="I just had a banana…"
              className="min-h-[56px] flex-1 rounded-2xl border-2 border-line bg-wash px-4 text-[17px] font-bold text-pine placeholder:font-semibold placeholder:text-pine-soft/60 focus:border-teal focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send"
              className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-2xl bg-teal text-surface disabled:opacity-40"
              disabled={!text.trim()}
            >
              <IconSend width={24} height={24} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AssistantButton({ store, dark }: { store: TummyStore; dark?: boolean }) {
  if (store.chatOpen) return null;
  return (
    <button
      onClick={() => store.setChatOpen(true)}
      aria-label="Ask Tummy"
      className={cn(
        "absolute bottom-[104px] right-4 z-30 flex h-[64px] items-center gap-2 rounded-full pl-4 pr-5 shadow-xl active:scale-[0.97]",
        dark ? "bg-mint text-pine" : "bg-teal text-surface",
      )}
    >
      <IconChat width={26} height={26} />
      <span className="text-[16px] font-extrabold">Ask Tummy</span>
    </button>
  );
}

export function AssistantHint({ store }: { store: TummyStore }) {
  return (
    <button
      onClick={() => store.setChatOpen(true)}
      className="flex w-full items-center gap-3 rounded-3xl border-2 border-dashed border-teal/40 bg-mint-soft/60 px-4 py-4 text-left"
    >
      <Mascot src={MASCOT.calm} size={44} />
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-extrabold text-pine">
          Or just tell Tummy what happened
        </span>
        <span className="block text-[15px] font-semibold text-pine-soft">
          "I had a coffee and a slice of toast"
        </span>
      </span>
      <span className="shrink-0 text-teal">
        <IconCheck width={22} height={22} />
      </span>
    </button>
  );
}
