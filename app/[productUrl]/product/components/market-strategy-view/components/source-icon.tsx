import { useState } from "react";

export type SourceIconProps = {
  domain: string;
  name: string;
};

export function SourceIcon({ domain, name }: SourceIconProps) {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return null;
  }

  return (
    <img
      src={`https://${domain}/favicon.ico`}
      alt={`${name} Icon`}
      className="relative rounded-full w-4 h-4 flex-none"
      onError={() => setUseFallback(true)}
    />
  );
}
