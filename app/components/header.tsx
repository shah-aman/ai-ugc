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
      <div className="flex items-center gap-2 mb-4">
        <GiSpikyExplosion className="h-8 w-8 md:h-10 md:w-10 bg-fuchsia-500 text-white p-1.5 rounded-md" />
        <span className={`${instrumentSerif.className} font-light text-2xl md:text-3xl text-fuchsia-400`}>
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
