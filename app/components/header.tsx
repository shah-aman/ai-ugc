"use client";

import { useTheme } from "next-themes";
import { GiSpikyExplosion } from "react-icons/gi";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Instrument_Serif } from 'next/font/google';

const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ['latin'] });

export function Header() {
  const theme = useTheme();
  const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6 text-4xl md:text-5xl lg:text-7xl text-balance font-semibold leading-tight tracking-tight mb-4">
        <div className="flex items-center gap-2 px-0 pt-3 pb-1 transition-all duration-300 ease-in-out group-data-[state=collapsed]:px-0">
          <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 ease-in-out">
            <GiSpikyExplosion className="h-10 w-10 bg-fuchsia-500 text-white p-1.5 rounded-md transition-all duration-300 ease-in-out" />
          </div>
          <span
            className={`${instrumentSerif.className} font-light mb-1 text-4xl text-fuchsia-400 opacity-100 transition-all duration-300 ease-in-out group-data-[state=collapsed]:hidden tracking-[0.015em]`}
          >
            supernova
          </span>
        </div>
      <h1 className="flex flex-col items-center">
        <div className="flex items-baseline gap-3 md:gap-4">
          <span>Make</span>
          <LineShadowText
            className="italic font-medium"
            shadowColor={shadowColor}
          >
            marketing
          </LineShadowText>
        </div>
        <div className="flex items-baseline gap-3 md:gap-4">
          <span>go</span>
          <AuroraText className="font-medium">supernova</AuroraText>
        </div>
      </h1>
    </div>
  );
}
