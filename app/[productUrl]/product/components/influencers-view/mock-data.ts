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
  campaignStatus?: "active" | "pending" | "completed";
  lastActive?: string;
}

export const influencers: Influencer[] = [
  {
    id: "113eece852cd4d0eb70cfdfa612dd04b",
    name: "TechEnthusiast",
    avatar:
      "https://ui-avatars.com/api/?name=Tech+Enthusiast&background=6366f1&color=fff",
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
      personality: ["Analytical", "Early Adopter", "Detail-oriented"],
    },
    voiceTone: {
      primary: "Informative & Engaging",
      secondary: ["Technical", "Enthusiastic", "Clear"],
      examples: [
        "Breaking down complex tech in simple terms",
        "Excitement about innovation",
        "Data-driven insights",
      ],
    },
    contentStyle: {
      format: ["Long-form reviews", "Quick tips", "Tutorial series"],
      preferences: [
        "High production value",
        "Detailed b-roll",
        "Minimal editing",
      ],
      uniqueApproach: "Combines technical depth with accessible explanations",
    },
    audienceProfile: {
      demographics: ["25-34", "Tech-savvy", "Urban"],
      interests: ["Technology", "Innovation", "Productivity"],
      behavior: ["Research-oriented", "Early adopters", "High engagement"],
    },
    recentPosts: 24,
    totalReach: "2.1M",
    averageLikes: "45K",
    conversionRate: "2.8%",
    campaignStatus: "active",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "LifestyleGuru",
    avatar:
      "https://ui-avatars.com/api/?name=Lifestyle+Guru&background=f43f5e&color=fff",
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
      personality: ["Approachable", "Trendsetter", "Authentic"],
    },
    voiceTone: {
      primary: "Aspirational & Relatable",
      secondary: ["Warm", "Sophisticated", "Genuine"],
      examples: [
        "Integrating premium tech into a balanced lifestyle",
        "Mindful approach to digital wellness",
        "Authentic product experiences",
      ],
    },
    contentStyle: {
      format: ["Lifestyle vlogs", "Product integrations", "Day-in-life"],
      preferences: [
        "Aesthetic quality",
        "Natural lighting",
        "Lifestyle context",
      ],
      uniqueApproach: "Seamlessly blends tech with luxury lifestyle content",
    },
    audienceProfile: {
      demographics: ["28-40", "Urban professionals", "High income"],
      interests: ["Luxury lifestyle", "Wellness", "Premium tech"],
      behavior: ["Brand conscious", "Quality-focused", "Lifestyle-oriented"],
    },
    recentPosts: 18,
    totalReach: "3.5M",
    averageLikes: "52K",
    conversionRate: "3.2%",
    campaignStatus: "active",
    lastActive: "5 hours ago",
  },
  {
    id: "3",
    name: "AudioPro",
    avatar:
      "https://ui-avatars.com/api/?name=Audio+Pro&background=84cc16&color=fff",
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
      personality: ["Professional", "Technical", "Passionate"],
    },
    voiceTone: {
      primary: "Professional & Technical",
      secondary: ["Expert", "Detailed", "Educational"],
      examples: [
        "In-depth analysis of audio quality and performance",
        "Professional perspective on sound engineering",
        "Technical breakdowns with practical applications",
      ],
    },
    contentStyle: {
      format: ["Technical reviews", "Studio sessions", "Comparison videos"],
      preferences: [
        "Professional audio",
        "Studio environment",
        "Technical demos",
      ],
      uniqueApproach:
        "Combines professional expertise with practical user perspective",
    },
    audienceProfile: {
      demographics: ["22-45", "Music professionals", "Audio enthusiasts"],
      interests: ["Professional audio", "Music production", "Sound quality"],
      behavior: ["Technical-focused", "Professional use", "Quality-driven"],
    },
    recentPosts: 15,
    totalReach: "980K",
    averageLikes: "28K",
    conversionRate: "4.5%",
    campaignStatus: "pending",
    lastActive: "1 day ago",
  },
];
