"use client";

import { useState } from 'react';
import {
    Instagram,
    Youtube,
    ExternalLink,
    Sparkles,
    MessageCircle,
    Users2,
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    psychographics: {
        values: string[];
        interests: string[];
        personality: string[];
    };
    voiceTone: {
        primary: string;
        secondary: string[];
        examples: string[];
    };
    contentStyle: {
        format: string[];
        preferences: string[];
        uniqueApproach: string;
    };
    audienceProfile: {
        demographics: string[];
        interests: string[];
        behavior: string[];
    };
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
        },
        tags: ["Tech", "Gadgets", "Reviews"],
        psychographics: {
            values: ["Innovation", "Authenticity", "Education"],
            interests: ["Emerging Tech", "Sustainable Tech", "AI Development"],
            personality: ["Analytical", "Early Adopter", "Detail-oriented"]
        },
        voiceTone: {
            primary: "Informative & Engaging",
            secondary: ["Technical", "Enthusiastic", "Clear"],
            examples: [
                "Breaking down complex tech in simple terms",
                "Excitement about innovation",
                "Data-driven insights"
            ]
        },
        contentStyle: {
            format: ["Long-form reviews", "Quick tips", "Tutorial series"],
            preferences: ["High production value", "Detailed b-roll", "Minimal editing"],
            uniqueApproach: "Combines technical depth with accessible explanations"
        },
        audienceProfile: {
            demographics: ["25-34", "Tech-savvy", "Urban"],
            interests: ["Technology", "Innovation", "Productivity"],
            behavior: ["Research-oriented", "Early adopters", "High engagement"]
        },
        recentPosts: 24,
        totalReach: "2.1M",
        averageLikes: "45K",
        conversionRate: "2.8%",
        campaignStatus: 'active',
        lastActive: "2 hours ago"
    },
    {
        id: '2',
        name: "LifestyleGuru",
        avatar: "https://ui-avatars.com/api/?name=Lifestyle+Guru&background=f43f5e&color=fff",
        followers: "1.2M",
        engagement: "3.8%",
        socialMedia: {
            instagram: "@lifestyle_guru",
            youtube: "LifestyleGuruOfficial",
        },
        tags: ["Lifestyle", "Wellness", "Tech"],
        psychographics: {
            values: ["Balance", "Quality", "Mindfulness"],
            interests: ["Premium Products", "Wellness Tech", "Minimalism"],
            personality: ["Approachable", "Trendsetter", "Authentic"]
        },
        voiceTone: {
            primary: "Aspirational & Relatable",
            secondary: ["Warm", "Sophisticated", "Genuine"],
            examples: [
                "Integrating premium tech into a balanced lifestyle",
                "Mindful approach to digital wellness",
                "Authentic product experiences"
            ]
        },
        contentStyle: {
            format: ["Lifestyle vlogs", "Product integrations", "Day-in-life"],
            preferences: ["Aesthetic quality", "Natural lighting", "Lifestyle context"],
            uniqueApproach: "Seamlessly blends tech with luxury lifestyle content"
        },
        audienceProfile: {
            demographics: ["28-40", "Urban professionals", "High income"],
            interests: ["Luxury lifestyle", "Wellness", "Premium tech"],
            behavior: ["Brand conscious", "Quality-focused", "Lifestyle-oriented"]
        },
        recentPosts: 18,
        totalReach: "3.5M",
        averageLikes: "52K",
        conversionRate: "3.2%",
        campaignStatus: 'active',
        lastActive: "5 hours ago"
    },
    {
        id: '3',
        name: "AudioPro",
        avatar: "https://ui-avatars.com/api/?name=Audio+Pro&background=84cc16&color=fff",
        followers: "420K",
        engagement: "5.1%",
        socialMedia: {
            instagram: "@audio_pro",
            youtube: "AudioProOfficial",
        },
        tags: ["Audio", "Music", "Production"],
        psychographics: {
            values: ["Quality", "Expertise", "Craftsmanship"],
            interests: ["Sound Engineering", "Music Production", "Audio Tech"],
            personality: ["Professional", "Technical", "Passionate"]
        },
        voiceTone: {
            primary: "Professional & Technical",
            secondary: ["Expert", "Detailed", "Educational"],
            examples: [
                "In-depth analysis of audio quality and performance",
                "Professional perspective on sound engineering",
                "Technical breakdowns with practical applications"
            ]
        },
        contentStyle: {
            format: ["Technical reviews", "Studio sessions", "Comparison videos"],
            preferences: ["Professional audio", "Studio environment", "Technical demos"],
            uniqueApproach: "Combines professional expertise with practical user perspective"
        },
        audienceProfile: {
            demographics: ["22-45", "Music professionals", "Audio enthusiasts"],
            interests: ["Professional audio", "Music production", "Sound quality"],
            behavior: ["Technical-focused", "Professional use", "Quality-driven"]
        },
        recentPosts: 15,
        totalReach: "980K",
        averageLikes: "28K",
        conversionRate: "4.5%",
        campaignStatus: 'pending',
        lastActive: "1 day ago"
    }
];

