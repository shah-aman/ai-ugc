"use client";

import { Button } from "@/components/ui/button";
import { defineStepper } from "@/components/ui/stepper";
import { ProductView } from "./components/product-view";
import { FinalVideoView } from "./components/final-video";

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

const Content = ({ id }: { id: string }) => {
  return <p className="text-xl font-normal">Content for {id}</p>;
};

export default function StepperDemo() {
  return (
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
              strategy: (step) => <Content id={step.id} />,
              storyboard: (step) => <Content id={step.id} />,
              "raw-video": (step) => <Content id={step.id} />,
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
  );
}
