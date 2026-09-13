import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full border border-beige-dark rounded-xl px-4 py-3 text-sm bg-white outline-none transition-all placeholder:text-slate/40 resize-none focus:border-lavender focus:ring-2 focus:ring-lavender/20 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
