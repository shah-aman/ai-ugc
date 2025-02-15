"use client";

import { Button } from "@/components/ui/button";
import { defineStepper } from "@/components/ui/stepper";
import { ProductView } from "./components/product-view";
import { FinalVideoView } from "./components/final-video-view";
import { IntermediateVideoView } from "./components/intermediate-video-view";
import { StoryboardView } from "./components/storyboard-view";
import { ProductContextProvider } from "./contexts/product-context";
import { cn } from "@/lib/utils";
import { Instrument_Serif } from 'next/font/google';
import { MarketStrategyView } from "./components/market-strategy-view";
import { InfluencersView } from "./components/influencers-view";
import { ConsolidatedResearch } from "@/app/api/research/product/types";
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ['latin'] });

const researchData: ConsolidatedResearch = {
  "summary": {
    "productSummary": {
      "overview": "Comprehensive analysis of Meta Quest 3 VR headset with 128GB storage. Features Qualcomm Snapdragon XR2 Gen 2 processor, 2064x2208 pixels per eye resolution, new pancake lenses, and full-color mixed reality passthrough. Includes redesigned Touch Plus controllers with TruTouch haptics. 40% slimmer profile than Quest 2, with enhanced graphics performance and 8GB RAM. Supports both virtual reality and mixed reality experiences through its high-resolution color cameras. Released in October 2023 at $499.99.",
      "keyInsights": [],
      "marketOpportunity": "Estimated tens of millions of potential users globally",
      "competitivePosition": "High-resolution color passthrough. Enhanced graphics performance with Snapdragon XR2 Gen 2. Slimmer design for comfort. Affordable price point",
      "valueProposition": "Supports both virtual reality (VR) and mixed reality (MR) experiences. High-resolution display for immersive experiences. Redesigned Touch Plus controllers with enhanced haptics. Enhanced audio capabilities with spatial sound support"
    },
    "detailedAnalysis": {
      "features": {
        "features": [
          {
            "name": "Core Functionality",
            "description": "Supports both virtual reality (VR) and mixed reality (MR) experiences",
            "technicalDetails": [
              "Qualcomm Snapdragon XR2 Gen 2 processor",
              "Full-color mixed reality passthrough"
            ]
          },
          {
            "name": "Display and Resolution",
            "description": "High-resolution display for immersive experiences",
            "technicalDetails": [
              "2064x2208 pixels per eye",
              "Pancake lenses for improved display quality"
            ]
          },
          {
            "name": "Controllers",
            "description": "Redesigned Touch Plus controllers with enhanced haptics",
            "technicalDetails": [
              "TruTouch haptics",
              "Improved ergonomics"
            ]
          },
          {
            "name": "Audio and Sound",
            "description": "Enhanced audio capabilities with spatial sound support",
            "technicalDetails": [
              "3D spatial audio",
              "40% louder than Quest 2"
            ]
          }
        ],
        "specifications": {
          "Processor": "Qualcomm Snapdragon XR2 Gen 2",
          "Resolution per Eye": "2064x2208 pixels",
          "Storage": "128GB",
          "RAM": "8GB",
          "Refresh Rate": "90Hz, 120Hz (pending update)",
          "Battery Life": "2-3 hours",
          "Weight": "515 grams",
          "Price": "$499"
        },
        "innovations": [
          "Full-color mixed reality passthrough",
          "Pancake lenses for a slimmer profile",
          "Enhanced graphics performance with Snapdragon XR2 Gen 2",
          "Redesigned Touch Plus controllers with TruTouch haptics"
        ],
        "buildQuality": {
          "materials": [
            "Plastic",
            "Adjustable headband"
          ],
          "durability": "Robust construction with a 1-year limited warranty"
        }
      },
      "market": {
        "primaryMarket": {
          "demographics": [
            "Young adults",
            "Gamers",
            "Tech-savvy individuals"
          ],
          "psychographics": [
            "Curiosity about new technology",
            "Interest in immersive experiences",
            "Desire for entertainment and social interaction"
          ],
          "marketSize": "Estimated tens of millions of potential users globally"
        },
        "secondaryMarkets": [
          {
            "segment": "Education and Training",
            "opportunity": "Utilizing VR for interactive learning experiences and professional development"
          },
          {
            "segment": "Healthcare and Therapy",
            "opportunity": "Employing VR for therapy, treatment, and patient education"
          },
          {
            "segment": "Enterprise and Business",
            "opportunity": "Enhancing collaboration, training, and customer engagement"
          }
        ],
        "userPersonas": [
          {
            "type": "Gaming Enthusiast",
            "description": "Individuals who frequently play video games and seek immersive experiences",
            "needs": [
              "High-quality graphics",
              "Interactive gameplay",
              "Social features"
            ]
          },
          {
            "type": "Tech Explorer",
            "description": "Early adopters interested in exploring new technologies and experiences",
            "needs": [
              "Innovative features",
              "Ease of use",
              "Affordability"
            ]
          },
          {
            "type": "Educational User",
            "description": "Students and educators looking for interactive learning tools",
            "needs": [
              "Engaging educational content",
              "Ease of integration into curriculum",
              "Cost-effectiveness"
            ]
          }
        ],
        "useCases": [
          {
            "scenario": "Gaming and Entertainment",
            "benefits": [
              "Immersive gaming experiences",
              "Access to a wide range of VR content",
              "Social interaction with friends"
            ]
          },
          {
            "scenario": "Mixed Reality Experiences",
            "benefits": [
              "Blending virtual and real-world environments",
              "Enhanced interaction with surroundings",
              "Increased sense of presence"
            ]
          },
          {
            "scenario": "Educational and Training",
            "benefits": [
              "Interactive learning",
              "Improved retention rates",
              "Cost-effective compared to traditional methods"
            ]
          }
        ]
      },
      "competition": {
        "directCompetitors": [
          {
            "name": "Meta Quest 3S",
            "strengths": [
              "Lower price point",
              "Similar features to Quest 3",
              "Targeted at budget-conscious consumers"
            ],
            "weaknesses": [
              "Lower resolution compared to Quest 3",
              "Limited storage options"
            ],
            "pricePoint": "$299"
          },
          {
            "name": "Meta Quest Pro",
            "strengths": [
              "Advanced eye-tracking technology",
              "Higher resolution displays",
              "Enterprise-focused features"
            ],
            "weaknesses": [
              "Higher price point",
              "Limited consumer appeal"
            ],
            "pricePoint": "$1,000"
          },
          {
            "name": "HTC Vive Pro 2",
            "strengths": [
              "High-end PC VR capabilities",
              "Advanced tracking system",
              "High-resolution displays"
            ],
            "weaknesses": [
              "Requires a PC for operation",
              "Higher cost including PC requirements"
            ],
            "pricePoint": "$1,399 (headset only)"
          }
        ],
        "indirectCompetitors": [
          {
            "name": "Apple Vision Pro",
            "threatLevel": "High",
            "differentiators": [
              "Advanced AR capabilities",
              "Integration with Apple ecosystem",
              "High-end design"
            ]
          },
          {
            "name": "PlayStation VR2",
            "threatLevel": "Medium",
            "differentiators": [
              "Exclusive games for PlayStation",
              "Advanced haptic feedback",
              "Console-based VR experience"
            ]
          }
        ],
        "marketPosition": {
          "uniqueAdvantages": [
            "High-resolution color passthrough",
            "Enhanced graphics performance with Snapdragon XR2 Gen 2",
            "Slimmer design for comfort",
            "Affordable price point"
          ],
          "challenges": [
            "Short battery life",
            "Limited hand tracking capabilities",
            "Dependence on Meta's ecosystem"
          ],
          "opportunities": [
            "Growing demand for VR and MR experiences",
            "Expanding app and game library",
            "Potential partnerships with other tech companies"
          ]
        }
      },
      "painPoints": {
        "painPoints": [
          {
            "problem": "Bulky Design and Comfort",
            "solution": "The Meta Quest 3 features a 40% slimmer profile than its predecessor, enhancing comfort and ergonomics.",
            "effectiveness": "Highly effective in improving user comfort during extended VR sessions.",
            "userFeedback": "Users appreciate the slimmer design, finding it more comfortable to wear."
          },
          {
            "problem": "Limited Graphics Performance",
            "solution": "The Quest 3 includes a next-gen Qualcomm Snapdragon XR2 Gen 2 processor, doubling graphics performance.",
            "effectiveness": "Significantly enhances the VR experience with improved graphics.",
            "userFeedback": "Customers report a noticeable improvement in graphics quality and performance."
          },
          {
            "problem": "Insufficient Storage Options",
            "solution": "Offers both 128GB and 512GB storage options to accommodate different user needs.",
            "effectiveness": "Meets the storage requirements of most users, though some may still find the base model limiting.",
            "userFeedback": "Users appreciate the flexibility in storage options, though some prefer larger capacities."
          },
          {
            "problem": "Limited Mixed Reality Capabilities",
            "solution": "Features high-fidelity color passthrough for enhanced mixed reality experiences.",
            "effectiveness": "Effectively supports mixed reality applications with improved color accuracy.",
            "userFeedback": "Users enjoy the immersive mixed reality experiences, though some find hand tracking could be improved."
          },
          {
            "problem": "Short Battery Life",
            "solution": "The Quest 3 offers a battery life of 2-3 hours, similar to its predecessors.",
            "effectiveness": "Somewhat effective, as users still report needing frequent recharges.",
            "userFeedback": "Customers find the battery life insufficient for extended gaming sessions."
          }
        ],
        "satisfactionMetrics": {
          "overallRating": "4.5/5",
          "keyMetrics": {
            "Design and Comfort": "4.8/5",
            "Graphics Performance": "4.7/5",
            "Mixed Reality Experience": "4.5/5",
            "Battery Life": "3.5/5"
          }
        },
        "improvementAreas": [
          {
            "area": "Battery Life",
            "suggestion": "Enhance battery life to support longer VR sessions without recharging."
          },
          {
            "area": "Hand Tracking",
            "suggestion": "Improve hand tracking capabilities for more intuitive interactions."
          },
          {
            "area": "Storage Options",
            "suggestion": "Consider offering larger storage options or expandable storage solutions."
          }
        ]
      }
    },
    "recommendations": {
      "marketingAngles": [
        "Full-color mixed reality passthrough",
        "Pancake lenses for a slimmer profile",
        "Enhanced graphics performance with Snapdragon XR2 Gen 2",
        "Redesigned Touch Plus controllers with TruTouch haptics",
        "High-resolution color passthrough",
        "Enhanced graphics performance with Snapdragon XR2 Gen 2",
        "Slimmer design for comfort",
        "Affordable price point"
      ],
      "targetAudience": [
        "Gaming Enthusiast",
        "Tech Explorer",
        "Educational User"
      ],
      "contentStrategy": {
        "keyMessages": [
          "Core Functionality",
          "Display and Resolution",
          "Controllers",
          "Audio and Sound",
          "The Meta Quest 3 features a 40% slimmer profile than its predecessor, enhancing comfort and ergonomics.",
          "The Quest 3 includes a next-gen Qualcomm Snapdragon XR2 Gen 2 processor, doubling graphics performance.",
          "Offers both 128GB and 512GB storage options to accommodate different user needs.",
          "Features high-fidelity color passthrough for enhanced mixed reality experiences.",
          "The Quest 3 offers a battery life of 2-3 hours, similar to its predecessors."
        ],
        "suggestedTopics": [
          "Gaming and Entertainment",
          "Mixed Reality Experiences",
          "Educational and Training"
        ]
      }
    },
    "citations": [
      "https://vrcover.com/meta-quest-3-release-date-price-specs-and-more/",
      "https://www.shi.com/product/46795637/Meta-Quest-3-Virtual-reality-system",
      "https://www.tomsguide.com/reviews/meta-quest-3",
      "https://en.wikipedia.org/wiki/Reality_Labs",
      "https://www.meta.com/quest/quest-3/",
      "https://www.thedoodlepeople.com/post/apple-vision-pro-vs-meta-quest-3-elevating-audience-interaction-in-mixed-reality-a-comparative-in",
      "https://investitin.com/meta-quest-3-is-a-step-closer-to-mainstream-ar-vr/",
      "https://www.statista.com/statistics/1302175/metaverse-business-target-audience-persona-global/",
      "https://www.kiwidesign.com/blogs/news-1/oculus-quest-3-specs-features-and-more"
    ]
  },
  "citations": [
    "https://vrcover.com/meta-quest-3-release-date-price-specs-and-more/",
    "https://www.shi.com/product/46795637/Meta-Quest-3-Virtual-reality-system",
    "https://www.tomsguide.com/reviews/meta-quest-3",
    "https://en.wikipedia.org/wiki/Reality_Labs",
    "https://www.meta.com/quest/quest-3/",
    "https://www.thedoodlepeople.com/post/apple-vision-pro-vs-meta-quest-3-elevating-audience-interaction-in-mixed-reality-a-comparative-in",
    "https://investitin.com/meta-quest-3-is-a-step-closer-to-mainstream-ar-vr/",
    "https://www.statista.com/statistics/1302175/metaverse-business-target-audience-persona-global/",
    "https://www.kiwidesign.com/blogs/news-1/oculus-quest-3-specs-features-and-more"
  ]
}

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

