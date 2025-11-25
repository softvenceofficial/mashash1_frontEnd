import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import { cva } from "class-variance-authority";

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

const rippleVariants = cva("absolute rounded-full size-5 pointer-events-none", {
  variants: {
    variant: {
      default: "bg-primary",
      primary: "bg-primary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type Ripple = {
  id: number;
  x: number;
  y: number;
};

export function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

export function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex items-center justify-start border-b border-gray-200 bg-transparent",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const createRipple = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newRipple: Ripple = {
        id: Date.now(),
        x,
        y,
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    },
    []
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event);
      if (props.onClick) {
        props.onClick(event);
      }
    },
    [createRipple, props]
  );

  return (
    <TabsPrimitive.Trigger
      ref={triggerRef}
      data-slot="tabs-trigger"
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center px-6 py-3 text-xl font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-primary",
        "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:transition-opacity after:opacity-0 data-[state=active]:after:opacity-100 w-full cursor-pointer",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {props.children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 30, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(rippleVariants({ variant: "primary" }))}
          style={{
            top: ripple.y - 10,
            left: ripple.x - 10,
          }}
        />
      ))}
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("mt-4 outline-none", className)}
      {...props}
    />
  );
}
