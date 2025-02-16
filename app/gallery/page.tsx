"use client";

import { ExternalLink, Play, Clock, Share2, Download, FileVideo } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Tables } from "@/supabase/types";
import { ConsolidatedResearch } from "@/app/api/research/product/types";
import { ProductInfo } from "@/app/api/product-info/schema";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VideoPlayer } from "@/app/components/video-player";

type ProductGroupData = {
    scripts: Array<Tables<"scripts">>;
    research: (Tables<"research"> & {
        product_research: ConsolidatedResearch;
        product_info: ProductInfo;
    }) | undefined;
    bRoll: Array<Tables<"b_roll">>;
};

type GalleryData = {
    scripts: Array<Tables<"scripts">>;
    research: Array<Tables<"research">>;
    bRoll: Array<Tables<"b_roll">>;
};

type ScriptSegment = {
    content?: string;
    text?: string;
    roll_type: string;
    description?: string;
    start?: number;
    end?: number;
};

export default function GalleryPage() {
    const [data, setData] = useState<GalleryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGalleryData() {
            try {
                const response = await fetch("/api/gallery");
                const galleryData = await response.json();
                setData(galleryData);
            } catch (error) {
                console.error("Error fetching gallery data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchGalleryData();
    }, []);

    if (loading) {
        return <GalleryLoadingSkeleton />;
    }

    if (!data) {
        return <div>Error loading gallery data</div>;
    }

    // Group content by product_link
    const productGroups = data.scripts.reduce((groups, script) => {
        const group = groups[script.product_link] || {
            scripts: [],
            research: data.research.find(r => r.product_link === script.product_link),
            bRoll: data.bRoll.filter(b => b.product_link === script.product_link)
        };

        group.scripts.push(script);
        groups[script.product_link] = group;
        return groups;
    }, {} as Record<string, ProductGroupData>);

    return (
        <div className="w-full min-h-screen p-6 space-y-8">
            <header className="space-y-2">
                <h1 className="text-2xl font-medium tracking-tight">Content Gallery</h1>
                <p className="text-muted-foreground">
                    Browse all generated marketing content
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(productGroups).map(([productLink, group]) => (
                    <ProductSection
                        key={productLink}
                        productLink={productLink}
                        group={group}
                    />
                ))}
            </div>
        </div>
    );
}

function ProductSection({ productLink, group }: { productLink: string; group: ProductGroupData }) {
    const router = useRouter();
    const research = group.research?.product_research;

    const handleProductClick = () => {
        localStorage.setItem(`gallery-${productLink}`, JSON.stringify(group));
        router.push(`/gallery/${encodeURIComponent(productLink)}`);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium truncate">
                        {group.research?.product_info?.name ?? "Untitled Product"}
                    </h2>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleProductClick}
                        className="shrink-0"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {research?.summary?.productSummary?.overview}
                </p>
            </div>

            <div className="space-y-4">
                {group.scripts.map((script) => (
                    <VideoCard
                        key={script.id}
                        script={script}
                        research={group.research}
                    />
                ))}
            </div>
        </div>
    );
}

function VideoCard({
    script,
    research,
}: {
    script: Tables<"scripts">;
    research: (Tables<"research"> & {
        product_research: ConsolidatedResearch;
        product_info: ProductInfo;
    }) | undefined;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showDialog, setShowDialog] = useState(false);
    const formattedDate = new Date(script.created_at).toISOString().split('T')[0];

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(err => {
                console.log("Video play failed:", err);
            });
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    useEffect(() => {
        if (script.processed_video_link) {
            console.log("Video URL:", script.processed_video_link);
            // Test if the URL is accessible
            fetch(script.processed_video_link)
                .then(response => {
                    console.log("Video response status:", response.status);
                })
                .catch(error => {
                    console.error("Error checking video URL:", error);
                });
        }
    }, [script.processed_video_link]);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowDialog(true);
    };

    return (
        <>
            <Card
                className={cn(
                    "group cursor-pointer overflow-hidden transition-all duration-200",
                    "hover:shadow-md hover:border-primary/20",
                    "bg-background/50 border-sidebar-border",
                )}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="relative" style={{ aspectRatio: '16/9' }}>
                    {script.processed_video_link ? (
                        <>
                            <video
                                ref={videoRef}
                                src={script.processed_video_link}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                                preload="metadata"
                                poster={undefined}
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity">
                                <Play className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px]">
                            {formattedDate}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{script.full_script?.split(' ').length ?? 0} words</span>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {script.full_script}
                    </p>
                </CardContent>
            </Card>

            <VideoDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                script={script}
                name={research?.product_info?.name ?? "Untitled Product"}
            />
        </>
    );
}

