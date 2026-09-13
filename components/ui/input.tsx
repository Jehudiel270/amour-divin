import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full border border-beige-dark rounded-xl px-4 py-3 text-sm bg-white outline-none transition-all placeholder:text-slate/40 focus:border-lavender focus:ring-2 focus:ring-lavender/20 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export { Input };
