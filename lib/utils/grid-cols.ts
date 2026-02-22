/**
 * Returns a Tailwind grid-cols class string that adapts to the number of items,
 * so lone items are centered and small sets are evenly spaced.
 *
 * @param count   Number of items in the grid
 * @param max     Maximum columns at the largest breakpoint (default 4)
 */
export function dynamicGridCols(count: number, max: 2 | 3 | 4 | 5 | 6 = 4): string {
  const capped = Math.min(count, max);
  switch (capped) {
    case 1:
      return "grid-cols-1 max-w-sm mx-auto";
    case 2:
      return "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto";
    case 3:
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto";
    case 4:
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    case 5:
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
    case 6:
      return "grid-cols-2 sm:grid-cols-3 md:grid-cols-6";
    default:
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  }
}
