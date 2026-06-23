import { KortexIcon } from "@/components/KortexIcon";

const SIZES = {
  sm: { icon: 28, text: "text-lg" },
  md: { icon: 36, text: "text-2xl" },
  lg: { icon: 44, text: "text-3xl" },
};

export function KortexLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = SIZES[size];

  return (
    <div className="flex items-center gap-2.5">
      <KortexIcon size={s.icon} />
      <span className={`${s.text} font-bold tracking-tight text-text-primary`}>
        Kortex
      </span>
    </div>
  );
}
