"use client";

import { useMemo } from "react";

import { useRouter } from "next/router";
import { useParams } from "next/navigation";

import { ProductGallery } from "./components/product-gallery";
import { ProductInfo } from "./components/product-info";

const productImages = [
  "https://m.media-amazon.com/images/I/61Ht6pj0JiL._AC_SX695_.jpg",
  "https://m.media-amazon.com/images/I/51odl4a-jPL._AC_SX695_.jpg",
  "https://m.media-amazon.com/images/I/61Lf1nNOm1L._AC_SX695_.jpg",
  "https://m.media-amazon.com/images/I/61QpbJRCCXL._AC_SX695_.jpg",
  "https://m.media-amazon.com/images/I/5139oFF5RUL._AC_SX695_.jpg",
];

const productData = {
  name: "New Balance Men's 608 V5 Casual Comfort Cross Trainer",
  description:
    "Leather upper. ABZORB midsole cushioning aids in absorbing forceful impacts. Premium PU comfort insert",
  specs: [
    { label: "Fabric type", value: "100% Leather" },
    { label: "Care instructions", value: "Machine Wash" },
    { label: "Origin", value: "Imported" },
    { label: "Sole material", value: "Rubber" },
  ],
};

import { Button } from "@/components/ui/button";
import { defineStepper } from "@/components/ui/stepper";

const {
  StepperProvider,
  StepperControls,
  StepperNavigation,
  StepperPanel,
  StepperStep,
  StepperTitle,
} = defineStepper(
  { id: "step-1", title: "Step 1" },
  { id: "step-2", title: "Step 2" },
  { id: "step-3", title: "Step 3" },
);

const Content = ({ id }: { id: string }) => {
  return (
    <StepperPanel className="h-[200px] content-center rounded border bg-slate-50 p-8">
      {" "}
      <p className="text-xl font-normal">Content for {id}</p>{" "}
    </StepperPanel>
  );
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
          {methods.switch({
            "step-1": (step) => <Content id={step.id} />,
            "step-2": (step) => <Content id={step.id} />,
            "step-3": (step) => <Content id={step.id} />,
          })}
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

export function ProductPage() {
  // const router = useRouter();
  const params = useParams<{ productUrl: string }>();

  const productUrl = useMemo(
    () => decodeURIComponent(params.productUrl),
    [params],
  );
  console.log(productUrl);

  const handleAddToCart = () => console.log("HELLOOO");

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <ProductGallery images={productImages} />
          </div>
          <div className="w-full md:w-1/2">
            <ProductInfo product={productData} onAddToCart={handleAddToCart} />
          </div>
        </div>
      </div>
    </div>
  );
}
