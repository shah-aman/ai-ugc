import { createContext, useContext, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import {
  useProductInfo,
  UseProductInfoQueryResult,
} from "./modules/product-info";
import {
  useMarketResearch,
  UseMarketResearchQueryResult,
} from "./modules/market-research";
import {
  useStoryboard,
  UseStoryboardQueryResult,
} from "./modules/storyboarding";
import {
  useIntermediateVideo,
  UseIntermediateVideoQueryResult,
} from "./modules/intermediate-video";
import { useFinalVideo, UseFinalVideoQueryResult } from "./modules/final-video";
import { objectToMarkdownPromptRecursive } from "./modules/storyboarding/utils/prompt";

export type ProductContextType = {
  product: UseProductInfoQueryResult;
  marketResearch: UseMarketResearchQueryResult;
  storyboard: UseStoryboardQueryResult;
  avatarId: string;
  setAvatarId: (id: string) => void;
  intermediateVideo: UseIntermediateVideoQueryResult;
  finalVideo: UseFinalVideoQueryResult;
  // setProduct: (product: ProductContextType["product"]) => void;
  // setStrategy: (strategy: ProductContextType["strategy"]) => void;
  // setStoryboard: (storyboard: ProductContextType["storyboard"]) => void;
  // setFinalVideo: (finalVideo: ProductContextType["finalVideo"]) => void;
};

const defaultContext: ProductContextType = {
  product: {} as UseProductInfoQueryResult,
  marketResearch: {} as UseMarketResearchQueryResult,
  storyboard: {} as UseStoryboardQueryResult,
  avatarId: "",
  setAvatarId: () => undefined,
  intermediateVideo: {} as UseIntermediateVideoQueryResult,
  finalVideo: {} as UseFinalVideoQueryResult,
};

export const ProductContext = createContext<ProductContextType>(defaultContext);

export function ProductContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ productUrl: string }>();
  const productUrl = useMemo(
    () => decodeURIComponent(params.productUrl),
    [params],
  );

  const product = useProductInfo({ productUrl });

  const marketResearch = useMarketResearch({
    productDescription: product.data?.description ?? "",
  });

  const storyboard = useStoryboard({
    customerIntent: "", // TODO: Add once done
    productResearch:
      marketResearch.data !== undefined
        ? objectToMarkdownPromptRecursive(marketResearch.data!)
        : "", // TODO: Consider passing an object instead of markdown
    influencerResearch: "", // TODO: Add once done
  });

  const [avatarId, setAvatarId] = useState<string>();
  const intermediateVideo = useIntermediateVideo({
    avatarId: avatarId ?? "",
    voiceId: "26b2064088674c80b1e5fc5ab1a068eb",
    script:
      storyboard.data?.script
        .map(
          (scene) =>
            `Roll type: ${scene.roll_type}\nDescription: ${scene.description}\nContent: "${scene.content}"`,
        )
        .join("\n\n") ?? "", // TODO: Improve the data being passed
  });

  const finalVideo = useFinalVideo({
    avatarId: "",
    voiceId: "",
    script: "",
  });

  // const handleSceneChange = (sceneIndex: number) => {
  //   setVideoState((prev) => ({
  //     ...prev,
  //     currentScene: sceneIndex,
  //     isPlaying: false,
  //     progress: 0,
  //   }));
  // };

  const contextValue = {
    product,
    marketResearch,
    storyboard,
    avatarId,
    setAvatarId,
    intermediateVideo,
    finalVideo,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProductContext = () => useContext(ProductContext);
