import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IconChat, IconX, IconSend, IconCheck } from "./icons";
import { Mascot, MASCOT } from "./ui";
import type { TummyStore } from "./store";

type Msg = {
  id: string;
  from: "tummy" | "me";
  text: string;
  action?: { label: string; run: () => void };
  done?: boolean;
};

const CHIPS = [
  "Log a meal",
  "Add a glass of water",
  "Log a symptom",
  "Start a recording",
  "What's next?",
  "Toilet habits",
];

let seq = 0;
const uid = () => `m${++seq}`;

function reply(store: TummyStore, raw: string): Msg[] {
  const t = raw.toLowerCase();
  const say = (text: string, action?: Msg["action"]): Msg[] => [
    { id: uid(), from: "tummy", text, action },
  ];

  if (/water|drink|hydrat|glass/.test(t)) {
    store.addEntry("hydration", "Water", "1 glass");
    return say("Added one glass of water to today's log. That's it — nothing else needed.", {
      label: "Open hydration log",
      run: () => {
        store.setChatOpen(false);
        store.go("logHydration");
      },
    });
  }
  if (/meal|breakfast|lunch|dinner|snack|ate|eat/.test(t)) {
    return say("Let's log that meal. A photo is ideal, but a short description works too.", {
      label: "Log the meal",
      run: () => {
        store.setChatOpen(false);
        store.go("logMeal");
      },
    });
  }
  if (/record|gut sound|session|mic/.test(t)) {
    return say(
      "Your next gut sound recording is Breakfast + 90 min. Take the case off and sit somewhere quiet first.",
      {
        label: "Start recording",
        run: () => {
          store.setChatOpen(false);
          store.go("sessionHub");
        },
      },
    );
  }
  if (/toilet|bowel|stool|poo/.test(t)) {
    return say("Noted. I'll open the toilet habits log — it's four quick taps.", {
      label: "Log toilet habits",
      run: () => {
        store.setChatOpen(false);
        store.go("logToilet");
      },
    });
  }
  if (/symptom|pain|bloat|cramp|nausea|gas|gurgl/.test(t)) {
    return say("Sorry to hear that. Tell me which one and how strong it feels.", {
      label: "Log a symptom",
      run: () => {
        store.setChatOpen(false);
        store.go("logSymptom");
      },
    });
  }
  if (/sleep|slept|bed/.test(t)) {
    return say("I can log last night's sleep in three taps.", {
      label: "Log sleep",
      run: () => {
        store.setChatOpen(false);
        store.go("logSleep");
      },
    });
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
      "Case off, bare phone on bare skin, about 9 cm from your belly button — right side first, then left.",
    );
  }
  return say(
    "I can log meals, drinks, symptoms, sleep and toilet habits, or start a gut sound recording. Just tell me what happened.",
  );
}

export function AssistantSheet({ store }: { store: TummyStore }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: uid(),
      from: "tummy",
      text: "Hi — I'm Tummy. Tell me what you ate, drank or felt and I'll log it for you.",
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
