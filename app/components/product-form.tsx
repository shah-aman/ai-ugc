"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useRouter } from "next/navigation";

const PLACEHOLDER_LINKS = [
  "https://a.co/d/fwhl29U",
  "https://www.etsy.com/listing/624694625",
];

export function ProductForm() {
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const productUrl = e.target[0].value;
    router.push(`/${encodeURIComponent(productUrl)}/product`);
  };

  return (
    <div className="flex-grow flex flex-col justify-center items-center gap-4">
      <h2 className="text-muted-foreground">
        Paste your product link and get an instant ad in minutes
      </h2>

      <div className="w-[70dvw]">
        <PlaceholdersAndVanishInput
          placeholders={PLACEHOLDER_LINKS}
          onChange={() => {}}
          onSubmit={onSubmit}
        />
      </div>
      <div className="flex gap-4">
        <img
          src="https://a.storyblok.com/f/216574/250x250/9813d8be5a/shopify-icon.webp"
          className="size-10"
          alt="Shopify logo"
        />
        <img
          src="https://static-00.iconduck.com/assets.00/amazon-icon-1024x1024-7lg9cyjs.png"
          className="size-10"
          alt="Amazon logo"
        />
        <img
          src="https://reverie-st.com/wp-content/uploads/2023/09/Etsy-Logo-PNG-Photo.png"
          className="size-10"
          alt="Etsy logo"
        />
      </div>
    </div>
  );
}
