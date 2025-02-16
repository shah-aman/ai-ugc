import { Users, Target, Crosshair } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { useProductContext } from "../../contexts/product-context";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SourceIcon } from "./components/source-icon";

export type MarketStrategyViewProps = {
  onNextStep: () => void;
};

export function MarketStrategyView({ onNextStep }: MarketStrategyViewProps) {
  const {
    productResearch: { data },
  } = useProductContext();

  return (
    <div className="space-y-6 w-full">
      {data === undefined ? (
        <Skeleton className="w-full h-[200px]" />
      ) : (
        <>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Card className="bg-background/50 border-sidebar-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
                  <CardTitle className="text-[11px] font-medium text-muted-foreground">
                    Market Size
                  </CardTitle>
                  <Users className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-0 pb-2 px-2">
                  <div className="text-base font-medium">
                    {
                      data.summary.detailedAnalysis.market.primaryMarket
                        .marketSize
                    }
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/50 border-sidebar-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
                  <CardTitle className="text-[11px] font-medium text-muted-foreground">
                    Target Segments
                  </CardTitle>
                  <Target className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-0 pb-2 px-2">
                  <div className="text-base font-medium">
                    {data.summary.detailedAnalysis.market.userPersonas.length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/50 border-sidebar-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
                  <CardTitle className="text-[11px] font-medium text-muted-foreground">
                    Competitors
                  </CardTitle>
                  <Crosshair className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-0 pb-2 px-2">
                  <div className="text-base font-medium">
                    {
                      data.summary.detailedAnalysis.competition
                        .directCompetitors.length
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Satisfaction Metrics */}
            <div className="grid grid-cols-5 gap-2">
              <div className="p-2 bg-muted/50 rounded-lg border flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Overall Rating
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-center">
                    {
                      data.summary.detailedAnalysis.painPoints
                        .satisfactionMetrics.overallRating
                    }
                  </span>
                </div>
              </div>

              {Object.entries(
                data.summary.detailedAnalysis.painPoints.satisfactionMetrics
                  .keyMetrics,
              ).map(([key, value], index) => {
                const colors = {
                  0: {
                    bg: "bg-blue-500",
                    text: "text-blue-500",
                    light: "bg-blue-500/10",
                  },
                  1: {
                    bg: "bg-violet-500",
                    text: "text-violet-500",
                    light: "bg-violet-500/10",
                  },
                  2: {
                    bg: "bg-orange-500",
                    text: "text-orange-500",
                    light: "bg-orange-500/10",
                  },
                };
                const color = colors[index as keyof typeof colors] || colors[0];

                return (
                  <div
                    key={key}
                    className="p-2 bg-muted/50 rounded-lg border flex flex-col"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {key
                          .split(/(?=[A-Z])/)
                          .map(
                            (str) => str.charAt(0).toUpperCase() + str.slice(1),
                          )
                          .join(" ")}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${color.light} ${color.text}`}
                      >
                        {value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Research Sources</h3>
              <span className="text-xs text-muted-foreground">
                {data.citations.length} sources
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.citations.map((citation, i) => {
                const urlMatch = citation.match(/https?:\/\/([^\/]+)/);
                const domain = urlMatch ? urlMatch[1] : "";
                const nameMatch = citation.match(/^(.*?)\s*-\s*http/);
                const name = nameMatch ? nameMatch[1] : domain;

                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 shrink-0 border bg-muted/50 px-3 py-1.5 rounded-sm hover:bg-muted/70 transition-colors"
                  >
                    {/* <div className="relative h-4 w-4 flex-none"> */}
                    {/*   <SourceIcon domain={domain} name={name} /> */}
                    {/* </div> */}
                    <SourceIcon domain={domain} name={name} />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
              <p>
                All sources have been analyzed and verified for relevance and
                accuracy.
              </p>
            </div>
          </div>
        </>
      )}

      {data === undefined ? (
        <Skeleton className="w-full h-[500px]" />
      ) : (
        <>
          {/* Main Content */}
          <Tabs defaultValue="market" className="w-full">
            <TabsList className="w-full justify-start h-auto gap-2 bg-transparent pb-4">
              <TabsTrigger
                value="market"
                className="data-[state=active]:bg-primary/10 px-3 py-1.5 text-xs"
              >
                Market Analysis
              </TabsTrigger>
              <TabsTrigger
                value="audience"
                className="data-[state=active]:bg-primary/10 px-3 py-1.5 text-xs"
              >
                Target Audience
              </TabsTrigger>
              <TabsTrigger
                value="competition"
                className="data-[state=active]:bg-primary/10 px-3 py-1.5 text-xs"
              >
                Competition
              </TabsTrigger>
            </TabsList>

            <TabsContent value="market" className="mt-0 px-1 space-y-4">
              <div className="space-y-4">
                {/* Market Overview */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {data.summary.productSummary.overview}
                  </p>
                  <div className="mt-4">
                    <h4 className="text-xs font-medium mb-2">Key Insights</h4>
                    <div className="space-y-2">
                      {data.summary.productSummary.keyInsights.map(
                        (insight, index) => (
                          <p
                            key={index}
                            className="text-sm text-muted-foreground"
                          >
                            • {insight}
                          </p>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Secondary Markets */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Secondary Markets</h3>
                  <div className="grid gap-2">
                    {data.summary.detailedAnalysis.market.secondaryMarkets.map(
                      (market, index) => (
                        <div
                          key={index}
                          className="p-3 bg-muted/50 rounded-lg border"
                        >
                          <h4 className="text-sm font-medium mb-1">
                            {market.segment}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {market.opportunity}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Use Cases */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Use Cases</h3>
                  <div className="grid gap-2">
                    {data.summary.detailedAnalysis.market.useCases.map(
                      (useCase, index) => (
                        <div
                          key={index}
                          className="p-3 bg-muted/50 rounded-lg border"
                        >
                          <h4 className="text-sm font-medium mb-2">
                            {useCase.scenario}
                          </h4>
                          <div className="space-y-1">
                            {useCase.benefits.map((benefit, i) => (
                              <p
                                key={i}
                                className="text-sm text-muted-foreground"
                              >
                                • {benefit}
                              </p>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audience" className="mt-0 px-1 space-y-3">
              {/* Primary Market */}
              <div className="p-3 bg-muted/50 rounded-lg border space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-medium">Primary Market</h3>
                  <Badge variant="outline" className="text-[10px]">
                    {
                      data.summary.detailedAnalysis.market.primaryMarket
                        .marketSize
                    }
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {data.summary.detailedAnalysis.market.primaryMarket.demographics.map(
                      (demo, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {demo}
                        </Badge>
                      ),
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.summary.detailedAnalysis.market.primaryMarket.psychographics.map(
                      (psycho, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {psycho}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Secondary Markets */}
              <div className="space-y-2">
                {data.summary.detailedAnalysis.market.secondaryMarkets.map(
                  (market, index) => (
                    <div
                      key={index}
                      className="p-3 bg-muted/50 rounded-lg border space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-medium">
                          {market.segment}
                        </h3>
                        <Badge variant="outline" className="text-[10px]">
                          Secondary Market
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {market.opportunity}
                      </p>
                    </div>
                  ),
                )}
              </div>

              {/* User Personas */}
              <div className="grid gap-2">
                {data.summary.detailedAnalysis.market.userPersonas.map(
                  (persona, index) => (
                    <div
                      key={index}
                      className="p-3 bg-muted/50 rounded-lg border space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-medium">{persona.type}</h3>
                        <Badge variant="outline" className="text-[10px]">
                          Persona
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {persona.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {persona.needs.map((need, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-[10px]"
                          >
                            {need}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </TabsContent>

            <TabsContent value="competition" className="mt-0 px-1 space-y-3">
              {/* Market Position Overview */}
              <div className="p-3 bg-muted/50 rounded-lg border">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <h4 className="text-[11px] font-medium text-muted-foreground mb-2">
                      Advantages
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {data.summary.detailedAnalysis.competition.marketPosition.uniqueAdvantages.map(
                        (advantage, i) => (
                          <span
                            key={i}
                            className="text-xs text-muted-foreground"
                          >
                            • {advantage}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-medium text-muted-foreground mb-2">
                      Challenges
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {data.summary.detailedAnalysis.competition.marketPosition.challenges.map(
                        (challenge, i) => (
                          <span
                            key={i}
                            className="text-xs text-muted-foreground"
                          >
                            • {challenge}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-medium text-muted-foreground mb-2">
                      Opportunities
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {data.summary.detailedAnalysis.competition.marketPosition.opportunities.map(
                        (opportunity, i) => (
                          <span
                            key={i}
                            className="text-xs text-muted-foreground"
                          >
                            • {opportunity}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Competitors */}
              <div className="space-y-2">
                {data.summary.detailedAnalysis.competition.directCompetitors.map(
                  (competitor, index) => (
                    <div
                      key={index}
                      className="p-3 bg-muted/50 rounded-lg border space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xs font-medium">
                            {competitor.name}
                          </h3>
                          <Badge variant="outline" className="text-[10px]">
                            {competitor.pricePoint}
                          </Badge>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">
                          Direct Competitor
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h4 className="text-[11px] font-medium text-muted-foreground mb-1.5">
                            Strengths
                          </h4>
                          <div className="flex flex-col gap-1">
                            {competitor.strengths.map((strength, i) => (
                              <span
                                key={i}
                                className="text-xs text-muted-foreground"
                              >
                                • {strength}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[11px] font-medium text-muted-foreground mb-1.5">
                            Weaknesses
                          </h4>
                          <div className="flex flex-col gap-1">
                            {competitor.weaknesses.map((weakness, i) => (
                              <span
                                key={i}
                                className="text-xs text-muted-foreground"
                              >
                                • {weakness}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* Indirect Competitors */}
              <div className="space-y-2">
                {data.summary.detailedAnalysis.competition.indirectCompetitors.map(
                  (competitor, index) => (
                    <div
                      key={index}
                      className="p-3 bg-muted/50 rounded-lg border space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-medium">
                          {competitor.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">
                            {competitor.threatLevel}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            Indirect
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {competitor.differentiators.map((diff, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {diff}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {data !== undefined && (
        <Button
          onClick={onNextStep}
          className={cn(
            "w-full bg-fuchsia-500 text-white",
            "hover:bg-fuchsia-600",
            "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
          )}
        >
          Explore influencers
        </Button>
      )}
    </div>
  );
}
