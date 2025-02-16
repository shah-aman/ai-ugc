"use client";

import { useMemo, useState } from "react";

import { ExternalLink, Sparkles, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useProductContext } from "../../contexts/product-context";

export type InfluencersViewProps = {
  onNextStep: () => void;
};

export function InfluencersView({ onNextStep }: InfluencersViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    selectedInfluencerId,
    setSelectedInfluencerId,
    influencerResearch: { data },
  } = useProductContext();

  const fuseInstance = useMemo(() => {
    const options = {
      keys: [
        "name",
        "influencer_research.keytopics.recurringThemes",
        "influencer_research.targetAudience.demographics",
        "influencer_research.background.achievements",
      ],
      threshold: 0.3,
      includeScore: true,
    };
    return new Fuse(data ?? [], options);
  }, [data]);

  const searchResults = useMemo(() => {
    if (searchQuery === "") return data ?? [];
    const results = fuseInstance.search(searchQuery);
    return results.map((res) => res.item);
  }, [data, fuseInstance, searchQuery]);

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
          <h2 className="text-2xl font-medium tracking-tight">
            Select an Influencer
          </h2>
          <p className="text-muted-foreground">
            Choose a creator that matches your brand&apos;s voice and values
          </p>
        </div>

        {/* Search Bar */}
        <div
          className={cn(
            "relative w-full rounded-xl",
            "bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm",
            "ring-1 ring-zinc-200/50 dark:ring-zinc-800/50",
            "focus-within:ring-primary/20 dark:focus-within:ring-primary/20",
            "transition duration-200",
          )}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, values, or content style..."
            className={cn(
              "w-full bg-transparent px-4 py-3 text-sm",
              "rounded-xl outline-none",
              "placeholder:text-muted-foreground/60",
            )}
          />
        </div>
      </div>

      {/* Influencer Grid */}
      {data === undefined ? (
        <Skeleton className="w-full h-[300px]" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {searchResults.map((influencer) => (
              <motion.div
                key={influencer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="group"
              >
                <div
                  onClick={() => setSelectedInfluencerId(influencer.id)}
                  className={cn(
                    "relative p-5 rounded-2xl cursor-pointer overflow-hidden",
                    "bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm",
                    "border border-zinc-200/50 dark:border-zinc-800/50",
                    "transition-all duration-300 ease-out",
                    "hover:bg-white/60 dark:hover:bg-zinc-900/60",
                    "hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]",
                    "dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]",
                    selectedInfluencerId === influencer.id && [
                      "bg-white/80 dark:bg-zinc-900/80",
                      "border-primary/20 dark:border-primary/20",
                      "shadow-[0_0_0_1px_rgba(var(--primary),0.2),0_8px_40px_rgb(0,0,0,0.1)]",
                    ],
                  )}
                >
                  {/* Profile Header */}
                  <div className="flex items-start gap-4">
                    <motion.img
                      src={influencer.image_url ?? undefined}
                      alt={influencer.name}
                      className="w-14 h-14 rounded-xl object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {influencer.name}
                      </h3>
                      {/*
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users2 className="w-3 h-3" />
                        <span>{influencer.followers} followers</span>
                      </div>
                        */}
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-lg opacity-50 hover:opacity-100"
                        >
                          <a href={influencer.tiktok_profile_link ?? undefined}>
                            <svg
                              className="h-3 w-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" />
                              <path d="M10 12C8.34315 12 7 13.3431 7 15C7 16.6569 8.34315 18 10 18C11.6569 18 13 16.6569 13 15V6C13.3333 7 14.6 9 17 9" />
                            </svg>
                          </a>
                        </Button>
                        {/* {influencer.socialMedia.instagram && ( */}
                        {/*   <Button */}
                        {/*     variant="ghost" */}
                        {/*     size="icon" */}
                        {/*     className="h-6 w-6 rounded-lg opacity-50 hover:opacity-100" */}
                        {/*   > */}
                        {/*     <Instagram className="h-3 w-3" /> */}
                        {/*   </Button> */}
                        {/* )} */}
                        {/* {influencer.socialMedia.youtube && ( */}
                        {/*   <Button */}
                        {/*     variant="ghost" */}
                        {/*     size="icon" */}
                        {/*     className="h-6 w-6 rounded-lg opacity-50 hover:opacity-100" */}
                        {/*   > */}
                        {/*     <Youtube className="h-3 w-3" /> */}
                        {/*   </Button> */}
                        {/* )} */}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <a href={influencer.tiktok_profile_link ?? undefined}>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>

                  {influencer.influencer_research !== null && (
                    <>
                      {/* Voice & Style */}
                      <div className="mt-5 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <MessageCircle className="w-4 h-4" />
                            <span>Key Topics</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="px-2 py-0.5 text-xs rounded-md bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                              {
                                influencer.influencer_research.keyTopics
                                  .recurringThemes[0]
                              }
                            </span>
                            {influencer.influencer_research.keyTopics.recurringThemes
                              .slice(0)
                              .map((tone) => (
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
                            <span>Target Audience</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {influencer.influencer_research.targetAudience.demographics.map(
                              (value) => (
                                <span
                                  key={value}
                                  className="px-2 py-0.5 text-xs rounded-md 
                                                             bg-primary/5 text-muted-foreground/70
                                                             dark:bg-primary/10"
                                >
                                  {value}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content Style Example */}
                      <div className="mt-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-xs">
                        <p className="text-muted-foreground italic">
                          &quot;
                          {
                            influencer.influencer_research.background
                              .achievements[0]
                          }
                          &quot;
                        </p>
                      </div>

                      {/* Metrics Footer */}
                      <div className="mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Engagement:
                            </span>
                            <span className="ml-1.5 font-medium">
                              {
                                influencer.influencer_research.content
                                  .engagementRate
                              }
                            </span>
                          </div>
                          {/* <div> */}
                          {/*   <span className="text-muted-foreground">Posts:</span> */}
                          {/*   <span className="ml-1.5 font-medium"> */}
                          {/*     {influencer.recentPosts} */}
                          {/*   </span> */}
                          {/* </div> */}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Button
        onClick={onNextStep}
        className={cn(
          "w-full bg-fuchsia-500 text-white",
          "hover:bg-fuchsia-600",
          "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
        )}
        disabled={selectedInfluencerId === undefined}
      >
        Generate script
      </Button>

      {/* Empty State - Show when no influencers match search */}
      {searchResults.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No influencers found matching your search.
          </p>
        </div>
      )}
    </motion.div>
  );
}
