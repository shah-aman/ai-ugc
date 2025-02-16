"use client";

import { Instrument_Serif } from "next/font/google";

import { defineStepper } from "@/components/ui/stepper";
import { cn } from "@/lib/utils";

import { ProductView } from "./components/product-view";
import { FinalVideoView } from "./components/final-video-view";
import { IntermediateVideoView } from "./components/intermediate-video-view";
import { StoryboardView } from "./components/storyboard-view";
import { ProductContextProvider } from "./contexts/product-context";
import { MarketStrategyView } from "./components/market-strategy-view";
import { InfluencersView } from "./components/influencers-view";

const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

export default function StepperDemo() {
  const {
    StepperProvider,
    StepperNavigation,
    StepperPanel,
    StepperStep,
    StepperTitle,
  } = defineStepper(
    { id: "product", title: "Product" },
    { id: "market-strategy", title: "Market Strategy" },
    { id: "influencers", title: "Influencers" },
    { id: "storyboard", title: "Storyboard" },
    { id: "raw-video", title: "Raw Video" },
    { id: "final-video", title: "Final Video" },
  );

  return (
    <ProductContextProvider>
      <StepperProvider
        className="space-y-6 w-full"
        variant="horizontal"
        style={
          {
            "--step-circle-size": "1.0rem",
            "--step-circle-font-size": "0.75rem",
          } as React.CSSProperties
        }
      >
        {({ methods }) => (
          <div className="flex flex-col gap-6 p-6 w-full">
            <StepperNavigation className="w-full items-center justify-between gap-1 bg-background/30 py-2 px-3 rounded-lg border border-sidebar-border shadow-sm">
              <div className="flex gap-2 min-w-0">
                {methods.all.map((step) => (
                  <StepperStep
                    key={step.id}
                    of={step.id}
                    onClick={() => methods.goTo(step.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-md transition-all duration-200 text-xs min-w-0",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "data-[active=true]:bg-fuchsia-500 data-[active=true]:text-white",
                      "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
                      "flex items-center justify-center",
                    )}
                  >
                    <StepperTitle
                      className={cn(
                        instrumentSerif.className,
                        "text-md font-medium truncate",
                      )}
                    >
                      {step.title}
                    </StepperTitle>
                  </StepperStep>
                ))}
              </div>

              {/* <div className="flex gap-1 flex-shrink-0 border-l border-sidebar-border pl-2"> */}
              {/*   {!methods.isFirst && ( */}
              {/*     <Button */}
              {/*       variant="outline" */}
              {/*       size="sm" */}
              {/*       onClick={methods.prev} */}
              {/*       className={cn( */}
              {/*         "h-7 px-3 text-xs border-sidebar-border", */}
              {/*         "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", */}
              {/*         "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none" */}
              {/*       )} */}
              {/*     > */}
              {/*       Previous */}
              {/*     </Button> */}
              {/*   )} */}
              {/*   <Button */}
              {/*     size="sm" */}
              {/*     onClick={methods.isLast ? methods.reset : methods.next} */}
              {/*     className="h-7 px-3 text-xs bg-fuchsia-500 text-white hover:bg-fuchsia-600 focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none" */}
              {/*   > */}
              {/*     {methods.isLast ? "Start Over" : "Next"} */}
              {/*   </Button> */}
              {/* </div> */}
            </StepperNavigation>

            <StepperPanel
              className={cn(
                "min-h-[400px] rounded-lg border border-sidebar-border bg-background/30 p-6",
                "shadow-sm transition-all duration-200",
              )}
            >
              {methods.switch({
                product: () => <ProductView onNextStep={methods.next} />,
                "market-strategy": () => (
                  <MarketStrategyView onNextStep={() => methods.next()} />
                ),
                influencers: () => (
                  <InfluencersView onNextStep={methods.next} />
                ),
                storyboard: () => <StoryboardView onNextStep={methods.next} />,
                "raw-video": () => <IntermediateVideoView />,
                "final-video": () => <FinalVideoView />,
              })}
            </StepperPanel>
          </div>
        )}
      </StepperProvider>
    </ProductContextProvider>
  );
}
