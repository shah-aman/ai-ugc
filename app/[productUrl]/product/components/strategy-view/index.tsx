"use client";

import { MarketingStrategy } from "./components/marketing-strategy";
import { InfluencerList } from "./components/influencer-list";

const marketingStrategy = {
  title: "Influencer Marketing Strategy",
  summary:
    "Our strategy focuses on leveraging micro and macro influencers across various social media platforms to increase brand awareness and drive sales for our Premium Wireless Headphones. We'll target influencers in the tech, music, and lifestyle niches to reach a diverse audience and showcase the product's versatility.",
  keyPoints: [
    "Collaborate with 20+ influencers across Instagram, YouTube, and TikTok",
    "Create unique discount codes for each influencer to track conversions",
    "Encourage authentic product reviews and demonstrations",
    "Run a branded hashtag campaign to increase user-generated content",
    "Host influencer-led giveaways to boost engagement and followers",
  ],
};

const influencers = [
  {
    name: "TechEnthusiast",
    socialMedia: {
      instagram: "@tech_enthusiast",
      youtube: "TechEnthusiastChannel",
      tiktok: "@techenthusiast",
    },
    tags: ["Tech", "Gadgets", "Reviews"],
  },
  {
    name: "MusicMaestro",
    socialMedia: {
      instagram: "@music_maestro",
      youtube: "MusicMaestroOfficial",
      spotify: "musicmaestro",
    },
    tags: ["Music", "Audio", "Lifestyle"],
  },
  {
    name: "FitnessGuru",
    socialMedia: {
      instagram: "@fitness_guru",
      youtube: "FitnessGuruTV",
      tiktok: "@fitnessguru",
    },
    tags: ["Fitness", "Wellness", "Tech"],
  },
  {
    name: "TravelExplorer",
    socialMedia: {
      instagram: "@travel_explorer",
      youtube: "TravelExplorerVlogs",
      tiktok: "@travelexplorer",
    },
    tags: ["Travel", "Lifestyle", "Tech"],
  },
  {
    name: "BeautyBlogger",
    socialMedia: {
      instagram: "@beauty_blogger",
      youtube: "BeautyBloggerOfficial",
      tiktok: "@beautyblogger",
    },
    tags: ["Beauty", "Lifestyle", "Fashion"],
  },
];

export function StrategyView() {
  const handleAddInfluencer = () => {
    console.log("HEHEHHE");
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <MarketingStrategy strategy={marketingStrategy} />
        <InfluencerList
          influencers={influencers}
          onAddInfluencer={handleAddInfluencer}
        />
      </div>
    </div>
  );
}
