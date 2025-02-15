"use client";

import { Button } from "@/components/ui/button";
import { defineStepper } from "@/components/ui/stepper";
import { ProductView } from "./components/product-view";
import { FinalVideoView } from "./components/final-video-view";
import { IntermediateVideoView } from "./components/intermediate-video-view";
import { StoryboardView } from "./components/storyboard-view";
import { StrategyView } from "./components/strategy-view";
import { ProductContextProvider } from "./contexts/product-context";

const {
  StepperProvider,
  StepperControls,
  StepperNavigation,
  StepperPanel,
  StepperStep,
  StepperTitle,
} = defineStepper(
  { id: "product", title: "Product" },
  { id: "strategy", title: "Marketing Strategy" },
  { id: "storyboard", title: "Storyboard" },
  { id: "raw-video", title: "Raw Video" },
  { id: "final-video", title: "Final Video" },
);

export default function StepperDemo() {
  return (
    <ProductContextProvider>
      <StepperProvider className="space-y-4" variant="horizontal">
        {({ methods }) => (
          <>
            <StepperNavigation>
              {methods.all.map((step) => (
                <StepperStep
                  key={step.id}
                  of={step.id}
                  onClick={() => methods.goTo(step.id)}
                >
                  <StepperTitle>{step.title}</StepperTitle>
                </StepperStep>
              ))}
            </StepperNavigation>
            <StepperPanel className="h-[200px] content-center rounded border bg-slate-50 p-8">
              {methods.switch({
                product: () => <ProductView />,
                strategy: () => <StrategyView />,
                storyboard: () => <StoryboardView />,
                "raw-video": () => <IntermediateVideoView />,
                "final-video": () => <FinalVideoView />,
              })}
            </StepperPanel>
            <StepperControls>
              {!methods.isLast && (
                <Button
                  variant="secondary"
                  onClick={methods.prev}
                  disabled={methods.isFirst}
                >
                  {" "}
                  Previous{" "}
                </Button>
              )}
              <Button onClick={methods.isLast ? methods.reset : methods.next}>
                {methods.isLast ? "Reset" : "Next"}
              </Button>{" "}
            </StepperControls>{" "}
          </>
        )}
      </StepperProvider>
    </ProductContextProvider>
  );
}
