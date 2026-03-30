import { useEffect, useRef } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useClickOutside<T extends HTMLElement>(handler: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the click is on the button that toggles the menu, let the toggle handle it
      // to avoid double-toggling (open -> click toggle -> close from hook -> toggle opens it again)
      const target = event.target as Node;
      if (ref.current && !ref.current.contains(target)) {
        handler();
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handler]);

  return ref;
}