function VideoDialog({
    open,
    onOpenChange,
    script,
    name
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    script: Tables<"scripts">;
    name: string;
}) {
    const [currentTime, setCurrentTime] = useState(0);
    const [scriptSegments, setScriptSegments] = useState<ScriptSegment[]>([]);

    useEffect(() => {
        if (script.structured_script) {
            try {
                const rawSegments = typeof script.structured_script === 'string'
                    ? JSON.parse(script.structured_script)
                    : script.structured_script;

                // Normalize the segments to handle both formats
                const normalizedSegments = rawSegments.map((segment: ScriptSegment) => ({
                    content: segment.content || segment.text || '',
                    roll_type: segment.roll_type,
                    description: segment.description || segment.text || '',
                    start: segment.start || 0,
                    end: segment.end || 0
                }));

                setScriptSegments(normalizedSegments);
            } catch (error) {
                console.error("Error parsing structured script:", error);
                setScriptSegments([]);
            }
        }
    }, [script.structured_script]);

    const handleTimeUpdate = (time: number) => {
        setCurrentTime(time);
    };

    const getRollTypeClass = (rollType: string) => {
        switch (rollType) {
            case 'A-roll':
                return 'bg-zinc-50 dark:bg-zinc-900';
            case 'B-roll-product':
            case 'B-roll':
                return 'bg-zinc-50 dark:bg-zinc-900';
            case 'B-roll-generic':
                return 'bg-zinc-50 dark:bg-zinc-900';
            default:
                return 'bg-zinc-50 dark:bg-zinc-900';
        }
    };

    const getRollTypeTagClass = (rollType: string) => {
        switch (rollType) {
            case 'A-roll':
                return 'bg-zinc-100 dark:bg-zinc-800';
            case 'B-roll-product':
            case 'B-roll':
                return 'bg-zinc-100 dark:bg-zinc-800';
            case 'B-roll-generic':
                return 'bg-zinc-100 dark:bg-zinc-800';
            default:
                return 'bg-zinc-100 dark:bg-zinc-800';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl border-none bg-background/95 backdrop-blur-sm">
                <DialogTitle className="sr-only">
                    Video Preview - {script.full_script?.slice(0, 50)}...
                </DialogTitle>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-medium">{name}</h2>
                            <p className="text-sm text-muted-foreground">
                                Preview and share your finished video
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </Button>
                            <Button
                                size="sm"
                                className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-xs gap-2"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-2 order-1">
                            <div className="bg-black rounded-lg overflow-hidden max-w-[400px] mx-auto h-full">
                                <div className="relative h-full" style={{ aspectRatio: '9/16' }}>
                                    <VideoPlayer
                                        videoUrl={script.processed_video_link || ""}
                                        onTimeUpdate={handleTimeUpdate}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-3 order-2">
                            <div className="h-full">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <FileVideo className="w-4 h-4" />
                                            <span className="text-sm font-medium">Script Timeline</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {scriptSegments.length} segments
                                        </span>
                                    </div>
                                    <div className="h-[600px] overflow-y-auto space-y-3 p-4">
                                        {scriptSegments.map((segment, index) => (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "p-4 rounded-lg transition-all duration-200",
                                                    getRollTypeClass(segment.roll_type),
                                                    currentTime >= (segment.start || 0) && currentTime <= (segment.end || 0)
                                                        ? "ring-1 ring-zinc-200 dark:ring-zinc-700 shadow-sm"
                                                        : ""
                                                )}
                                            >
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn(
                                                                "px-2 py-0.5 rounded-full text-[11px] uppercase font-semibold",
                                                                getRollTypeTagClass(segment.roll_type)
                                                            )}>
                                                                {segment.roll_type === 'A-roll' ? 'Speaking' : 'B-Roll'}
                                                            </div>
                                                            <span className="text-[11px] text-muted-foreground/60 font-mono tabular-nums">
                                                                {segment.start?.toFixed(1)}s
                                                            </span>
                                                        </div>
                                                        <Badge variant="outline" className="text-[10px]">
                                                            {`Segment ${index + 1}`}
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <p className="text-sm leading-relaxed text-foreground">
                                                            {segment.content || segment.text}
                                                        </p>
                                                        {segment.description && segment.description !== segment.content && (
                                                            <div className="flex gap-2 items-start pt-1">
                                                                <Badge variant="secondary" className="shrink-0 text-[10px] font-medium uppercase tracking-wide">
                                                                    Shot Details
                                                                </Badge>
                                                                <p className="text-xs leading-relaxed text-muted-foreground">
                                                                    {segment.description}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function GalleryLoadingSkeleton() {
    return (
        <div className="w-full min-h-screen p-6 space-y-8">
            <header className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-96" />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="w-full h-[200px] rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
}
