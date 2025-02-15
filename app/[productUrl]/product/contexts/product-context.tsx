import { createContext, useContext, useMemo } from "react";

import { useParams } from "next/navigation";

export const ProductContext = createContext<{
  product: {
    url: string;
    name: string;
    imageUrls: string[];
    description: string;
    specs: { label: string; value: string }[];
  };
  strategy: {
    targetAudience: string;
    valueProposition: string;
    marketingChannels: string[];
    proposedInfluencers: {
      id: string;
      name: string;
      socialMedia: {
        instagram?: string;
        tiktok?: string;
        youtube?: string;
        facebook?: string;
      };
      tags: string[];
    }[];
  };
  storyboard: {
    scenes: {
      type: "a-roll" | "b-roll";
      title: string;
      description: string;
    }[];
  };
  intermediateVideo: {
    video: {
      duration: number;
      url: string;
    };
  };
  finalVideo: {
    video: {
      duration: number;
      url: string;
    };
  };
}>({
  product: {
    url: "",
    name: "",
    imageUrls: [],
    description: "",
    specs: [],
  },
  strategy: {
    targetAudience: "",
    valueProposition: "",
    marketingChannels: [],
    proposedInfluencers: [],
  },
  storyboard: {
    scenes: [],
  },
  intermediateVideo: {
    video: {
      duration: 0,
      url: "",
    },
  },
  finalVideo: {
    video: {
      duration: 0,
      url: "",
    },
  },
});

export function ProductContextProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const params = useParams<{ productUrl: string }>();
  const productUrl = useMemo(
    () => decodeURIComponent(params.productUrl),
    [params],
  );
  const contextValue = {
    product: {
      url: productUrl,
      name: "",
      imageUrls: [],
      description: "",
      specs: [],
    },
    strategy: {
      targetAudience: "",
      valueProposition: "",
      marketingChannels: [],
      proposedInfluencers: [],
    },
    storyboard: {
      scenes: [],
    },
    intermediateVideo: {
      video: {
        duration: 0,
        url: "",
      },
    },
    finalVideo: {
      video: {
        duration: 0,
        url: "",
      },
    },
  };
  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProductContext = () => useContext(ProductContext);
