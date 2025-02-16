import { createContext, useContext, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import {
  useProductInfo,
  UseProductInfoQueryResult,
} from "./modules/product-info";
import {
  useProductResearch,
  UseProductResearchQueryResult,
} from "./modules/product-research";
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
import {
  useInfluencerResearch,
  UseInfluencerResearchQueryResult,
} from "./modules/influencer-research";

export type ProductContextType = {
  product: UseProductInfoQueryResult;
  productResearch: UseProductResearchQueryResult;
  influencerResearch: UseInfluencerResearchQueryResult;
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
  productResearch: {} as UseProductResearchQueryResult,
  influencerResearch: {} as UseInfluencerResearchQueryResult,
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

  const productResearch = useProductResearch({
    productDescription: product.data?.description ?? "",
  });

  const influencerResearch = useInfluencerResearch();

  const storyboard = useStoryboard({
    customerIntent: "", // TODO: Add once done
    productResearch:
      productResearch.data !== undefined
        ? objectToMarkdownPromptRecursive(productResearch.data!)
        : "", // TODO: Consider passing an object instead of markdown
    influencerResearch: "", // TODO: Add once done
    productLink: productUrl,
    influencerId: "54e6c27f-c6dd-4ba0-9b69-823771ed49cd",
  });

  console.log(storyboard.data);

  const [avatarId, setAvatarId] = useState<string>();
  const intermediateVideo = useIntermediateVideo({
    avatarId: avatarId ?? "",
    voiceId: "26b2064088674c80b1e5fc5ab1a068eb",
    script:
      storyboard.data?.structured_script
        ?.map(
          (scene) =>
            `Roll type: ${scene!.roll_type}\nDescription: ${scene!.description}\nContent: "${scene!.content}"`,
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
    productResearch,
    influencerResearch,
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
