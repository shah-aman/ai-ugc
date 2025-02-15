"use client";

import { useTheme } from "next-themes";

import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { AuroraText } from "@/components/magicui/aurora-text";

export function Header() {
  const theme = useTheme();
  const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";
  return (
    <div className="flex flex-col items-center gap-8 text-4xl md:text-5xl lg:text-7xl text-balance font-semibold leading-none tracking-tighter">
      <h1>
        <p>
          Market{" "}
          <LineShadowText className="italic" shadowColor={shadowColor}>
            fast
          </LineShadowText>
        </p>
        <p>
          Market <AuroraText>beautiful</AuroraText>
        </p>
      </h1>
    </div>
  );
}
