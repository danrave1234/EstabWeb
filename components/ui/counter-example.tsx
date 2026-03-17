"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg bg-muted border")}>
      <h1 className="text-2xl font-bold mb-2 text-foreground">Component Example</h1>
      <h2 className="text-xl font-semibold text-foreground">{count}</h2>
      <div className="flex gap-2">
        <button 
          onClick={() => setCount((prev) => prev - 1)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          -
        </button>
        <button 
          onClick={() => setCount((prev) => prev + 1)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          +
        </button>
      </div>
    </div>
  );
};