export function InfluencersView() {
    const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <motion.div
            className="w-full max-w-7xl mx-auto space-y-8 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header Section */}
            <div className="space-y-6 max-w-2xl mx-auto text-center">
                <div className="space-y-2">
                    <h2 className="text-2xl font-medium tracking-tight">Select an Influencer</h2>
                    <p className="text-muted-foreground">
                        Choose a creator that matches your brand&apos;s voice and values
                    </p>
                </div>

                {/* Search Bar */}
                <div className={cn(
                    "relative w-full rounded-xl",
                    "bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm",
                    "ring-1 ring-zinc-200/50 dark:ring-zinc-800/50",
                    "focus-within:ring-primary/20 dark:focus-within:ring-primary/20",
                    "transition duration-200"
                )}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, values, or content style..."
                        className={cn(
                            "w-full bg-transparent px-4 py-3 text-sm",
                            "rounded-xl outline-none",
                            "placeholder:text-muted-foreground/60"
                        )}
                    />
                </div>
            </div>

            {/* Influencer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {influencers.map((influencer) => (
                        <motion.div
                            key={influencer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="group"
                        >
                            <div
                                onClick={() => setSelectedInfluencer(influencer)}
                                className={cn(
                                    "relative p-5 rounded-2xl cursor-pointer overflow-hidden",
                                    "bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm",
                                    "border border-zinc-200/50 dark:border-zinc-800/50",
                                    "transition-all duration-300 ease-out",
                                    "hover:bg-white/60 dark:hover:bg-zinc-900/60",
                                    "hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]",
                                    "dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]",
                                    selectedInfluencer?.id === influencer.id && [
                                        "bg-white/80 dark:bg-zinc-900/80",
                                        "border-primary/20 dark:border-primary/20",
                                        "shadow-[0_0_0_1px_rgba(var(--primary),0.2),0_8px_40px_rgb(0,0,0,0.1)]",
                                    ]
                                )}
                            >
                                {/* Profile Header */}
                                <div className="flex items-start gap-4">
                                    <motion.img
                                        src={influencer.avatar}
                                        alt={influencer.name}
                                        className="w-14 h-14 rounded-xl object-cover"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium truncate">{influencer.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users2 className="w-3 h-3" />
                                            <span>{influencer.followers} followers</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {influencer.socialMedia.instagram && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-lg opacity-50 hover:opacity-100"
                                                >
                                                    <Instagram className="h-3 w-3" />
                                                </Button>
                                            )}
                                            {influencer.socialMedia.youtube && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-lg opacity-50 hover:opacity-100"
                                                >
                                                    <Youtube className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Voice & Style */}
                                <div className="mt-5 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>Voice Tone</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="px-2 py-0.5 text-xs rounded-md bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                {influencer.voiceTone.primary}
                                            </span>
                                            {influencer.voiceTone.secondary.map((tone) => (
                                                <span
                                                    key={tone}
                                                    className="px-2 py-0.5 text-xs rounded-md bg-blue-50/50 text-blue-600/80 dark:bg-blue-500/5 dark:text-blue-400/80"
                                                >
                                                    {tone}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Sparkles className="w-4 h-4" />
                                            <span>Values & Personality</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {influencer.psychographics.values.map((value) => (
                                                <span
                                                    key={value}
                                                    className="px-2 py-0.5 text-xs rounded-md 
                                                             bg-primary/5 text-muted-foreground/70
                                                             dark:bg-primary/10"
                                                >
                                                    {value}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Style Example */}
                                <div className="mt-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-xs">
                                    <p className="text-muted-foreground italic">&quot;{influencer.voiceTone.examples[0]}&quot;</p>
                                </div>

                                {/* Metrics Footer */}
                                <div className="mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50">
                                    <div className="flex items-center justify-between text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Engagement:</span>
                                            <span className="ml-1.5 font-medium">{influencer.engagement}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Posts:</span>
                                            <span className="ml-1.5 font-medium">{influencer.recentPosts}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State - Show when no influencers match search */}
            {influencers.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No influencers found matching your search.</p>
                </div>
            )}
        </motion.div>
    );
} 