export default function StepperDemo() {
  return (
    <ProductContextProvider>
      <StepperProvider
        className="space-y-6 w-full"
        variant="horizontal"
        style={{
          "--step-circle-size": "1.0rem",
          "--step-circle-font-size": "0.75rem"
        } as React.CSSProperties}
      >
        {({ methods }) => (
          <div className="flex flex-col gap-6 p-6 w-full">
            <StepperNavigation
              className="w-full items-center justify-between gap-1 bg-background/30 py-2 px-3 rounded-lg border border-sidebar-border shadow-sm"
            >
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
                      "flex items-center justify-center"
                    )}
                  >
                    <StepperTitle className={cn(
                      instrumentSerif.className,
                      "text-md font-medium truncate"
                    )}>
                      {step.title}
                    </StepperTitle>
                  </StepperStep>
                ))}
              </div>

              <div className="flex gap-1 flex-shrink-0 border-l border-sidebar-border pl-2">
                {!methods.isFirst && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={methods.prev}
                    className={cn(
                      "h-7 px-3 text-xs border-sidebar-border",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
                    )}
                  >
                    Previous
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={methods.isLast ? methods.reset : methods.next}
                  className="h-7 px-3 text-xs bg-fuchsia-500 text-white hover:bg-fuchsia-600 focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
                >
                  {methods.isLast ? "Start Over" : "Next"}
                </Button>
              </div>
            </StepperNavigation>

            <StepperPanel className={cn(
              "min-h-[400px] rounded-lg border border-sidebar-border bg-background/30 p-6",
              "shadow-sm transition-all duration-200"
            )}>
              {methods.switch({
                product: () => <ProductView />,
                "market-strategy": () => <MarketStrategyView researchData={researchData} />,
                influencers: () => <InfluencersView />,
                storyboard: () => <StoryboardView />,
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
