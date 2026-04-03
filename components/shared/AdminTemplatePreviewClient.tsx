"use client";

import { useEffect, useState } from "react";
import SiteBlockRenderer from "@/components/shared/SiteBlockRenderer";
import SiteEditorSidebar from "@/components/shared/SiteEditorSidebar";

interface AdminTemplatePreviewClientProps {
  initialData: any;
}

export default function AdminTemplatePreviewClient({ initialData }: AdminTemplatePreviewClientProps) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  if (!data) return null;

  return (
    <>
      <SiteEditorSidebar initialData={data} onDataChange={setData} />
      <SiteBlockRenderer data={data} />
    </>
  );
}