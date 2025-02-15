import { motion } from "framer-motion";

import { Influencer, InfluencerCard } from "./components/influencer-card";

interface InfluencerListProps {
  influencers: Influencer[];
  onAddInfluencer: () => void;
}

export function InfluencerList({
  influencers,
  onAddInfluencer,
}: InfluencerListProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Influencers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {influencers.map((influencer, index) => (
          <InfluencerCard key={index} influencer={influencer} />
        ))}
        <AddInfluencerCard onAddInfluencer={onAddInfluencer} />
      </div>
    </div>
  );
}

function AddInfluencerCard({
  onAddInfluencer,
}: {
  onAddInfluencer: () => void;
}) {
  return (
    <motion.div
      className="bg-[#1c1c1f] p-6 rounded-lg shadow-lg flex items-center justify-center cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={onAddInfluencer}
    >
      <div className="text-center">
        <div className="w-12 h-12 bg-[#2c2c2f] rounded-full flex items-center justify-center mx-auto mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <span className="text-gray-300">Add Influencer</span>
      </div>
    </motion.div>
  );
}
