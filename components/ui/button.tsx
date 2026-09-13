import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none outline-none focus-visible:ring-2 focus-visible:ring-lavender/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-midnight text-ivory hover:bg-midnight-light shadow-sm hover:shadow-md",
        secondary: "bg-lavender-pale text-midnight hover:bg-lavender-light border border-lavender",
        ghost: "text-slate hover:bg-lavender-pale hover:text-midnight",
        destructive: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
        outline: "border border-midnight text-midnight hover:bg-midnight hover:text-ivory",
        gold: "bg-gold text-white hover:bg-gold-light shadow-sm hover:shadow-md",
        link: "text-midnight underline-offset-4 hover:underline rounded-none",
      },
      size: {
        sm: "px-4 py-1.5 text-sm",
        default: "px-6 py-2.5 text-sm",
        lg: "px-8 py-3.5 text-base",
        icon: "size-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
