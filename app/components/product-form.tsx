"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const PLACEHOLDER_LINKS = [
  "https://a.co/d/fwhl29U",
  "https://www.etsy.com/listing/624694625",
];

const PLATFORMS = [
  {
    name: "Shopify",
    logo: "https://a.storyblok.com/f/216574/250x250/9813d8be5a/shopify-icon.webp",
  },
  {
    name: "Amazon",
    logo: "https://static-00.iconduck.com/assets.00/amazon-icon-1024x1024-7lg9cyjs.png",
  },
  {
    name: "Etsy",
    logo: "https://reverie-st.com/wp-content/uploads/2023/09/Etsy-Logo-PNG-Photo.png",
  },
];

export function ProductForm() {
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const productUrl = (e.target as HTMLFormElement).productUrl.value;
    router.push(`/${encodeURIComponent(productUrl)}/product`);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 max-w-3xl mx-auto w-full mt-20">
      <motion.h2
        className="text-muted-foreground text-center text-lg md:text-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Paste your product link and get an instant ad in minutes
      </motion.h2>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <PlaceholdersAndVanishInput
          placeholders={PLACEHOLDER_LINKS}
          onChange={() => { }}
          onSubmit={onSubmit}
        />
      </motion.div>

      <motion.div
        className="flex gap-6 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {PLATFORMS.map((platform) => (
          <motion.img
            key={platform.name}
            src={platform.logo}
            alt={`${platform.name} logo`}
            className="size-8 md:size-10 opacity-70 hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
