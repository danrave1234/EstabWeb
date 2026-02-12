import * as React from "react"

export const RenderValue = ({ value }: { value: any }) => {
  if (value === null || value === undefined || value === "") return <span>(empty)</span>;
  
  if (Array.isArray(value)) {
    return (
      <div className="pl-3 border-l-2 border-primary/20 space-y-2 mt-1">
        {value.map((item, i) => (
          <div key={i} className="text-xs p-2 bg-muted/50 rounded-md">
            <div className="font-bold text-[10px] text-muted-foreground uppercase mb-1">Item {i + 1}</div>
            <RenderValue value={item} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object') {
    return (
      <div className="pl-3 border-l-2 border-primary/20 space-y-2 mt-1">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="text-xs">
            <span className="font-bold text-muted-foreground/70 uppercase text-[9px] mr-2">{k}:</span>
            <RenderValue value={v} />
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(value)}</span>;
};
