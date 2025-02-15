import { useState } from 'react';
import {
    Target,
    Calendar,
    ArrowUpRight,
    ChevronRight,
    PieChart
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface MarketingMetric {
    label: string;
    value: string;
    trend?: number;
    status?: 'positive' | 'negative' | 'neutral';
}

interface TargetAudience {
    name: string;
    percentage: number;
    description: string;
    preferences: string[];
    painPoints: string[];
}

interface CompetitorAnalysis {
    name: string;
    marketShare: string;
    strengths: string[];
    weaknesses: string[];
    pricePoint: string;
}

const marketingStrategy = {
    summary: "Our strategy focuses on leveraging micro and macro influencers across various social media platforms to increase brand awareness and drive sales for our Premium Wireless Headphones. We'll target influencers in the tech, music, and lifestyle niches to reach a diverse audience and showcase the product's versatility.",
    keyPoints: [
        "Collaborate with 20+ influencers across Instagram, YouTube, and TikTok",
        "Create unique discount codes for each influencer to track conversions",
        "Encourage authentic product reviews and demonstrations",
        "Run a branded hashtag campaign to increase user-generated content",
        "Host influencer-led giveaways to boost engagement and followers",
    ],
    metrics: [
        { label: "Estimated Reach", value: "2.5M+", trend: 15, status: 'positive' },
        { label: "Target ROI", value: "350%", trend: 5, status: 'positive' },
        { label: "Campaign Duration", value: "3 months", status: 'neutral' },
        { label: "Budget Range", value: "$15K-25K", trend: -2, status: 'negative' },
    ] as MarketingMetric[],
    targetAudiences: [
        {
            name: "Tech Enthusiasts",
            percentage: 45,
            description: "Early adopters who prioritize sound quality and features",
            preferences: ["High-fidelity audio", "Latest technology", "Premium build quality"],
            painPoints: ["Battery life", "Connectivity issues", "Price sensitivity"]
        },
        {
            name: "Music Professionals",
            percentage: 30,
            description: "Musicians and audio professionals seeking reliable equipment",
            preferences: ["Studio-quality sound", "Durability", "Professional appearance"],
            painPoints: ["Latency", "Noise isolation", "Wireless reliability"]
        }
    ] as TargetAudience[],
    competitors: [
        {
            name: "SoundMaster Pro",
            marketShare: "35%",
            strengths: ["Brand recognition", "Wide distribution", "Marketing budget"],
            weaknesses: ["Higher price point", "Limited features", "Older technology"],
            pricePoint: "$299"
        }
    ] as CompetitorAnalysis[],
    kpis: [
        { label: "Market Share", current: "15%", target: "25%", progress: 60 },
        { label: "Brand Awareness", current: "45%", target: "70%", progress: 64 },
        { label: "Customer Satisfaction", current: "4.2/5", target: "4.5/5", progress: 84 }
    ]
};

export function MarketStrategyView() {
    const [activeAudience, setActiveAudience] = useState(marketingStrategy.targetAudiences[0]);

    return (
        <div className="space-y-6">
            {/* Header Section - updated padding */}
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-2xl font-medium">Product Marketing Strategy</h1>
                    <p className="text-muted-foreground">Comprehensive market analysis and planning</p>
                </div>
                <Button size="sm" variant="secondary">
                    <Calendar className="mr-2 h-4 w-4" />
                    Go to Company Profile
                </Button>
            </div>

            {/* KPI Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {marketingStrategy.metrics.map((metric) => (
                    <Card key={metric.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                            {metric.trend && (
                                <span className={`flex items-center text-sm ${metric.status === 'positive' ? 'text-green-500' :
                                    metric.status === 'negative' ? 'text-red-500' :
                                        'text-gray-500'
                                    }`}>
                                    {metric.trend > 0 && '+'}{metric.trend}%
                                    <ArrowUpRight className="h-4 w-4 ml-1" />
                                </span>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="audience">Target Audience</TabsTrigger>
                    <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Strategy Summary</CardTitle>
                                <CardDescription>Current marketing approach and goals</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{marketingStrategy.summary}</p>
                                <div className="mt-4 space-y-2">
                                    {marketingStrategy.keyPoints.map((point, index) => (
                                        <div key={index} className="flex items-start space-x-2">
                                            <ChevronRight className="h-4 w-4 mt-1 text-primary" />
                                            <span className="text-sm">{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Key Performance Indicators</CardTitle>
                                <CardDescription>Progress towards strategic goals</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {marketingStrategy.kpis.map((kpi) => (
                                        <div key={kpi.label} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium">{kpi.label}</span>
                                                <span className="text-muted-foreground">
                                                    {kpi.current} / {kpi.target}
                                                </span>
                                            </div>
                                            <Progress value={kpi.progress} />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="audience">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle>Audience Segments</CardTitle>
                                <CardDescription>Click to view detailed analysis</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {marketingStrategy.targetAudiences.map((audience) => (
                                        <div
                                            key={audience.name}
                                            onClick={() => setActiveAudience(audience)}
                                            className={`p-3 rounded-lg cursor-pointer transition-colors
                        ${activeAudience.name === audience.name
                                                    ? 'bg-primary/10'
                                                    : 'hover:bg-secondary'}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">{audience.name}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {audience.percentage}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>{activeAudience.name}</CardTitle>
                                <CardDescription>{activeAudience.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Key Preferences</h4>
                                        <div className="space-y-2">
                                            {activeAudience.preferences.map((pref, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <Target className="h-4 w-4 text-primary" />
                                                    <span className="text-sm">{pref}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Pain Points</h4>
                                        <div className="space-y-2">
                                            {activeAudience.painPoints.map((point, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <PieChart className="h-4 w-4 text-destructive" />
                                                    <span className="text-sm">{point}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Add Competitor Analysis and Performance tabs content */}
            </Tabs>
        </div>
    );
} 