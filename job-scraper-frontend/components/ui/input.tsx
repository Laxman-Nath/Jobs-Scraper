import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-line bg-white px-2.5 py-1 text-base text-ink transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink placeholder:text-muted focus-visible:border-ink focus-visible:ring-3 focus-visible:ring-ink/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-rust aria-invalid:ring-3 aria-invalid:ring-rust/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }