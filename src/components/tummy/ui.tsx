import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconAlert,
  IconShield,
  IconHome,
  IconBook,
  IconChart,
  IconUser,
} from "./icons";
import type { ScreenKey, TummyStore } from "./store";
import mascotWave from "@/assets/tummy-wave.png";
import mascotCalm from "@/assets/tummy-calm.png";
import mascotCheer from "@/assets/tummy-cheer.png";

export const MASCOT = { wave: mascotWave, calm: mascotCalm, cheer: mascotCheer };

/* ---------------- layout ---------------- */

export function Screen({
  children,
  className,
  dark,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col",
        dark ? "bg-pine text-surface" : "bg-wash text-pine",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ScreenBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex-1 overflow-y-auto px-5 pb-8", className)}>{children}</div>;
}

export function TopBar({
  title,
  onBack,
  right,
  dark,
  step,
}: {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  dark?: boolean;
  step?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-3 px-4 pb-3 pt-14",
        dark ? "text-surface" : "text-pine",
      )}
    >
      {onBack ? (
        <button
          onClick={onBack}
          aria-label="Go back"
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            dark ? "bg-surface/15" : "bg-surface",
          )}
        >
          <IconArrowLeft width={22} height={22} />
        </button>
      ) : (
        <div className="h-11 w-1" />
      )}
      <div className="min-w-0 flex-1">
        {step ? (
          <p className={cn("text-[13px] font-bold", dark ? "text-mint" : "text-teal")}>{step}</p>
        ) : null}
        {title ? (
          <h1 className="truncate text-[19px] font-extrabold leading-tight">{title}</h1>
        ) : null}
      </div>
      {right}
    </div>
  );
}

/* ---------------- controls ---------------- */

