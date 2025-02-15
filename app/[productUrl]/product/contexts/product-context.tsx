import { createContext, useContext, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type VideoState = {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  currentScene: number;
};

export type ProductContextType = {
  product: {
    url: string;
    name: string;
    imageUrls: string[];
    description: string;
    price: string;
    rating: number;
    reviews: number;
    category: string;
    tags: string[];
    specs: { label: string; value: string }[];
    features: string[];
    inStock: boolean;
    targetAudiences: {
      name: string;
      description: string;
    }[];
  };
  strategy: {
    summary: string;
    keyPoints: string[];
    metrics: {
      label: string;
      value: string;
      progress?: number;
      status?: "success" | "warning";
    }[];
    influencers: {
      name: string;
      avatar: string;
      followers: string;
      engagement: string;
      socialMedia: {
        [key: string]: string;
      };
      tags: string[];
    }[];
  };
  storyboard: {
    scenes: {
      id: number;
      roll_type: "A-roll" | "B-roll";
      content: string;
      description: string;
    }[];
  };
  intermediateVideo: {
    videoState: VideoState;
    setVideoState: (updates: Partial<VideoState>) => void;
    handleSceneChange: (sceneIndex: number) => void;
  };
  finalVideo: {
    details: {
      title: string;
      duration: string;
      resolution: string;
      format: string;
      description: string;
    };
  };
  setProduct: (product: ProductContextType["product"]) => void;
  setStrategy: (strategy: ProductContextType["strategy"]) => void;
  setStoryboard: (storyboard: ProductContextType["storyboard"]) => void;
  setFinalVideo: (finalVideo: ProductContextType["finalVideo"]) => void;
};

const defaultContext: ProductContextType = {
  product: {
    url: "",
    name: "",
    imageUrls: [],
    description: "",
    price: "",
    rating: 0,
    reviews: 0,
    category: "",
    tags: [],
    specs: [],
    features: [],
    inStock: false,
    targetAudiences: [],
  },
  strategy: {
    summary: "",
    keyPoints: [],
    metrics: [],
    influencers: [],
  },
  storyboard: {
    scenes: [],
  },
  intermediateVideo: {
    videoState: {
      isPlaying: false,
      isMuted: false,
      progress: 0,
      currentScene: 0,
    },
    setVideoState: () => { },
    handleSceneChange: () => { },
  },
  finalVideo: {
    details: {
      title: "",
      duration: "",
      resolution: "",
      format: "",
      description: "",
    },
  },
  setProduct: () => { },
  setStrategy: () => { },
  setStoryboard: () => { },
  setFinalVideo: () => { },
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

  const [product, setProduct] = useState(defaultContext.product);
  const [strategy, setStrategy] = useState(defaultContext.strategy);
  const [storyboard, setStoryboard] = useState(defaultContext.storyboard);
  const [finalVideo, setFinalVideo] = useState(defaultContext.finalVideo);
  const [videoState, setVideoState] = useState(defaultContext.intermediateVideo.videoState);

  const handleSceneChange = (sceneIndex: number) => {
    setVideoState(prev => ({
      ...prev,
      currentScene: sceneIndex,
      isPlaying: false,
      progress: 0,
    }));
  };

  const contextValue = {
    product: { ...product, url: productUrl },
    strategy,
    storyboard,
    intermediateVideo: {
      videoState,
      setVideoState: (updates: Partial<VideoState>) =>
        setVideoState(prev => ({ ...prev, ...updates })),
      handleSceneChange,
    },
    finalVideo,
    setProduct,
    setStrategy,
    setStoryboard,
    setFinalVideo,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProductContext = () => useContext(ProductContext);
