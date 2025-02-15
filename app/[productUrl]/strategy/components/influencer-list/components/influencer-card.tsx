import { motion } from "framer-motion";
import { Instagram, Youtube, Music, TwitterIcon as TikTok } from "lucide-react";

export type Influencer = {
  name: string;
  socialMedia: {
    [key: string]: string;
  };
  tags: string[];
};

function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <Instagram className="w-5 h-5 text-pink-500" />;
    case "youtube":
      return <Youtube className="w-5 h-5 text-red-500" />;
    case "tiktok":
      return <TikTok className="w-5 h-5 text-white" />;
    case "spotify":
      return <Music className="w-5 h-5 text-green-500" />;
    default:
      return null;
  }
}

export type InfluencerCardProps = {
  influencer: Influencer;
};

export function InfluencerCard({ influencer }: InfluencerCardProps) {
  return (
    <motion.div
      className="bg-[#1c1c1f] p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-semibold mb-3">{influencer.name}</h3>
      <div className="mb-4">
        {Object.entries(influencer.socialMedia).map(([platform, handle]) => (
          <div key={platform} className="flex items-center mb-2">
            {getSocialIcon(platform)}
            <span className="ml-2 text-gray-300">{handle}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {influencer.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-[#2c2c2f] text-sm rounded-full text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
