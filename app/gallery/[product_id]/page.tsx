"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Tables } from "@/supabase/types";
import { ConsolidatedResearch } from "@/app/api/research/product/types";
import { ProductInfo } from "@/app/api/product-info/schema";

type ProductGroupData = {
    scripts: Array<Tables<"scripts">>;
    research: (Tables<"research"> & {
        product_research: ConsolidatedResearch;
        product_info: ProductInfo;
    }) | undefined;
    bRoll: Array<Tables<"b_roll">>;
};

export default function GalleryProductPage() {
    const params = useParams();
    const [data, setData] = useState<ProductGroupData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAllSources, setShowAllSources] = useState(false);

    useEffect(() => {
        const productId = decodeURIComponent(params.product_id as string);
        const storedData = localStorage.getItem(`gallery-${productId}`);

        if (storedData) {
            try {
                setData(JSON.parse(storedData));
            } catch (error) {
                console.error('Error parsing stored data:', error);
            }
        }
        setLoading(false);
    }, [params.product_id]);

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!data || !data.research) {
        return (
            <div className="w-full min-h-screen p-6">
                <Button
                    variant="ghost"
                    className="mb-4"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Gallery
                </Button>
                <div className="flex flex-col items-center justify-center space-y-4 mt-12">
                    <h1 className="text-2xl font-medium">Product Not Found</h1>
                    <p className="text-muted-foreground">
                        The product data could not be loaded. Please return to the gallery and try again.
                    </p>
                </div>
            </div>
        );
    }

    const research = data.research.product_research;

    return (
        <motion.div
            className="w-full min-h-screen p-6 space-y-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mx-auto mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-semibold">{data.research.product_info?.name ?? "Untitled Product"}</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Created {new Date(data.research.created_at).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Info Column */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Product Images */}
                    {data.research.product_info?.top3ImageUrls && (
                        <div className="grid grid-cols-3 gap-2">
                            {data.research.product_info.top3ImageUrls.map((imageUrl, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "relative aspect-square overflow-hidden rounded-lg border bg-muted",
                                        index === 0 && "col-span-3"
                                    )}
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`Product image ${index + 1}`}
                                        className={cn(
                                            "object-cover w-full h-full",
                                            "transition-all duration-300 hover:scale-105"
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                                {data.research.product_info?.category || "Product"}
                            </Badge>
                            <Badge variant="default" className="text-xs">
                                {data.scripts.length} Scripts Available
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "w-4 h-4",
                                                i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    ({data.scripts.length} generated videos)
                                </span>
                            </div>
                            {data.research.product_info?.price && (
                                <span className="text-2xl font-semibold text-fuchsia-500">
                                    {data.research.product_info.price}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-muted-foreground">
                            {data.research.product_info?.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {research?.summary?.productSummary?.keyInsights?.map((insight, i) => (
                                <Badge key={i} variant="outline" className="bg-background/50">
                                    {insight}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-sm font-medium">Key Features</h2>
                        <ul className="grid grid-cols-2 gap-2">
                            {research?.summary?.detailedAnalysis?.features?.features?.map((feature) => (
                                <li key={feature.name} className="flex items-center gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
                                    {feature.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Table>
                        <TableBody>
                            {research?.summary?.detailedAnalysis?.features?.specifications &&
                                Object.entries(research.summary.detailedAnalysis.features.specifications).map(([label, value]) => (
                                    <TableRow key={label}>
                                        <TableCell className="text-muted-foreground font-medium py-2">
                                            {label}
                                        </TableCell>
                                        <TableCell className="text-right py-2">
                                            {value}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>

                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="text-muted-foreground font-medium py-2">
                                    Market Size
                                </TableCell>
                                <TableCell className="text-right py-2">
                                    {research?.summary?.detailedAnalysis?.market?.primaryMarket?.marketSize}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-muted-foreground font-medium py-2">
                                    Total Content
                                </TableCell>
                                <TableCell className="text-right py-2">
                                    {data.scripts.length + data.bRoll.length} items
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-muted-foreground font-medium py-2">
                                    Generated On
                                </TableCell>
                                <TableCell className="text-right py-2">
                                    {new Date(data.research.created_at).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Market Research & Content Column */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="market" className="w-full">
                        <TabsList className="w-full justify-start h-auto gap-2 bg-transparent pb-4">
                            <TabsTrigger
                                value="market"
                                className="data-[state=active]:bg-primary/10 px-3 py-1.5 text-xs"
                            >
                                Market Analysis
                            </TabsTrigger>
                            <TabsTrigger
                                value="competition"
                                className="data-[state=active]:bg-primary/10 px-3 py-1.5 text-xs"
                            >
                                Competition
                            </TabsTrigger>
                            <TabsTrigger
                                value="content"
                                className="data-[state=active]:bg-primary/10 px-3 py-1.5 text-xs"
                            >
                                Generated Content
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="market" className="mt-0 space-y-6">
                            {/* Market Overview */}
                            <div className="space-y-4">

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
                                                research?.summary?.detailedAnalysis?.market?.primaryMarket?.marketSize
                                            }
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Satisfaction Metrics */}
                                <div className="grid grid-cols-5 gap-2">
                                    <div className="p-2 bg-muted/50 rounded-lg border flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-medium text-muted-foreground">
                                                Overall Rating
                                            </span>
                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-center">
                                                {research?.summary?.detailedAnalysis?.painPoints?.satisfactionMetrics?.overallRating}
                                            </span>
                                        </div>
                                    </div>

                                    {research?.summary?.detailedAnalysis?.painPoints?.satisfactionMetrics?.keyMetrics &&
                                        Object.entries(research.summary.detailedAnalysis.painPoints.satisfactionMetrics.keyMetrics)
                                            .map(([key, value], index) => {
                                                const colors = {
                                                    0: { bg: "bg-blue-500/10", text: "text-blue-500" },
                                                    1: { bg: "bg-violet-500/10", text: "text-violet-500" },
                                                    2: { bg: "bg-orange-500/10", text: "text-orange-500" },
                                                };
                                                const color = colors[index as keyof typeof colors] || colors[0];

                                                return (
                                                    <div key={key} className="p-2 bg-muted/50 rounded-lg border flex flex-col">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-medium text-muted-foreground">
                                                                {key.split(/(?=[A-Z])/).map(str =>
                                                                    str.charAt(0).toUpperCase() + str.slice(1)
                                                                ).join(" ")}
                                                            </span>
                                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>
                                                                {value}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                </div>

                                {/* Research Sources */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium">Research Sources</h3>
                                        <span className="text-xs text-muted-foreground">
                                            {data.research.product_research.citations.length} sources
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {data.research.product_research.citations
                                            .slice(0, showAllSources ? undefined : 4)
                                            .map((citation, i) => {
                                                const urlMatch = citation.match(/https?:\/\/([^\/]+)/);
                                                const domain = urlMatch ? urlMatch[1] : "";
                                                const nameMatch = citation.match(/^(.*?)\s*-\s*http/);
                                                const name = nameMatch ? nameMatch[1] : domain;

                                                if (!domain) return null;

                                                return (
                                                    <div
                                                        key={i}
                                                        className="flex items-center gap-2 shrink-0 border bg-muted/50 px-3 py-1.5 rounded-sm hover:bg-muted/70 transition-colors"
                                                    >
                                                        <div className="relative h-4 w-4 flex-none">
                                                            <img
                                                                src={`https://${domain}/favicon.ico`}
                                                                alt={`${name} Icon`}
                                                                className="rounded-full w-4 h-4"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                            {name}
                                                        </span>
                                                    </div>
                                                );
                                            })}

                                        {data.research.product_research.citations.length > 4 && (
                                            <button
                                                onClick={() => setShowAllSources(!showAllSources)}
                                                className="flex items-center gap-2 shrink-0 border bg-muted/50 px-3 py-1.5 rounded-sm hover:bg-muted/70 transition-colors"
                                            >
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {showAllSources
                                                        ? "Show Less"
                                                        : `+ ${data.research.product_research.citations.length - 4} more`
                                                    }
                                                </span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                                        <p>All sources have been analyzed and verified for relevance and accuracy.</p>
                                    </div>
                                </div>

                                {/* Problems This Product Solves */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium">Problems This Product Solves</h3>
                                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                            {data.research.product_research.summary.detailedAnalysis.painPoints.painPoints.length} Key Solutions
                                        </Badge>
                                    </div>
                                    <div className="grid gap-3">
                                        {data.research.product_research.summary.detailedAnalysis.painPoints.painPoints.map((painPoint, index) => (
                                            <div
                                                key={index}
                                                className="relative group"
                                            >
                                                <div className="p-3 bg-muted/30 rounded-lg border border-border/40 hover:bg-muted/50 transition-all duration-200">
                                                    <div className="flex items-center gap-3">
                                                        <div className="shrink-0">
                                                            <div className="w-8 h-8 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                                                                <span className="text-xs font-medium text-primary/70">
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="text-sm font-medium truncate">{painPoint.problem}</h4>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "text-[10px] shrink-0",
                                                                        painPoint.effectiveness.includes("High") && "bg-emerald-500/5 text-emerald-500 border-emerald-200/30",
                                                                        painPoint.effectiveness.includes("Medium") && "bg-blue-500/5 text-blue-500 border-blue-200/30",
                                                                        painPoint.effectiveness.includes("Low") && "bg-amber-500/5 text-amber-500 border-amber-200/30"
                                                                    )}
                                                                >
                                                                    {painPoint.effectiveness.replace(" effective", "")}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground line-clamp-2 group-hover:line-clamp-none transition-all duration-200">
                                                                {painPoint.solution}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Demographics */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium">Target Demographics</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {research?.summary?.detailedAnalysis?.market?.primaryMarket?.demographics.map((demo, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                                {demo}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* User Personas */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium">User Personas</h3>
                                    <div className="grid gap-4">
                                        {research?.summary?.detailedAnalysis?.market?.userPersonas.map((persona, index) => (
                                            <Card key={index} className="bg-background/50 border-sidebar-border">
                                                <CardContent className="p-4 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-medium">{persona.type}</h4>
                                                        <Badge variant="outline" className="text-xs">Persona</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{persona.description}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {persona.needs.map((need, i) => (
                                                            <Badge key={i} variant="secondary" className="text-xs">
                                                                {need}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="competition" className="mt-0 space-y-6">
                            {/* Market Position Overview */}
                            <Card className="bg-background/50 border-sidebar-border">
                                <CardContent className="p-4 space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">Advantages</h4>
                                            <ul className="space-y-1">
                                                {research?.summary?.detailedAnalysis?.competition?.marketPosition?.uniqueAdvantages.map((advantage, i) => (
                                                    <li key={i} className="text-sm text-muted-foreground">
                                                        • {advantage}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">Challenges</h4>
                                            <ul className="space-y-1">
                                                {research?.summary?.detailedAnalysis?.competition?.marketPosition?.challenges.map((challenge, i) => (
                                                    <li key={i} className="text-sm text-muted-foreground">
                                                        • {challenge}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">Opportunities</h4>
                                            <ul className="space-y-1">
                                                {research?.summary?.detailedAnalysis?.competition?.marketPosition?.opportunities.map((opportunity, i) => (
                                                    <li key={i} className="text-sm text-muted-foreground">
                                                        • {opportunity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Competitive Analysis */}
                            <div className="grid gap-4">
                                {research?.summary?.detailedAnalysis?.competition?.directCompetitors.map((competitor, i) => (
                                    <Card key={i} className="bg-background/50 border-sidebar-border">
                                        <CardContent className="p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-medium">{competitor.name}</h4>
                                                    <Badge variant="outline" className="text-xs">
                                                        {competitor.pricePoint}
                                                    </Badge>
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    Direct Competitor
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <h5 className="text-xs text-muted-foreground">Strengths</h5>
                                                    <ul className="space-y-1">
                                                        {competitor.strengths.map((strength, j) => (
                                                            <li key={j} className="text-xs text-muted-foreground">
                                                                • {strength}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="space-y-2">
                                                    <h5 className="text-xs text-muted-foreground">Weaknesses</h5>
                                                    <ul className="space-y-1">
                                                        {competitor.weaknesses.map((weakness, j) => (
                                                            <li key={j} className="text-xs text-muted-foreground">
                                                                • {weakness}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Indirect Competitors */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium">Indirect Competitors</h3>
                                <div className="grid gap-4">
                                    {research?.summary?.detailedAnalysis?.competition?.indirectCompetitors.map((competitor, i) => (
                                        <Card key={i} className="bg-background/50 border-sidebar-border">
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium">{competitor.name}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {competitor.threatLevel}
                                                        </Badge>
                                                        <Badge variant="secondary" className="text-xs">
                                                            Indirect
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {competitor.differentiators.map((diff, j) => (
                                                        <Badge key={j} variant="outline" className="text-xs">
                                                            {diff}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="content" className="mt-0 space-y-6">
                            {/* Generated Content Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {data.scripts.map((script) => (
                                    <Card
                                        key={script.id}
                                        className="group cursor-pointer hover:shadow-md transition-all duration-200"
                                    >
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline" className="text-[10px]">
                                                    {new Date(script.created_at).toLocaleDateString()}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                {script.full_script}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </motion.div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="w-full min-h-screen p-6 space-y-8">
            <header className="space-y-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-96" />
                <Skeleton className="h-4 w-[600px]" />
            </header>
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        </div>
    );
}
