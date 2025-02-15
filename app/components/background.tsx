import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

export function Background() {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-background/50 backdrop-blur-3xl z-[-1]">
      <AnimatedGridPattern
        numSquares={36}
        maxOpacity={0.08}
        duration={4}
        repeatDelay={0.5}
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-20%] h-[160%] skew-y-12 opacity-90",
        )}
      />
    </div>
  );
}
