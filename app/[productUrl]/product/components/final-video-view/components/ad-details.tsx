import { motion } from "framer-motion";
import { Share2 } from "lucide-react";

export type AdDetailsProps = {
  details: {
    title: string;
    duration: string;
    resolution: string;
    format: string;
    description: string;
  };
  onShare: () => void;
};

export function AdDetails({ details, onShare }: AdDetailsProps) {
  return (
    <motion.div
      className="bg-[#1c1c1f] p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-4">{details.title}</h2>
      <div className="space-y-2 mb-4">
        <p>
          <span className="font-semibold">Duration:</span> {details.duration}
        </p>
        <p>
          <span className="font-semibold">Resolution:</span>{" "}
          {details.resolution}
        </p>
        <p>
          <span className="font-semibold">Format:</span> {details.format}
        </p>
      </div>
      <p className="text-gray-300 mb-6">{details.description}</p>
      <button
        onClick={onShare}
        className="w-full h-12 bg-gradient-to-b from-[#7c5aff] to-[#6c47ff] rounded-[99px] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16),0px_1px_2px_0px_rgba(0,0,0,0.20)] justify-center items-center inline-flex overflow-hidden cursor-pointer hover:from-[#8f71ff] hover:to-[#7c5aff] active:from-[#6c47ff] active:to-[#5835ff] transition-all duration-200"
      >
        <Share2 className="w-5 h-5 mr-2" />
        <span className="text-white text-[15px] font-medium">Share Video</span>
      </button>
    </motion.div>
  );
}