export function Btn({
  children,
  onClick,
  variant = "primary",
  className,
  disabled,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "blue";
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
}) {
  const styles: Record<string, string> = {
    primary:
      "bg-teal text-surface shadow-[0_6px_0_0_var(--color-teal-deep)] active:translate-y-[3px] active:shadow-[0_3px_0_0_var(--color-teal-deep)]",
    blue: "bg-blue text-surface shadow-[0_6px_0_0_#2f6f85] active:translate-y-[3px]",
    secondary: "bg-surface text-pine border-2 border-line",
    ghost: "bg-transparent text-teal",
    danger: "bg-coral-soft text-coral border-2 border-coral",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex min-h-[60px] w-full items-center justify-center gap-2 rounded-2xl px-5 text-[17px] font-extrabold transition-all disabled:opacity-40",
        styles[variant],
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "w-full rounded-3xl border border-line bg-surface p-5 text-left",
        onClick && "active:scale-[0.99] transition-transform",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Note({
  tone = "amber",
  title,
  children,
}: {
  tone?: "amber" | "coral" | "green" | "blue";
  title?: string;
  children: ReactNode;
}) {
  const map = {
    amber: "bg-amber-soft border-amber/40 text-pine",
    coral: "bg-coral-soft border-coral/40 text-pine",
    green: "bg-mint-soft border-mint text-pine",
    blue: "bg-[#e3eff4] border-blue/30 text-pine",
  } as const;
  const iconColor = {
    amber: "text-amber",
    coral: "text-coral",
    green: "text-teal",
    blue: "text-blue",
  } as const;
  return (
    <div className={cn("flex gap-3 rounded-2xl border-2 p-4", map[tone])}>
      <span className={cn("mt-[2px] shrink-0", iconColor[tone])}>
        {tone === "green" ? (
          <IconShield width={22} height={22} />
        ) : (
          <IconAlert width={22} height={22} />
        )}
      </span>
      <div className="min-w-0 text-[16px] font-semibold leading-snug">
        {title ? <p className="font-extrabold">{title}</p> : null}
        <div className={cn(title && "mt-1 font-semibold text-pine-soft")}>{children}</div>
      </div>
    </div>
  );
}

export function Dots({ states }: { states: boolean[] }) {
  return (
    <div className="flex items-center gap-3">
      {states.map((filled, i) => (
        <span
          key={i}
          className={cn(
            "h-[22px] w-[22px] rounded-full border-[3px]",
            filled ? "border-teal bg-teal" : "border-teal/40 bg-transparent",
          )}
        />
      ))}
    </div>
  );
}

export function Choice({
  label,
  sub,
  selected,
  onClick,
  icon,
}: {
  label: string;
  sub?: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex min-h-[64px] w-full items-center gap-3 rounded-2xl border-2 bg-surface px-4 py-3 text-left",
        selected ? "border-teal bg-mint-soft" : "border-line",
      )}
    >
      {icon ? <span className="shrink-0 text-teal">{icon}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-extrabold text-pine">{label}</span>
        {sub ? <span className="block text-[15px] font-semibold text-pine-soft">{sub}</span> : null}
      </span>
      <span
        className={cn(
          "h-6 w-6 shrink-0 rounded-full border-[3px]",
          selected ? "border-teal bg-teal" : "border-line",
        )}
      />
    </button>
  );
}

export function ScaleRow({
  label,
  value,
  onChange,
  max = 5,
  info,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
  info?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 text-[16px] font-extrabold text-pine">{label}</p>
        {info ? (
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={`What does ${label} mean?`}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[15px] font-black",
              open ? "border-teal bg-teal text-surface" : "border-line text-pine-soft",
            )}
          >
            i
          </button>
        ) : null}
      </div>
      {info && open ? (
        <p className="mt-2 rounded-xl bg-mint-soft px-3 py-2 text-[15px] font-semibold leading-snug text-pine">
          {info}
        </p>
      ) : null}
      <div className="mt-3 flex gap-2">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={cn(
              "h-[52px] flex-1 rounded-xl border-2 text-[17px] font-extrabold",
              value === n
                ? "border-teal bg-teal text-surface"
                : "border-line bg-wash text-pine-soft",
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Severity({
  value,
  onChange,
  dark,
}: {
  value: number;
  onChange: (v: number) => void;
  dark?: boolean;
}) {
  const labels = ["Very mild", "Mild", "Moderate", "Strong", "Very strong"];
  return (
    <div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={cn(
              "h-[58px] flex-1 rounded-xl border-2 text-[18px] font-extrabold",
              value === n
                ? "border-teal bg-teal text-surface"
                : dark
                  ? "border-surface/25 bg-surface/10 text-surface"
                  : "border-line bg-wash text-pine-soft",
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <p
        className={cn(
          "mt-2 text-center text-[15px] font-bold",
          dark ? "text-mint" : "text-pine-soft",
        )}
      >
        {labels[value - 1]}
      </p>
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <p className="mb-2 text-[16px] font-extrabold text-pine">{label}</p>
      {hint ? <p className="mb-2 text-[15px] font-semibold text-pine-soft">{hint}</p> : null}
      {children}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "min-h-[58px] w-full rounded-2xl border-2 border-line bg-surface px-4 text-[17px] font-bold text-pine placeholder:font-semibold placeholder:text-pine-soft/60 focus:border-teal focus:outline-none",
        props.className,
      )}
    />
  );
}

export function Mascot({
  src = MASCOT.wave,
  size = 96,
  className,
}: {
  src?: string;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt="Tummy the study mascot"
      width={size}
      height={size}
      loading="lazy"
      className={cn("shrink-0 object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function MascotSays({
  children,
  src = MASCOT.wave,
  size = 84,
}: {
  children: ReactNode;
  src?: string;
  size?: number;
}) {
  return (
    <div className="flex items-start gap-3">
      <Mascot src={src} size={size} />
      <div className="relative mt-2 flex-1 rounded-3xl rounded-tl-md border border-line bg-surface p-4 text-[16px] font-semibold leading-snug text-pine">
        {children}
      </div>
    </div>
  );
}

export function StickyFooter({ children }: { children: ReactNode }) {
  return (
    <div className="shrink-0 border-t border-line bg-wash/95 px-5 pb-7 pt-4 backdrop-blur">
      {children}
    </div>
  );
}

/* ---------------- bottom nav ---------------- */

const NAV: { key: ScreenKey; label: string; Icon: typeof IconHome }[] = [
  { key: "home", label: "Home", Icon: IconHome },
  { key: "logHub", label: "Log", Icon: IconBook },
  { key: "progress", label: "Progress", Icon: IconChart },
  { key: "profile", label: "Profile", Icon: IconUser },
];

export function TabBar({ store }: { store: TummyStore }) {
  return (
    <nav className="shrink-0 border-t border-line bg-surface px-2 pb-6 pt-2">
      <div className="flex">
        {NAV.map(({ key, label, Icon }) => {
          const active = store.screen === key;
          return (
            <button
              key={key}
              onClick={() => store.go(key)}
              className={cn(
                "flex min-h-[58px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl",
                active ? "bg-mint-soft text-teal" : "text-pine-soft",
              )}
            >
              <Icon width={26} height={26} />
              <span className="text-[13px] font-extrabold">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
