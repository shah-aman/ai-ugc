import { motion } from "framer-motion";

interface MarketingStrategyProps {
  strategy: {
    title: string;
    summary: string;
    keyPoints: string[];
  };
}

export function MarketingStrategy({ strategy }: MarketingStrategyProps) {
  return (
    <motion.div
      className="mb-12 p-6 bg-[#1c1c1f] rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-4">{strategy.title}</h1>
      <p className="text-gray-300 mb-6">{strategy.summary}</p>
      <h2 className="text-xl font-semibold mb-3">Key Points:</h2>
      <ul className="list-disc list-inside space-y-2">
        {strategy.keyPoints.map((point, index) => (
          <li key={index} className="text-gray-300">
            {point}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
