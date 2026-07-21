import { Briefcase } from "lucide-react";

type LogoProps = {
  size?: "sm" | "md";
};

const sizeClasses = {
  sm: { box: "w-8 h-8", icon: "h-4 w-4", text: "text-lg" },
  md: { box: "w-9 h-9", icon: "h-4 w-4", text: "text-lg" },
};

export function Logo({ size = "sm" }: LogoProps) {
  const classes = sizeClasses[size];

  return (
    <div className="flex items-center gap-2">
      <div className={`${classes.box} rounded-lg bg-ink flex items-center justify-center`}>
        <Briefcase className={`${classes.icon} text-base`} strokeWidth={2} />
      </div>
      <span className={`font-display font-semibold ${classes.text} text-ink`}>JobFinder</span>
    </div>
  );
}