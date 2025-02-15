import { useState } from 'react';
import {
    Activity,
    Users,
    Instagram,
    Youtube,
    Filter,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Influencer {
    id: string;
    name: string;
    avatar: string;
    followers: string;
    engagement: string;
    socialMedia: {
        instagram?: string;
        youtube?: string;
        tiktok?: string;
    };
    tags: string[];
    recentPosts?: number;
    totalReach?: string;
    averageLikes?: string;
    conversionRate?: string;
    campaignStatus?: 'active' | 'pending' | 'completed';
    lastActive?: string;
}

const influencers: Influencer[] = [
    {
        id: '1',
        name: "TechEnthusiast",
        avatar: "https://ui-avatars.com/api/?name=Tech+Enthusiast&background=6366f1&color=fff",
        followers: "850K",
        engagement: "4.2%",
        socialMedia: {
            instagram: "@tech_enthusiast",
            youtube: "TechEnthusiastChannel",
            tiktok: "@techenthusiast",
        },
        tags: ["Tech", "Gadgets", "Reviews"],
        recentPosts: 24,
        totalReach: "2.1M",
        averageLikes: "45K",
        conversionRate: "2.8%",
        campaignStatus: 'active',
        lastActive: "2 hours ago"
    },
    // Add more influencers here...
];

export function InfluencersView() {
    const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(influencers[0]);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-6">
            {/* Header Section - updated styling */}
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-2xl font-medium">Influencer Management</h1>
                    <p className="text-muted-foreground">Manage and track your influencer campaigns</p>
                </div>
            </div>

            {/* Stats Overview - removed mb-6 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.1M</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.2%</div>
                        <p className="text-xs text-muted-foreground">+1.2% from last month</p>
                    </CardContent>
                </Card>
                {/* Add more stat cards */}
            </div>

            {/* Main content - removed mb-6 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Influencer List Panel */}
                <div className="col-span-1">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Input
                                    placeholder="Search influencers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full"
                                />
                                <Button variant="ghost" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {influencers.map((influencer) => (
                                    <div
                                        key={influencer.id}
                                        onClick={() => setSelectedInfluencer(influencer)}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors
                      ${selectedInfluencer?.id === influencer.id
                                                ? 'bg-primary/10'
                                                : 'hover:bg-secondary'}`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={influencer.avatar}
                                                alt={influencer.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <h3 className="font-medium">{influencer.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {influencer.followers} followers
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Influencer Detail Panel */}
                <div className="col-span-2">
                    {selectedInfluencer && (
                        <Tabs defaultValue="overview" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                <TabsTrigger value="content">Content</TabsTrigger>
                                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={selectedInfluencer.avatar}
                                                alt={selectedInfluencer.name}
                                                className="w-16 h-16 rounded-full"
                                            />
                                            <div>
                                                <CardTitle>{selectedInfluencer.name}</CardTitle>
                                                <CardDescription>
                                                    Last active: {selectedInfluencer.lastActive}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-medium mb-2">Social Profiles</h4>
                                                    <div className="space-y-2">
                                                        {selectedInfluencer.socialMedia.instagram && (
                                                            <div className="flex items-center space-x-2">
                                                                <Instagram className="h-4 w-4" />
                                                                <span>{selectedInfluencer.socialMedia.instagram}</span>
                                                            </div>
                                                        )}
                                                        {selectedInfluencer.socialMedia.youtube && (
                                                            <div className="flex items-center space-x-2">
                                                                <Youtube className="h-4 w-4" />
                                                                <span>{selectedInfluencer.socialMedia.youtube}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium mb-2">Tags</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedInfluencer.tags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="px-2 py-1 bg-secondary rounded-full text-xs"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-medium mb-2">Performance Metrics</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Total Reach</span>
                                                            <span className="font-medium">{selectedInfluencer.totalReach}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Avg. Likes</span>
                                                            <span className="font-medium">{selectedInfluencer.averageLikes}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Conversion Rate</span>
                                                            <span className="font-medium">{selectedInfluencer.conversionRate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Add content for other tabs */}
                        </Tabs>
                    )}
                </div>
            </div>
        </div>
    );
} 