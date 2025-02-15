import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface DescriptionListProps
  extends React.HTMLAttributes<HTMLDListElement> {
  asChild?: boolean;
}

export interface DescriptionTermProps
  extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export interface DescriptionDetailsProps
  extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

const DescriptionList = React.forwardRef<
  HTMLDListElement,
  DescriptionListProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "dl";
  return (
    <Comp
      className={cn("w-full text-sm sm:text-sm", className)}
      ref={ref}
      {...props}
    />
  );
});
DescriptionList.displayName = "DescriptionList";

const DescriptionTerm = React.forwardRef<HTMLElement, DescriptionTermProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "dt";
    return (
      <Comp
        className={cn(
          "border-t py-3 text-muted-foreground first:border-none sm:float-left sm:clear-left sm:w-1/3 sm:px-0",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
DescriptionTerm.displayName = "DescriptionTerm";

const DescriptionDetails = React.forwardRef<
  HTMLElement,
  DescriptionDetailsProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "dd";
  return (
    <Comp
      className={cn(
        "pb-3 sm:ml-[33.333333%] sm:border-t sm:pt-3 sm:[&:nth-child(2)]:border-none",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
DescriptionDetails.displayName = "DescriptionDetails";

export { DescriptionList, DescriptionTerm, DescriptionDetails };
