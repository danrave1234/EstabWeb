"use client"

import SiteBlockRenderer from "@/components/shared/SiteBlockRenderer";
import { useLivePreview } from "./LivePreviewProvider";
import { useSectionTracking } from "@/hooks/useSectionTracking";

interface SiteTemplateProps {
  data: any;
  isAdmin?: boolean;
}

export default function SiteTemplate({ data: serverData, isAdmin = false }: SiteTemplateProps) {
  const previewData = useLivePreview();
  const data = previewData || serverData;

  const projectId = data?.projectId as string | undefined;
  const pageSlug = data?.pageSlug as string | undefined;

  useSectionTracking(isAdmin ? undefined : projectId, pageSlug);

  return <SiteBlockRenderer data={data} isAdmin={isAdmin} />;
}
