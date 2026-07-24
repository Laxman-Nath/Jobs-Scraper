type LogoProps = {
  size?: "sm" | "md";
};

const sizeClasses = {
  sm: { box: 32, text: "text-lg" },
  md: { box: 36, text: "text-xl" },
};

export function Logo({ size = "sm" }: LogoProps) {
  const classes = sizeClasses[size];

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={classes.box}
        height={classes.box}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="9" fill="#171412" />
        {/* stylized "J" mark */}
        <path
          d="M19.5 9v9.2c0 3.1-1.9 5.1-5 5.1-2.3 0-4-.9-5-2.6l1.9-1.7c.7 1.1 1.6 1.7 2.9 1.7 1.6 0 2.6-1 2.6-2.6V9h-3.4V6.8h9.4V9h-3.4z"
          fill="#FAF6EF"
        />
        {/* signal dot accent */}
        <circle cx="24" cy="8" r="2.4" fill="#FF5A1F" />
      </svg>
      <span className={`font-display font-semibold ${classes.text} text-ink tracking-tight`}>
        JobFinder
      </span>
    </div>
  );
}