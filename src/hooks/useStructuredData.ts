import { useEffect } from "react";
import { createStructuredData as createStructuredDataUtil } from "@/hooks/useSEO";

interface StructuredDataConfig {
  "@type": string;
  [key: string]: any;
}

export function useStructuredData(
  config: StructuredDataConfig | null,
  scriptId: string
) {
  useEffect(() => {
    if (!config) return;

    const structuredData = createStructuredDataUtil(config);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = structuredData;
    script.id = scriptId;
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [config, scriptId]);
}
