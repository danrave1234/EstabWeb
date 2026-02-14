"use client"

import SiteBlockRenderer from "@/components/shared/SiteBlockRenderer";
import { useLivePreview } from "./LivePreviewProvider";

interface SiteTemplateProps {
  data: any;
  isAdmin?: boolean;
}

export default function SiteTemplate({ data: serverData, isAdmin = false }: SiteTemplateProps) {
  const previewData = useLivePreview();
  const data = previewData || serverData;

  return <SiteBlockRenderer data={data} isAdmin={isAdmin} />;
}
